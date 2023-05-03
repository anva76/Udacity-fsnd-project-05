import sys
import json
from datetime import datetime
from validators import OrderValidator
from flask import Blueprint, Flask, jsonify, request, abort
from models import db, Order, OrderStatus, OrderItem, CartItem, User
from sqlalchemy import func as fn
from auth import requires_auth
from .utils import get_user_from_auth_id, format_err_response, paginator

bp = Blueprint("orders", __name__, url_prefix="/api")


# Get orders
# -----------------------------------------------------------------------
@bp.get("/orders/")
@requires_auth("view:orders")
def get_orders(auth_user):
    # Admins can see all orders, normal users can only see their own
    if auth_user["admin"] is True:
        orders = Order.query.order_by(Order.created_at.desc()).all()
    else:
        user = get_user_from_auth_id(auth_user["id"])
        if user is None:
            return jsonify({"success": True, "orders": []})
        orders = user.get_orders()

    paginated_orders, actual_page = paginator(request, orders)

    return jsonify(
        {
            "success": True,
            "orders": [order.to_dict() for order in paginated_orders],
            "actual_page": actual_page,
            "total_orders": len(orders),
        }
    )


# -----------------------------------------------------------------------
@bp.get("/orders/<int:order_id>/")
@requires_auth("view:orders")
def get_order(order_id, auth_user):
    # Admins can see all orders, normal users can only see their own
    if auth_user["admin"] is True:
        order = Order.query.filter(Order.id == order_id).one_or_none()
        if order is None:
            abort(404)
    else:
        user = get_user_from_auth_id(auth_user["id"])
        if user is None:
            abort(404)

        order = Order.query.filter(
            Order.id == order_id, Order.user_id == user.id
        ).one_or_none()
        if order is None:
            abort(404)

    return jsonify({"success": True, "order": order.to_dict_long()})


# Submit a new order with current cart items
# -----------------------------------------------------------------------
@bp.post("/orders/")
@requires_auth("create:orders")
def submit_new_order(auth_user):
    error = False
    user = get_user_from_auth_id(auth_user["id"])

    if user is None or len(user.cart_items) == 0:
        return format_err_response(
            "Order could not be submitted. Cart is empty.", 400
        )

    data = OrderValidator.validate_post(request)
    if data is None:
        return format_err_response(
            "JSON schema or parameters are not valid.", 400
        )

    try:
        order = Order(**data)
        order.status = OrderStatus.Submitted
        order.user_id = user.id
        order.flush()

        total_amount = 0
        items_count = 0
        for item in user.cart_items:
            if item.product.discounted_price is None:
                total_amount += item.product.price * item.quantity
            else:
                total_amount += item.product.discounted_price * item.quantity
            items_count += item.quantity

            order_item = OrderItem()
            order_item.order_id = order.id
            order_item.product_id = item.product_id
            order_item.quantity = item.quantity
            order_item.price = (
                item.product.discounted_price
                if item.product.discounted_price is not None
                else item.product.price
            )
            db.session.add(order_item)

        current_date = datetime.today().strftime("%Y%m%d")
        order_number = current_date + "." + str(order.id)
        order.order_number = order_number
        order.total_amount = total_amount
        order.items_count = items_count
        # Clear cart items
        CartItem.query.filter(CartItem.user_id == user.id).delete()

        db.session.commit()

    except Exception as e:
        error = True
        db.session.rollback()
        print(str(e))

    if error:
        return format_err_response(
            "Server error. Order could not be created.", 500
        )
    else:
        return jsonify({"success": True, "order_id": order.id})


# -----------------------------------------------------------------------
@bp.delete("/orders/<int:order_id>/")
@requires_auth("delete:orders")
def delete_order(order_id, **kwargs):
    error = False

    order = Order.query.filter(Order.id == order_id).one_or_none()
    if order is None:
        abort(404)

    try:
        order.delete()

    except Exception as e:
        error = True
        db.session.rollback()
        print(str(e))

    if error:
        return format_err_response(
            f"Server error. Order id:{order.id} could not be deleted.", 500
        )
    else:
        return jsonify({"success": True, "order_id": order.id})


# -----------------------------------------------------------------------
@bp.patch("/orders/<int:order_id>/")
@requires_auth("update:orders")
def update_order(order_id, **kwargs):
    error = False
    new_data = OrderValidator.validate_patch(request)
    if new_data is None:
        return format_err_response(
            "JSON schema or parameters are not valid.", 400
        )

    order = Order.query.filter(Order.id == order_id).one_or_none()
    if order is None:
        abort(404)

    try:
        order.update_from_dict(new_data)
        order.update()

    except Exception as e:
        error = True
        db.session.rollback()
        print(str(e))

    if error:
        return format_err_response(
            f"Order id:{order.id} could not be updated.", 500
        )
    else:
        return jsonify({"success": True, "order_id": order.id})
