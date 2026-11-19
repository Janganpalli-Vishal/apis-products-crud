# 📦 Products CRUD API — Full Reference

**Base URL:** `http://localhost:5001/api/products`

---

## 📋 Table of Contents

1. [GET — All Products (with filters)](#1-get--all-products)
2. [GET — Single Product by ID](#2-get--single-product)
3. [POST — Create Product](#3-post--create-product)
4. [PUT — Full Update](#4-put--full-update)
5. [PATCH — Partial Update](#5-patch--partial-update)
6. [DELETE — Delete Product](#6-delete--delete-product)
7. [Error Responses](#-error-responses)

---

## 1. GET — All Products

**URL:** `GET /api/products`

Fetch all products. Supports filtering, sorting, and pagination via query parameters.

### Query Parameters (all optional)

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `name` | string | `?name=iphone` | Search by name (case-insensitive) |
| `category` | string | `?category=Electronics` | Filter by category |
| `minPrice` | number | `?minPrice=500` | Minimum price |
| `maxPrice` | number | `?maxPrice=50000` | Maximum price |
| `brand` | string | `?brand=apple` | Filter by brand |
| `isFeatured` | boolean | `?isFeatured=true` | Only featured products |
| `isBestSeller` | boolean | `?isBestSeller=true` | Only best sellers |
| `isOnSale` | boolean | `?isOnSale=true` | Only sale products |
| `isActive` | boolean | `?isActive=false` | Only inactive products |
| `status` | string | `?status=published` | draft / published / archived |
| `page` | number | `?page=2` | Page number (default: 1) |
| `limit` | number | `?limit=5` | Items per page (default: 10, max: 50) |
| `sort` | string | `?sort=price` | Sort field (default: `-createdAt`) |

### Example Requests

```
# Get all products
GET /api/products

# Search by name
GET /api/products?name=samsung

# Filter by category
GET /api/products?category=Electronics

# Filter by price range
GET /api/products?minPrice=1000&maxPrice=50000

# Combine filters
GET /api/products?category=Electronics&minPrice=5000&isFeatured=true

# Pagination
GET /api/products?page=1&limit=5

# Sort by price (ascending)
GET /api/products?sort=price

# Sort by price (descending)
GET /api/products?sort=-price
```

### ✅ Success Response `200 OK`

```json
{
  "success": true,
  "message": "Products fetched successfully",
  "count": 2,
  "total": 21,
  "page": 1,
  "totalPages": 11,
  "filters": {
    "category": "Electronics"
  },
  "data": [
    {
      "_id": "674abc123def456789000001",
      "name": "iPhone 15 Pro Max",
      "slug": "iphone-15-pro-max",
      "shortDescription": "Apple's most powerful iPhone ever.",
      "description": "The latest Apple flagship...",
      "price": 134900,
      "originalPrice": 149900,
      "discount": 10,
      "finalPrice": 121410,
      "category": "Electronics",
      "subCategory": "Smartphones",
      "brand": "Apple",
      "tags": ["apple", "iphone", "5g"],
      "stock": 45,
      "sku": "SKU-1700000001-423",
      "weight": 0.221,
      "image": "https://...",
      "images": [],
      "rating": 4.9,
      "reviewCount": 2340,
      "isActive": true,
      "isFeatured": true,
      "isNewArrival": true,
      "isBestSeller": true,
      "isOnSale": true,
      "inStock": true,
      "freeShipping": true,
      "isPremium": true,
      "shippingDays": 2,
      "returnDays": 15,
      "status": "published",
      "createdAt": "2026-11-19T07:00:00.000Z",
      "updatedAt": "2026-11-19T07:00:00.000Z"
    }
  ]
}
```

---

## 2. GET — Single Product

**URL:** `GET /api/products/:id`

Fetch one product by its MongoDB `_id`.

### Example Request

```
GET /api/products/674abc123def456789000001
```

### ✅ Success Response `200 OK`

```json
{
  "success": true,
  "message": "Product fetched successfully",
  "data": {
    "_id": "674abc123def456789000001",
    "name": "iPhone 15 Pro Max",
    "price": 134900,
    "finalPrice": 121410,
    "category": "Electronics",
    "isActive": true,
    "inStock": true,
    "..."  : "..."
  }
}
```

### ❌ Not Found `404`

```json
{
  "success": false,
  "message": "Product with ID \"674abc123def456789000001\" not found"
}
```

### ❌ Invalid ID Format `400`

```json
{
  "success": false,
  "message": "Invalid product ID format: \"abc\""
}
```

---

## 3. POST — Create Product

**URL:** `POST /api/products`

Create a new product. Send data as **JSON body**.

### Required Fields

| Field | Type | Validation |
|-------|------|-----------|
| `name` | string | min 2, max 100 chars |
| `description` | string | max 1000 chars |
| `price` | number | must be ≥ 0 |
| `category` | string | must be a valid enum value |
| `stock` | number | must be ≥ 0 |

### Valid Category Values

```
Electronics | Clothing | Food | Books | Sports | Home | Beauty | Toys
```

### Example Request

```http
POST /api/products
Content-Type: application/json

{
  "name": "Samsung Galaxy S24",
  "description": "Snapdragon 8 Gen 3, 50MP camera, 5000mAh battery.",
  "shortDescription": "Samsung's best mid-range phone.",
  "price": 74999,
  "originalPrice": 79999,
  "discount": 6,
  "category": "Electronics",
  "subCategory": "Smartphones",
  "brand": "Samsung",
  "stock": 100,
  "weight": 0.167,
  "image": "https://example.com/s24.jpg",
  "rating": 4.5,
  "reviewCount": 500,
  "isActive": true,
  "isFeatured": false,
  "isNewArrival": true,
  "isBestSeller": false,
  "isOnSale": true,
  "inStock": true,
  "freeShipping": false,
  "isPremium": false,
  "shippingDays": 3,
  "returnDays": 10,
  "status": "published"
}
```

### ✅ Success Response `201 Created`

```json
{
  "success": true,
  "message": "Product \"Samsung Galaxy S24\" created successfully!",
  "data": {
    "_id": "674abc123def456789000099",
    "name": "Samsung Galaxy S24",
    "slug": "samsung-galaxy-s24",
    "sku": "SKU-1700000099-512",
    "price": 74999,
    "finalPrice": 70499.06,
    "..."  : "..."
  }
}
```

### ❌ Validation Error `400`

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Product name is required",
    "Price cannot be negative"
  ]
}
```

### ❌ Duplicate Product `409`

```json
{
  "success": false,
  "message": "A product with this slug already exists"
}
```

---

## 4. PUT — Full Update

**URL:** `PUT /api/products/:id`

**Completely replaces** the product. Send the **full product object** — missing fields revert to defaults.

> 🧠 **Teaching Note:** PUT = Full Replace. If you don't send `isFeatured`, it gets reset to `false`.

### Example Request

```http
PUT /api/products/674abc123def456789000001
Content-Type: application/json

{
  "name": "iPhone 15 Pro Max — Updated",
  "description": "Updated description with new features.",
  "shortDescription": "Now with more storage.",
  "price": 129900,
  "originalPrice": 149900,
  "discount": 13,
  "category": "Electronics",
  "subCategory": "Smartphones",
  "brand": "Apple",
  "stock": 30,
  "weight": 0.221,
  "image": "https://example.com/iphone15.jpg",
  "rating": 4.9,
  "reviewCount": 2500,
  "isActive": true,
  "isFeatured": true,
  "isNewArrival": false,
  "isBestSeller": true,
  "isOnSale": true,
  "inStock": true,
  "freeShipping": true,
  "isPremium": true,
  "shippingDays": 2,
  "returnDays": 15,
  "status": "published"
}
```

### ✅ Success Response `200 OK`

```json
{
  "success": true,
  "message": "Product \"iPhone 15 Pro Max — Updated\" fully updated successfully!",
  "data": {
    "_id": "674abc123def456789000001",
    "name": "iPhone 15 Pro Max — Updated",
    "price": 129900,
    "..."  : "..."
  }
}
```

### ❌ Not Found `404`

```json
{
  "success": false,
  "message": "Product with ID \"674abc123def456789000001\" not found"
}
```

---

## 5. PATCH — Partial Update

**URL:** `PATCH /api/products/:id`

Updates **only the fields you send**. All other fields stay unchanged.

> 🧠 **Teaching Note:** PATCH = Partial Update. Send only what you want to change.

### Example Requests

```http
# Toggle active status
PATCH /api/products/674abc123def456789000001
Content-Type: application/json

{ "isActive": false }
```

```http
# Mark as featured and on sale
PATCH /api/products/674abc123def456789000001
Content-Type: application/json

{ "isFeatured": true, "isOnSale": true, "discount": 20 }
```

```http
# Update price only
PATCH /api/products/674abc123def456789000001
Content-Type: application/json

{ "price": 99999 }
```

```http
# Update stock count
PATCH /api/products/674abc123def456789000001
Content-Type: application/json

{ "stock": 0, "inStock": false }
```

### ✅ Success Response `200 OK`

```json
{
  "success": true,
  "message": "Product \"iPhone 15 Pro Max\" partially updated!",
  "updatedFields": ["isActive"],
  "data": {
    "_id": "674abc123def456789000001",
    "name": "iPhone 15 Pro Max",
    "isActive": false,
    "..."  : "..."
  }
}
```

---

## 6. DELETE — Delete Product

**URL:** `DELETE /api/products/:id`

Permanently deletes a product.

### Example Request

```
DELETE /api/products/674abc123def456789000001
```

### ✅ Success Response `200 OK`

```json
{
  "success": true,
  "message": "Product \"iPhone 15 Pro Max\" deleted successfully!",
  "deletedProduct": {
    "id": "674abc123def456789000001",
    "name": "iPhone 15 Pro Max",
    "category": "Electronics"
  }
}
```

### ❌ Not Found `404`

```json
{
  "success": false,
  "message": "Product with ID \"674abc123def456789000001\" not found"
}
```

---

## ❌ Error Responses

### Common HTTP Status Codes

| Code | Meaning | When it happens |
|------|---------|----------------|
| `200` | OK | Successful GET, PUT, PATCH, DELETE |
| `201` | Created | Successful POST |
| `400` | Bad Request | Validation failed / Invalid ID format |
| `404` | Not Found | Product ID doesn't exist |
| `409` | Conflict | Duplicate slug or SKU |
| `500` | Server Error | Unexpected crash |

### Standard Error Shape

```json
{
  "success": false,
  "message": "Human-readable error description"
}
```

### Validation Error Shape (POST / PUT)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Product name is required",
    "Electronics is not a valid category"
  ]
}
```

---

## ⚡ PUT vs PATCH — Quick Comparison

| | PUT | PATCH |
|--|-----|-------|
| Sends | **All fields** | **Only changed fields** |
| Missing fields | Reset to default | Stay unchanged |
| Use case | Full edit form | Toggle, quick fix |
| Body size | Large | Small |

```js
// PATCH — just flip one flag
axios.patch(`/api/products/${id}`, { isActive: false })

// PUT — send the full object
axios.put(`/api/products/${id}`, { name, price, category, ...allFields })
```

---

## 🧪 Test with cURL

```bash
# GET all
curl http://localhost:5001/api/products

# GET with filter
curl "http://localhost:5001/api/products?category=Electronics&minPrice=1000"

# GET one
curl http://localhost:5001/api/products/<id>

# POST
curl -X POST http://localhost:5001/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","description":"A test.","price":999,"category":"Books","stock":10}'

# PUT
curl -X PUT http://localhost:5001/api/products/<id> \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated","description":"Updated desc","price":1299,"category":"Books","stock":5}'

# PATCH
curl -X PATCH http://localhost:5001/api/products/<id> \
  -H "Content-Type: application/json" \
  -d '{"isActive": false}'

# DELETE
curl -X DELETE http://localhost:5001/api/products/<id>
```
