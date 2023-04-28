import sys
import json
from datetime import datetime
from validators import ProductValidator, SearchValidator
from flask import Blueprint, Flask, jsonify, request, abort
from models import db, Product, OrderItem
from sqlalchemy import func as fn
from auth import requires_auth
from .utils import get_user_from_auth_id, format_err_response, paginator

bp = Blueprint("products", __name__, url_prefix="/")


# ----------------------------------------------------------------------
@bp.get("/products/")
def get_products():
    products = Product.query.order_by(Product.created_at.desc()).all()

    paginated_products, actual_page = paginator(request, products)

    return jsonify(
        {
            "success": True,
            "products": [pr.to_dict() for pr in paginated_products],
            "actual_page": actual_page,
        }
    )


# ----------------------------------------------------------------------
@bp.get("/products/<int:product_id>/")
def get_product_by_id(product_id):
    product = Product.query.filter_by(id=product_id).one_or_none()
    if product is None:
        abort(404)

    return jsonify({"success": True, "product": product.to_dict_long()})


# Confirm product name is unique
# ----------------------------------------------------------------------
def confirm_product_unique(name, current_name=None, patched=False):
    if patched:
        product = Product.query.filter(
            fn.lower(Product.name) == fn.lower(name),
            fn.lower(Product.name) != fn.lower(current_name),
        ).one_or_none()
    else:
        product = Product.query.filter(
            fn.lower(Product.name) == fn.lower(name)
        ).one_or_none()

    if product is not None:
        return False

    return True


# Add a new product
# ----------------------------------------------------------------------
@bp.post("/products/")
@requires_auth("create:products")
def add_new_product(**kwargs):
    error = False
    new_data = ProductValidator.validate_post(request)
    if new_data is None:
        return format_err_response(
            "JSON schema or parameters are not valid.", 400
        )

    if not confirm_product_unique(new_data["name"]):
        return format_err_response("Product name is not unique.", 400)

    try:
        product = Product(**new_data)
        product.save()

    except Exception as e:
        error = True
        db.session.rollback()
        print(str(e))

    if error:
        return format_err_response("New product could not be created.", 500)
    else:
        return jsonify({"success": True, "product_id": product.id})


# Update a new product
# ----------------------------------------------------------------------
@bp.patch("/products/<int:product_id>/")
@requires_auth("update:products")
def update_product(product_id, **kwargs):
    error = False
    new_data = ProductValidator.validate_patch(request)
    if new_data is None:
        return format_err_response(
            "JSON schema or parameters are not valid.", 400
        )

    product = Product.query.filter_by(id=product_id).one_or_none()
    if product is None:
        abort(404)

    if not confirm_product_unique(
        new_data["name"], product.name, patched=True
    ):
        return format_err_response("Product name is not unique.", 400)

    try:
        product.update_from_dict(new_data)
        product.update()

    except Exception as e:
        error = True
        db.session.rollback()
        print(str(e))

    if error:
        return format_err_response(
            f"Product id:{product.id} could not be updated.", 500
        )
    else:
        return jsonify({"success": True, "product_id": product.id})


# Check if a product was previously ordered
# -----------------------------------------------------------------------
def was_ordered(product):
    item = OrderItem.query.filter_by(product_id=product.id).one_or_none()

    if item is not None:
        return True

    return False


# -----------------------------------------------------------------------
@bp.delete("/products/<int:product_id>/")
@requires_auth("delete:products")
def delete_product(product_id, **kwargs):
    error = False
    product = Product.query.filter_by(id=product_id).one_or_none()
    if product is None:
        abort(404)

    if was_ordered(product):
        return format_err_response("Product was already ordered.", 400)

    try:
        product.delete()

    except Exception as e:
        error = True
        db.session.rollback()
        print(str(e))

    if error:
        return format_err_response(
            f"Product id:{product.id} could not be deleted.", 500
        )
    else:
        return jsonify({"success": True, "product_id": product.id})


# -----------------------------------------------------------------------
@bp.post("/search/")
def search_products():
    data = SearchValidator.validate_post(request)

    if data is None:
        return format_err_response(
            "JSON schema or parameters are not valid.", 400
        )

    query = data["search_query"].strip()
    products = Product.query.filter(Product.name.ilike(f"%{query}%")).all()

    return {"success": True, "products": [pr.to_dict() for pr in products]}
