import sys
import json
from datetime import datetime
from validators import CategoryValidator
from flask import Blueprint, Flask, jsonify, request, abort
from models import db, Category, Product
from sqlalchemy import func as fn
from auth import requires_auth
from .utils import format_err_response, paginator

bp = Blueprint("categories", __name__, url_prefix="/api")


# ----------------------------------------------------------------------
@bp.get("/categories/")
def get_categories():
    categories = Category.query.order_by(Category.name).all()

    return jsonify(
        {
            "success": True,
            "categories": [cat.to_dict() for cat in categories],
        }
    )


# ----------------------------------------------------------------------
@bp.get("/categories/<int:category_id>/")
def get_category_by_id(category_id):
    category = Category.query.filter_by(id=category_id).one_or_none()
    if category is None:
        abort(404)

    return jsonify({"success": True, "category": category.to_dict_long()})


# ----------------------------------------------------------------------
@bp.get("/categories/<int:category_id>/products/")
def get_products_by_category(category_id):
    category = Category.query.filter_by(id=category_id).one_or_none()
    if category is None:
        abort(404)

    products = (
        Product.query.filter_by(category_id=category.id)
        .order_by(Product.created_at.desc())
        .all()
    )
    paginated_products, actual_page = paginator(request, products)

    return jsonify(
        {
            "success": True,
            "products": [p.to_dict() for p in paginated_products],
            "category_id": category.id,
            "actual_page": actual_page,
            "total_products": len(products),
        }
    )


# Confirm category name is unique
# ----------------------------------------------------------------------
def confirm_category_unique(name, current_name=None, patched=False):
    # print(name)
    if patched:
        category = Category.query.filter(
            fn.lower(Category.name) == fn.lower(name),
            fn.lower(Category.name) != fn.lower(current_name),
        ).one_or_none()
    else:
        category = Category.query.filter(
            fn.lower(Category.name) == fn.lower(name)
        ).one_or_none()

    if category is not None:
        return False

    return True


# ----------------------------------------------------------------------
@bp.post("/categories/")
@requires_auth("create:categories")
def add_new_category(**kwargs):
    error = False
    new_data = CategoryValidator.validate_post(request)
    if new_data is None:
        return format_err_response("JSON schema or parameters are not valid.", 422)

    if not confirm_category_unique(new_data["name"]):
        return format_err_response("Category name is not unique", 422)

    try:
        category = Category(**new_data)
        category.save()

    except Exception as e:
        error = True
        db.session.rollback()
        print(str(e))

    if error:
        return format_err_response("New category could not be created.", 500)
    else:
        return jsonify({"success": True, "category_id": category.id})


# Update an existing category
# ----------------------------------------------------------------------
@bp.patch("/categories/<int:category_id>/")
@requires_auth("update:categories")
def update_category(category_id, **kwargs):
    error = False
    category = Category.query.filter_by(id=category_id).one_or_none()
    if category is None:
        abort(404)

    new_data = CategoryValidator.validate_patch(request)
    if new_data is None:
        return format_err_response("JSON schema or parameters are not valid.", 422)

    if not confirm_category_unique(new_data["name"], category.name, patched=True):
        return format_err_response("Category name is not unique", 422)

    try:
        category.update_from_dict(new_data)
        category.update()

    except Exception as e:
        error = True
        db.session.rollback()
        print(str(e))

    if error:
        return format_err_response(
            f"Server error. Category id:{category.id} could not be updated.",
            500,
        )
    else:
        return jsonify({"success": True, "category_id": category.id})


# Check if the category is empty
# ----------------------------------------------------------------------
def confirm_category_empty(category):
    return len(category.products) == 0


# ----------------------------------------------------------------------
@bp.delete("/categories/<int:category_id>/")
@requires_auth("delete:categories")
def delete_category(category_id, **kwargs):
    error = False
    category = Category.query.filter_by(id=category_id).one_or_none()
    if category is None:
        abort(404)

    if not confirm_category_empty(category):
        return format_err_response("Category is not empty.", 422, "category_not_empty")

    try:
        category.delete()

    except Exception as e:
        error = True
        db.session.rollback()
        print(str(e))

    if error:
        return format_err_response(
            f"Category id:{category.id} could not be deleted.", 500
        )
    else:
        return jsonify({"success": True, "category_id": category.id})
