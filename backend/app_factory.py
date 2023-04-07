import sys
import json
from datetime import datetime
from flask_cors import CORS
from flask_migrate import Migrate
from flask import Flask, jsonify, request, abort
from models import (
    db,
    Category,
    Product,
    User,
    Order,
    OrderItem,
    CartItem,
    OrderStatus,
)
from sqlalchemy import func as fn
from auth import get_auth_provider_user_id


def create_flask_app(name, config_obj):
    app = Flask(name)
    app.config.from_object(config_obj)
    CORS(app)

    db.init_app(app)
    migrate = Migrate(app, db)

    # Response with a specific message if necessary
    # ----------------------------------------------------------------------
    def format_err_response(message, code):
        return (
            jsonify({"success": False, "error": code, "message": message}),
            code,
        )

    # ----------------------------------------------------------------------
    def extract_request_params(request, param_keys):
        body = request.get_json()
        result = {}
        for key in param_keys:
            tmp = body.get(key, None)
            if tmp is not None:
                if isinstance(tmp, str):
                    result[key] = tmp.strip()
                else:
                    result[key] = tmp
        return result

    # ----------------------------------------------------------------------
    def get_user_from_auth_id(auth_user_id):
        user = User.query.filter_by(auth_user_id=auth_user_id).one_or_none()

        return user

    # ----------------------------------------------------------------------
    @app.get("/categories/")
    def get_categories():
        categories = Category.query.all()

        return jsonify(
            {
                "success": True,
                "categories": [cat.to_dict() for cat in categories],
            }
        )

    # ----------------------------------------------------------------------
    @app.get("/categories/<int:category_id>/")
    def get_category_by_id(category_id):
        category = Category.query.filter_by(id=category_id).one_or_none()
        if category is None:
            abort(404)

        return jsonify({"success": True, "category": category.to_dict_long()})

    # Validate a new category
    # ----------------------------------------------------------------------
    def validate_category(request, patched=False):
        param_keys = ("name", "image_link", "notes")
        data = extract_request_params(request, param_keys)

        if len(data) != len(param_keys) and not patched:
            return None

        if len(data["name"]) == 0:
            return None

        data["name"] = data["name"].strip()

        return data

    # Confirm category name is unique
    # ----------------------------------------------------------------------
    def confirm_category_unique(name, current_name=None, patched=False):
        print(name)
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
    @app.post("/categories/")
    def add_new_category():
        error = False
        new_data = validate_category(request)

        if new_data is None:
            abort(400)

        if not confirm_category_unique(new_data["name"]):
            return format_err_response("Category name is not unique", 400)

        try:
            category = Category(**new_data)
            category.save()

        except Exception as e:
            error = True
            db.session.rollback()
            print(str(e))

        if error:
            return format_err_response(
                "New category could not be created.", 500
            )
        else:
            return jsonify({"success": True, "category_id": category.id})

    # Update an existing category
    # ----------------------------------------------------------------------
    @app.patch("/categories/<int:category_id>/")
    def update_category(category_id):
        error = False
        category = Category.query.filter_by(id=category_id).one_or_none()
        if category is None:
            abort(404)

        new_data = validate_category(request, patched=True)

        if new_data is None:
            abort(400)

        if not confirm_category_unique(
            new_data["name"], category.name, patched=True
        ):
            return format_err_response("Category name is not unique", 400)

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
    @app.delete("/categories/<int:category_id>/")
    def delete_category(category_id):
        error = False
        category = Category.query.filter_by(id=category_id).one_or_none()
        if category is None:
            abort(404)

        if not confirm_category_empty(category):
            return format_err_response("Category is not empty.", 400)

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

    # ----------------------------------------------------------------------
    @app.get("/products/")
    def get_products():
        products = Product.query.all()

        return jsonify(
            {"success": True, "products": [pr.to_dict() for pr in products]}
        )

    # ----------------------------------------------------------------------
    @app.get("/products/<int:product_id>/")
    def get_product_by_id(product_id):
        product = Product.query.filter_by(id=product_id).one_or_none()
        if product is None:
            abort(404)

        return jsonify({"success": True, "product": product.to_dict_long()})

    # Validate a new product
    # ----------------------------------------------------------------------
    def validate_product(request):
        param_keys = (
            "name",
            "image_link",
            "notes",
            "sku_code",
            "category_id",
            "price",
            "discounted_price",
        )
        data = extract_request_params(request, param_keys)

        if len(data) != len(param_keys):
            return None

        if len(data["name"]) == 0:
            return None

        # Assert int value
        try:
            data["category_id"] = int(data["category_id"])
        except ValueError:
            return None

        return data

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
    @app.post("/products/")
    def add_new_product():
        error = False
        new_data = validate_product(request)

        if new_data is None:
            abort(400)

        if not Category.query.filter_by(
            id=new_data["category_id"]
        ).one_or_none():
            return format_err_response("Category not found.", 404)

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
            return format_err_response(
                "New product could not be created.", 500
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
    @app.delete("/products/<int:product_id>/")
    def delete_product(product_id):
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

    # Get cart contents
    # -----------------------------------------------------------------------
    @app.get("/cart/")
    def get_cart_items():
        auth_user_id = get_auth_provider_user_id(request)

        # Locate the related shop user
        user = get_user_from_auth_id(auth_user_id)

        if user is None:
            return jsonify({"success": True, "cart_items": []})

        cart_items = [
            {
                "id": i.id,
                "quantity": i.quantity,
                "product": i.product.to_dict(),
            }
            for i in user.cart_items
        ]

        return jsonify({"success": True, "cart_items": cart_items})

    # -----------------------------------------------------------------------
    def validate_cart_item(request):
        param_keys = ("product_id", "quantity")
        data = extract_request_params(request, param_keys)

        if len(data) != len(param_keys):
            return None

        return data

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
    @app.post("/cart/")
    def add_product_to_cart():
        error = False

        auth_user_id = get_auth_provider_user_id(request)
        if auth_user_id is None:
            return format_err_response("Unauthorized", 401)

        data = validate_cart_item(request)
        if data is None:
            abort(400)

        product = Product.query.filter_by(id=data["product_id"]).one_or_none()
        if product is None:
            return format_err_response("Product not found", 404)

        user = get_user_from_auth_id(auth_user_id)

        try:
            if user is None:
                user = User(auth_user_id=auth_user_id)
                user.save()

            cart_product = add_cart_item(
                user.id,
                data["product_id"],
                data["quantity"],
            )

        except Exception as e:
            error = True
            db.session.rollback()
            print(str(e))

        if error:
            return format_err_response(
                "New cart item could not be added.", 500
            )
        else:
            return jsonify(
                {"success": True, "cart_product_id": cart_product.id}
            )

    # Delete a cart item
    # -----------------------------------------------------------------------
    @app.delete("/cart/<int:cart_item_id>/")
    def delete_cart_item(cart_item_id):
        error = False

        auth_user_id = get_auth_provider_user_id(request)
        if auth_user_id is None:
            return format_err_response("Unauthorized", 401)

        user = get_user_from_auth_id(auth_user_id)

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

    def validate_order(request):
        param_keys = (
            "first_name",
            "last_name",
            "email",
            "phone",
            "street_address_1",
            "street_address_2",
            "city",
            "province",
            "country",
        )
        data = extract_request_params(request, param_keys)

        if len(data) != len(param_keys):
            return None

        return data

    # Get orders
    # -----------------------------------------------------------------------
    @app.get("/orders/")
    def get_orders():
        auth_user_id = get_auth_provider_user_id(request)
        if auth_user_id is None:
            return format_err_response("Unauthorized", 401)

        user = get_user_from_auth_id(auth_user_id)

        if user is None:
            return jsonify({"success": True, "orders": []})

        return jsonify(
            {
                "success": True,
                "orders": [order.to_dict() for order in user.orders],
            }
        )

    # -----------------------------------------------------------------------
    @app.get("/orders/<int:order_id>/")
    def get_order(order_id):
        auth_user_id = get_auth_provider_user_id(request)
        if auth_user_id is None:
            return format_err_response("Unauthorized", 401)

        user = get_user_from_auth_id(auth_user_id)

        order = Order.query.filter(
            Order.id == order_id, Order.user_id == user.id
        ).one_or_none()
        if order is None:
            abort(404)

        return jsonify({"success": True, "order": order.to_dict_long()})

    # Submit a new order with current cart items
    # -----------------------------------------------------------------------
    @app.post("/orders/")
    def submit_new_order():
        error = False

        auth_user_id = get_auth_provider_user_id(request)
        if auth_user_id is None:
            return format_err_response("Unauthorized", 401)

        user = get_user_from_auth_id(auth_user_id)

        if len(user.cart_items) == 0:
            return format_err_response(
                "Order could not be submitted. Cart is empty.", 400
            )

        data = validate_order(request)
        if data is None:
            abort(400)

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
                    items_count += item.quantity
                else:
                    total_amount += (
                        item.product.discounted_price * item.quantity
                    )
                    items_count += item.quantity

                order_item = OrderItem()
                order_item.order_id = order.id
                order_item.product_id = item.product_id
                order_item.quantity = item.quantity
                order_item.flush()

            current_date = datetime.today().strftime("%Y%m%d")
            order_number = current_date + "." + str(order.id)
            order.order_number = order_number
            order.total_amount = total_amount
            order.items_count = items_count
            order.flush()
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
    @app.delete("/orders/<int:order_id>/")
    def delete_order(order_id):
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

    # Error Handling
    # -----------------------------------------------------------------------

    # Unprocessable entity
    @app.errorhandler(422)
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
    @app.errorhandler(404)
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
    @app.errorhandler(400)
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
    @app.errorhandler(500)
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
    @app.errorhandler(403)
    def access_denied(error):
        return (
            jsonify(
                {
                    "success": False,
                    "error": 403,
                    "message": "Access denied.",
                }
            ),
            403,
        )

    # Unauthorized
    @app.errorhandler(401)
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

    return app
