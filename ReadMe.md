# Aronyo Backend – REST API for Plant Selling E-Commerce Platform

This is the **backend service** for **Aronyo**, a full-stack e-commerce platform for selling plants online.  
It is built with **Node.js**, **Express.js**, and **MongoDB**, providing secure APIs for authentication, products, orders, carts, blogs, and role-based dashboards.

---

## Backend Tech Stack

- **TypeScript** – Main Language
- **Node.js** – JavaScript runtime
- **Express.js** – Web framework
- **MongoDB + Mongoose** – Database & ODM
- **JWT Authentication** – Secure login & role-based access
- **Zod** – Input validation

---

## ✨ Features

- **Authentication & Authorization** (JWT-based, role-based access)
- **Product Management** (CRUD operations with categories, stock, and pricing)
- **Cart & Wishlist System** (user-specific carts, persistent state)
- **Order Management** (create orders, update status, track delivery)
- **Blog Management** (Admin/Staff can create & manage blogs)
- **Role-Based Dashboards**
  - User: Orders, cart, profile
  - Staff: Manage products & orders
  - Admin: Full control (users, roles, analytics)

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Abhamid3311/Aronyo-backend.git

cd Aronyo-backend

npm install

npm run start:dev

```
