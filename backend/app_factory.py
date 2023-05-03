from flask_cors import CORS
from flask_migrate import Migrate
from flask import Flask, jsonify, request
from models import db
from config import API_PREFIX
import blueprints.order as order
import blueprints.product as product
import blueprints.category as category
import blueprints.cart as cart
import blueprints.errors as errors


def create_flask_app(name, config_obj):
    app = Flask(name, static_folder="./client", static_url_path="/")
    app.config.from_object(config_obj)
    CORS(app)

    db.init_app(app)
    migrate = Migrate(app, db)

    app.register_blueprint(category.bp)
    app.register_blueprint(product.bp)
    app.register_blueprint(order.bp)
    app.register_blueprint(cart.bp)
    app.register_blueprint(errors.bp)

    @app.route("/")
    def index():
        return app.send_static_file("index.html")

    @app.errorhandler(404)
    def not_found(error):
        if request.path.startswith(API_PREFIX):
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
        else:
            return app.send_static_file("index.html")

    @app.after_request
    def after_request(response):
        response.headers.add(
            "Access-Control-Allow-Headers", "Content-Type, Authorization"
        )
        response.headers.add(
            "Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS"
        )
        return response

    return app
