from flask import Blueprint

marks_bp = Blueprint('marks', __name__)

from . import routes  # noqa: F401, E402
