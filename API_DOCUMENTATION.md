# UltraTech Connect - API Documentation

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <accessToken>
```

---

## 🔐 Authentication Endpoints

### 1. POST /auth/signup
**Create a new user account**

```bash
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "password": "SecurePass@123",
    "preferredLanguage": "en"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "mobile": "9876543210",
      "preferredLanguage": "en"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. POST /auth/login
**Login with email and password**

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass@123"
  }'
```

---

### 3. POST /auth/send-otp
**Send OTP to mobile number**

```bash
curl -X POST http://localhost:5000/api/v1/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "9876543210"
  }'
```

---

### 4. POST /auth/login/otp
**Login using OTP**

```bash
curl -X POST http://localhost:5000/api/v1/auth/login/otp \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "9876543210",
    "otp": "123456"
  }'
```

---

### 5. POST /auth/refresh
**Refresh access token**

```bash
curl -X POST http://localhost:5000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

---

### 6. POST /auth/logout
**Logout (invalidate current session)**

```bash
curl -X POST http://localhost:5000/api/v1/auth/logout \
  -H "Authorization: Bearer <accessToken>"
```

---

## 📋 Category Endpoints

### 1. GET /categories
**Retrieve all issue categories**

```bash
curl http://localhost:5000/api/v1/categories
```

**Response:**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": {
    "categories": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "key": "cracks",
        "displayName": {
          "en": "Wall Cracks",
          "hi": "दीवार की दरारें"
        },
        "subCategories": [
          {
            "key": "hairline",
            "displayName": { "en": "Hairline Cracks", "hi": "बारीक दरारें" }
          }
        ],
        "isActive": true
      }
    ]
  }
}
```

---

### 2. GET /categories/:categoryId/subcategories
**Get subcategories of a category**

```bash
curl http://localhost:5000/api/v1/categories/507f1f77bcf86cd799439011/subcategories
```

---

## 📦 Product Endpoints

### 1. GET /products
**Retrieve products with filtering and pagination**

```bash
# Get all products
curl http://localhost:5000/api/v1/products

# Filter by category
curl "http://localhost:5000/api/v1/products?categoryKey=cracks"

# Search
curl "http://localhost:5000/api/v1/products?search=seal&page=1&limit=10"

# Pagination
curl "http://localhost:5000/api/v1/products?page=2&limit=20"
```

**Response:**
```json
{
  "success": true,
  "items": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "nameKey": "ultratech-seal",
      "displayName": {
        "en": "UltraTech Seal & Dry",
        "hi": "अल्ट्राटेक सील और ड्राई"
      },
      "categoryKey": "waterproofing",
      "marketPrice": 499,
      "buyLink": "https://example.com/product",
      "images": ["image1.jpg", "image2.jpg"]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

---

### 2. GET /products/:productId
**Get specific product details**

```bash
curl http://localhost:5000/api/v1/products/507f1f77bcf86cd799439011
```

---

## 🎬 Tutorial Endpoints

### 1. GET /tutorials
**Retrieve tutorials with filtering**

```bash
# Get all tutorials
curl http://localhost:5000/api/v1/tutorials

# Filter by category
curl "http://localhost:5000/api/v1/tutorials?categoryKey=cracks"

# Search
curl "http://localhost:5000/api/v1/tutorials?search=installation"
```

---

## 🤖 AI Diagnostic Endpoints

### 1. POST /ai/diagnostics
**Analyze construction issue with AI**

```bash
# With image upload
curl -X POST http://localhost:5000/api/v1/ai/diagnostics \
  -H "Authorization: Bearer <accessToken>" \
  -F "image=@/path/to/image.jpg" \
  -F "userProblemText=There is a crack on my wall"

# Text only
curl -X POST http://localhost:5000/api/v1/ai/diagnostics \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "userProblemText": "Water leakage from corner"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Diagnostic analysis completed",
  "data": {
    "issue": "Wall Crack",
    "severity": "Medium",
    "recommendation": {
      "productId": "507f1f77bcf86cd799439011",
      "name": {
        "en": "UltraTech Seal & Dry",
        "hi": "अल्ट्राटेक सील और ड्राई"
      },
      "marketPrice": 499,
      "buyLink": "https://example.com"
    },
    "reasoning": "AI detected a medium-severity crack with 85% confidence",
    "diagnosticId": "507f1f77bcf86cd799439012"
  }
}
```

---

### 2. GET /ai/diagnostics/:diagnosticId
**Retrieve specific diagnostic result**

```bash
curl http://localhost:5000/api/v1/ai/diagnostics/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer <accessToken>"
```

---

### 3. GET /ai/history
**Get user's diagnostic history**

```bash
# Get latest diagnostics
curl "http://localhost:5000/api/v1/ai/history?page=1&limit=10" \
  -H "Authorization: Bearer <accessToken>"
```

---

## 👤 User Profile Endpoints

### 1. GET /users/me
**Get current user profile**

```bash
curl http://localhost:5000/api/v1/users/me \
  -H "Authorization: Bearer <accessToken>"
```

---

### 2. PATCH /users/me
**Update user profile**

```bash
curl -X PATCH http://localhost:5000/api/v1/users/me \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "preferredLanguage": "hi"
  }'
```

---

## 💬 Chatbot Endpoints

### 1. POST /chatbot/conversations
**Create a new conversation**

```bash
curl -X POST http://localhost:5000/api/v1/chatbot/conversations \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "aiRequestId": "507f1f77bcf86cd799439012"
  }'
```

---

### 2. GET /chatbot/conversations
**Retrieve user's conversations**

```bash
curl "http://localhost:5000/api/v1/chatbot/conversations?page=1&limit=20" \
  -H "Authorization: Bearer <accessToken>"
```

---

### 3. POST /chatbot/conversations/:conversationId/messages
**Add message to conversation**

```bash
curl -X POST http://localhost:5000/api/v1/chatbot/conversations/507f1f77bcf86cd799439013/messages \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "How do I apply this product?",
    "language": "en"
  }'
```

---

### 4. POST /chatbot/conversations/:conversationId/escalate
**Escalate conversation to support team**

```bash
curl -X POST http://localhost:5000/api/v1/chatbot/conversations/507f1f77bcf86cd799439013/escalate \
  -H "Authorization: Bearer <accessToken>"
```

---

## 📢 Feedback Endpoints

### 1. POST /feedback
**Submit feedback**

```bash
curl -X POST http://localhost:5000/api/v1/feedback \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Great product!",
    "message": "The UltraTech Seal & Dry worked perfectly for my wall crack."
  }'
```

---

### 2. GET /feedback/me
**Get user's feedback submissions**

```bash
curl "http://localhost:5000/api/v1/feedback/me?page=1&limit=10" \
  -H "Authorization: Bearer <accessToken>"
```

---

### 3. GET /feedback (Admin)
**Retrieve all feedback (admin only)**

```bash
curl "http://localhost:5000/api/v1/feedback?status=SUBMITTED&page=1" \
  -H "Authorization: Bearer <accessToken>"
```

---

## ✅ Health Check

### GET /health
**Check API status**

```bash
curl http://localhost:5000/api/v1/health
```

**Response:**
```json
{
  "status": "OK",
  "message": "UltraTech Connect API is running"
}
```

---

## 🚨 Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is invalid"
  }
}
```

### Error Codes
- `VALIDATION_ERROR` - Input validation failed (400)
- `NOT_FOUND` - Resource not found (404)
- `CONFLICT` - Resource already exists (409)
- `UNAUTHORIZED` - Authentication failed (401)
- `FORBIDDEN` - Authorization failed (403)
- `AI_PROVIDER_ERROR` - AI service error (503)
- `INTERNAL_SERVER_ERROR` - Server error (500)

---

## 🔒 Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (@, $, !, %, *, ?, &)

Example: `SecurePass@123`

---

## 🌐 Supported Languages

- `en` - English
- `hi` - Hindi
- `mr` - Marathi
- `ta` - Tamil
- `te` - Telugu
- `kn` - Kannada

---

## 📝 Notes

1. All timestamps are in ISO 8601 format
2. File uploads max size: 5MB
3. Allowed image formats: JPEG, PNG, GIF, WebP
4. Pagination default limit: 20, max: 100
5. Access tokens expire in 15 minutes
6. Refresh tokens expire in 7 days
7. OTP expires in 10 minutes

---

## 🚀 Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and configure
3. Install dependencies: `npm install`
4. Start MongoDB
5. Run: `npm run dev`
6. API will be available at `http://localhost:5000/api/v1`

---

*Last Updated: 2026-05-07*
