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


# Category tests
# --------------------------------------------------------------------------
class TestCategories(TestCase):
    def setUp(self):
        self.app = app.test_client()

    def test_get_categories(self):
        response = self.app.get("/categories/")
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["success"], True)
        self.assertTrue(data["categories"])

    def test_get_one_category(self):
        response = self.app.get("/categories/1/")
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["success"], True)
        self.assertTrue(data["category"])

    def test_get_products_by_category(self):
        response = self.app.get("/categories/1/products/")
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["success"], True)
        self.assertTrue(data["products"])

    def test_create_category(self):
        test_name = "test -" + uuid.uuid4().hex[:8]
        response = self.app.post(
            "/categories/",
            json={"name": test_name},
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {TEST_TOKEN}",
            },
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["success"], True)

    def test_update_category(self):
        test_name = "test -" + uuid.uuid4().hex[:8]
        response = self.app.patch(
            "/categories/1/",
            json={"name": test_name},
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {TEST_TOKEN}",
            },
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["success"], True)

    def test_delete_category(self):
        # add a test category to be deleted
        test_name = "test -" + uuid.uuid4().hex[:8]
        response = self.app.post(
            "/categories/",
            json={"name": test_name},
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {TEST_TOKEN}",
            },
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        category_id = data["category_id"]

        # delete the created category
        response = self.app.delete(
            f"/categories/{category_id}/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
            },
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["success"], True)


# Category fail tests
# --------------------------------------------------------------------------
class TestCategoriesFail(TestCase):
    def setUp(self):
        self.app = app.test_client()

    @mock.patch("blueprints.category.Category")
    def test_get_categories(self, mock_model):
        # Mocking an internal server error
        mock_model.query.order_by.return_value.all.side_effect = (
            InternalServerError("Mock error")
        )

        response = self.app.get("/categories/")
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 500)
        self.assertEqual(data["success"], False)

    @mock.patch("blueprints.category.Category")
    def test_get_one_category(self, mock_model):
        # Mocking an internal server error
        mock_model.query.filter_by.return_value.one_or_none.side_effect = (
            InternalServerError("Mock error")
        )
        response = self.app.get("/categories/1/")
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 500)
        self.assertEqual(data["success"], False)

    def test_get_one_category_404(self):
        response = self.app.get("/categories/9999/")
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(data["success"], False)

    @mock.patch("blueprints.category.Category")
    def test_get_products_by_category(self, mock_model):
        # Mocking an internal server error
        mock_model.query.filter_by.return_value.one_or_none.side_effect = (
            InternalServerError("Mock error")
        )
        response = self.app.get("/categories/1/products/")
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 500)
        self.assertEqual(data["success"], False)

    def test_get_products_by_category_404(self):
        response = self.app.get("/categories/9999/products/")
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(data["success"], False)

    @mock.patch("blueprints.category.Category.save")
    def test_create_category(self, mock_model):
        # Mocking an internal server error
        mock_model.side_effect = InternalServerError("Mock error")
        test_name = "test -" + uuid.uuid4().hex[:8]
        response = self.app.post(
            "/categories/",
            json={"name": test_name},
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {TEST_TOKEN}",
            },
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 500)
        self.assertEqual(data["success"], False)

    def test_create_category_400(self):
        response = self.app.post(
            "/categories/",
            # Incorrect data - name is missing
            json={"name": ""},
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {TEST_TOKEN}",
            },
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data["success"], False)

    @mock.patch("blueprints.category.Category.update")
    def test_update_category(self, mock_model):
        # Mocking an internal server error
        mock_model.side_effect = InternalServerError("Mock error")
        test_name = "test -" + uuid.uuid4().hex[:8]
        response = self.app.patch(
            "/categories/1/",
            json={"name": test_name},
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {TEST_TOKEN}",
            },
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 500)
        self.assertEqual(data["success"], False)

    def test_update_category_400(self):
        response = self.app.patch(
            "/categories/1/",
            # Incorrect type
            json={"name": 1234.23},
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {TEST_TOKEN}",
            },
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data["success"], False)

    def test_update_category_404(self):
        response = self.app.patch(
            "/categories/999/",
            json={"name": "test"},
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {TEST_TOKEN}",
            },
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(data["success"], False)

    @mock.patch("blueprints.category.Category.delete")
    def test_delete_category(self, mock_model):
        # Add a test category to be deleted
        test_name = "test -" + uuid.uuid4().hex[:8]
        response = self.app.post(
            "/categories/",
            json={"name": test_name},
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {TEST_TOKEN}",
            },
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        category_id = data["category_id"]

        # Try to delete the created category
        # Mocking an internal server error
        mock_model.side_effect = InternalServerError("Mock error")
        response = self.app.delete(
            f"/categories/{category_id}/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
            },
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 500)
        self.assertEqual(data["success"], False)

    def test_delete_category_404(self):
        response = self.app.delete(
            "/categories/999/",
            headers={
                "Authorization": f"Bearer {TEST_TOKEN}",
            },
        )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(data["success"], False)
