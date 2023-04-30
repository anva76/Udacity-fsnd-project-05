from models import db, User, jsonify
from config import ITEMS_PER_PAGE


# Response with a specific message if necessary
# ----------------------------------------------------------------------
def format_err_response(message, status_code, code=None):
    return (
        jsonify(
            {
                "success": False,
                "error": status_code,
                "message": message,
                "code": code,
            }
        ),
        code,
    )


# ----------------------------------------------------------------------
def get_user_from_auth_id(auth_user_id):
    user = User.query.filter_by(auth_user_id=auth_user_id).one_or_none()

    return user


# Paginator
# ---------------------------------------------------------------
def paginator(request, selection):
    page = request.args.get("page", None, int)
    if page is None:
        return selection, None

    start = (page - 1) * ITEMS_PER_PAGE
    end = start + ITEMS_PER_PAGE

    if start > len(selection) - 1:
        # return the first page if the page number is out of range
        return selection[0:ITEMS_PER_PAGE], 1
    else:
        return selection[start:end], page
