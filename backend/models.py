import json
from flask_sqlalchemy import SQLAlchemy
from flask import jsonify
from aenum import Enum
from sqlalchemy.sql import func

# Fix for sqlite3
# -------------------------------------------------------
from sqlalchemy import event
from sqlalchemy.engine import Engine
from sqlite3 import Connection as SQLite3Connection


@event.listens_for(Engine, "connect")
def _set_sqlite_pragma(dbapi_connection, connection_record):
    if isinstance(dbapi_connection, SQLite3Connection):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON;")
        cursor.close()


# -------------------------------------------------------

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
    created_at = db.Column(db.DateTime(), server_default=func.now())

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

    def get_cart_items(self):
        return self.cart_items

    def get_orders(self):
        return self.orders


class Category(db.Model):
    __tablename__ = "category"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), unique=True, nullable=False)
    notes = db.Column(db.String(255))
    image_link = db.Column(db.String(500))

    created_at = db.Column(db.DateTime(), server_default=func.now())
    updated_at = db.Column(
        db.DateTime(), server_default=func.now(), onupdate=func.now()
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
    discounted_price = db.Column(db.Float(2))
    image_link = db.Column(db.String(500))
    sku_code = db.Column(db.String(100), unique=True)

    created_at = db.Column(db.DateTime(), server_default=func.now())
    updated_at = db.Column(
        db.DateTime(), server_default=func.now(), onupdate=func.now()
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
            "price": self.price,
            "discounted_price": self.discounted_price,
            "image_link": self.image_link,
        }

    def to_dict_long(self):
        return {
            "id": self.id,
            "name": self.name,
            "notes": self.notes,
            "price": self.price,
            "discounted_price": self.discounted_price,
            "image_link": self.image_link,
            "sku_code": self.sku_code,
            "category_id": self.category_id,
        }


class Order(db.Model):
    __tablename__ = "order"

    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(30), unique=True)
    total_amount = db.Column(db.Float(2))
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
    postal_code = db.Column(db.String(50))
    country = db.Column(db.String(50), nullable=False)

    created_at = db.Column(db.DateTime(), server_default=func.now())
    updated_at = db.Column(
        db.DateTime(), server_default=func.now(), onupdate=func.now()
    )

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
            "id": self.id,
            "order_number": self.order_number,
            "total_amount": self.total_amount,
            "items_count": self.items_count,
            "country": self.country,
            "status": str(self.status),
            "recipient_name": f"{self.first_name} {self.last_name}",
            "created_at": self.created_at.strftime("%d.%m.%Y %H:%M"),
            "updated_at": self.updated_at.strftime("%d.%m.%Y %H:%M"),
        }

    def to_dict_long(self):
        items = []
        for i in self.order_items:
            if i.product.discounted_price is None:
                sub_total = i.product.price * i.quantity
            else:
                sub_total = i.product.discounted_price * i.quantity

            items.append(
                {
                    "id": i.id,
                    "quantity": i.quantity,
                    "product": i.product.to_dict(),
                    "sub_total": sub_total,
                }
            )

        return {
            "id": self.id,
            "order_number": self.order_number,
            "total_amount": self.total_amount,
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
            "postal_code": self.postal_code,
            "country": self.country,
            "items": items,
            "created_at": self.created_at.strftime("%d.%m.%Y %H:%M"),
            "updated_at": self.updated_at.strftime("%d.%m.%Y %H:%M"),
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
