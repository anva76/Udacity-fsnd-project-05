from flask import Blueprint, jsonify
from auth import AuthError

bp = Blueprint("errors", __name__)


# Error Handling
# -----------------------------------------------------------------------
# Unprocessable entity
@bp.app_errorhandler(422)
def unprocessable(error):
    return (
        jsonify(
            {
                "success": False,
                "error": 422,
                "message": "Unprocessable entity.",
            }
        ),
        422,
    )


# Entity not found
@bp.app_errorhandler(404)
def not_found(error):
    return (
        jsonify(
            {
                "success": False,
                "error": 404,
                "message": "Entity not found.",
            }
        ),
        404,
    )


# Bad request
@bp.app_errorhandler(400)
def bad_request(error):
    print(error)
    return (
        jsonify(
            {
                "success": False,
                "error": 400,
                "message": "Invalid request.",
            }
        ),
        400,
    )


# Internal server error
@bp.app_errorhandler(500)
def server_error(error):
    return (
        jsonify(
            {
                "success": False,
                "error": 500,
                "message": "Internal server error.",
            }
        ),
        500,
    )


# Access denied
@bp.app_errorhandler(403)
def access_denied(error):
    return (
        jsonify(
            {
                "success": False,
                "error": 403,
                "message": "Access denied!!.",
            }
        ),
        403,
    )


# Unauthorized
@bp.app_errorhandler(401)
def unauthorized(error):
    return (
        jsonify(
            {
                "success": False,
                "error": 401,
                "message": "Unauthorized.",
            }
        ),
        401,
    )


# AuthError error handler
@bp.app_errorhandler(AuthError)
def auth_error(e):
    return (
        jsonify(
            {
                "success": False,
                "error": e.status_code,
                "message": e.error["description"],
            }
        ),
        401,
    )
