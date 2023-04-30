import os
from dotenv import dotenv_values

env_config = {
    **dotenv_values(".env"),
    **os.environ,  # override loaded values with environment variables
}

DB_HOST = env_config.get("DB_HOST", "localhost:5432")
DB_USER = env_config.get("DB_USER", "")
DB_PASSWORD = env_config.get("DB_PASSWORD", "")
DB_NAME = env_config.get("DB_NAME")
TEST_DB_NAME = env_config.get("TEST_DB_NAME")

db_uri = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
test_db_uri = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{TEST_DB_NAME}"

# Dummy test token for CRUD unit tests
# Not to be used for actual authorization
TEST_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0X3VzZXJfMSIsInBlcm1pc3Npb25zIjpbImNyZWF0ZTpwcm9kdWN0cyIsInVwZGF0ZTpwcm9kdWN0cyIsImRlbGV0ZTpwcm9kdWN0cyIsImNyZWF0ZTpjYXRlZ29yaWVzIiwidXBkYXRlOmNhdGVnb3JpZXMiLCJkZWxldGU6Y2F0ZWdvcmllcyIsInZpZXc6b3JkZXJzIiwiY3JlYXRlOm9yZGVycyIsInVwZGF0ZTpvcmRlcnMiLCJkZWxldGU6b3JkZXJzIiwidmlldzp1cGRhdGU6Y2FydCIsInJvbGU6YWRtaW4iXX0.h0MubbhNJWOwf9jQ-ofCQ7f6RlAoE669EmG1cc8QRAU"

ITEMS_PER_PAGE = 10


class DevelopmentConfig:
    SECRET_KEY = os.urandom(32)
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
    AUTH0_DOMAIN = env_config.get("AUTH0_DOMAIN", "")
    ALGORITHMS = ["RS256"]
    API_AUDIENCE = env_config.get("AUTH0_API_AUDIENCE", "")
