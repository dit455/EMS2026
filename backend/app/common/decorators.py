from functools import wraps
from flask_jwt_extended import get_jwt_identity
from .responses import error


def roles_required(*allowed_roles):
    """Decorator: restrict a route to one or more roles.

    Usage:
        @roles_required('admin', 'super_admin')
        def my_view(): ...
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            identity = get_jwt_identity()
            if not identity or identity.get('role') not in allowed_roles:
                return error('You do not have permission to access this resource.', 403)
            return fn(*args, **kwargs)
        return wrapper
    return decorator
