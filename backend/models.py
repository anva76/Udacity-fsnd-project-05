import json
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask import jsonify
from aenum import Enum

db = SQLAlchemy()


class OrderStatus(Enum):
    NotDefined = "not_defined"
    Submitted = "submitted"
    Accepted = "accepted"
    InAssembly = "in_assembly"
    InDelivery = "in_delivery"
    Delivered = "delivered"
    Cancelled = "cancelled"

    @classmethod
    def db_model_choices(cls, *args):
        return [str(x.value) for x in cls]


class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    auth_user_id = db.Column(db.String(150), unique=True, nullable=False)
    created_at = db.Column(db.DateTime(), default=datetime.now())

    cart_items = db.relationship(
        "CartItem", back_populates="user", cascade="all,delete-orphan"
    )

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class Category(db.Model):
    __tablename__ = "category"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), unique=True, nullable=False)
    notes = db.Column(db.String(255))
    image_link = db.Column(db.String(500))
    created_at = db.Column(db.DateTime(), default=datetime.now())
    updated_at = db.Column(
        db.DateTime(), default=datetime.now(), onupdate=datetime.now()
    )

    products = db.relationship(
        "Product", back_populates="category", cascade="all,delete-orphan"
    )

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "notes": self.notes,
            "image_link": self.image_link,
        }


class Product(db.Model):
    __tablename__ = "product"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), unique=True, nullable=False)
    notes = db.Column(db.String(255))
    image_link = db.Column(db.String(500))
    sku_code = db.Column(db.String(100), unique=True)
    created_at = db.Column(db.DateTime(), default=datetime.now())
    updated_at = db.Column(
        db.DateTime(), default=datetime.now(), onupdate=datetime.now()
    )

    category_id = db.Column(db.Integer, db.ForeignKey("category.id"))
    category = db.relationship("Category", back_populates="products")

    order_items = db.relationship(
        "OrderProduct", back_populates="product", cascade="all,delete-orphan"
    )

    # orders = db.relationship(
    #    "Order", secondary="order_product", back_populates="products"
    # )

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "notes": self.notes,
            "image_link": self.image_link,
            "sku_code": self.sku_code,
            "category_id": self.category_id,
        }


class Order(db.Model):
    __tablename__ = "order"

    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(30), unique=True)
    total_amount = db.Column(db.Integer, nullable=False)

    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    email = db.Column(db.String(50))
    phone = db.Column(db.String(50))
    street_address_1 = db.Column(db.String(50))
    street_address_2 = db.Column(db.String(50))
    city = db.Column(db.String(50))
    province = db.Column(db.String(50))
    country = db.Column(db.String(50))
    order_status = db.Column(
        db.Enum(OrderStatus, values_callable=OrderStatus.db_model_choices),
        default=OrderStatus.NotDefined,
    )

    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))

    order_items = db.relationship(
        "OrderProduct", back_populates="order", cascade="all,delete-orphan"
    )

    # products = db.relationship(
    #    "Product", secondary="order_product", back_populates="orders"
    # )

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self):
        db.session.commit()


class OrderProduct(db.Model):
    __tablename__ = "order_product"

    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)

    product_id = db.Column(db.Integer, db.ForeignKey("product.id"))
    product = db.relationship("Product", back_populates="order_items")

    order_id = db.Column(db.Integer, db.ForeignKey("order.id"))
    order = db.relationship("Order", back_populates="order_items")

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self):
        db.session.commit()


class CartItem(db.Model):
    __tablename__ = "cart_item"

    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    user = db.relationship("User", back_populates="cart_items")

    product_id = db.Column(db.Integer, db.ForeignKey("product.id"))
    product = db.relationship("Product")

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self):
        db.session.commit()
