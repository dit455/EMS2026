from flask import request
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.common.responses import success, error
from app.common.decorators import roles_required
from . import examinations_bp
from .models import Subject, ExamSchedule, Attendance


@examinations_bp.get('/subjects')
@jwt_required()
def list_subjects():
    subjects = Subject.query.all()
    return success({'subjects': [
        {'id': s.id, 'name': s.name, 'course': s.course, 'term': s.term, 'type': s.mapping_type}
        for s in subjects
    ]})


@examinations_bp.post('/subjects')
@jwt_required()
@roles_required('maker', 'admin', 'super_admin')
def create_subject():
    data = request.get_json(silent=True) or {}
    if not data.get('name') or not data.get('course') or not data.get('term'):
        return error('name, course, and term are required.', 400)
    subject = Subject(
        name=data['name'], course=data['course'], term=data['term'],
        mapping_type=data.get('mapping_type', 'Core'),
        start_date=data.get('start_date'), end_date=data.get('end_date'),
    )
    db.session.add(subject)
    db.session.commit()
    return success({'subject': {'id': subject.id, 'name': subject.name}}, 201)


@examinations_bp.get('/schedules')
@jwt_required()
def list_schedules():
    schedules = ExamSchedule.query.order_by(ExamSchedule.exam_date).all()
    return success({'schedules': [
        {
            'id': s.id, 'course': s.course, 'term': s.term,
            'exam_type': s.exam_type, 'exam_date': str(s.exam_date),
            'venue': s.venue, 'status': s.status,
        }
        for s in schedules
    ]})


@examinations_bp.post('/schedules')
@jwt_required()
@roles_required('maker', 'admin', 'super_admin')
def create_schedule():
    data = request.get_json(silent=True) or {}
    schedule = ExamSchedule(
        subject_id=data.get('subject_id'), course=data.get('course'),
        term=data.get('term'), exam_type=data.get('exam_type'),
        exam_date=data.get('exam_date'), exam_time=data.get('exam_time'),
        venue=data.get('venue'),
    )
    db.session.add(schedule)
    db.session.commit()
    return success({'schedule': {'id': schedule.id}}, 201)


@examinations_bp.post('/attendance')
@jwt_required()
@roles_required('maker', 'checker', 'admin', 'super_admin')
def mark_attendance():
    data = request.get_json(silent=True) or {}
    attendance = Attendance(
        student_id=data.get('student_id'),
        schedule_id=data.get('schedule_id'),
        status=data.get('status', 'present'),
    )
    db.session.add(attendance)
    db.session.commit()
    return success({'attendance': {'id': attendance.id}}, 201)
