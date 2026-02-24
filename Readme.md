# PULSEPR — eCommerce Backend API

A production-ready Express.js backend for the **PULSEPR** clothing brand, powered by Prisma ORM, PostgreSQL (Neon), JWT Authentication, and Razorpay Payments.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express.js |
| Database | PostgreSQL via Neon |
| ORM | Prisma v5 |
| Auth | JWT + bcryptjs |
| Payments | Razorpay |
| File Upload | Multer |

---

## 📁 Project Structure

```
PulsePr/
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── cartController.js
│   ├── paymentController.js
│   └── adminController.js
├── middlewares/
│   ├── auth.js
│   └── uploadMiddleware.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   ├── paymentRoutes.js
│   └── adminRoutes.js
├── lib/
│   └── prisma.js
├── prisma/
│   └── schema.prisma
├── public/
│   └── uploads/
├── server.js
├── .env
└── package.json
```

---

## ⚙️ Setup & Installation

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd PulsePr
npm install
```

### 2. Configure Environment Variables

Create a `.env` file:

```env
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
JWT_SECRET=your_super_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 3. Push Database Schema

```bash
npx prisma db push
npx prisma generate
```

### 4. Run the Server

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Server runs at: **`http://localhost:5000`**

---

## 🔐 Authentication

All protected routes require a `Bearer` token in the header:

```
Authorization: Bearer <your_jwt_token>
```

**Admin routes** additionally require the user role to be `ADMIN`.

---

## 📡 API Reference

### Base URL
```
http://localhost:5000
```

---

## 🔑 Auth Routes — `/api/auth`

### Register User
```
POST /api/auth/register
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "USER"
}
```
> Set `"role": "ADMIN"` to create an admin user.

**Response `201`:**
```json
{
  "message": "User registered successfully",
  "user": { "id": 1, "email": "john@example.com", "role": "USER" }
}
```

---

### Login
```
POST /api/auth/login
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response `200`:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGci...",
  "user": { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "USER" }
}
```

---

## 👕 Product Routes — `/api/products`  *(Public)*

### Get All Products
```
GET /api/products
```
**Response `200`:**
```json
{
  "products": [
    {
      "id": 1,
      "name": "Classic Oversized Tee",
      "brand": "PULSEPR",
      "price": 999,
      "discountPrice": 799,
      "category": "Oversized",
      "isActive": true,
      "images": [{ "id": 1, "imageUrl": "/uploads/sample.jpg" }],
      "sizes": [
        { "id": 1, "size": "S", "stockQuantity": 20 },
        { "id": 2, "size": "M", "stockQuantity": 30 }
      ]
    }
  ]
}
```

---

### Get Single Product
```
GET /api/products/:id
```
**Example:** `GET /api/products/1`

**Response `200`:**
```json
{
  "product": {
    "id": 1,
    "name": "Classic Oversized Tee",
    "images": [...],
    "sizes": [...]
  }
}
```

---

### Search Products
```
GET /api/products/search?q=<query>
```
**Example:** `GET /api/products/search?q=oversized`

**Response `200`:**
```json
{
  "products": [...]
}
```

---

### Get Products by Category
```
GET /api/products/category/:category
```
**Categories:** `Oversized` | `Regular` | `Graphic Tee` | `Hoodie`

**Example:** `GET /api/products/category/Oversized`

**Response `200`:**
```json
{
  "products": [...]
}
```

---

## 🛒 Cart Routes — `/api/cart`  *(Requires Auth)*

### Get Cart
```
GET /api/cart
Authorization: Bearer <token>
```
**Response `200`:**
```json
{
  "cart": {
    "id": 1,
    "userId": 1,
    "items": [
      {
        "id": 1,
        "size": "M",
        "quantity": 2,
        "product": { "id": 1, "name": "Classic Oversized Tee", "images": [...] }
      }
    ]
  }
}
```

---

### Add Item to Cart
```
POST /api/cart
Authorization: Bearer <token>
```
**Body:**
```json
{
  "productId": 1,
  "size": "M",
  "quantity": 2
}
```
**Response `201`:**
```json
{ "message": "Item added to cart" }
```

---

### Update Cart Item Quantity
```
PUT /api/cart
Authorization: Bearer <token>
```
**Body:**
```json
{
  "itemId": 1,
  "quantity": 3
}
```
> Set `quantity` to `0` or less to remove the item.

**Response `200`:**
```json
{ "message": "Cart item updated" }
```

---

### Remove Item from Cart
```
DELETE /api/cart/:itemId
Authorization: Bearer <token>
```
**Example:** `DELETE /api/cart/1`

**Response `200`:**
```json
{ "message": "Item removed from cart" }
```

---

## 💳 Payment Routes — `/api/payment`  *(Requires Auth)*

### Create Razorpay Order
```
POST /api/payment/create-order
Authorization: Bearer <token>
```
**Body:**
```json
{
  "items": [
    { "productId": 1, "size": "M", "quantity": 2 }
  ],
  "address": "123 Street, Mumbai, Maharashtra 400001"
}
```
**Response `200`:**
```json
{
  "success": true,
  "order": {
    "id": "order_PQ4kL3...",
    "amount": 159800,
    "currency": "INR"
  },
  "totalAmount": 1598
}
```
> Use `order.id` to open the Razorpay checkout on the frontend.

---

### Verify Payment & Place Order
```
POST /api/payment/verify
Authorization: Bearer <token>
```
**Body:**
```json
{
  "razorpay_order_id": "order_PQ4kL3...",
  "razorpay_payment_id": "pay_PQ5mN4...",
  "razorpay_signature": "abc123...",
  "items": [
    { "productId": 1, "size": "M", "quantity": 2 }
  ],
  "address": "123 Street, Mumbai, Maharashtra 400001",
  "totalAmount": 1598
}
```
**Response `200`:**
```json
{
  "success": true,
  "message": "Payment verified and order created",
  "order": {
    "id": 1,
    "orderStatus": "Paid",
    "totalAmount": 1598
  }
}
```
> This endpoint verifies the Razorpay signature, reduces stock using a **SQL transaction**, creates the order record, and clears the cart.

---

## 🛠️ Admin Routes — `/api/admin`  *(Requires Admin Auth)*

All admin routes require:
```
Authorization: Bearer <admin_jwt_token>
```

---

### Product Management

#### Add Product
```
POST /api/admin/product/add
```
**Body:**
```json
{
  "name": "Classic Oversized Tee",
  "brand": "PULSEPR",
  "description": "Premium 100% cotton oversized tee",
  "price": 999,
  "discountPrice": 799,
  "category": "Oversized",
  "isActive": true,
  "images": ["/uploads/image1.jpg", "/uploads/image2.jpg"],
  "sizes": [
    { "size": "S", "stockQuantity": 20 },
    { "size": "M", "stockQuantity": 30 },
    { "size": "L", "stockQuantity": 25 },
    { "size": "XL", "stockQuantity": 15 },
    { "size": "XXL", "stockQuantity": 10 }
  ]
}
```
**Response `201`:**
```json
{
  "message": "Product created successfully",
  "product": { "id": 1, "name": "Classic Oversized Tee", "images": [...], "sizes": [...] }
}
```

---

#### Update Product
```
PUT /api/admin/product/update/:id
```
**Example:** `PUT /api/admin/product/update/1`

**Body** *(all fields optional)*:
```json
{
  "name": "Updated Tee Name",
  "price": 1099,
  "discountPrice": 899,
  "isActive": true,
  "images": ["/uploads/new-image.jpg"],
  "sizes": [
    { "size": "M", "stockQuantity": 50 }
  ]
}
```
**Response `200`:**
```json
{
  "message": "Product updated successfully",
  "product": { ... }
}
```

---

#### Delete Product
```
DELETE /api/admin/product/delete/:id
```
**Example:** `DELETE /api/admin/product/delete/1`

**Response `200`:**
```json
{ "message": "Product deleted successfully" }
```

---

#### Upload Product Images
```
POST /api/admin/product/upload-image
Content-Type: multipart/form-data
```
**Form Field:** `images` (supports multiple files, max 10)

**Response `200`:**
```json
{
  "message": "Files uploaded successfully",
  "images": ["/uploads/1234567890-shirt.jpg", "/uploads/9876543210-back.jpg"]
}
```
> Use the returned image URLs when calling **Add Product** or **Update Product**.

---

#### Get All Products (Admin)
```
GET /api/admin/products
```
> Returns **all** products including inactive ones.

**Response `200`:**
```json
{ "products": [...] }
```

---

### Order Management

#### Get All Orders
```
GET /api/admin/orders
```
**Response `200`:**
```json
{
  "orders": [
    {
      "id": 1,
      "totalAmount": 1598,
      "orderStatus": "Paid",
      "address": "123 Street...",
      "createdAt": "2026-02-24T...",
      "user": { "id": 1, "name": "John Doe", "email": "john@example.com" },
      "orderItems": [
        {
          "size": "M",
          "quantity": 2,
          "price": 799,
          "product": { "name": "Classic Oversized Tee", "images": [...] }
        }
      ]
    }
  ]
}
```

---

#### Update Order Status
```
PATCH /api/admin/order/status/:id
```
**Example:** `PATCH /api/admin/order/status/1`

**Body:**
```json
{ "orderStatus": "Shipped" }
```
> Valid values: `Pending` | `Paid` | `Shipped` | `Delivered` | `Cancelled`

**Response `200`:**
```json
{
  "message": "Order status updated successfully",
  "order": { "id": 1, "orderStatus": "Shipped" }
}
```

---

### User Management

#### Get All Users
```
GET /api/admin/users
```
**Response `200`:**
```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "createdAt": "2026-02-24T...",
      "_count": { "orders": 3 }
    }
  ]
}
```

---

### Dashboard Stats

#### Get Statistics
```
GET /api/admin/stats
```
**Response `200`:**
```json
{
  "stats": {
    "totalUsers": 150,
    "totalOrders": 320,
    "totalRevenue": 278400,
    "topSellingProducts": [
      { "id": 1, "name": "Classic Oversized Tee", "category": "Oversized", "totalSold": 85, "images": [...] },
      { "id": 2, "name": "Street Graphic Tee", "category": "Graphic Tee", "totalSold": 60, "images": [...] }
    ]
  }
}
```

---

### Offers Management

#### Get All Offers
```
GET /api/admin/offers
```
**Response `200`:**
```json
{
  "offers": [
    {
      "id": 1,
      "title": "Summer Sale",
      "discountPercentage": 20,
      "startDate": "2026-03-01T00:00:00.000Z",
      "endDate": "2026-03-31T00:00:00.000Z",
      "isActive": true
    }
  ]
}
```

---

#### Create Offer
```
POST /api/admin/offers
```
**Body:**
```json
{
  "title": "Summer Sale",
  "discountPercentage": 20,
  "startDate": "2026-03-01",
  "endDate": "2026-03-31",
  "isActive": true
}
```
**Response `201`:**
```json
{
  "message": "Offer created successfully",
  "offer": { "id": 1, "title": "Summer Sale", ... }
}
```

---

#### Apply Offer to Products
```
POST /api/admin/offers/apply
```
**Body (apply to specific category):**
```json
{
  "offerId": 1,
  "category": "Oversized"
}
```
**Body (apply globally to all products):**
```json
{
  "offerId": 1
}
```
> This calculates `discountPrice = price × (1 - discountPercentage/100)` and updates all matching products.

**Response `200`:**
```json
{ "message": "Offer successfully applied to products" }
```

---

## 🖼️ Static Files

Uploaded images are served at:
```
GET /uploads/<filename>
```
**Example:** `http://localhost:5000/uploads/1234567890-shirt.jpg`

---

## 🔒 Error Responses

All endpoints return consistent error responses:

| Status | Meaning |
|---|---|
| `400` | Bad Request — missing or invalid fields |
| `401` | Unauthorized — missing or invalid token |
| `403` | Forbidden — admin access required |
| `404` | Not Found — resource doesn't exist |
| `405` | Method Not Allowed |
| `500` | Internal Server Error |

**Error format:**
```json
{ "message": "Descriptive error message" }
```

---

## 🧪 Quick Test with PowerShell

```powershell
# Register
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -ContentType "application/json" -Body '{"name":"Test User","email":"test@pulsepr.com","password":"test123"}'

# Login and save token
$r = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"test@pulsepr.com","password":"test123"}'
$token = $r.token

# Get all products
Invoke-RestMethod -Uri "http://localhost:5000/api/products" -Method GET

# Get cart (authenticated)
Invoke-RestMethod -Uri "http://localhost:5000/api/cart" -Method GET -Headers @{Authorization="Bearer $token"}
```

---

## 📦 Available Scripts

```bash
npm start        # Start production server
npm run dev      # Start dev server with nodemon (auto-reload)
npx prisma db push        # Push schema to database
npx prisma generate       # Regenerate Prisma Client
npx prisma studio         # Open Prisma Studio (database GUI)
```

---

## 🌐 Deployment (Vercel)

This project also supports **Vercel Serverless deployment** alongside the Express server.
The `api/` folder contains serverless handlers that mirror all routes.

```bash
npx vercel          # Deploy preview
npx vercel --prod   # Deploy production
```

---

*Built with ❤️ for PULSEPR clothing brand.*
