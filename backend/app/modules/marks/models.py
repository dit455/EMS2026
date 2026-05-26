from app.extensions import db
from datetime import datetime


class MarksConfig(db.Model):
    __tablename__ = 'marks_config'

    id               = db.Column(db.Integer, primary_key=True)
    course           = db.Column(db.String(100), nullable=False)
    term             = db.Column(db.String(30), nullable=False)
    subject_id       = db.Column(db.Integer, db.ForeignKey('subjects.id'), nullable=False)
    total_marks      = db.Column(db.Integer, nullable=False)
    pass_marks       = db.Column(db.Integer, nullable=False)
    internal_marks   = db.Column(db.Integer)
    external_marks   = db.Column(db.Integer)
    division_criteria = db.Column(db.String(50))
    effective_from   = db.Column(db.Date)
    # status: draft | approved
    status           = db.Column(db.String(20), default='draft')
    created_at       = db.Column(db.DateTime, default=datetime.utcnow)


class MarksEntry(db.Model):
    __tablename__ = 'marks_entries'

    id            = db.Column(db.Integer, primary_key=True)
    student_id    = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    config_id     = db.Column(db.Integer, db.ForeignKey('marks_config.id'), nullable=False)
    schedule_id   = db.Column(db.Integer, db.ForeignKey('exam_schedules.id'))
    internal      = db.Column(db.Integer, default=0)
    external      = db.Column(db.Integer, default=0)
    total         = db.Column(db.Integer)
    # result: pass | fail | absent | withheld
    result        = db.Column(db.String(20))
    # workflow status: draft | submitted | approved
    status        = db.Column(db.String(20), default='draft')
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at    = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class MarksChangeRequest(db.Model):
    __tablename__ = 'marks_change_requests'

    id               = db.Column(db.Integer, primary_key=True)
    marks_entry_id   = db.Column(db.Integer, db.ForeignKey('marks_entries.id'), nullable=False)
    existing_marks   = db.Column(db.Integer)
    requested_marks  = db.Column(db.Integer)
    reason           = db.Column(db.Text)
    proof_filename   = db.Column(db.String(255))
    # status: pending | approved | rejected
    status           = db.Column(db.String(20), default='pending')
    requested_at     = db.Column(db.DateTime, default=datetime.utcnow)
    reviewed_by      = db.Column(db.Integer, db.ForeignKey('users.id'))


class Marksheet(db.Model):
    __tablename__ = 'marksheets'

    id               = db.Column(db.Integer, primary_key=True)
    student_id       = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    reference        = db.Column(db.String(50), unique=True)
    pdf_filename     = db.Column(db.String(255))
    dsc_embedded     = db.Column(db.Boolean, default=False)
    digilocker_status = db.Column(db.String(30), default='not_published')
    generated_at     = db.Column(db.DateTime, default=datetime.utcnow)
