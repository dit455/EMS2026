from flask import request
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.common.responses import success, error
from app.common.decorators import roles_required
from . import students_bp
from .models import Student, EducationRecord, StudentDocument


@students_bp.get('/')
@jwt_required()
@roles_required('maker', 'checker', 'approver', 'admin', 'super_admin')
def list_students():
    page     = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    status   = request.args.get('status')

    query = Student.query
    if status:
        query = query.filter_by(status=status)

    paginated = query.order_by(Student.created_at.desc()).paginate(page=page, per_page=per_page)
    return success({
        'students': [s.to_dict() for s in paginated.items],
        'total':    paginated.total,
        'page':     paginated.page,
        'pages':    paginated.pages,
    })


@students_bp.post('/')
@jwt_required()
def create_student():
    data = request.get_json(silent=True) or {}
    required = ('name', 'email')
    missing = [f for f in required if not data.get(f)]
    if missing:
        return error(f"Missing required fields: {', '.join(missing)}", 400)

    if Student.query.filter_by(email=data['email']).first():
        return error('Email already registered.', 409)

    student = Student(**{k: data.get(k) for k in (
        'name', 'email', 'mobile', 'dob', 'gender', 'student_id',
        'father_name', 'mother_name', 'address', 'place_of_residence',
        'state', 'pin_code', 'college', 'course', 'admission_year',
    ) if data.get(k)})
    db.session.add(student)
    db.session.commit()
    return success({'student': student.to_dict()}, 201)


@students_bp.get('/<int:student_id>')
@jwt_required()
def get_student(student_id):
    student = db.session.get(Student, student_id)
    if not student:
        return error('Student not found.', 404)
    return success({'student': student.to_dict()})


@students_bp.put('/<int:student_id>')
@jwt_required()
def update_student(student_id):
    student = db.session.get(Student, student_id)
    if not student:
        return error('Student not found.', 404)

    data = request.get_json(silent=True) or {}
    updatable = (
        'name', 'mobile', 'gender', 'father_name', 'mother_name',
        'address', 'place_of_residence', 'state', 'pin_code',
        'college', 'course', 'admission_year', 'identity_number',
    )
    for field in updatable:
        if field in data:
            setattr(student, field, data[field])

    db.session.commit()
    return success({'student': student.to_dict()})


@students_bp.put('/<int:student_id>/status')
@jwt_required()
@roles_required('checker', 'approver', 'admin', 'super_admin')
def update_status(student_id):
    student = db.session.get(Student, student_id)
    if not student:
        return error('Student not found.', 404)

    data   = request.get_json(silent=True) or {}
    status = data.get('status')
    allowed = ('draft', 'submitted', 'checker_review', 'approved', 'rejected')
    if status not in allowed:
        return error(f"Invalid status. Allowed: {', '.join(allowed)}", 400)

    student.status = status
    db.session.commit()
    return success({'student': student.to_dict()})
