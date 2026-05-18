import os
from flask import Blueprint, request, jsonify, send_file
from modules.marks.models import (
    get_student_marks, get_marksheet, create_marksheet,
    sign_marksheet, update_digilocker_id
)
from modules.marks.helpers import calculate_grade, generate_marksheet_ref
from modules.marks.pdf_generator import generate_marksheet_pdf
from modules.marks.digilocker import push_to_digilocker
from database import query_db
from config import Config

marksheet_bp = Blueprint('marksheet', __name__)

@marksheet_bp.route('/marks/marksheet/generate', methods=['POST'])
def generate_marksheet():
    data = request.get_json()
    required = ['student_id', 'course_id', 'term_id', 'exam_id', 'exam_schedule_id']
    for field in required:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400

    # Check all marks are approved
    marks = get_student_marks(data['exam_schedule_id'], data['student_id'])
    if not marks:
        return jsonify({'error': 'No marks found for this student'}), 404

    unapproved = [m for m in marks if m['status'] != 'approved']
    if unapproved:
        return jsonify({'error': 'All marks must be approved before generating marksheet'}), 400

    # Compute totals
    total_obtained = sum(float(m['marks_obtained']) for m in marks)
    total_max      = sum(
        (query_db(
            "SELECT max_marks FROM subject_mark_config WHERE subject_id=%s AND course_id=%s AND term_id=%s AND division_name=%s AND is_active=1",
            (m['subject_id'], data['course_id'], data['term_id'], m['division_name']), one=True
         ) or {}).get('max_marks', 0)
        for m in marks
    )
    percentage = (total_obtained / total_max * 100) if total_max > 0 else 0
    grade      = calculate_grade(percentage)

    # Get student info for reference number
    student = query_db("SELECT * FROM students WHERE id=%s", (data['student_id'],), one=True) or {}
    ref_no  = generate_marksheet_ref(data['course_id'], data['term_id'],
                                     student.get('registration_number', str(data['student_id'])))

    pdf_path = os.path.join(Config.UPLOAD_FOLDER, 'marksheets', f"{ref_no}.pdf")

    marksheet_payload = {
        'reference_number':     ref_no,
        'student_id':           data['student_id'],
        'course_id':            data['course_id'],
        'term_id':              data['term_id'],
        'exam_id':              data['exam_id'],
        'total_marks_obtained': total_obtained,
        'total_max_marks':      total_max,
        'percentage':           round(percentage, 2),
        'grade_division':       grade,
        'pdf_path':             pdf_path,
        'is_digitally_signed':  False,
    }

    # Generate PDF
    generate_marksheet_pdf(marksheet_payload, marks, student, pdf_path)

    new_id = create_marksheet(marksheet_payload)
    return jsonify({
        'message':   'Marksheet generated',
        'id':        new_id,
        'reference': ref_no,
        'grade':     grade,
        'percentage': round(percentage, 2),
    }), 201

@marksheet_bp.route('/marks/marksheet/<int:marksheet_id>/sign', methods=['PUT'])
def sign_sheet(marksheet_id):
    data      = request.get_json()
    signed_by = data.get('signed_by')
    signature = data.get('digital_signature')
    if not signed_by or not signature:
        return jsonify({'error': 'signed_by and digital_signature are required'}), 400

    sign_marksheet(marksheet_id, signed_by, signature)
    return jsonify({'message': 'Marksheet digitally signed'}), 200

@marksheet_bp.route('/marks/marksheet/<int:student_id>/<int:exam_id>', methods=['GET'])
def view_marksheet(student_id, exam_id):
    sheet = get_marksheet(student_id, exam_id)
    if not sheet:
        return jsonify({'error': 'Marksheet not found'}), 404
    return jsonify(sheet), 200

@marksheet_bp.route('/marks/marksheet/<int:marksheet_id>/pdf', methods=['GET'])
def download_pdf(marksheet_id):
    sheet = query_db("SELECT * FROM marksheets WHERE id=%s", (marksheet_id,), one=True)
    if not sheet or not os.path.exists(sheet['pdf_path']):
        return jsonify({'error': 'PDF not found'}), 404
    return send_file(sheet['pdf_path'], as_attachment=True,
                     download_name=f"marksheet_{sheet['reference_number']}.pdf")

@marksheet_bp.route('/marks/marksheet/<int:marksheet_id>/digilocker', methods=['POST'])
def push_digilocker(marksheet_id):
    sheet   = query_db("SELECT * FROM marksheets WHERE id=%s", (marksheet_id,), one=True)
    student = query_db("SELECT * FROM students WHERE id=%s", (sheet['student_id'],), one=True) or {}

    if not sheet:
        return jsonify({'error': 'Marksheet not found'}), 404
    if not sheet['is_digitally_signed']:
        return jsonify({'error': 'Marksheet must be digitally signed before pushing to Digilocker'}), 400

    doc_id, error = push_to_digilocker(sheet, sheet['pdf_path'], student)
    if error:
        return jsonify({'error': error}), 500

    update_digilocker_id(marksheet_id, doc_id)
    return jsonify({'message': 'Pushed to Digilocker', 'digilocker_doc_id': doc_id}), 200
