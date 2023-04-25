import os

database_filename = "database.db"
backend_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(backend_dir, "database", database_filename)
# print(db_path)

db_uri = f"sqlite:///{db_path}"
test_db_uri = db_uri

TEST_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdXRoMHw2M2ZkZTBiODc1NDUzNGZmZDQ3YzA3NWY3OCIsInBlcm1pc3Npb25zIjpbImNyZWF0ZTpwcm9kdWN0cyIsInVwZGF0ZTpwcm9kdWN0cyIsImRlbGV0ZTpwcm9kdWN0cyIsImNyZWF0ZTpjYXRlZ29yaWVzIiwidXBkYXRlOmNhdGVnb3JpZXMiLCJkZWxldGU6Y2F0ZWdvcmllcyIsInZpZXc6b3JkZXJzIiwiY3JlYXRlOm9yZGVycyIsInVwZGF0ZTpvcmRlcnMiLCJkZWxldGU6b3JkZXJzIiwidmlldzp1cGRhdGU6Y2FydCJdfQ.diuD6q8Y9jgktH6NUq8wCjx4JbQ58jbFB-ShjgqEEfY"

ITEMS_PER_PAGE = 8


class DevelopmentConfig:
    SQLALCHEMY_DATABASE_URI = db_uri
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEVELOPMENT = True
    DEBUG = True
    VALIDATE_TOKENS = False  #


class ProductionConfig(DevelopmentConfig):
    DEVELOPMENT = False
    DEBUG = False


class UnittestConfig(DevelopmentConfig):
    SQLALCHEMY_DATABASE_URI = test_db_uri
    VALIDATE_TOKENS = False


class AuthConfig:
    AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
    ALGORITHMS = ["RS256"]
    API_AUDIENCE = os.getenv("API_AUDIENCE")
