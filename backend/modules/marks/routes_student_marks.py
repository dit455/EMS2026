from flask import Blueprint, request, jsonify
from modules.marks.models import (
    is_student_present, save_student_mark, get_marks_for_exam,
    get_student_marks, approve_student_marks,
    update_student_mark, get_marks_audit, get_subject_mark_config
)
from modules.marks.helpers import calculate_pass_fail

marks_student_bp = Blueprint('marks_student', __name__)

@marks_student_bp.route('/marks/student', methods=['POST'])
def enter_marks():
    data = request.get_json()
    required = ['exam_schedule_id', 'student_id', 'subject_id',
                'division_name', 'marks_obtained', 'course_id', 'term_id']
    for field in required:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400

    # Block entry if student was absent (Ref 15)
    if not is_student_present(data['exam_schedule_id'], data['student_id']):
        return jsonify({
            'error': 'Cannot enter marks — student was absent for this examination'
        }), 403

    # Validate marks do not exceed max
    configs = get_subject_mark_config(data['subject_id'], data['course_id'], data['term_id'])
    cfg = next((c for c in configs if c['division_name'] == data['division_name']), None)
    if cfg and data['marks_obtained'] > cfg['max_marks']:
        return jsonify({'error': f"Marks exceed maximum allowed: {cfg['max_marks']}"}), 400

    # Compute pass/fail
    all_marks = get_student_marks(data['exam_schedule_id'], data['student_id'])
    all_marks_with_new = [m for m in all_marks if m['division_name'] != data['division_name']]
    all_marks_with_new.append({
        'division_name': data['division_name'],
        'marks_obtained': data['marks_obtained']
    })

    pass_mark_level = cfg['pass_mark_level'] if cfg else 'subject'
    data['is_pass'] = calculate_pass_fail(all_marks_with_new, configs, pass_mark_level)

    save_student_mark(data)
    return jsonify({
        'message': 'Marks saved',
        'result': 'Pass' if data['is_pass'] else 'Fail'
    }), 201

@marks_student_bp.route('/marks/student/exam/<int:exam_schedule_id>', methods=['GET'])
def get_exam_marks(exam_schedule_id):
    subject_id = request.args.get('subject_id')
    marks = get_marks_for_exam(exam_schedule_id, subject_id)
    return jsonify(marks), 200

@marks_student_bp.route('/marks/student/<int:exam_schedule_id>/<int:student_id>/approve', methods=['PUT'])
def approve_marks(exam_schedule_id, student_id):
    data       = request.get_json()
    approved_by = data.get('approved_by')
    signature   = data.get('digital_signature')
    if not approved_by or not signature:
        return jsonify({'error': 'approved_by and digital_signature are required'}), 400

    approve_student_marks(exam_schedule_id, student_id, approved_by, signature)
    return jsonify({'message': 'Marks approved and digitally signed'}), 200

@marks_student_bp.route('/marks/student/<int:marks_id>', methods=['PUT'])
def edit_mark(marks_id):
    data      = request.get_json()
    new_marks  = data.get('marks_obtained')
    edited_by  = data.get('edited_by')
    signature  = data.get('digital_signature')
    reason     = data.get('reason', '')

    if new_marks is None or not edited_by or not signature:
        return jsonify({'error': 'marks_obtained, edited_by, digital_signature are required'}), 400

    result, error = update_student_mark(marks_id, new_marks, edited_by, signature, reason)
    if error:
        return jsonify({'error': error}), 404
    return jsonify({'message': 'Mark updated, audit trail saved'}), 200

@marks_student_bp.route('/marks/student/<int:marks_id>/audit', methods=['GET'])
def marks_audit(marks_id):
    trail = get_marks_audit(marks_id)
    return jsonify(trail), 200
