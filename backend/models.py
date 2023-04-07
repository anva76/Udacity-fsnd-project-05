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

    def __str__(self):
        return str(self.value)

    @classmethod
    def db_model_choices(cls, *args):
        return [str(c.value) for c in cls]


class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    auth_user_id = db.Column(db.String(150), unique=True, nullable=False)
    created_at = db.Column(db.DateTime(), default=datetime.now())

    cart_items = db.relationship(
        "CartItem", back_populates="user", cascade="all,delete-orphan"
    )
    orders = db.relationship("Order", back_populates="user")

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

    products = db.relationship("Product", back_populates="category")

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def update_from_dict(self, data):
        for key, value in data.items():
            setattr(self, key, value)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "image_link": self.image_link,
        }

    def to_dict_long(self):
        return {
            "id": self.id,
            "name": self.name,
            "image_link": self.image_link,
            "notes": self.notes,
            "products_count": len(self.products),
        }


class Product(db.Model):
    __tablename__ = "product"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), unique=True, nullable=False)
    notes = db.Column(db.String(255))
    price = db.Column(db.Float(2), nullable=False)
    discounted_price = db.Column(db.Float(2), default=None)
    image_link = db.Column(db.String(500))
    sku_code = db.Column(db.String(100), unique=True)
    created_at = db.Column(db.DateTime(), default=datetime.now())
    updated_at = db.Column(
        db.DateTime(), default=datetime.now(), onupdate=datetime.now()
    )

    category_id = db.Column(
        db.Integer, db.ForeignKey("category.id"), nullable=False
    )
    category = db.relationship("Category", back_populates="products")

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def update_from_dict(self, data):
        for key, value in data.items():
            setattr(self, key, value)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": "{:,.2f}".format(self.price),
            "discounted_price": None
            if self.discounted_price is None
            else "{:,.2f}".format(self.discounted_price),
            "image_link": self.image_link,
        }

    def to_dict_long(self):
        return {
            "id": self.id,
            "name": self.name,
            "notes": self.notes,
            "price": "{:,.2f}".format(self.price),
            "discounted_price": None
            if self.discounted_price is None
            else "{:,.2f}".format(self.discounted_price),
            "image_link": self.image_link,
            "sku_code": self.sku_code,
            "category_id": self.category_id,
        }


class Order(db.Model):
    __tablename__ = "order"

    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(30), unique=True)
    total_amount = db.Column(db.Integer)
    items_count = db.Column(db.Integer)

    # Delivery address
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(50), nullable=False)
    street_address_1 = db.Column(db.String(50), nullable=False)
    street_address_2 = db.Column(db.String(50))
    city = db.Column(db.String(50), nullable=False)
    province = db.Column(db.String(50), nullable=False)
    country = db.Column(db.String(50), nullable=False)

    status = db.Column(
        db.Enum(OrderStatus, values_callable=OrderStatus.db_model_choices),
        default=OrderStatus.NotDefined,
    )
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    user = db.relationship("User", back_populates="orders")

    order_items = db.relationship(
        "OrderItem", back_populates="order", cascade="all,delete-orphan"
    )

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def flush(self):
        db.session.add(self)
        db.session.flush()

    def update_from_dict(self, data):
        for key, value in data.items():
            setattr(self, key, value)

    def to_dict(self):
        return {
            "order_id": self.id,
            "order_number": self.order_number,
            "total_amount": "{:,.2f}".format(self.total_amount),
            "items_count": self.items_count,
            "country": self.country,
            "status": str(self.status),
        }

    def to_dict_long(self):
        items = [
            {
                "id": i.id,
                "quantity": i.quantity,
                "product": i.product.to_dict(),
            }
            for i in self.order_items
        ]

        return {
            "order_id": self.id,
            "order_number": self.order_number,
            "total_amount": "{:,.2f}".format(self.total_amount),
            "items_count": self.items_count,
            "country": self.country,
            "status": str(self.status),
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "phone": self.phone,
            "street_address_1": self.street_address_1,
            "street_address_2": self.street_address_2,
            "city": self.city,
            "province": self.province,
            "country": self.country,
            "order_items": items,
        }


class OrderItem(db.Model):
    __tablename__ = "order_item"

    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)

    product_id = db.Column(
        db.Integer, db.ForeignKey("product.id", ondelete="CASCADE")
    )
    product = db.relationship("Product")

    order_id = db.Column(
        db.Integer, db.ForeignKey("order.id", ondelete="CASCADE")
    )
    order = db.relationship("Order", back_populates="order_items")

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def flush(self):
        db.session.add(self)
        db.session.flush()


class CartItem(db.Model):
    __tablename__ = "cart_item"

    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)

    user_id = db.Column(
        db.Integer, db.ForeignKey("user.id", ondelete="CASCADE")
    )
    user = db.relationship("User", back_populates="cart_items")

    product_id = db.Column(
        db.Integer, db.ForeignKey("product.id", ondelete="CASCADE")
    )
    product = db.relationship("Product")

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    @classmethod
    def clear_user_cart(cls, user_id):
        CartItem.query.filter(CartItem.user_id == user_id).delete()
        db.session.commit()
