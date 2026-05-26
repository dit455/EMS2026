from app.extensions import db
from datetime import datetime


class Role(db.Model):
    __tablename__ = 'roles'

    id          = db.Column(db.Integer, primary_key=True)
    name        = db.Column(db.String(50), unique=True, nullable=False)
    scope       = db.Column(db.String(50))   # system | office | college | board
    description = db.Column(db.String(255))
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)


class Office(db.Model):
    __tablename__ = 'offices'

    id          = db.Column(db.Integer, primary_key=True)
    name        = db.Column(db.String(150), nullable=False)
    region      = db.Column(db.String(60))
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)


class College(db.Model):
    __tablename__ = 'colleges'

    id         = db.Column(db.Integer, primary_key=True)
    name       = db.Column(db.String(200), nullable=False)
    code       = db.Column(db.String(20), unique=True)
    office_id  = db.Column(db.Integer, db.ForeignKey('offices.id'))
    region     = db.Column(db.String(60))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    office = db.relationship('Office', backref='colleges')


class Feature(db.Model):
    """Feature flag — controls which modules/features are released."""
    __tablename__ = 'features'

    id          = db.Column(db.Integer, primary_key=True)
    name        = db.Column(db.String(100), unique=True, nullable=False)
    module      = db.Column(db.String(60))
    # status: enabled | disabled | pending_release
    status      = db.Column(db.String(30), default='disabled')
    description = db.Column(db.String(255))
    updated_at  = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    updated_by  = db.Column(db.Integer, db.ForeignKey('users.id'))
