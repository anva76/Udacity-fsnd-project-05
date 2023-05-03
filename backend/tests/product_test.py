import json
import uuid
import unittest
from models import db
from unittest import TestCase, mock
from werkzeug.exceptions import InternalServerError
from app_factory import create_flask_app
from config import TEST_TOKEN, API_PREFIX

app = create_flask_app(__name__, "config.UnittestConfig")

db.app = app
# db.init_app(app)


# Product tests
# --------------------------------------------------------------------------
class TestProducts(TestCase):
    def setUp(self):
        self.app = app.test_client()

    def test_get_products(self):
        response = self.app.get(API_PREFIX + "/products/")
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["success"], True)
        self.assertTrue(data["products"])

    def test_get_one_product(self):
        response = self.app.get(API_PREFIX + "/products/1/")
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["success"], True)
        self.assertTrue(data["product"])

    def test_create_product(self):
        test_name = "test -" + uuid.uuid4().hex[:8]
        response = self.app.post(
            API_PREFIX + "/products/",
            json={
                "name": test_name,
                "category_id": 1,
                "notes": "test notes",
                "image_link": "",
                "price": 50.0,
            },
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {TEST_TOKEN}",
            },
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["success"], True)

    def test_update_product(self):
        test_name = "test -" + uuid.uuid4().hex[:8]
        response = self.app.patch(
            API_PREFIX + "/products/1/",
            json={"name": test_name, "price": 75.0},
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {TEST_TOKEN}",
            },
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["success"], True)

    def test_delete_product(self):
        # add a test product to be deleted
        test_name = "test -" + uuid.uuid4().hex[:8]
        response = self.app.post(
            API_PREFIX + "/products/",
            json={
                "name": test_name,
                "category_id": 1,
                "notes": "test notes",
                "price": 50.0,
            },
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {TEST_TOKEN}",
            },
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        product_id = data["product_id"]

        # delete the created product
        response = self.app.delete(
            API_PREFIX + f"/products/{product_id}/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
            },
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["success"], True)

    def test_search(self):
        # add a test product for searching later
        test_name = "test -" + uuid.uuid4().hex[:8]
        response = self.app.post(
            API_PREFIX + "/products/",
            json={
                "name": test_name,
                "category_id": 1,
                "notes": "test notes",
                "price": 50.0,
            },
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {TEST_TOKEN}",
            },
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        product_id = data["product_id"]

        # Search for the created product
        response = self.app.post(
            API_PREFIX + f"/search/",
            headers={
                "Content-Type": "application/json",
            },
            json={"search_query": test_name},
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["success"], True)
        self.assertTrue(data["products"])


# Product fail tests
# --------------------------------------------------------------------------
class TestProductsFail(TestCase):
    def setUp(self):
        self.app = app.test_client()

    @mock.patch("blueprints.product.Product")
    def test_get_produtcs(self, mock_model):
        # Mocking an internal server error
        mock_model.query.order_by.return_value.all.side_effect = (
            InternalServerError("Mock error")
        )

        response = self.app.get(API_PREFIX + "/products/")
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 500)
        self.assertEqual(data["success"], False)

    @mock.patch("blueprints.product.Product")
    def test_get_one_product(self, mock_model):
        # Mocking an internal server error
        mock_model.query.filter_by.return_value.one_or_none.side_effect = (
            InternalServerError("Mock error")
        )
        response = self.app.get(API_PREFIX + "/products/1/")
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 500)
        self.assertEqual(data["success"], False)

    def test_get_one_product_404(self):
        response = self.app.get(API_PREFIX + "/products/9999/")
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(data["success"], False)

    @mock.patch("blueprints.product.Product.save")
    def test_create_product(self, mock_model):
        mock_model.side_effect = InternalServerError("Mock error")

        test_name = "test -" + uuid.uuid4().hex[:8]
        response = self.app.post(
            API_PREFIX + "/products/",
            json={
                "name": test_name,
                "category_id": 1,
                "notes": "test notes",
                "image_link": "",
                "price": 50.0,
            },
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {TEST_TOKEN}",
            },
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 500)
        self.assertEqual(data["success"], False)

    def test_create_product_400(self):
        test_name = "test -" + uuid.uuid4().hex[:8]
        response = self.app.post(
            API_PREFIX + "/products/",
            json={
                # Incorrect data - name is missing
                "category_id": 1,
                "notes": "test notes",
                "image_link": "",
                "price": 50.0,
            },
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {TEST_TOKEN}",
            },
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data["success"], False)

    @mock.patch("blueprints.product.Product.update")
    def test_update_product(self, mock_model):
        mock_model.side_effect = InternalServerError("Mock error")

        test_name = "test -" + uuid.uuid4().hex[:8]
        response = self.app.patch(
            API_PREFIX + "/products/1/",
            json={"name": test_name, "price": 75.0},
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {TEST_TOKEN}",
            },
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 500)
        self.assertEqual(data["success"], False)

    def test_update_product_404(self):
        test_name = "test -" + uuid.uuid4().hex[:8]
        response = self.app.patch(
            API_PREFIX + "/products/999/",
            json={"name": test_name, "price": 75.0},
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {TEST_TOKEN}",
            },
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(data["success"], False)

    def test_delete_product_404(self):
        response = self.app.delete(
            API_PREFIX + f"/products/9999/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
            },
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(data["success"], False)

    @mock.patch("blueprints.product.Product.delete")
    def test_delete_product(self, mock_model):
        # add a test product to be deleted
        test_name = "test -" + uuid.uuid4().hex[:8]
        response = self.app.post(
            API_PREFIX + "/products/",
            json={
                "name": test_name,
                "category_id": 1,
                "notes": "test notes",
                "price": 50.0,
            },
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {TEST_TOKEN}",
            },
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        product_id = data["product_id"]

        # Try to delete the created product
        # Mocking an internal server error
        mock_model.side_effect = InternalServerError("Mock error")

        response = self.app.delete(
            API_PREFIX + f"/products/{product_id}/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
            },
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 500)
        self.assertEqual(data["success"], False)

    @mock.patch("blueprints.product.Product")
    def test_search(self, mock_model):
        # Mocking an internal server error
        mock_model.query.filter.return_value.all.side_effect = (
            InternalServerError("Mock error")
        )
        response = self.app.post(
            API_PREFIX + f"/search/",
            headers={
                "Content-Type": "application/json",
            },
            json={"search_query": "shirt"},
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 500)
        self.assertEqual(data["success"], False)
