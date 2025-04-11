# Multi-Vendor Order System

A Node.js-based backend system for managing a multi-vendor e-commerce platform. This system allows vendors to manage products, customers to place orders across multiple vendors, and admins to track analytics.

---

## Features

## 📄 API Documentation (Swagger)
- Swagger UI: [http://localhost:3000/api-docs/]



### 🔐 Authentication & Authorization
- **Sign Up / Login** with JWT.
- Role-based access control (RBAC) for `customer`, `vendor`, and `admin`.

### 📦 Product Management (Vendor Only)
- Create, update, delete, and list products.
- Product fields: `name`, `price`, `stock`, `vendorId`, `category`, `createdAt`.

### 🛒 Order Placement (Customer)
- Place orders with items from multiple vendors.
- Backend automatically:
  - Validates stock.
  - Deducts stock (transaction-safe).
  - Splits orders per vendor.
  - Generates a master order and sub-orders.

### 📈 Analytics (Admin & Vendor)
- **Admin APIs**:
  - Revenue per vendor (last 30 days).
  - Top 5 products by sales.
  - Average order value.
- **Vendor APIs**:
  - Daily sales (last 7 days).
  - Low-stock products.

### ⚙️ Technical Features
- **Redis Caching** for product listing.
- **Swagger** documentation.
- **Unit Testing** with Jest and Supertest.
- Modular and clean project structure.

---

## 🧰 Installation

### Prerequisites
- Node.js (v16+)
- MongoDB
- Redis

## 📮 Postman Collection

You can test all Product CRUD APIs using the included Postman collection.

📁 File: `postman/Multi-Vendor-Product-API.postman_collection.json`

### 🚀 How to Use:
1. Open Postman
2. Click `Import`
3. Select the file above
4. Set your `{{token}}` variable (from `/api/auth/login`)



### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/sauravkumar711/multi-vendor-order-system
   cd multi-vendor-order-system
