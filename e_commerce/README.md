# Mini E-Commerce API

A RESTful e-commerce API built with Node.js and Express.
The API uses JSON files for data storage and JWT for authentication.

## Technologies

* Node.js
* Express
* bcryptjs
* JSON Web Token (JWT)
* File System (`fs/promises`)
* JSON files for data storage

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=3001
SECRET=your_secret
```

Start the server:

```bash
npm start
```

The server will run on:

```text
http://localhost:3001
```

## Authentication

Users can register and log in using JWT authentication.

There are two roles:

* `customer` — can browse products, create orders, and view their own orders.
* `admin` — can manage products and view all orders.

A seeded admin account is stored in `data/users.json`.

**Admin username:** `admin`
**Admin password:** `admin098`

Replace `ADMIN_PASSWORD` with the password used when creating the admin account.

## API Endpoints

### Authentication

| Method | Endpoint         | Description             |
| ------ | ---------------- | ----------------------- |
| POST   | `/auth/register` | Register a new customer |
| POST   | `/auth/login`    | Login and receive a JWT |

### Products

| Method | Endpoint        | Access | Description         |
| ------ | --------------- | ------ | ------------------- |
| GET    | `/products`     | Public | Get all products    |
| GET    | `/products/:id` | Public | Get a product by ID |
| POST   | `/products`     | Admin  | Create a product    |
| PUT    | `/products/:id` | Admin  | Update a product    |
| DELETE | `/products/:id` | Admin  | Delete a product    |

Products can also be filtered and sorted using query parameters:

```text
GET /products?category=electronics
GET /products?sort=price
GET /products?category=electronics&sort=price
```

### Orders

| Method | Endpoint      | Access        | Description                                      |
| ------ | ------------- | ------------- | ------------------------------------------------ |
| POST   | `/orders`     | Authenticated | Create an order                                  |
| GET    | `/orders`     | Authenticated | Customer sees own orders; admin sees all orders  |
| GET    | `/orders/:id` | Authenticated | Customer sees own order; admin can see any order |

## Order Checkout

When creating an order, the client sends only the product ID and quantity:

```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ]
}
```

The server:

* validates the requested products;
* checks stock availability;
* calculates the total using the server-side product price;
* decreases product stock;
* creates the order.

If any product is unavailable or there is not enough stock, the order is rejected and stock is not changed.

## Data Storage

The application stores data in JSON files:

```text
data/
├── users.json
├── products.json
└── orders.json
```

No external database is used.

## Security

* Passwords are hashed with `bcryptjs`.
* Password hashes are never returned in API responses.
* Authentication uses JWT.
* JWT contains the user's `id`, `username`, and `role`.
* Protected routes require a valid Bearer token.
* Admin-only routes return `403 Forbidden` for customers.

## Assignment Deviations

No deviations from the required API specification.
