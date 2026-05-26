from flask import request
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.common.responses import success, error
from app.common.decorators import roles_required
from . import migration_bp
from .models import MigrationBatch


@migration_bp.get('/')
@jwt_required()
@roles_required('admin', 'super_admin')
def list_batches():
    batches = MigrationBatch.query.order_by(MigrationBatch.created_at.desc()).all()
    return success({'batches': [
        {
            'id': b.id, 'name': b.name, 'source': b.source,
            'stage': b.stage, 'status': b.status,
            'total': b.total_rows, 'imported': b.imported, 'failed': b.failed,
        }
        for b in batches
    ]})


@migration_bp.post('/')
@jwt_required()
@roles_required('admin', 'super_admin')
def create_batch():
    data = request.get_json(silent=True) or {}
    if not data.get('name'):
        return error('Batch name is required.', 400)
    batch = MigrationBatch(
        name=data['name'], source=data.get('source'),
        total_rows=data.get('total_rows'), notes=data.get('notes'),
    )
    db.session.add(batch)
    db.session.commit()
    return success({'batch': {'id': batch.id, 'name': batch.name}}, 201)


@migration_bp.put('/<int:batch_id>/stage')
@jwt_required()
@roles_required('admin', 'super_admin')
def advance_stage(batch_id):
    batch = db.session.get(MigrationBatch, batch_id)
    if not batch:
        return error('Batch not found.', 404)
    stages = ['metadata_consolidation', 'data_cleaning', 'staging_import', 'integration', 'audit']
    current = stages.index(batch.stage) if batch.stage in stages else 0
    if current < len(stages) - 1:
        batch.stage = stages[current + 1]
    db.session.commit()
    return success({'batch': {'id': batch.id, 'stage': batch.stage}})
