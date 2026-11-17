<a id="top"></a>

<div align="center">

# 🛍️ PERN Commerce

### A Full-Stack E-Commerce Application

**PostgreSQL · Express.js · React · Node.js**

A modern, full-stack online store built with the **PERN stack**, **TypeScript**, and **Sequelize** — inspired by my **Bon Marché** e-commerce project.

[![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=0B1F2A)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Express](https://img.shields.io/badge/Express.js-5-222222?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-24%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

![Status](https://img.shields.io/badge/Status-In%20Development-F59E0B?style=flat-square)
![Sequelize](https://img.shields.io/badge/ORM-Sequelize%206-52B0E7?style=flat-square&logo=sequelize&logoColor=white)

**[Repository](https://github.com/Arnaudbrice/pern-training)** · **[Features](#-features)** · **[Architecture](#-architecture)** · **[Getting started](#-getting-started)** · **[Roadmap](#-roadmap)**

</div>

---

## 🌟 About the project

**PERN Commerce** is a full-stack e-commerce application being built around the four technologies of the **PERN stack**:

- **P**ostgreSQL — relational data storage and database-level integrity
- **E**xpress.js — REST API and server-side business logic
- **R**eact — interactive, responsive shopping experience
- **N**ode.js — JavaScript runtime for the backend

The goal is to deliver an end-to-end shopping experience: product discovery, accounts, carts, reviews, and a reliable order workflow — backed by a carefully designed relational database.

> [!IMPORTANT]
> **Development status:** This is a **full PERN-stack project**, not a backend-only product. The repository currently contains the **Node.js / Express / PostgreSQL foundation**. The **React frontend will be developed and integrated into this same project**. Features not yet available are identified below.

## ✨ Features

<table>
<tr><th align="left">✅ Implemented in the repository</th><th align="left">🚧 In progress / planned</th></tr>
<tr><td valign="top">

- Product REST API (CRUD)
- User and category creation endpoints
- Sequelize models for users, products, categories, addresses, orders, carts, cart items, and reviews
- One-to-one, one-to-many, and many-to-many associations
- Versioned PostgreSQL migrations
- Cart quantity, product-weight, and review-rating constraints
- Composite unique indexes to prevent duplicates
- Transaction-based database integration tests

</td><td valign="top">

- **React + TypeScript storefront inside this repository**
- Responsive product listings, detail pages, search, and filters
- Shopping cart and checkout UI
- Authentication and account experience
- Customer reviews and average star ratings
- Order placement and history endpoints / UI
- Additional API and integration test coverage
- Deployment and CI/CD setup

</td></tr>
</table>

### ⭐ Product ratings: a deliberate design decision

Customers can submit **whole-star reviews (1–5)**. The **average rating** is calculated from all reviews and can be rendered in React in **half-star increments** (for example, `4.33 → 4.5 ⭐` for display). The stored review values remain integers.

## 🧱 Tech stack

| Layer | Technology | Role |
|:--|:--|:--|
| Frontend **(planned integration)** | **React, TypeScript** | Component-based UI and shopping experience |
| Backend **(implemented)** | **Node.js, Express 5** | REST endpoints, controllers, middleware |
| Database **(implemented)** | **PostgreSQL** | Relational data and constraints |
| ORM **(implemented)** | **Sequelize 6 / Sequelize CLI** | Models, associations, migrations |
| Tooling | TypeScript, ESLint, npm | Type checking and code quality |
| Tests | Node.js `assert/strict`, PostgreSQL transactions | Database integration and constraint testing |

## 🏗️ Architecture

```mermaid
flowchart TB
    U[Customer / Browser] --> R[React + TypeScript Storefront<br/>Planned / In Development]
    R -->|REST API / JSON| E[Node.js + Express API<br/>Implemented]
    E --> S[Sequelize ORM<br/>Models + Associations]
    S --> P[(PostgreSQL<br/>Tables + Constraints)]
    E --> T[Database Integration Tests]
    T --> P
```

### Main data relationships

```mermaid
erDiagram
    USERS ||--o{ PRODUCTS : owns
    CATEGORIES ||--o{ PRODUCTS : categorizes
    USERS ||--o{ ADDRESSES : has
    USERS ||--o| CARTS : owns
    CARTS ||--o{ CART_ITEMS : contains
    PRODUCTS ||--o{ CART_ITEMS : referenced_by
    USERS ||--o{ ORDERS : places
    ORDERS ||--o{ ORDER_ITEMS : contains
    PRODUCTS ||--o{ ORDER_ITEMS : referenced_by
    USERS ||--o{ REVIEWS : writes
    PRODUCTS ||--o{ REVIEWS : receives
```

The user model also references an optional **default address**.

### 🔐 Database rules

| Business rule | PostgreSQL enforcement |
|:--|:--|
| One cart per user | `UNIQUE (userId)` |
| One cart row per product | `UNIQUE (cartId, productId)` |
| Quantity must be positive | `CHECK (quantity >= 1)` |
| Product weight must be positive | `CHECK (weightGrams >= 1)` |
| Review rating must be 1–5 | `INTEGER` + `CHECK (rating BETWEEN 1 AND 5)` |
| A user can review a product only once | `UNIQUE (productId, userId)` |
| Deleting a reviewer removes their reviews | `ON DELETE CASCADE` |
| A product with reviews cannot be deleted | `ON DELETE RESTRICT` |
| Removing a default address clears the reference | `ON DELETE SET NULL` |

These constraints protect the data even when application-level validation is bypassed.

## 🔌 REST API

Currently exposed routes in the Express backend:

| Method | Endpoint | Description |
|:--:|:--|:--|
| `GET` | `/api/products` | Get products |
| `GET` | `/api/products/:id` | Get one product |
| `POST` | `/api/products` | Create a product |
| `PUT` | `/api/products/:id` | Update a product |
| `DELETE` | `/api/products/:id` | Delete a product |
| `POST` | `/api/users` | Create a user |
| `POST` | `/api/categories` | Create a category |

> Cart, review, and order database models exist, but their complete public REST APIs and React screens are still being developed.

## 🚀 Getting started

### Requirements

- Node.js **24+** (used by this backend for native TypeScript model imports)
- PostgreSQL
- npm

### 1. Clone the repository

```bash
git clone https://github.com/Arnaudbrice/pern-training.git
cd pern-training
npm install
```

> **Current setup note:** The existing Sequelize CLI config calls `require("dotenv")`. If `dotenv` is not installed, add it with `npm install dotenv` before migrating.

### 2. Configure PostgreSQL

Create a local PostgreSQL database (for example, `pern_refresh`) and a `.env` file at the repository root:

```dotenv
PG_URI=postgres://postgres:YOUR_PASSWORD@localhost:5432/pern_refresh
PORT=3000
```

Replace the credentials and port with your own configuration. Never commit `.env` or real passwords.

### 3. Run migrations

```bash
npm run migrate
npm run migrate-status
```

### 4. Start the backend

```bash
npm run dev
```

Backend default: **http://localhost:3000**

**React frontend setup:** will be documented once the frontend is added to this repository. There is no frontend startup command to run yet.

## 🧪 Testing

This project tests actual PostgreSQL behavior, not only mocked results. Tests create records inside transactions and roll back to avoid leaving test data behind.

```bash
# Cart associations and constraints
node --env-file=.env src/scripts/cart-db-test.js
node --env-file=.env src/scripts/cart-item-db-test.js
node --env-file=.env src/scripts/cart-item-constraints-db-test.js

# Review associations
node --env-file=.env src/scripts/review-db-test.js

# Review constraints (still being completed)
node --env-file=.env src/scripts/review-constraints-db-test.js

# Type check and lint
npx tsc --noEmit
npm run lint
```

Review-constraint test coverage is still in progress. The integration-test approach checks **CHECK**, **UNIQUE**, **CASCADE**, and **RESTRICT** rules using real SQL errors and independent transactions.

## 📂 Project structure

```text
pern-training/
├── src/                      # Backend (currently implemented)
│   ├── controllers/          # Express controller functions
│   ├── routers/              # API route definitions
│   ├── middleware/           # Error handling
│   ├── models/               # Sequelize JS/TS models and associations
│   ├── db/                   # Connection, CLI configuration, migrations
│   ├── scripts/              # PostgreSQL integration tests
│   └── index.js              # Express app entry point
├── client/                   # React + TypeScript frontend (planned)
├── package.json
└── tsconfig.json
```

*`client/` illustrates the planned full-stack layout; it is not yet present in the repository.*

## 🗺️ Roadmap

- [x] PostgreSQL database schema and model associations
- [x] Product CRUD routes and basic user/category routes
- [x] Cart / CartItem constraints and transaction tests
- [x] Review schema, rating rules, and associations
- [ ] Finish review constraint integration tests
- [ ] Complete authentication, cart, order, and review APIs
- [ ] **Build and integrate React + TypeScript frontend**
- [ ] Product browsing, cart, checkout, ratings, and account UI
- [ ] Full-stack testing, deployment, and CI/CD

## 💡 Project goals

This project is an opportunity to build a maintainable **end-to-end PERN application**, combining frontend engineering with robust backend design:

- Build reusable, accessible React components with TypeScript.
- Design clear REST APIs and predictable application state.
- Model business rules in PostgreSQL using migrations and constraints.
- Protect data integrity with transactions and integration tests.
- Deliver a responsive e-commerce experience from UI to database.

---

<div align="center">

### Built with React ⚛️ · Node.js 🟢 · Express ⚡ · PostgreSQL 🐘

**A complete PERN shopping experience — in the making.**

[⬆ Back to top](#top)

</div>
