# Udacity FSND Capstone Project

## E-Commerce application overview

E-Commerce Kiosk is a capstone project that was implemented for the Udacity full stack nanodegree program. It realizes an e-commerce application where users can browse for products by categories, put the products to a shopping cart and place an order. Each specific user can also see the list of their orders displayed on the My Orders page. Users can freely browse for products, but they need to sign in to access the shopping cart and make an order. Please note that integration with payment processors is out of scope of this project.

Apart from the end users (consumers), administrative personnel - sales specialists and managers - can also access this application where they can perform some administrative tasks. Sales specialists can create and modify categories and products or update orders while the manager can delete categories, products, and orders in addition to what the sales specialist does. Consequently, three corresponding authentication roles exist in the system to control permissions.

The frontend part of this project was created by using React and the Vite development server while the backend API server is based on Flask/SQLAlchemy and PostgreSQL. Also, both backend and frontend sides are secured by a third party authentication provider - Auth0.com.

To implement authentication in the React application, the standard Auth0 React module was installed. Access to React routes and specific interface elements is provided based on whether the user is authenticated and the user's role/permissions.

Please refer to readme files in the frontend and backend folders to get more details about each part specifically.

## Running E-Commerce Kiosk App

The web application was deployed on `Render.com`, a unified cloud provider. The deployed instance can be accessed via this link: `https://ecommerce-kiosk.onrender.com`.

The backend API is accessible via this link: `https://ecommerce-kiosk.onrender.com/api`.

## Installing and running E-Commerce Kiosk App locally

- Git-clone this project (or download and extract a zip file) into a separate folder.

- Proceed to the `/backend` folder to install dependencies and launch the backend API server. The details can be found in the readme file inside the folder.

- Proceed to the `/frontend` folder to install dependencies and launch the Vite development server. The details can be found in the readme file inside the folder.

- Open http://localhost:5173/ in your browser to run E-Commerce Kiosk App.
