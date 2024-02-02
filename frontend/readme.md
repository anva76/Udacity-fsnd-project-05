# E-Commerce App Frontend

## Overview

The frontend side of this project was created by means of React and the Vite development server. This React application implements a user interface of an E-Commerce Kiosk (web shop).

Both backend and frontend sides are secured by a third party authentication provider - Auth0.com. To implement authentication in the React application, the standard Auth0 npm module was installed.

Access to React routes and specific interface elements is provided based on whether the user is authenticated and the user's role/permissions. New end users can sign up (register) via the Auth0 sign-in/sign-up page with the `consumer` role being assigned to them automatically. Admin users with roles `sales specialist` and `manager` can only be created manually via the Auth0 web admin interface.

## Running the frontend app locally

### Prerequisites

- **Installing Node and NPM** - This project depends on Nodejs and Node Package Manager (NPM). Before continuing, you must download and install Node (the download includes NPM) from [https://nodejs.com/en/download](https://nodejs.org/en/download/).

- **Vite Server** - The Vite development server is required to serve and build the frontend. Please refer to the [Vite Documentation](https://vitejs.dev/guide/) for more details.

### Installing Dependencies

In your terminal, please navigate to the `/frontend` folder and run:

```bash
npm install
```

## Running Frontend in Development Mode

Vite loads some parameters from an `.env` file. Please create one in the `/frontend` dicrectory:

```bash
VITE_API_SERVER_URL=back_end_server_address
VITE_AUTH0_DOMAIN=auth0_domain_address
VITE_AUTH0_CLIENT_ID=auth0_client_id
VITE_AUTH0_API_AUDIENCE=auth0_api_audience
VITE_AUTH0_CALLBACK_URL=auth0_callback_url
```

In your terminal, please navigate to the `/frontend` folder and run the following command to start the frontend development server:

```bash
npm run dev
```

Open http://localhost:5173/ in your browser to run the E-Commerce Kiosk App.

## Authentication and authorization

The backend and frontend parts are secured by a third party authentication provider - Auth0.com

### Authentication workflow

In simple terms, the frontend sends an authorization request to Auth0 servers. Auth0 validates this request, provides a login form to authenticate the end user, and sends back an access token upon success. This access token is then used by the frontend to access the Flask-based backend API. The backend validates the token and checks the available permissions according to Auth0 predefined procedures.

### Use Cases

There are four use cases possible in this application:

- Public users - no authentication required. They can view products and categories.

- Consumers (end users). These users are required to sign in to access their shopping cart and make orders. They also have access to the `My Orders` page where they can see the list of their orders and click on each specific order to get more details.

- Sales specialists. These users are required to sign in. They can perform various administrative tasks: create and modify categories and products or modify orders. They also have access to the `Orders Dashboard` page where they can view all orders in the database. To perform these tasks, they use the red administrative buttons revealed to them after authentication. The red administrative buttons can be found on the `product detail` and `order detail` pages as well as on the `catalog by categories` page. Also, please note that these users cannot add products to the shopping cart and submit orders since they are administrators, not end users.

- Managers. These users are required to sign in. They can delete categories, products and orders in addition to what the sales specialist does. They also have access to the `Orders Dashboard` page where they can view all orders in the database. To perform these tasks, they can use the red administrative buttons revealed to them after authentication. The red administrative buttons can be found on the `product detail` and `order detail` pages as well as on the `catalog by categories` page. Also, please note that these users cannot add products to the shopping cart and submit orders since they are administrators, not end users.
