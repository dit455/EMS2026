from flask import request
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.common.responses import success, error
from app.common.decorators import roles_required
from . import marks_bp
from .models import MarksConfig, MarksEntry, MarksChangeRequest, Marksheet


@marks_bp.get('/config')
@jwt_required()
def list_config():
    configs = MarksConfig.query.all()
    return success({'configs': [
        {'id': c.id, 'course': c.course, 'term': c.term, 'total': c.total_marks, 'status': c.status}
        for c in configs
    ]})


@marks_bp.post('/config')
@jwt_required()
@roles_required('maker', 'admin', 'super_admin')
def create_config():
    data = request.get_json(silent=True) or {}
    config = MarksConfig(
        course=data.get('course'), term=data.get('term'),
        subject_id=data.get('subject_id'),
        total_marks=data.get('total_marks', 100),
        pass_marks=data.get('pass_marks', 50),
        internal_marks=data.get('internal_marks'),
        external_marks=data.get('external_marks'),
        division_criteria=data.get('division_criteria'),
        effective_from=data.get('effective_from'),
    )
    db.session.add(config)
    db.session.commit()
    return success({'config': {'id': config.id}}, 201)


@marks_bp.get('/entries')
@jwt_required()
@roles_required('maker', 'checker', 'approver', 'admin', 'super_admin')
def list_entries():
    entries = MarksEntry.query.order_by(MarksEntry.created_at.desc()).all()
    return success({'entries': [
        {'id': e.id, 'student_id': e.student_id, 'total': e.total, 'result': e.result, 'status': e.status}
        for e in entries
    ]})


@marks_bp.post('/entries')
@jwt_required()
@roles_required('maker', 'admin', 'super_admin')
def create_entry():
    data = request.get_json(silent=True) or {}
    internal = data.get('internal', 0)
    external = data.get('external', 0)
    entry = MarksEntry(
        student_id=data.get('student_id'),
        config_id=data.get('config_id'),
        schedule_id=data.get('schedule_id'),
        internal=internal, external=external,
        total=internal + external,
    )
    db.session.add(entry)
    db.session.commit()
    return success({'entry': {'id': entry.id, 'total': entry.total}}, 201)


@marks_bp.post('/change-requests')
@jwt_required()
def create_change_request():
    data = request.get_json(silent=True) or {}
    cr = MarksChangeRequest(
        marks_entry_id=data.get('marks_entry_id'),
        existing_marks=data.get('existing_marks'),
        requested_marks=data.get('requested_marks'),
        reason=data.get('reason'),
    )
    db.session.add(cr)
    db.session.commit()
    return success({'change_request': {'id': cr.id}}, 201)
