from flask import Blueprint

administration_bp = Blueprint('administration', __name__)

from . import routes  # noqa: F401, E402
