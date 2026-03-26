<div align="center">

<img 
  src="https://raw.githubusercontent.com/parthnarkar/FitMart/main/client/public/logo.png" 
  alt="FitMart" 
  width="100"
/>

# FitMart

### *Your All-in-One Fitness & Nutrition E-Commerce Platform*

> A full-stack MERN e-commerce application combining premium fitness gear, nutrition products, and seamless payments — built for learning, collaboration, and real-world use.

<br/>

[![React](https://img.shields.io/badge/React-v19-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v16+-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-0C2A5E?style=flat-square)](https://razorpay.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![Status](https://img.shields.io/badge/Status-In%20Development-orange?style=flat-square)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square)](CONTRIBUTING.md)

<br/>

[![GitHub Stars](https://img.shields.io/github/stars/parthnarkar/FitMart?style=for-the-badge&logo=github)](https://github.com/parthnarkar/FitMart/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/parthnarkar/FitMart?style=for-the-badge&logo=github)](https://github.com/parthnarkar/FitMart/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/parthnarkar/FitMart?style=for-the-badge&logo=github)](https://github.com/parthnarkar/FitMart/issues)
[![GitHub PRs](https://img.shields.io/github/issues-pr/parthnarkar/FitMart?style=for-the-badge&logo=github)](https://github.com/parthnarkar/FitMart/pulls)

</div>

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Seeding the Database](#-seeding-the-database)
- [Running the App](#-running-the-app)
- [API Reference](#-api-reference)
- [Data Models](#-data-models)
- [Notes & Recommendations](#-notes--recommendations)
- [Contributing](#-contributing)
- [Contributors](#-contributors)
- [License](#-license)

---

## 🧠 About the Project

**FitMart** is a full-stack e-commerce web application built with the MERN stack. It's designed as both a **learning resource** and a **real-world starting point** for building modern storefronts.

The project covers end-to-end functionality including:
- 🔐 User authentication via Firebase
- 🛒 Cart management with stock reservation logic
- 💳 Secure payments via Razorpay (with HMAC verification)
- 📦 Order management with price snapshotting

Whether you're a beginner looking to learn full-stack development or an experienced developer who wants to contribute — **FitMart is built for you.**

---

## ✨ Features

| Feature | Description |
|---|---|
| 🛍️ Product Catalog | Browse products with images, pricing, badges & metadata |
| 🛒 Smart Cart | Cart with real-time stock reservation logic |
| 📦 Order Management | Orders with price snapshotting at time of purchase |
| 💳 Razorpay Payments | Secure order creation & HMAC payment verification |
| 🔐 Firebase Auth | Email/password and Google Sign-In |
| 🌱 Seed Script | One-command DB population with demo products |
| 📱 PWA Ready | Progressive Web App support |

---

## 🛠️ Tech Stack

### Frontend
- **React v19** + **Vite** — fast dev experience
- **Tailwind CSS** — utility-first styling
- **Firebase Authentication** — client-side auth

### Backend
- **Node.js** + **Express** — REST API
- **Mongoose** — MongoDB ODM
- **Razorpay SDK** — payment processing

### Database & Services
- **MongoDB** (Atlas or local)
- **Firebase** (Auth)
- **Razorpay** (Payments)

---

## 📁 Project Structure

```
FitMart/
├── client/                   # React + Vite Frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route-level pages
│   │   ├── auth/             # Firebase auth helpers
│   │   └── utils/        # Helper functions
│   ├── public/               # Static assets
│   └── package.json
│
├── server/                   # Node.js + Express Backend
│   ├── models/               # Mongoose models (Product, Cart, Order)
│   ├── routes/               # Express routes (products, cart, orders, payment)
│   ├── db.js                 # MongoDB connection helper
│   ├── index.js              # Server entry point
│   └── seed.js               # DB seed script
│
├── CONTRIBUTING.md           # Contributor guide
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org/) v16+
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [MongoDB](https://www.mongodb.com/atlas) connection (Atlas or local)
- A [Firebase](https://firebase.google.com/) project (for auth)
- A [Razorpay](https://razorpay.com/) account (for payments)

---

### 1. Clone the Repository

```bash
git clone https://github.com/parthnarkar/FitMart.git
cd FitMart
```

### 2. Set Up the Server

```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder (see [Environment Variables](#-environment-variables)):

```bash
cp .env.example .env   # if available, or create manually
```

Seed the database with sample products:
 
```bash
npm run seed
```

Start the backend dev server:

```bash
npm run dev
```

> The server runs at **http://localhost:5000** by default.

---

### 3. Set Up the Client

Open a **new terminal** and run:

```bash
cd client
npm install
```

Create a `.env` file in the `client/` folder (see [Environment Variables](#-environment-variables)):

```bash
npm run dev
```

> The client runs at **http://localhost:5173** by default.

---

## 🔑 Environment Variables

> ⚠️ **Never commit your `.env` files or API secrets to GitHub!** They are already in `.gitignore`.

### Server — `server/.env`
```env
MONGO_URI=<your_mongodb_connection_string>
MONGO_DB=<your_database_name>           # optional
PORT=5000
RAZORPAY_KEY_ID=<your_razorpay_key_id>
RAZORPAY_KEY_SECRET=<your_razorpay_key_secret>

# Firebase Admin SDK (required for auth middleware)
FIREBASE_PROJECT_ID=<your_firebase_project_id>
FIREBASE_CLIENT_EMAIL=<your_firebase_client_email>
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

#### Getting Firebase Admin credentials

1. Go to [Firebase Console](https://console.firebase.google.com) and open your project
2. Click the gear icon → **Project Settings** → **Service Accounts** tab
3. Make sure **Node.js** is selected
4. Click **"Generate new private key"** → **"Generate key"**
5. A `.json` file will download — open it and copy:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (wrap in double quotes, keep all `\n` as-is)
6. Delete the `.json` file after copying — never commit it to GitHub

### Client — `client/.env`

```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=<your_razorpay_key_id>

# Firebase config (from your Firebase project settings)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

---

## 🌱 Seeding the Database

The seed script populates your MongoDB with sample fitness products:

```bash
cd server
npm run seed
```

Each product includes: `productId`, `name`, `brand`, `category`, `price`, `originalPrice`, `rating`, `reviews`, `badge`, `image`, `stock`, and `reserved`.

---

## ▶️ Running the App

### Development

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

### Production

```bash
# Build the frontend
cd client && npm run build

# Start the server
cd server && npm start
```

---

## 📡 API Reference

**Base URL:** `http://localhost:5000` (or your `VITE_API_URL`)

### 🛍️ Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | List all products (sorted by `productId`) |
| `GET` | `/api/products/:id` | Get product by `productId` |
| `POST` | `/api/products` | Create a new product |
| `PUT` | `/api/products/:id` | Update product by `productId` |
| `DELETE` | `/api/products/:id` | Delete product by `productId` |

### 🛒 Cart

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/cart/:userId` | Get or create a user's cart |
| `POST` | `/api/cart/:userId/add` | Add item — body: `{ productId, quantity }` |
| `POST` | `/api/cart/:userId/remove` | Remove item — body: `{ productId, quantity }` |
| `DELETE` | `/api/cart/:userId` | Clear cart and release reserved stock |

### 📦 Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/orders` | Create order — body: `{ userId, items? }` |
| `GET` | `/api/orders/:userId` | List all orders for a user |

### 💳 Payments

| `POST` | `/api/payment/create-order` | Create a Razorpay order |
| `POST` | `/api/payment/verify-payment` | Verify HMAC signature |
| `POST` | `/api/payment/clear-cart` | Release stock & clear cart — body: `{ userId }` |
| `POST` | `/api/payment/demo-success` | Simulate successful payment (testing only) |

> **Security:** Payment verification uses HMAC-SHA256 on `razorpay_order_id|razorpay_payment_id` with `RAZORPAY_KEY_SECRET`.

---

## 🗃️ Data Models

### Product
```js
{
  productId:     Number (unique, required),
  name:          String,
  brand:         String,
  category:      String,
  price:         Number (required),
  originalPrice: Number,
  rating:        Number,
  reviews:       Number,
  badge:         String,
  image:         String,   // URL
  stock:         Number | null,
  reserved:      Number    // quantity reserved in carts
}
```

### Cart
```js
{
  userId: String (indexed),
  items: [{ productId, quantity }]
}
```

### Order
```js
{
  userId: String,
  items:  [{ productId, quantity, price }],  // price snapshotted at purchase
  total:  Number,
  status: String
}
```

---

## 📝 Notes & Recommendations

- **API URL consistency** — Some client files still use the hardcoded `http://localhost:5000`. It's recommended to standardize everything on `VITE_API_URL`. This is a great first contribution!
- **Cart reservation** — `Product.reserved` increments on cart add and decrements on cart remove/clear. Orders finalize the reservation but don't re-release it.
- **Razorpay** — Always verify payments server-side. Never expose `RAZORPAY_KEY_SECRET` to the client.
- **Firebase** — Only client-facing Firebase config keys go in the Vite `.env.local`. Never put service account credentials there.

---

## 🤝 Contributing

We love contributions! FitMart is an open-source, community-driven project and contributions of all kinds are welcome — from fixing typos to building new features.

Please read our **[CONTRIBUTING.md](CONTRIBUTING.md)** for a full guide on:
- How to set up your development environment
- How to pick and work on issues
- How to submit a Pull Request
- Code style and commit conventions

**New to open source?** Look for issues labelled [`good first issue`](https://github.com/parthnarkar/FitMart/labels/good%20first%20issue) — they're perfect starting points! 🌱

---

## 👥 Contributors

Thanks to everyone who contributes to FitMart.

<a href="https://github.com/parthnarkar/FitMart/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=parthnarkar/FitMart" alt="FitMart contributors" />
</a>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ by [Parth Narkar](https://github.com/parthnarkar) and the [Parth Builds Community](https://www.instagram.com/parth.builds/)

⭐ **Star this repo** if you find it useful — it means a lot!

</div>