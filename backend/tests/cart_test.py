import json
import uuid
import unittest
from models import db
from unittest import TestCase, mock
from werkzeug.exceptions import InternalServerError
from app_factory import create_flask_app
from config import TEST_TOKEN

app = create_flask_app(__name__, "config.UnittestConfig")

db.app = app
# db.init_app(app)


# Cart tests
# --------------------------------------------------------------------------
class TestCart(TestCase):
    def setUp(self):
        self.app = app.test_client()

    def test_get_cart(self):
        response = self.app.get(
            "/cart/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
            },
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["success"], True)
        self.assertIsInstance(data["cart"], dict)

    def test_add_cart_item(self):
        response = self.app.post(
            "/cart/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
                "Content-Type": "application/json",
            },
            json={"product_id": 1, "quantity": 1},
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["success"], True)

    def test_update_cart_item(self):
        # Add a cart item to be patched
        response = self.app.post(
            "/cart/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
                "Content-Type": "application/json",
            },
            json={"product_id": 1, "quantity": 1},
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        cart_item_id = data["cart_item_id"]

        # Update the created cart item
        response = self.app.patch(
            f"/cart/{cart_item_id}/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
                "Content-Type": "application/json",
            },
            json={"quantity": 3},
        )
        data = json.loads(response.data)
        # print(data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["success"], True)

    def test_delete_cart_item(self):
        # Add a cart item to be deleted
        response = self.app.post(
            "/cart/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
                "Content-Type": "application/json",
            },
            json={"product_id": 1, "quantity": 1},
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        cart_item_id = data["cart_item_id"]

        # Delete the created cart item
        response = self.app.delete(
            f"/cart/{cart_item_id}/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
            },
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["success"], True)


# Cart fail tests
# --------------------------------------------------------------------------
class TestCartFail(TestCase):
    def setUp(self):
        self.app = app.test_client()

    @mock.patch("blueprints.cart.User.get_cart_items")
    def test_get_cart(self, mock_model):
        mock_model.side_effect = InternalServerError("Mock error")

        response = self.app.get(
            "/cart/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
            },
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 500)
        self.assertEqual(data["success"], False)

    @mock.patch("blueprints.cart.CartItem")
    def test_add_cart_item(self, mock_model):
        mock_model.query.filter_by.return_value.one_or_none.side_effect = (
            InternalServerError("Mock error")
        )

        response = self.app.post(
            "/cart/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
                "Content-Type": "application/json",
            },
            json={"product_id": 1, "quantity": 1},
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 500)
        self.assertEqual(data["success"], False)

    @mock.patch("blueprints.cart.CartItem.update")
    def test_update_cart_item(self, mock_model):
        # Add a cart item to be patched
        response = self.app.post(
            "/cart/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
                "Content-Type": "application/json",
            },
            json={"product_id": 1, "quantity": 1},
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        cart_item_id = data["cart_item_id"]

        # Try to update the created cart item
        # Mocking a internal server error
        mock_model.side_effect = InternalServerError("Mock error")
        response = self.app.patch(
            f"/cart/{cart_item_id}/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
                "Content-Type": "application/json",
            },
            json={"quantity": 3},
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 500)
        self.assertEqual(data["success"], False)

    @mock.patch("blueprints.cart.CartItem.delete")
    def test_delete_cart_item(self, mock_model):
        # Add a cart item to be deleted
        response = self.app.post(
            "/cart/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
                "Content-Type": "application/json",
            },
            json={"product_id": 1, "quantity": 1},
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        cart_item_id = data["cart_item_id"]

        # Try to delete the created cart item
        # Mocking a internal server error
        mock_model.side_effect = InternalServerError("Mock error")
        response = self.app.delete(
            f"/cart/{cart_item_id}/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
            },
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 500)
        self.assertEqual(data["success"], False)

    def test_delete_cart_item_404(self):
        response = self.app.delete(
            "/cart/9999/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
            },
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(data["success"], False)

    def test_update_cart_item_404(self):
        response = self.app.patch(
            "/cart/9999/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
                "Content-Type": "application/json",
            },
            json={"quantity": 2},
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(data["success"], False)
