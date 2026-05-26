from flask import Blueprint

migration_bp = Blueprint('migration', __name__)

from . import routes  # noqa: F401, E402
