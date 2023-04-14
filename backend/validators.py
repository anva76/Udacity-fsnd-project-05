from jsonschema import validate

NAME_FIELD_PATTERN = "^[^\s][\w\s.-]+[^\s]$"
EMAIL_FIELD_PATTERN = "^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$"
PHONE_FIELD_PATTERN = (
    "^\+([0-9]{1,3})[-. ]?([0-9]{2,3})[-. ]?([0-9]{3,4})[-. ]?([0-9]{3,4})$"
)


# JSON schema validator - base class
class Validator:
    PostSchema = {}
    PatchSchema = {}

    @classmethod
    def validate_post(cls, request):
        data = request.get_json()
        try:
            validate(instance=data, schema=cls.PostSchema)
        except Exception as e:
            print(str(e))
            return None

        return data

    @classmethod
    def validate_patch(cls, request):
        data = request.get_json()
        try:
            validate(instance=data, schema=cls.PatchSchema)
        except Exception as e:
            print(str(e))
            return None

        return data


# JSON schema validator for Category model
class CategoryValidator(Validator):
    PostSchema = {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "name": {
                "type": "string",
                "minLength": 3,
                "pattern": NAME_FIELD_PATTERN,
            },
            "image_link": {"type": ["string", "null"]},
            "notes": {"type": ["string", "null"]},
        },
        "required": ["name", "image_link", "notes"],
    }

    PatchSchema = {
        "type": "object",
        "minProperties": 1,
        "additionalProperties": False,
        "properties": {
            "name": {
                "type": "string",
                "minLength": 3,
                "pattern": NAME_FIELD_PATTERN,
            },
            "image_link": {"type": ["string", "null"]},
            "notes": {"type": ["string", "null"]},
        },
    }


# JSON schema validator for Product model
class ProductValidator(Validator):
    PostSchema = {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "name": {
                "type": "string",
                "minLength": 3,
                "pattern": NAME_FIELD_PATTERN,
            },
            "image_link": {"type": ["string", "null"]},
            "notes": {"type": ["string", "null"]},
            "sku_code": {"type": ["string", "null"]},
            "category_id": {"type": "integer", "minumum": 0},
            "price": {"type": "number", "minumum": 0},
            "discounted_price": {"type": ["number", "null"], "minumum": 0},
        },
        "required": [
            "name",
            "category_id",
            "price",
        ],
    }

    PatchSchema = {
        "type": "object",
        "minProperties": 1,
        "additionalProperties": False,
        "properties": {
            "name": {
                "type": "string",
                "minLength": 3,
                "pattern": NAME_FIELD_PATTERN,
            },
            "image_link": {"type": ["string", "null"]},
            "notes": {"type": ["string", "null"]},
            "sku_code": {"type": ["string", "null"]},
            "category_id": {"type": "integer", "minumum": 0},
            "price": {"type": "number", "minumum": 0},
            "discounted_price": {"type": ["number", "null"], "minumum": 0},
        },
    }


# JSON schema validator for Product model
class OrderValidator(Validator):
    PostSchema = {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "first_name": {"type": "string"},
            "last_name": {"type": "string"},
            "email": {
                "type": "string",
                "pattern": EMAIL_FIELD_PATTERN,
            },
            "phone": {
                "type": "string",
                "pattern": PHONE_FIELD_PATTERN,
            },
            "street_address_1": {"type": "string"},
            "street_address_2": {"type": "string"},
            "city": {"type": "string"},
            "province": {"type": "string"},
            "postal_code": {"type": "string"},
            "country": {"type": "string"},
        },
        "required": [
            "first_name",
            "last_name",
            "email",
            "phone",
            "street_address_1",
            "city",
            "province",
            "postal_code",
            "country",
        ],
    }

    PatchSchema = {
        "type": "object",
        "additionalProperties": False,
        "minProperties": 1,
        "properties": {
            "first_name": {"type": "string"},
            "last_name": {"type": "string"},
            "email": {
                "type": "string",
                "pattern": EMAIL_FIELD_PATTERN,
            },
            "phone": {
                "type": "string",
                "pattern": PHONE_FIELD_PATTERN,
            },
            "street_address_1": {"type": "string"},
            "street_address_2": {"type": "string"},
            "city": {"type": "string"},
            "province": {"type": "string"},
            "postal_code": {"type": "string"},
            "country": {"type": "string"},
            "status": {"type": "string"},
        },
    }


# JSON schema validator for CartItem model
class CartItemValidator(Validator):
    PostSchema = {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "product_id": {"type": "integer", "minumum": 0},
            "quantity": {"type": "integer", "minumum": 0},
        },
        "required": ["product_id", "quantity"],
    }

    PatchSchema = {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "quantity": {"type": "integer", "minumum": 0},
        },
        "required": ["quantity"],
    }
