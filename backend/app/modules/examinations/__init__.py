from flask import Blueprint

examinations_bp = Blueprint('examinations', __name__)

from . import routes  # noqa: F401, E402
