from flask import jsonify


def success(data: dict, status_code: int = 200):
    """Return a standardised JSON success response."""
    return jsonify({'status': 'success', **data}), status_code


def error(message: str, status_code: int = 400):
    """Return a standardised JSON error response."""
    return jsonify({'status': 'error', 'message': message}), status_code
