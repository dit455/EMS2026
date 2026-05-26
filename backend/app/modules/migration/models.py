from app.extensions import db
from datetime import datetime


class MigrationBatch(db.Model):
    __tablename__ = 'migration_batches'

    id           = db.Column(db.Integer, primary_key=True)
    name         = db.Column(db.String(150), nullable=False)
    source       = db.Column(db.String(100))     # e.g. "Legacy ERP", "Excel import"
    # stage: metadata_consolidation | data_cleaning | staging_import | integration | audit
    stage        = db.Column(db.String(40), default='metadata_consolidation')
    # status: pending | in_progress | completed | failed
    status       = db.Column(db.String(20), default='pending')
    total_rows   = db.Column(db.Integer)
    imported     = db.Column(db.Integer, default=0)
    failed       = db.Column(db.Integer, default=0)
    notes        = db.Column(db.Text)
    created_by   = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at   = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)
