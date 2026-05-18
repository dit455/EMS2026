from flask import Blueprint, request, jsonify
from modules.examination.models import (
    get_schedule, create_schedule, get_schedule_by_id,
    update_schedule_status, disable_old_schedules
)
from modules.examination.helpers import check_holiday_conflict

examination_schedule_bp = Blueprint('examination_schedule', __name__)

@examination_schedule_bp.route('/examination/schedule', methods=['GET'])
def list_schedule():
    course_id = request.args.get('course_id')
    term_id   = request.args.get('term_id')
    if not course_id or not term_id:
        return jsonify({'error': 'course_id and term_id are required'}), 400
    schedules = get_schedule(course_id, term_id)
    return jsonify(schedules), 200

@examination_schedule_bp.route('/examination/schedule', methods=['POST'])
def add_schedule():
    data = request.get_json()
    required = ['course_id', 'term_id', 'subject_id', 'exam_type',
                'exam_date', 'start_time', 'end_time', 'venue']
    for field in required:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400

    holiday_check = check_holiday_conflict(data['exam_date'])
    new_id = create_schedule(data)
    return jsonify({
        'message': 'Schedule created',
        'id': new_id,
        'holiday_warning': holiday_check
    }), 201

@examination_schedule_bp.route('/examination/schedule/<int:schedule_id>/submit-approval', methods=['PUT'])
def submit_approval(schedule_id):
    update_schedule_status(schedule_id, 'pending_approval')
    return jsonify({'message': 'Submitted for approval'}), 200

@examination_schedule_bp.route('/examination/schedule/<int:schedule_id>/approve', methods=['PUT'])
def approve_schedule(schedule_id):
    data = request.get_json()
    user_id = data.get('approved_by')
    if not user_id:
        return jsonify({'error': 'approved_by is required'}), 400
    update_schedule_status(schedule_id, 'approved', user_id)
    return jsonify({'message': 'Schedule approved'}), 200

@examination_schedule_bp.route('/examination/schedule/<int:schedule_id>/publish', methods=['PUT'])
def publish_schedule(schedule_id):
    schedule = get_schedule_by_id(schedule_id)
    if not schedule or schedule['status'] != 'approved':
        return jsonify({'error': 'Schedule must be approved before publishing'}), 400

    # Disable all previously published schedules for this course+term
    disable_old_schedules(schedule['course_id'], schedule['term_id'])
    update_schedule_status(schedule_id, 'published')
    return jsonify({'message': 'Schedule published on portal'}), 200

@examination_schedule_bp.route('/examination/schedule/download', methods=['GET'])
def download_schedule():
    course_id = request.args.get('course_id')
    term_id   = request.args.get('term_id')
    if not course_id or not term_id:
        return jsonify({'error': 'course_id and term_id are required'}), 400
    from database import query_db
    schedules = query_db(
        "SELECT * FROM exam_schedules WHERE course_id=%s AND term_id=%s AND status='published'",
        (course_id, term_id)
    )
    return jsonify(schedules), 200

@examination_schedule_bp.route('/examination/holidays', methods=['GET'])
def check_holiday():
    exam_date = request.args.get('date')
    if not exam_date:
        return jsonify({'error': 'date is required'}), 400
    result = check_holiday_conflict(exam_date)
    return jsonify(result), 200
