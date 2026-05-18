import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from modules.examination.models import (
    get_attendance, get_student_attendance,
    upsert_attendance, save_attendance_audit, get_attendance_audit
)
from config import Config

examination_attendance_bp = Blueprint('examination_attendance', __name__)

ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@examination_attendance_bp.route('/examination/attendance/<int:exam_schedule_id>', methods=['GET'])
def list_attendance(exam_schedule_id):
    records = get_attendance(exam_schedule_id)
    return jsonify(records), 200

@examination_attendance_bp.route('/examination/attendance/bulk', methods=['POST'])
def mark_bulk_attendance():
    data = request.get_json()
    # data = { exam_schedule_id: int, attendance: [{student_id, is_present}] }
    exam_schedule_id = data.get('exam_schedule_id')
    attendance_list  = data.get('attendance', [])
    if not exam_schedule_id or not attendance_list:
        return jsonify({'error': 'exam_schedule_id and attendance list are required'}), 400

    for record in attendance_list:
        upsert_attendance(exam_schedule_id, record['student_id'], record['is_present'])

    return jsonify({'message': f'{len(attendance_list)} attendance records saved'}), 200

@examination_attendance_bp.route('/examination/attendance/upload-pdf', methods=['POST'])
def upload_pdf():
    exam_schedule_id = request.form.get('exam_schedule_id')
    if 'file' not in request.files or not exam_schedule_id:
        return jsonify({'error': 'file and exam_schedule_id are required'}), 400

    file = request.files['file']
    if not allowed_file(file.filename):
        return jsonify({'error': 'Only PDF files are allowed'}), 400

    filename = secure_filename(f"attendance_{exam_schedule_id}_{file.filename}")
    save_path = os.path.join(Config.UPLOAD_FOLDER, 'attendance', filename)
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    file.save(save_path)

    from database import execute_db
    execute_db(
        "UPDATE exam_attendance SET attendance_pdf_path=%s WHERE exam_schedule_id=%s",
        (save_path, exam_schedule_id)
    )
    return jsonify({'message': 'PDF uploaded', 'path': save_path}), 200

@examination_attendance_bp.route('/examination/attendance/<int:attendance_id>/edit', methods=['PUT'])
def edit_attendance(attendance_id):
    data = request.get_json()
    new_present = data.get('is_present')
    edited_by   = data.get('edited_by')
    reason      = data.get('reason', '')

    if new_present is None or not edited_by:
        return jsonify({'error': 'is_present and edited_by are required'}), 400

    from database import query_db, execute_db
    existing = query_db(
        "SELECT * FROM exam_attendance WHERE id=%s", (attendance_id,), one=True
    )
    if not existing:
        return jsonify({'error': 'Attendance record not found'}), 404

    if existing['is_confirmed']:
        # Save audit trail before edit
        save_attendance_audit(
            attendance_id, existing['is_present'], new_present, edited_by, reason
        )

    execute_db(
        "UPDATE exam_attendance SET is_present=%s WHERE id=%s",
        (new_present, attendance_id)
    )
    return jsonify({'message': 'Attendance updated'}), 200

@examination_attendance_bp.route('/examination/attendance/<int:attendance_id>/audit', methods=['GET'])
def view_audit(attendance_id):
    trail = get_attendance_audit(attendance_id)
    return jsonify(trail), 200
