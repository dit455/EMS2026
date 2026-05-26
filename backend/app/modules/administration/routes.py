from flask import request
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.common.responses import success, error
from app.common.decorators import roles_required
from . import administration_bp
from .models import Role, Office, College, Feature


@administration_bp.get('/roles')
@jwt_required()
@roles_required('admin', 'super_admin')
def list_roles():
    roles = Role.query.all()
    return success({'roles': [{'id': r.id, 'name': r.name, 'scope': r.scope} for r in roles]})


@administration_bp.post('/roles')
@jwt_required()
@roles_required('super_admin')
def create_role():
    data = request.get_json(silent=True) or {}
    role = Role(name=data.get('name'), scope=data.get('scope'), description=data.get('description'))
    db.session.add(role)
    db.session.commit()
    return success({'role': {'id': role.id, 'name': role.name}}, 201)


@administration_bp.get('/colleges')
@jwt_required()
def list_colleges():
    colleges = College.query.all()
    return success({'colleges': [{'id': c.id, 'name': c.name, 'code': c.code} for c in colleges]})


@administration_bp.post('/colleges')
@jwt_required()
@roles_required('admin', 'super_admin')
def create_college():
    data = request.get_json(silent=True) or {}
    college = College(
        name=data.get('name'), code=data.get('code'),
        office_id=data.get('office_id'), region=data.get('region'),
    )
    db.session.add(college)
    db.session.commit()
    return success({'college': {'id': college.id, 'name': college.name}}, 201)


@administration_bp.get('/features')
@jwt_required()
@roles_required('admin', 'super_admin')
def list_features():
    features = Feature.query.all()
    return success({'features': [
        {'id': f.id, 'name': f.name, 'module': f.module, 'status': f.status}
        for f in features
    ]})


@administration_bp.put('/features/<int:feature_id>')
@jwt_required()
@roles_required('super_admin')
def toggle_feature(feature_id):
    feature = db.session.get(Feature, feature_id)
    if not feature:
        return error('Feature not found.', 404)
    data = request.get_json(silent=True) or {}
    feature.status = data.get('status', feature.status)
    db.session.commit()
    return success({'feature': {'id': feature.id, 'status': feature.status}})
