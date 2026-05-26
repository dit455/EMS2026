from app.extensions import db
from datetime import datetime


class Subject(db.Model):
    __tablename__ = 'subjects'

    id           = db.Column(db.Integer, primary_key=True)
    name         = db.Column(db.String(100), nullable=False)
    course       = db.Column(db.String(100), nullable=False)
    term         = db.Column(db.String(30), nullable=False)
    mapping_type = db.Column(db.String(20), default='Core')  # Core | Elective
    start_date   = db.Column(db.Date)
    end_date     = db.Column(db.Date)
    created_at   = db.Column(db.DateTime, default=datetime.utcnow)


class ExamSchedule(db.Model):
    __tablename__ = 'exam_schedules'

    id          = db.Column(db.Integer, primary_key=True)
    subject_id  = db.Column(db.Integer, db.ForeignKey('subjects.id'), nullable=False)
    course      = db.Column(db.String(100))
    term        = db.Column(db.String(30))
    exam_type   = db.Column(db.String(20))   # Mid-term | End-term
    exam_date   = db.Column(db.Date, nullable=False)
    exam_time   = db.Column(db.Time)
    venue       = db.Column(db.String(100))
    # status: draft | pending_approval | approved | published
    status      = db.Column(db.String(30), default='draft')
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

    subject = db.relationship('Subject', backref='schedules')


class Attendance(db.Model):
    __tablename__ = 'attendance'

    id              = db.Column(db.Integer, primary_key=True)
    student_id      = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    schedule_id     = db.Column(db.Integer, db.ForeignKey('exam_schedules.id'), nullable=False)
    # status: present | absent
    status          = db.Column(db.String(10), nullable=False)
    sheet_filename  = db.Column(db.String(255))
    marked_at       = db.Column(db.DateTime, default=datetime.utcnow)
    marked_by       = db.Column(db.Integer, db.ForeignKey('users.id'))
