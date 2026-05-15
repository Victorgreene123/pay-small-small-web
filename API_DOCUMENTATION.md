
Below is the full documentation for the REST API endpoints, including request and response parameters.




### **1. Auth Module** (`/auth`)

| Endpoint | Method | Description | Auth | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `/register` | `POST` | Register a new user | No | `email, password, name` |
| `/login` | `POST` | User login | No | `email, password` |
| `/verify-email` | `POST` | Verify user email with OTP | No | `email, otp` |
| `/resend-otp` | `POST` | Resend verification OTP | No | `email` |
| `/forgot-password`| `POST` | Request password reset link | No | `email` |
| `/verify-otp` | `POST` | Verify password reset OTP | No | `email, otp` |
| `/reset-password` | `POST` | Set new password | No | `email, otp, newPassword` |
| `/refresh` | `POST` | Refresh access token | No | `refreshToken` |
| `/logout` | `POST` | Logout user | No | `refreshToken` |
| `/me` | `GET` | Get current user's profile | Yes | None |

---

### **2. User Module** (users)

| Endpoint | Method | Description | Auth | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `/edit-profile` | `PATCH` | Update user profile | Yes | `name` |
| `/update-password`| `PATCH` | Change password | Yes | `currentPassword, newPassword` |
| `/delete-account` | `DELETE`| Delete logged-in user account | Yes | None |
| `/delete-account-web`| `POST` | Delete account using credentials | No | `email, password` |

---

### **3. Split Module** (`/splits`)

| Endpoint | Method | Description | Auth | Request Body/Params |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `POST` | Create a new split group | Yes | `title, description, amount, participants[]` |
| `/me` | `GET` | Get all splits for current user | Yes | None |
| `/link/:link` | `GET` | Get split details by shareable link| No | `link` (param) |
| `/:id` | `PATCH` | Update split details | Yes | `id` (param), `title, description, amount` |
| `/:id` | `DELETE`| Delete a split | Yes | `id` (param) |

---

### **4. Form Module** (`/forms`)

| Endpoint | Method | Description | Auth | Request Body/Params |
| :--- | :--- | :--- | :--- | :--- |
| `/:splitId/fields` | `POST` | Create custom form fields | Yes | `splitId` (param), `fields[]` |
| `/:splitId/fields` | `GET` | Get fields for a split | No | `splitId` (param) |
| `/fields/:fieldId` | `PATCH` | Update a specific field | Yes | `fieldId` (param), `label, type, required` |
| `/fields/:fieldId` | `DELETE`| Delete a field | Yes | `fieldId` (param) |
| `/:splitId/participant/:participantId/submit` | `POST` | Submit form response | No | `splitId, participantId` (params), `data` |
| `/:splitId/results`| `GET` | Get all form results for a split | No | `splitId` (param) |

---

### **5. Wallet Module** (`/wallets`)

| Endpoint | Method | Description | Auth | Request Body/Params |
| :--- | :--- | :--- | :--- | :--- |
| `/:splitId` | `GET` | Get wallet data for a split | Yes | `splitId` (param) |
| `/:splitId/balance`| `GET` | Get current balance of a split | Yes | `splitId` (param) |
| `/:splitId/spend` | `POST` | Initiate withdrawal from wallet | Yes | `splitId` (param), `amount, description, bankCode, accountNumber, accountName` |
| `/finalize-spend` | `POST` | Finalize withdrawal with OTP | Yes | `transferCode, otp, walletId, amount` |

---

### **6. Payment Module** (`/payments`)

| Endpoint | Method | Description | Auth | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `/banks` | `GET` | Get list of supported banks | No | None |
| `/paystack-webhook`| `POST` | Handle Paystack events | No | (Paystack Payload) |

---

### **General Response Format**
Success responses typically follow this structure:
```json
{
  "success": true,
  "message": "Action description",
  "data": { ... }
}
```

---

### **Detailed Response Examples**

#### **1. Auth Responses**

**Register / Login** (`POST /auth/register`, `POST /auth/login`)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "cl...",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "accessToken": "ey...",
    "refreshToken": "ey..."
  }
}
```

**Verify Email** (`POST /auth/verify-email`)
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "accessToken": "ey...",
    "refreshToken": "ey..."
  }
}
```

#### **2. Split Responses**

**Create Split** (`POST /splits`)
```json
{
  "success": true,
  "message": "Split, Wallet and Form Fields created successfully",
  "data": {
    "id": "cl...",
    "title": "Road Trip",
    "totalAmount": 50000,
    "splitType": "SLOT_BASED",
    "status": "PENDING",
    "numberOfSlots": 5,
    "amountPerSlot": 10000,
    "minimumAmount": null,
    "shareCode": "split-171...",
    "createdById": "cl...",
    "createdAt": "2026-05-06T..."
  }
}
```

**Get My Splits** (`GET /splits/me`)
```json
{
  "success": true,
  "message": "Splits retrieved",
  "data": [
    {
      "id": "cl...",
      "title": "Lunch",
      "totalAmount": null,
      "splitType": "OPEN",
      "status": "ACTIVE",
      "shareCode": "split-...",
      "createdAt": "..."
    }
  ]
}
```

#### **3. Wallet Responses**

**Get Wallet Data** (`GET /wallets/:splitId`)
```json
{
  "success": true,
  "message": "Wallet data retrieved",
  "data": {
    "id": "cl...",
    "balance": 25000,
    "splitId": "cl...",
    "transactions": [
      {
        "id": "cl...",
        "type": "CREDIT",
        "amount": 5000,
        "description": "Payment from Jane",
        "createdAt": "..."
      }
    ]
  }
}
```

#### **4. Form Responses**

**Get Fields** (`GET /forms/:splitId/fields`)
```json
{
  "success": true,
  "message": "Fields retrieved",
  "data": [
    {
      "id": "cl...",
      "label": "T-Shirt Size",
      "type": "SELECT",
      "required": true,
      "options": ["S", "M", "L", "XL"]
    }
  ]
}
```

---

Error responses typically follow this structure:
```json
{
  "success": false,
  "message": "Error details"
}
```