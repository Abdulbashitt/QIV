# QIV API Reference & JavaScript API

## Client-Side API (Browser)

### Authentication State

```javascript
// Check if user is logged in
const isLoggedIn = window.qivAuth.isLoggedIn();

// Get current user object
const user = window.qivAuth.getCurrentUser();
// Returns: {
//   id: "google_1234567890_abc123",
//   email: "user@example.com",
//   provider: "google|apple|email",
//   name: "John Doe",
//   createdAt: "2026-02-02T10:30:00.000Z",
//   lastLogin: "2026-02-02T10:30:00.000Z",
//   notificationsEnabled: true
// }

// Open authentication modal
window.qivAuth.openAuthModal();

// Close authentication modal
window.qivAuth.closeAuthModal();

// Logout
window.qivAuth.logout();

// Request notification permission
window.qivAuth.requestNotificationPermission();

// Subscribe to push notifications
window.qivAuth.subscribeToNotifications();
```

### Download Management

```javascript
// Trigger download (checks auth automatically)
window.handleDownload(imageUrl);

// The function will:
// 1. Check if user is logged in
// 2. If not logged in: show auth modal
// 3. If logged in: fetch and download file
// 4. Show toast notification with status

// Example:
window.handleDownload('https://example.com/image.webp');
```

### Share Management

```javascript
// Trigger share (works for everyone)
window.handleShare(imageUrl);

// The function will:
// 1. Use native share API if available (mobile)
// 2. Fall back to clipboard copy on desktop
// 3. Show toast notification with status

// Example:
window.handleShare('https://example.com/image.webp');
```

### UI Notifications

```javascript
// Show temporary toast message
showToast(message, timeout);

// Examples:
showToast('✅ Download started!', 2000);
showToast('❌ Login required', 2500);
```

---

## Backend API Endpoints

### 1. User Registration

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "provider": "google",
  "name": "John Doe",
  "externalId": "google_user_123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "qiv_user_123",
    "email": "user@example.com",
    "provider": "google",
    "name": "John Doe",
    "createdAt": "2026-02-02T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Status Codes:**
- `201`: User created successfully
- `200`: User already exists
- `400`: Invalid input
- `409`: Email already registered with different provider

---

### 2. User Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "provider": "google"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "qiv_user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "lastLogin": "2026-02-02T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Status Codes:**
- `200`: Login successful
- `404`: User not found
- `401`: Invalid credentials

---

### 3. Push Notification Subscription

**Endpoint:** `POST /api/notifications/subscribe`

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "subscription": {
    "endpoint": "https://fcm.googleapis.com/fcm/send/...",
    "keys": {
      "p256dh": "...",
      "auth": "..."
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription saved"
}
```

**Status Codes:**
- `200`: Subscription successful
- `400`: Invalid subscription
- `401`: Unauthorized

---

### 4. Send Push Notification

**Endpoint:** `POST /api/notifications/send`

**Request Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "🎉 New QIV Wallpaper!",
  "body": "Check out the latest alien designs",
  "imageUrl": "https://example.com/wallpaper.webp",
  "wallpaperId": "wall_123",
  "recipientIds": ["qiv_user_123", "qiv_user_456"]
}
```

**Response:**
```json
{
  "success": true,
  "sent": 1250,
  "failed": 3,
  "message": "Notification delivered to 1250 users"
}
```

**Status Codes:**
- `200`: Notification sent
- `400`: Invalid payload
- `401`: Unauthorized
- `500`: Server error

---

### 5. Broadcast Notification (To All Users)

**Endpoint:** `POST /api/notifications/broadcast`

**Request Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "🎉 Major QIV Update!",
  "body": "We've added 50 new wallpapers",
  "imageUrl": "https://example.com/banner.webp",
  "actionUrl": "/wallpapers?new=true"
}
```

**Response:**
```json
{
  "success": true,
  "totalSent": 5000,
  "failedCount": 12
}
```

---

### 6. Get User Profile

**Endpoint:** `GET /api/users/profile`

**Request Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "qiv_user_123",
  "email": "user@example.com",
  "name": "John Doe",
  "provider": "google",
  "notificationsEnabled": true,
  "createdAt": "2026-02-02T10:30:00.000Z",
  "lastLogin": "2026-02-02T10:30:00.000Z"
}
```

---

### 7. Get User Downloads

**Endpoint:** `GET /api/users/downloads`

**Request Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `limit`: Number of downloads (default: 20)
- `offset`: Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "downloads": [
    {
      "wallpaperId": "wall_123",
      "wallpaperTitle": "Alien on Skateboard",
      "downloadedAt": "2026-02-02T10:30:00.000Z",
      "imageUrl": "https://..."
    }
  ],
  "total": 45,
  "limit": 20,
  "offset": 0
}
```

---

### 8. Track Download

**Endpoint:** `POST /api/wallpapers/{wallpaperId}/download`

**Request Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "downloads": 1250
}
```

---

### 9. Update User Preferences

**Endpoint:** `PATCH /api/users/preferences`

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "notificationsEnabled": true,
  "emailNotifications": false
}
```

**Response:**
```json
{
  "success": true,
  "preferences": {
    "notificationsEnabled": true,
    "emailNotifications": false
  }
}
```

---

### 10. Logout

**Endpoint:** `POST /api/auth/logout`

**Request Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_EMAIL",
    "message": "Email format is invalid",
    "statusCode": 400
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `INVALID_EMAIL` | 400 | Email format invalid |
| `INVALID_INPUT` | 400 | Missing or invalid fields |
| `USER_EXISTS` | 409 | User already registered |
| `USER_NOT_FOUND` | 404 | User doesn't exist |
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `SUBSCRIPTION_ERROR` | 400 | Invalid push subscription |
| `SERVER_ERROR` | 500 | Internal server error |

---

## Authentication

### JWT Token Format

Tokens are included in responses and should be stored:

```javascript
// Frontend: Store token
localStorage.setItem('qiv_auth_token', response.token);

// Frontend: Use token in requests
const headers = {
  'Authorization': `Bearer ${localStorage.getItem('qiv_auth_token')}`
};
```

### Token Payload Example

```json
{
  "iat": 1643788200,
  "exp": 1643874600,
  "sub": "qiv_user_123",
  "email": "user@example.com",
  "provider": "google"
}
```

---

## Rate Limiting

All endpoints are rate limited:

- **Standard**: 100 requests/hour per IP
- **Auth endpoints**: 10 requests/hour per IP
- **Notifications**: 50 requests/hour per user

Headers returned with each response:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1643788200
```

---

## CORS Configuration

```
Access-Control-Allow-Origin: https://yourdomain.com
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

---

## Webhook Events

Subscribe to backend events via webhook:

### Webhook: User Registered
```json
{
  "event": "user.registered",
  "timestamp": "2026-02-02T10:30:00.000Z",
  "data": {
    "userId": "qiv_user_123",
    "email": "user@example.com",
    "provider": "google"
  }
}
```

### Webhook: Download Started
```json
{
  "event": "wallpaper.downloaded",
  "timestamp": "2026-02-02T10:30:00.000Z",
  "data": {
    "userId": "qiv_user_123",
    "wallpaperId": "wall_123",
    "downloadUrl": "https://..."
  }
}
```

---

## Example Implementation

### Node.js/Express Backend

```javascript
// auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Register user
router.post('/register', async (req, res) => {
  const { email, provider, name } = req.body;
  
  // Check if user exists
  let user = await User.findOne({ email, provider });
  if (!user) {
    user = await User.create({ email, provider, name });
  }
  
  const token = jwt.sign(
    { sub: user.id, email: user.email, provider },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  res.json({ success: true, user, token });
});

// Get profile
router.get('/profile', authenticate, async (req, res) => {
  const user = await User.findById(req.user.sub);
  res.json(user);
});

module.exports = router;
```

### Subscribe to Push

```javascript
// notifications.js
router.post('/subscribe', authenticate, async (req, res) => {
  const { subscription } = req.body;
  
  // Save subscription
  await Subscription.create({
    userId: req.user.sub,
    subscription: JSON.stringify(subscription)
  });
  
  res.json({ success: true });
});
```

### Send Push Notification

```javascript
// wallpapers.js
const webpush = require('web-push');

router.post('/broadcast', authenticate, async (req, res) => {
  const { title, body, imageUrl } = req.body;
  
  const subscriptions = await Subscription.find({ userId: req.user.sub });
  
  for (const sub of subscriptions) {
    const parsed = JSON.parse(sub.subscription);
    
    await webpush.sendNotification(parsed, JSON.stringify({
      title,
      body,
      icon: imageUrl,
      badge: imageUrl
    })).catch(err => console.error(err));
  }
  
  res.json({ success: true, sent: subscriptions.length });
});
```

---

**Last Updated**: February 2, 2026
**API Version**: 1.0.0
