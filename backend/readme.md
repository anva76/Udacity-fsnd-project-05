# Backend - E-Commerce App

## Overview

The backend part of this application was implemeted based on Flask/SQLAlchemy and PostgreSQL. For authorization and token validation, some code examples provided by Auth0 were used.

## Setting up the Backend

### Prerequisites

- **Python 3.9 or higher** - Follow instructions to install the latest version of python for your platform in the [python docs](https://docs.python.org/3/using/unix.html#getting-and-installing-the-latest-version-of-python)

- **Virtual Environment** - It is recommended to use a python virtual environment for running the backend Flask code. Instructions for setting up a virtual environment for your platform can be found in the [python docs](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/)

- **PostgreSQL Server** - For this project, a connection to a running PostgreSQL server is required. The simplest scenario is to run the server locally. Please refer to the [PostgreSQL administration docs](https://www.postgresql.org/docs/current/admin.html) and [install](https://www.postgresql.org/download/) a relevant binary package for your platform.

### Installing PIP Dependencies

In your terminal, navigate to the `/backend` directory and create a virtual environment by executing:

```bash
virtualenv venv
```

Then activate the newly created environment:

```bash
source venv/bin/activate
```

Install PIP dependencies:

```bash
pip install -r requirements.txt
```

### Set up the Database

With Postgres running, create an `ecommerce` database:

```bash
createdb ecommerce
```

Populate the database using the `ecommerce.psql` file provided. From the `backend` folder in terminal run:

```bash
psql ecommerce < ecommerce.psql
```

### Run the Server

Before running the backend server, please ensure that you are in the `/backend` folder and your virtual environment is activated as described above.

The backend application loads its secrets as environment variables from an `.env` file. Please create one in the `/backend` folder as shown in the following example:

```bash
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_password
DB_NAME=postgre_database_name
TEST_DB_NAME=postgre_test_database_name
AUTH0_DOMAIN=auth0_domain
AUTH0_API_AUDIENCE=auth0_api_audience
```

To run the backend Flask server, execute:

```bash
python app.py
```

## Authentication and authorization

The backend and frontend parts are secured by a third party authentication provider - Auth0.com

### Authentication workflow

In simple terms, the frontend sends an authorization request to Auth0 servers. Auth0 validates this request, provides a login form to authenticate the end user, and sends back an access token upon success. This access token is then used by the frontend to access the Flask-based backend API. The backend validates the token and checks the available permissions according to Auth0 predefined procedures.

### User roles

There are four usage scenarios possible in this application.

- Public users - no authentication required. They can view products and categories.

- Consumers (end users). These users are required to sign in to access their shopping cart and place orders. The Auth0 profiles of these users have the `consumer` role assigned to them with the following permissions:

  - `view:update:cart`
  - `create:orders`
  - `view:orders`
  - `role:consumer`

- Sales specialists. These users are required to sign in. They can perform various administrative tasks: create and modify categories and products, modify orders. They have the `Sales Specialist` role assigned to them with the following permissions:

  - `create:categories`
  - `create:products`
  - `update:categories`
  - `update:products`
  - `view:orders`
  - `update:orders`
  - `role:admin`

- Managers. These users are required to sign in. They can delete categories, products and orders in addition to what the sales specialist does. They have the `Manager` role assigned to them with the following permissions:

  - `create:categories`
  - `create:products`
  - `update:categories`
  - `update:products`
  - `view:orders`
  - `update:orders`
  - `delete:categories`
  - `delete:products`
  - `delete:orders`
  - `role:admin`

## API documentation

### API Endpoints

#### Categories

`GET '/categories'`

- Fetches a list of all product categories.
- Request Arguments: None
- Returns: An object with a single key, `categories`, that contains the list of categories.

```json
{
  "categories": [
    {
      "id": 1,
      "name": "Shoes"
    },
    {
      "id": 2,
      "name": "T-Shirts"
    }
  ],
  "success": true
}
```

`GET '/categories/<int:category_id>/products/?page=<n>'`

- Fetches the list of products for a given category. If necessary, the result can be paginated.
- Request Arguments: `category_id` and `?page=` - both passed as url parameters. If the page parameter is omitted, the whole range of products for this category will be provided.
- Returns: a list of products, category id, and total number of products. The actual page parameter may be different from the requested page if it is out of range.

```json
{
  "actual_page": 1,
  "category_id": 1,
  "products": [
    {
      "id": 1,
      "image_link": "",
      "name": "T-Shirt with flower print",
      "price": 40.0,
      "discounted_price": 35.0
    },
    {
      "id": 1,
      "image_link": "",
      "name": "Blue T-Shirt",
      "price": 30.0,
      "discounted_price": 25.0
    }
  ],
  "success": true,
  "total_products": 2
}
```

`GET '/categories/<int:category_id>'`

- Fetches the details of a specified category.
- Request Arguments: `category_id` - passed as a url parameter.
- Returns: a dictionary of category properties.

```json
{
  "category": {
    "id": 1,
    "name": "T-Shirts",
    "products_count": 3,
    "created_at": "25.04.2023 18:57",
    "updated_at": "25.04.2023 20:14"
  },
  "success": true
}
```

`POST '/categories'`

- Sends a request to add a new category. This operation is only allowed to admin users.
- Request Arguments: `name` - passed in the body of a JSON request.

```json
{
  "name": "Jeans"
}
```

- Returns: the category id of a newly created entity.

```json
{
  "category_id": 10,
  "success": true
}
```

`PATCH '/categories/<int:category_id>'`

- Sends a request to modify a category. This operation is only allowed to admin users.
- Request Arguments: `category_id` - passed as a url parameter, `name` - passed in the body of a JSON request.

```json
{
  "name": "Jeans"
}
```

- Returns: the category id of the updated entity.

```json
{
  "category_id": 1,
  "success": true
}
```

`DELETE '/categories/<category_id>'`

- Sends a request to delete a category. This operation is only allowed to admin users.
- Request Arguments: `category_id` - passed as a url parameter.
- Returns: the category id of the deleted entity. If the category is not empty, an error will be returned.

```json
{
  "category_id": 5,
  "success": true
}
```

#### Products

`GET '/products/?page=<n>'`

- Fetches a list of all products. If necessary, the result can be paginated.
- Request Arguments: `?page=` - passed as a url parameter. If the page parameter is omitted, the whole range of products will be provided.
- Returns: a list of products, actual page and total number of products. The actual page parameter may be different from the requested page if it is out of range.

```json
{
  "actual_page": 1,
  "products": [
    {
      "id": 1,
      "image_link": "",
      "name": "T-Shirt with flower print",
      "price": 50.0,
      "discounted_price": 35.0
    },
    {
      "id": 2,
      "image_link": "",
      "name": "Blue T-Shirt",
      "price": 40.0,
      "discounted_price": 35.0
    }
  ],
  "success": true,
  "total_products": 2
}
```

`GET '/products/<product_id>'`

- Fetches the details of a specified product.
- Request Arguments: `product_id` - passed as a url parameter.
- Returns: a dictionary of product properties.

```json
{
  "product": {
    "id": 1,
    "category_id": 2,
    "price": 50.0,
    "discounted_price": 35.0,
    "image_link": "",
    "name": "Blue T-Shirt",
    "notes": "This is a Blue T-Shirt",
    "created_at": "25.04.2023 18:57",
    "updated_at": "25.04.2023 20:14"
  },
  "success": true
}
```

`POST '/search'`

- Sends a request to search for a specific product (or products) by search term.
- Request Arguments: `search_query` - passed in the body of a JSON request.

```json
{
  "search_query": "shirt"
}
```

- Returns: a list of products matching the search criteria and total number of the products in the list.

```json
{
  "products": [
    {
      "id": 3,
      "image_link": "",
      "name": "T-Shirt with flower print",
      "price": 50.0,
      "discounted_price": null
    },
    {
      "id": 7,
      "image_link": "",
      "name": "Blue T-Shirt",
      "price": 55.0,
      "discounted_price": 45.0
    }
  ],
  "total_products": 2,
  "success": true
}
```

`POST '/products'`

- Sends a request to add a new product. This operation is only allowed to admin users.
- Request Arguments: `name`, `category_id`, `price`, `discounted_price`, `notes`, `image_link` - all passed in the body of a JSON request. The first three parameters are requited, and the others are optional.

```json
{
  "name": "Blue T-Shirt",
  "category_id": 1,
  "notes": "This is a Blue T-Shirt",
  "image_link": "",
  "price": 50.0,
  "discounted_price": 35.0
}
```

- Returns: the product id of a newly created entity.

```json
{
  "product_id": 10,
  "success": true
}
```

`PATCH '/products/<product_id>'`

- Sends a request to modify a product. This operation is only allowed to admin users.
- Request Arguments: `product_id` - passed as a url parameter; `name`, `category_id`, `price`, `discounted_price`, `notes`, `image_link` - all passed in the body of a JSON request. At least one of the modified product properties should be present in the JSON request.

```json
{
  "name": "Blue T-Shirt",
  "category_id": 1,
  "notes": "This is a Blue T-Shirt",
  "image_link": "",
  "price": 50.0,
  "discounted_price": 35.0
}
```

- Returns: the product id of the updated entity.

```json
{
  "product_id": 7,
  "success": true
}
```

`DELETE '/products/<product_id>'`

- Sends a request to delete a product. This operation is only allowed to admin users.
- Request Arguments: `product_id` - passed as a url parameter.
- Returns: the product id of the deleted entity.

```json
{
  "product_id": 5,
  "success": true
}
```

#### Cart Items

`GET '/cart'`

- Fetches the list of items in the shopping cart of the current authenticated user. This operation is only allowed to end users(consumers).
- Request Arguments: None. The user id is derived from the authorization token at the server side.
- Returns: a list of cart items, items count, and total amount.

```json
{
  "cart": {
    "items": [
      {
        "id": 1,
        "product": {
          "id": 1,
          "name": "T-Shirt",
          "price": 75.0,
          "discounted_price": 65.0,
          "image_link": ""
        },
        "quantity": 1,
        "sub_total": 65.0
      }
    ],
    "items_count": 1,
    "total_amount": 65.0
  },
  "success": true
}
```

`POST '/cart'`

- Sends a request to add a product to the shopping cart. This operation is only allowed to end users(consumers).
- Request Arguments: `product_id` and `quantity` - both passed in the body of a JSON request. The user id is derived from the authorization token at the server side.

```json
{
  "product_id": 1,
  "quantity": 2
}
```

- Returns: the cart item id of a newly added cart item.

```json
{
  "cart_item_id": 1,
  "success": true
}
```

`PATCH '/cart/<cart_item_id>'`

- Sends a request to update a cart item. This operation is only allowed to end users(consumers).
- Request Arguments: `cart_item_id` - passed as a URL parameter; `quantity` - passed in the body of a JSON request. The user id is derived from the authorization token at the server side.

```json
{
  "quantity": 3
}
```

- Returns: The cart item id of the updated item.

```json
{
  "cart_item_id": 6,
  "success": true
}
```

`DELETE '/cart/<cart_item_id>'`

- Sends a request to delete a cart item from the shopping cart. This operation is only allowed to end users(consumers).
- Request Arguments: `cart_item_id` - passed as a URL parameter. The user id is derived from the authorization token at the server side.
- Returns: The cart item id of the deleted item.

```json
{
  "cart_item_id": 6,
  "success": true
}
```

#### Orders

`GET '/orders/?page=<n>'`

- Fetches a list of orders belonging to the current authenticated user or all orders in the database if the user has an admin role. If necessary, the result can be paginated.
- Request Arguments: `?page=` - passed as a url parameter. If the page parameter is omitted, the whole range of orders will be provided. The user id is derived from the authorization token at the server side.
- Returns: a list of orders, actual page, and total number of orders. The actual page parameter may be different from the requested page if it is out of range.

```json
{
  "actual_page": 1,
  "orders": [
    {
      "country": "Singapore",
      "id": 1,
      "items_count": 2,
      "order_number": "20230425.1",
      "recipient_name": "John Smith",
      "status": "in_assembly",
      "total_amount": 141.0,
      "created_at": "25.04.2023 19:22",
      "updated_at": "25.04.2023 16:31"
    },
    {
      "country": "Singapore",
      "id": 2,
      "items_count": 4,
      "order_number": "20230425.2",
      "recipient_name": "John Smith",
      "status": "submitted",
      "total_amount": 250.0,
      "created_at": "25.04.2023 19:22",
      "updated_at": "25.04.2023 19:22"
    }
  ],
  "success": true,
  "total_orders": 2
}
```

`GET '/orders/<order_id>'`

- Fetches the details of a specific order. End users (consumers) can only see their own orders while admin users can see all orders in the system.
- Request Arguments: `order_id` - passed as a URL parameter. The user id is derived from the authorization token at the server side.
- Returns: a dictionary object with order details and items.

```json
{
    "order": {
        "id": 1
        "order_number": "20230425.1",
        "items_count": 3,
        "status": "in_assembly",
        "total_amount": 240.0,
        "created_at": "25.04.2023 19:22",
        "updated_at": "26.04.2023 16:31",
        "first_name": "John",
        "last_name": "Smith",
        "email": "email@example.com",
        "phone": "+65-111-111-2222",
        "street_address_1": "123, Postgre str",
        "street_address_2": "",
        "city": "Singapore",
        "province": "Central Region",
        "postal_code": "10101010",
        "country": "Singapore",
        "items": [
            {
                "id": 1,
                "product": {
                    "id": 2,
                    "name": "T-Shirt with flower print",
                    "image_link": ""
                },
                "price": 100.0,
                "quantity": 1,
                "sub_total": 100.0
            },
            {
                "id": 2,
                "product": {
                    "id": 9,
                    "name": "Blue T-Shirt",
                    "image_link": ""
                },
                "price": 70.0,
                "quantity": 2,
                "sub_total": 140.0
            }
        ],
    },
    "success": true
}
```

`POST '/orders`

- Sends a request to submit a new order containing items from the current user's cart. This operation is only allowed to end users (consumers).
- Request Arguments: destination address fields passed in the body of a JSON request as shown below. The user id is derived from the authorization token at the server side.

```json
{
  "first_name": "John",
  "last_name": "Smith",
  "email": "email@example.com",
  "phone": "+65-111-111-2222",
  "street_address_1": "123, Postgre str",
  "street_address_2": "",
  "city": "Singapore",
  "province": "Central Region",
  "country": "Singapore",
  "postal_code": "10101010"
}
```

- Returns: the order id of a newly created entity.

```json
{
  "order_id": 1,
  "success": true
}
```

`PATCH '/orders/<order_id>'`

- Sends a request to update a specific order. This operation is only allowed to admin users.
- Request Arguments: `order_id` - passed as a URL parameter. `status` and the destination address parameters described above can be added in the body of a JSON request. At least one parameter should be present in the JSON request.

```json
{
  "phone": "+65-111-555-5555",
  "status": "in_delivery"
}
```

- Returns: the order id of the updated entity.

```json
{
  "order_id": 1,
  "success": true
}
```

`DELETE '/orders/<order_id>'`

- Sends a request to delete a specific order. This operation is only allowed to admin users.
- Request Arguments: `order_id` - passed as a URL parameter.
- Returns: the order id of the deleted entity.

```json
{
  "order_id": 1,
  "success": true
}
```

### Error handling

If an API request is successful, a `success` indicator equal to `true` as well as an HTTP status code of 200 will be included in each server response. In case of an error, the success parameter will be equal to `false`. In addition, an error message and code will be provided.

```json
{
  "error": 404,
  "message": "Not found",
  "success": false
}
```

## Testing

### Unit tests

In your terminal, navigate to the `/backend` folder and activate your virtual environment as described above.

The backend application loads its secrets as environment variables from an `.env` file. Please create one in the `/backend` folder as shown above.

Finally, execute the following commands to perform testing:

```bash
dropdb ecommerce_test
createdb ecommerce_test
psql ecommerce_test < ecommerce.psql
python test_app.py
```

Please note that a dummy test token (with all permissions) is used in the process of unit testing. This token is not suitable for actual authentication and consequently is not validated by using the normal Auth0 validation procedure.

### Permission tests

To perform permission tests for the authenticated users, please open the `fsnd-capstone-test-collection.json` file in Postman and run the tests. All API end points are tested against different user roles (public access, consumer, sales specialist, manager) by sending relevant access tokens in the request headers. If necessary, please change the `host` parameter of the test collection to `http://127.0.0.1:5000` for local testing.
