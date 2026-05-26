from flask_jwt_extended import jwt_required
from app.common.responses import success
from app.common.decorators import roles_required
from . import reports_bp


@reports_bp.get('/summary')
@jwt_required()
@roles_required('admin', 'super_admin', 'approver')
def summary():
    """Aggregate summary across students, exams, and marks."""
    from app.modules.students.models import Student
    from app.modules.examinations.models import ExamSchedule
    from app.modules.marks.models import Marksheet

    total_students   = Student.query.count()
    approved         = Student.query.filter_by(status='approved').count()
    total_schedules  = ExamSchedule.query.count()
    total_marksheets = Marksheet.query.count()

    return success({
        'total_students':   total_students,
        'approved_students': approved,
        'exam_schedules':   total_schedules,
        'marksheets':       total_marksheets,
    })


@reports_bp.get('/students')
@jwt_required()
@roles_required('admin', 'super_admin', 'approver', 'checker')
def students_report():
    from app.modules.students.models import Student
    students = Student.query.all()
    return success({'report': [s.to_dict() for s in students]})
