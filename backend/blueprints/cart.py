import sys
import json
from datetime import datetime
from flask import Blueprint, Flask, jsonify, request, abort
from validators import CartItemValidator
from models import db, CartItem, Product, User
from sqlalchemy import func as fn
from auth import requires_auth
from .utils import (
    get_user_from_auth_id,
    format_err_response,
)

bp = Blueprint("cart", __name__, url_prefix="/")


# Get cart contents
# -----------------------------------------------------------------------
@bp.get("/cart/")
@requires_auth("view:update:cart")
def get_cart_items(auth_user):
    # Locate the related shop user
    user = get_user_from_auth_id(auth_user["id"])
    if user is None:
        return jsonify({"success": True, "cart": {}})

    cart = {}
    cart_items = []
    total = 0.0
    items_count = 0
    for i in user.get_cart_items():
        if i.product.discounted_price is None:
            sub_total = i.product.price * i.quantity
        else:
            sub_total = i.product.discounted_price * i.quantity
        total += sub_total
        items_count += i.quantity
        cart_items.append(
            {
                "id": i.id,
                "quantity": i.quantity,
                "sub_total": sub_total,
                "product": i.product.to_dict(),
            }
        )
    if len(cart_items) != 0:
        cart = {
            "items": cart_items,
            "total_amount": total,
            "items_count": items_count,
        }
    else:
        cart = {}

    return jsonify({"success": True, "cart": cart})


# -----------------------------------------------------------------------
def add_cart_item(user_id, product_id, quantity):
    # Check if this product is already in the cart
    cart_item = CartItem.query.filter_by(
        user_id=user_id, product_id=product_id
    ).one_or_none()

    if cart_item is None:
        cart_item = CartItem(
            user_id=user_id,
            product_id=product_id,
            quantity=quantity,
        )
        cart_item.save()
    else:
        cart_item.quantity += quantity
        cart_item.update()

    return cart_item


# Add a new cart item
# -----------------------------------------------------------------------
@bp.post("/cart/")
@requires_auth("view:update:cart")
def add_product_to_cart(auth_user):
    error = False
    data = CartItemValidator.validate_post(request)
    if data is None:
        abort(400)

    product = Product.query.filter_by(id=data["product_id"]).one_or_none()
    if product is None:
        return format_err_response("Product not found", 404)

    user = get_user_from_auth_id(auth_user["id"])

    try:
        if user is None:
            user = User(auth_user_id=auth_user["id"])
            user.save()

        cart_item = add_cart_item(
            user.id,
            data["product_id"],
            data["quantity"],
        )

    except Exception as e:
        error = True
        db.session.rollback()
        print(str(e))

    if error:
        return format_err_response("New cart item could not be added.", 500)
    else:
        return jsonify({"success": True, "cart_item_id": cart_item.id})


# Delete a cart item
# -----------------------------------------------------------------------
@bp.delete("/cart/<int:cart_item_id>/")
@requires_auth("view:update:cart")
def delete_cart_item(cart_item_id, auth_user):
    error = False

    user = get_user_from_auth_id(auth_user["id"])
    if user is None:
        abort(404)

    cart_item = CartItem.query.filter_by(
        user_id=user.id, id=cart_item_id
    ).one_or_none()
    if cart_item is None:
        abort(404)

    try:
        cart_item.delete()

    except Exception as e:
        error = True
        db.session.rollback()
        print(str(e))

    if error:
        return format_err_response(
            f"Cart item id:{cart_item.id} could not be deleted.", 500
        )
    else:
        return jsonify({"success": True, "cart_item_id": cart_item.id})


# Partch a cart item
# -----------------------------------------------------------------------
@bp.patch("/cart/<int:cart_item_id>/")
@requires_auth("view:update:cart")
def patch_cart_item(cart_item_id, auth_user):
    error = False
    data = CartItemValidator.validate_patch(request)
    if data is None:
        abort(400)

    user = get_user_from_auth_id(auth_user["id"])
    if user is None:
        abort(404)

    cart_item = CartItem.query.filter_by(
        user_id=user.id, id=cart_item_id
    ).one_or_none()
    if cart_item is None:
        abort(404)

    try:
        cart_item.quantity = data["quantity"]
        cart_item.update()

    except Exception as e:
        error = True
        db.session.rollback()
        print(str(e))

    if error:
        return format_err_response(
            f"Cart item id:{cart_item.id} could not be updated.", 500
        )
    else:
        return jsonify({"success": True, "cart_item_id": cart_item.id})
