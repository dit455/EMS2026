from flask import Blueprint, request, jsonify
from modules.examination.models import (
    get_subjects_for_term, add_subject_to_term, remove_subject_from_term
)

examination_subjects_bp = Blueprint('examination_subjects', __name__)

@examination_subjects_bp.route('/examination/subjects', methods=['GET'])
def list_subjects():
    course_id = request.args.get('course_id')
    term_id   = request.args.get('term_id')
    if not course_id or not term_id:
        return jsonify({'error': 'course_id and term_id are required'}), 400
    subjects = get_subjects_for_term(course_id, term_id)
    return jsonify(subjects), 200

@examination_subjects_bp.route('/examination/subjects', methods=['POST'])
def add_subject():
    data = request.get_json()
    required = ['course_id', 'term_id', 'subject_id', 'effective_start_date', 'created_by']
    for field in required:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400
    new_id = add_subject_to_term(data)
    return jsonify({'message': 'Subject added to term', 'id': new_id}), 201

@examination_subjects_bp.route('/examination/subjects/<int:subject_id>/remove', methods=['PUT'])
def remove_subject(subject_id):
    data = request.get_json()
    if 'effective_end_date' not in data:
        return jsonify({'error': 'effective_end_date is required'}), 400
    remove_subject_from_term(subject_id, data['effective_end_date'])
    return jsonify({'message': 'Subject removed from term'}), 200
