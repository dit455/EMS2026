from app.extensions import db
from datetime import datetime


class WorkflowTask(db.Model):
    __tablename__ = 'workflow_tasks'

    id            = db.Column(db.Integer, primary_key=True)
    # entity_type: student | exam_schedule | marks_batch | marksheet
    entity_type   = db.Column(db.String(40), nullable=False)
    entity_id     = db.Column(db.Integer, nullable=False)
    # stage: maker | checker | approver
    stage         = db.Column(db.String(20), nullable=False)
    assigned_role = db.Column(db.String(50))
    assigned_user = db.Column(db.Integer, db.ForeignKey('users.id'))
    sla_hours     = db.Column(db.Integer, default=48)
    remarks       = db.Column(db.Text)
    # status: pending | in_progress | completed | sent_back | rejected
    status        = db.Column(db.String(20), default='pending')
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at    = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class AuditLog(db.Model):
    """Immutable log of every state-changing action in the system."""
    __tablename__ = 'audit_logs'

    id          = db.Column(db.Integer, primary_key=True)
    user_id     = db.Column(db.Integer, db.ForeignKey('users.id'))
    action      = db.Column(db.String(100), nullable=False)
    entity_type = db.Column(db.String(40))
    entity_id   = db.Column(db.Integer)
    detail      = db.Column(db.Text)
    ip_address  = db.Column(db.String(45))
    # severity: info | warning | critical
    severity    = db.Column(db.String(20), default='info')
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)
