from flask import request
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.common.responses import success, error
from app.common.decorators import roles_required
from . import workflow_bp
from .models import WorkflowTask, AuditLog


@workflow_bp.get('/tasks')
@jwt_required()
@roles_required('checker', 'approver', 'admin', 'super_admin')
def list_tasks():
    status = request.args.get('status')
    stage  = request.args.get('stage')
    query  = WorkflowTask.query
    if status:
        query = query.filter_by(status=status)
    if stage:
        query = query.filter_by(stage=stage)
    tasks = query.order_by(WorkflowTask.created_at.desc()).all()
    return success({'tasks': [
        {
            'id': t.id, 'entity_type': t.entity_type, 'entity_id': t.entity_id,
            'stage': t.stage, 'status': t.status, 'sla_hours': t.sla_hours,
        }
        for t in tasks
    ]})


@workflow_bp.put('/tasks/<int:task_id>')
@jwt_required()
@roles_required('checker', 'approver', 'admin', 'super_admin')
def update_task(task_id):
    task = db.session.get(WorkflowTask, task_id)
    if not task:
        return error('Task not found.', 404)
    data = request.get_json(silent=True) or {}
    allowed_statuses = ('pending', 'in_progress', 'completed', 'sent_back', 'rejected')
    if data.get('status') not in allowed_statuses:
        return error(f"Invalid status. Allowed: {', '.join(allowed_statuses)}", 400)
    task.status  = data['status']
    task.remarks = data.get('remarks', task.remarks)
    db.session.commit()
    return success({'task': {'id': task.id, 'status': task.status}})


@workflow_bp.get('/audit')
@jwt_required()
@roles_required('admin', 'super_admin')
def audit_log():
    logs = AuditLog.query.order_by(AuditLog.created_at.desc()).limit(200).all()
    return success({'logs': [
        {
            'id': l.id, 'action': l.action, 'entity_type': l.entity_type,
            'entity_id': l.entity_id, 'severity': l.severity,
            'created_at': l.created_at.isoformat(),
        }
        for l in logs
    ]})
