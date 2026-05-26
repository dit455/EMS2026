from flask import request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.extensions import db
from app.common.responses import success, error
from . import auth_bp
from .models import User


@auth_bp.post('/login')
def login():
    data = request.get_json(silent=True) or {}
    email    = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return error('Email and password are required.', 400)

    user = User.query.filter_by(email=email, is_active=True).first()
    if not user or not user.check_password(password):
        return error('Invalid credentials.', 401)

    token = create_access_token(identity={'id': user.id, 'role': user.role})
    return success({'token': token, 'user': user.to_dict()})


@auth_bp.post('/register')
def register():
    data = request.get_json(silent=True) or {}
    name     = data.get('name', '').strip()
    email    = data.get('email', '').strip().lower()
    password = data.get('password', '')
    mobile   = data.get('mobile', '').strip()

    if not all([name, email, password]):
        return error('Name, email, and password are required.', 400)

    if User.query.filter_by(email=email).first():
        return error('Email already registered.', 409)

    user = User(name=name, email=email, mobile=mobile, role='student')
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return success({'user': user.to_dict()}, 201)


@auth_bp.get('/me')
@jwt_required()
def me():
    identity = get_jwt_identity()
    user = db.session.get(User, identity['id'])
    if not user:
        return error('User not found.', 404)
    return success({'user': user.to_dict()})
