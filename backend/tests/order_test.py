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


# Order tests
# --------------------------------------------------------------------------
class TestOrders(TestCase):
    def setUp(self):
        self.app = app.test_client()

    def test_get_orders(self):
        response = self.app.get(
            "/orders/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
            },
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["success"], True)
        self.assertIsInstance(data["orders"], list)

    def test_get_one_order(self):
        response = self.app.get(
            "/orders/3/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
            },
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["success"], True)
        self.assertTrue(data["order"])

    def test_create_order(self):
        # Add one product to the cart before creating an order
        response = self.app.post(
            "/cart/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
                "Content-Type": "application/json",
            },
            json={"product_id": 1, "quantity": 1},
        )
        self.assertEqual(response.status_code, 200)

        # Create order
        response = self.app.post(
            "/orders/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
                "Content-Type": "application/json",
            },
            json={
                "first_name": "Test",
                "last_name": "Test",
                "email": "test@test.com",
                "phone": "+1-33-444-4444",
                "street_address_1": "Test",
                "street_address_2": "",
                "city": "Test",
                "province": "Test",
                "country": "Test",
                "postal_code": "1202303",
            },
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["success"], True)

    def test_update_order(self):
        response = self.app.patch(
            "/orders/1/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
                "Content-Type": "application/json",
            },
            json={
                "first_name": "Test_updated",
                "last_name": "Test_updated",
                "phone": "+1-33-555-5555",
            },
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["success"], True)

    def test_delete_order(self):
        # Add one product to the cart before creating an order
        response = self.app.post(
            "/cart/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
                "Content-Type": "application/json",
            },
            json={"product_id": 1, "quantity": 1},
        )
        self.assertEqual(response.status_code, 200)

        # Create order
        response = self.app.post(
            "/orders/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
                "Content-Type": "application/json",
            },
            json={
                "first_name": "Test",
                "last_name": "Test",
                "email": "test@test.com",
                "phone": "+1-33-444-4444",
                "street_address_1": "Test",
                "street_address_2": "",
                "city": "Test",
                "province": "Test",
                "country": "Test",
                "postal_code": "1202303",
            },
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["success"], True)
        order_id = data["order_id"]

        # Update the created order
        response = self.app.delete(
            f"/orders/{order_id}/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
                "Content-Type": "application/json",
            },
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["success"], True)


# Order fail tests
# --------------------------------------------------------------------------
class TestOrdersFail(TestCase):
    def setUp(self):
        self.app = app.test_client()

    @mock.patch("blueprints.order.User.get_orders")
    @mock.patch("blueprints.order.Order")
    def test_get_orders(self, mock_order_model, mock_user_model):
        # Mocking an internal server error
        mock_order_model.query.all.side_effect = InternalServerError(
            "Mock error"
        )
        mock_user_model.side_effect = InternalServerError("Mock error")

        response = self.app.get(
            "/orders/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
            },
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 500)
        self.assertEqual(data["success"], False)

    @mock.patch("blueprints.order.Order")
    def test_get_one_order(self, mock_model):
        # Mocking an internal server error
        mock_model.query.filter.return_value.one_or_none.side_effect = (
            InternalServerError("Mock error")
        )

        response = self.app.get(
            "/orders/1/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
            },
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 500)
        self.assertEqual(data["success"], False)

    @mock.patch("blueprints.order.Order.flush")
    def test_create_order(self, mock_model):
        # Add one product to the cart before creating an order
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

        # Try to create order
        # Mocking an internal server error
        mock_model.side_effect = InternalServerError("Mock error")
        response = self.app.post(
            "/orders/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
                "Content-Type": "application/json",
            },
            json={
                "first_name": "Test",
                "last_name": "Test",
                "email": "test@test.com",
                "phone": "+1-33-444-4444",
                "street_address_1": "Test",
                "street_address_2": "",
                "city": "Test",
                "province": "Test",
                "country": "Test",
                "postal_code": "1202303",
            },
        )
        self.assertEqual(response.status_code, 500)
        data = json.loads(response.data)
        self.assertEqual(data["success"], False)

    @mock.patch("blueprints.order.Order.update")
    def test_update_order(self, mock_model):
        # Mocking an internal server error
        mock_model.side_effect = InternalServerError("Mock error")

        # Try to update an order
        response = self.app.patch(
            f"/orders/{1}/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
                "Content-Type": "application/json",
            },
            json={
                "first_name": "Test_updated",
                "last_name": "Test_updated",
                "phone": "+1-33-555-5555",
            },
        )
        self.assertEqual(response.status_code, 500)
        data = json.loads(response.data)
        self.assertEqual(data["success"], False)

    @mock.patch("blueprints.order.Order.delete")
    def test_delete_order(self, mock_model):
        # Mocking an internal server error
        mock_model.side_effect = InternalServerError("Mock error")

        # Try to delete an order
        response = self.app.delete(
            f"/orders/{1}/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
                "Content-Type": "application/json",
            },
        )
        self.assertEqual(response.status_code, 500)
        data = json.loads(response.data)
        self.assertEqual(data["success"], False)

    def test_delete_order_404(self):
        # Try to delete an order
        response = self.app.delete(
            "/orders/99999/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
                "Content-Type": "application/json",
            },
        )
        self.assertEqual(response.status_code, 404)
        data = json.loads(response.data)
        self.assertEqual(data["success"], False)
