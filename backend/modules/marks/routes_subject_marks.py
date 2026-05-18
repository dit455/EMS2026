from flask import Blueprint, request, jsonify
from modules.marks.models import (
    get_subject_mark_config, create_subject_mark_config,
    update_subject_mark_config, get_config_audit
)

marks_subject_bp = Blueprint('marks_subject', __name__)

@marks_subject_bp.route('/marks/subject-config', methods=['GET'])
def get_config():
    subject_id = request.args.get('subject_id')
    course_id  = request.args.get('course_id')
    term_id    = request.args.get('term_id')
    if not all([subject_id, course_id, term_id]):
        return jsonify({'error': 'subject_id, course_id, term_id are required'}), 400
    config = get_subject_mark_config(subject_id, course_id, term_id)
    return jsonify(config), 200

@marks_subject_bp.route('/marks/subject-config', methods=['POST'])
def add_config():
    data = request.get_json()
    required = ['subject_id', 'course_id', 'term_id', 'division_name',
                'max_marks', 'pass_marks', 'total_marks', 'effective_start_date', 'created_by']
    for field in required:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400

    new_id = create_subject_mark_config(data)
    return jsonify({'message': 'Subject mark config created', 'id': new_id}), 201

@marks_subject_bp.route('/marks/subject-config/<int:config_id>', methods=['PUT'])
def update_config(config_id):
    data      = request.get_json()
    changed_by = data.get('changed_by')
    signature  = data.get('digital_signature')
    reason     = data.get('reason', '')

    if not changed_by or not signature:
        return jsonify({'error': 'changed_by and digital_signature are required'}), 400

    result, error = update_subject_mark_config(config_id, data, changed_by, signature, reason)
    if error:
        return jsonify({'error': error}), 404
    return jsonify({'message': 'Config updated, audit trail saved'}), 200

@marks_subject_bp.route('/marks/subject-config/<int:config_id>/audit', methods=['GET'])
def config_audit(config_id):
    trail = get_config_audit(config_id)
    return jsonify(trail), 200
