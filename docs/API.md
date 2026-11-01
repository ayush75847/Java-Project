# Inkly — API Documentation

## 1. Introduction

This document defines the REST API for **Inkly**.

The API is provided by the Java Spring Boot backend and is consumed by the React frontend.

The backend is responsible for:

* Receiving HTTP requests
* Validating request data
* Processing application logic
* Authenticating users
* Checking authorization
* Communicating with MongoDB
* Returning JSON responses

The initial API focuses on:

* User registration
* User login
* User profile
* Profile management
* Post creation
* Post retrieval
* Post management

---

# 2. API Base URL

During local development, the backend will run on a local server.

The base URL will initially be:

```text
http://localhost:8080
```

API endpoints will use the `/api` prefix.

Example:

```text
http://localhost:8080/api/posts
```

The port can be changed through the Spring Boot configuration if required.

---

# 3. API Communication

The frontend and backend will communicate using:

* HTTP
* REST
* JSON

General flow:

```text
React
  ↓
HTTP Request
  ↓
Spring Boot REST API
  ↓
Java Logic
  ↓
MongoDB
  ↓
JSON Response
  ↓
React
```

---

# 4. HTTP Methods

Inkly will use standard HTTP methods.

| Method   | Purpose                          |
| -------- | -------------------------------- |
| `GET`    | Retrieve data                    |
| `POST`   | Create data or perform an action |
| `PUT`    | Update existing data             |
| `DELETE` | Delete data                      |

---

# 5. API Response Format

Responses should generally be returned as JSON.

A successful response may look like:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

An error response may look like:

```json
{
  "success": false,
  "message": "Post not found"
}
```

The exact response structure can be simplified or adjusted during implementation.

---

# 6. Authentication APIs

## 6.1 Register User

Creates a new Inkly user account.

### Endpoint

```text
POST /api/auth/register
```

### Request Body

```json
{
  "username": "rahul",
  "email": "rahul@example.com",
  "password": "password123"
}
```

### Success Response

```text
HTTP 201 Created
```

Example:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "64abc123",
    "username": "rahul",
    "email": "rahul@example.com"
  }
}
```

The password should not be returned in the response.

### Possible Errors

```text
400 Bad Request
409 Conflict
500 Internal Server Error
```

Examples:

* Invalid input
* Username already exists
* Email already exists
* Database error

---

# 7. Login User

Authenticates an existing user.

### Endpoint

```text
POST /api/auth/login
```

### Request Body

```json
{
  "email": "rahul@example.com",
  "password": "password123"
}
```

### Success Response

```text
HTTP 200 OK
```

Example:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "authentication-token",
    "user": {
      "id": "64abc123",
      "username": "rahul",
      "email": "rahul@example.com"
    }
  }
}
```

The exact authentication mechanism and token implementation will be finalized during backend development.

### Possible Errors

```text
400 Bad Request
401 Unauthorized
500 Internal Server Error
```

---

# 8. User Profile APIs

## 8.1 Get User Profile

Retrieves information about a user.

### Endpoint

```text
GET /api/users/{userId}
```

### Example

```text
GET /api/users/64abc123
```

### Success Response

```text
HTTP 200 OK
```

Example:

```json
{
  "success": true,
  "data": {
    "id": "64abc123",
    "username": "rahul",
    "email": "rahul@example.com",
    "bio": "I love photography",
    "profileImage": "https://example.com/profile.jpg"
  }
}
```

The password must never be included in the response.

### Possible Errors

```text
400 Bad Request
404 Not Found
500 Internal Server Error
```

---

# 9. Update User Profile

Updates editable information for a user.

### Endpoint

```text
PUT /api/users/{userId}
```

### Example

```text
PUT /api/users/64abc123
```

### Request Body

```json
{
  "username": "rahul",
  "bio": "Photography and travel",
  "profileImage": "https://example.com/new-profile.jpg"
}
```

### Success Response

```text
HTTP 200 OK
```

Example:

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "64abc123",
    "username": "rahul",
    "email": "rahul@example.com",
    "bio": "Photography and travel",
    "profileImage": "https://example.com/new-profile.jpg"
  }
}
```

### Possible Errors

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

---

# 10. Post APIs

## 10.1 Create Post

Creates a new post for the authenticated user.

### Endpoint

```text
POST /api/posts
```

### Authentication

Required.

### Request Body

```json
{
  "title": "My First Post",
  "content": "<p>Hello from <strong>Inkly</strong>!</p>",
  "featuredImage": "https://example.com/post.jpg"
}
```

The backend will associate the post with the authenticated user.

The frontend should not be trusted to determine the post owner.

### Success Response

```text
HTTP 201 Created
```

Example:

```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "id": "post123",
    "userId": "64abc123",
    "title": "My First Post",
    "content": "<p>Hello from <strong>Inkly</strong>!</p>",
    "featuredImage": "https://example.com/post.jpg",
    "status": "ACTIVE",
    "createdAt": "2026-09-16T10:30:00Z",
    "updatedAt": "2026-09-16T10:30:00Z"
  }
}
```

### Possible Errors

```text
400 Bad Request
401 Unauthorized
500 Internal Server Error
```

---

# 11. Get Active Posts

Retrieves posts that are currently active.

### Endpoint

```text
GET /api/posts
```

### Authentication

Not necessarily required for public posts.

### Success Response

```text
HTTP 200 OK
```

Example:

```json
{
  "success": true,
  "data": [
    {
      "id": "post123",
      "userId": "64abc123",
      "title": "My First Post",
      "content": "<p>Hello from Inkly!</p>",
      "featuredImage": "https://example.com/post.jpg",
      "status": "ACTIVE",
      "createdAt": "2026-09-16T10:30:00Z",
      "updatedAt": "2026-09-16T10:30:00Z"
    }
  ]
}
```

The backend should normally return only:

```text
status = ACTIVE
```

posts for the public post feed.

### Possible Errors

```text
500 Internal Server Error
```

---

# 12. Get Single Post

Retrieves a specific post.

### Endpoint

```text
GET /api/posts/{postId}
```

### Example

```text
GET /api/posts/post123
```

### Success Response

```text
HTTP 200 OK
```

Example:

```json
{
  "success": true,
  "data": {
    "id": "post123",
    "userId": "64abc123",
    "title": "My First Post",
    "content": "<p>Hello from Inkly!</p>",
    "featuredImage": "https://example.com/post.jpg",
    "status": "ACTIVE",
    "createdAt": "2026-09-16T10:30:00Z",
    "updatedAt": "2026-09-16T10:30:00Z"
  }
}
```

### Possible Errors

```text
404 Not Found
500 Internal Server Error
```

---

# 13. Get My Posts

Retrieves posts created by the authenticated user.

### Endpoint

```text
GET /api/posts/my
```

### Authentication

Required.

### Success Response

```text
HTTP 200 OK
```

Example:

```json
{
  "success": true,
  "data": [
    {
      "id": "post123",
      "userId": "64abc123",
      "title": "My First Post",
      "content": "<p>Hello from Inkly!</p>",
      "featuredImage": "https://example.com/post.jpg",
      "status": "ACTIVE",
      "createdAt": "2026-09-16T10:30:00Z",
      "updatedAt": "2026-09-16T10:30:00Z"
    }
  ]
}
```

The backend should determine the user from the authentication information rather than accepting an arbitrary user ID from the frontend.

---

# 14. Update Post

Updates an existing post.

### Endpoint

```text
PUT /api/posts/{postId}
```

### Authentication

Required.

### Example

```text
PUT /api/posts/post123
```

### Request Body

```json
{
  "title": "Updated Post Title",
  "content": "<p>This is the updated content.</p>",
  "featuredImage": "https://example.com/new-image.jpg",
  "status": "ACTIVE"
}
```

### Backend Rules

The backend should:

1. Verify that the post exists.
2. Identify the authenticated user.
3. Check that the user owns the post.
4. Validate the updated data.
5. Update the post.
6. Update `updatedAt`.
7. Save the changes to MongoDB.

### Success Response

```text
HTTP 200 OK
```

Example:

```json
{
  "success": true,
  "message": "Post updated successfully",
  "data": {
    "id": "post123",
    "userId": "64abc123",
    "title": "Updated Post Title",
    "content": "<p>This is the updated content.</p>",
    "featuredImage": "https://example.com/new-image.jpg",
    "status": "ACTIVE",
    "createdAt": "2026-09-16T10:30:00Z",
    "updatedAt": "2026-09-16T11:00:00Z"
  }
}
```

### Possible Errors

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
500 Internal Server Error
```

---

# 15. Delete Post

Deletes an existing post.

### Endpoint

```text
DELETE /api/posts/{postId}
```

### Authentication

Required.

### Example

```text
DELETE /api/posts/post123
```

### Backend Rules

The backend should:

1. Verify that the post exists.
2. Identify the authenticated user.
3. Check post ownership.
4. Delete the post.
5. Return an appropriate response.

### Success Response

```text
HTTP 200 OK
```

Example:

```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

### Possible Errors

```text
401 Unauthorized
403 Forbidden
404 Not Found
500 Internal Server Error
```

---

# 16. Post Status Management

Posts support two statuses:

```text
ACTIVE
INACTIVE
```

The status can be changed through the post update operation.

Example:

```json
{
  "title": "My Post",
  "content": "<p>Post content</p>",
  "featuredImage": "image-url",
  "status": "INACTIVE"
}
```

An inactive post should normally not appear in the public active-post listing.

---

# 17. API Endpoint Summary

| Method   | Endpoint              | Authentication | Purpose          |
| -------- | --------------------- | -------------- | ---------------- |
| `POST`   | `/api/auth/register`  | No             | Register user    |
| `POST`   | `/api/auth/login`     | No             | Login user       |
| `GET`    | `/api/users/{userId}` | Optional       | Get user profile |
| `PUT`    | `/api/users/{userId}` | Yes            | Update profile   |
| `POST`   | `/api/posts`          | Yes            | Create post      |
| `GET`    | `/api/posts`          | No/Optional    | Get active posts |
| `GET`    | `/api/posts/{postId}` | No/Optional    | Get single post  |
| `GET`    | `/api/posts/my`       | Yes            | Get user's posts |
| `PUT`    | `/api/posts/{postId}` | Yes            | Update own post  |
| `DELETE` | `/api/posts/{postId}` | Yes            | Delete own post  |

---

# 18. Authentication Header

For protected APIs, the frontend will send authentication information with the request.

If token-based authentication is implemented, the request can use:

```http
Authorization: Bearer <token>
```

Example:

```http
GET /api/posts/my
Authorization: Bearer eyJhbGciOi...
```

The exact implementation will be finalized during the authentication phase.

---

# 19. Common HTTP Status Codes

The API will use standard HTTP status codes.

| Status | Meaning                                      |
| -----: | -------------------------------------------- |
|  `200` | Request successful                           |
|  `201` | Resource successfully created                |
|  `400` | Invalid request                              |
|  `401` | Authentication required or failed            |
|  `403` | User is not allowed to perform the operation |
|  `404` | Resource not found                           |
|  `409` | Conflict, such as duplicate username/email   |
|  `500` | Unexpected server error                      |

---

# 20. API Validation

The backend should validate incoming requests.

## Registration

```text
username → required
email → required + valid format
password → required
```

## Login

```text
email → required
password → required
```

## Profile

```text
username → valid if provided
bio → valid if provided
profileImage → valid if provided
```

## Post

```text
title → required
content → required
featuredImage → optional
status → ACTIVE / INACTIVE
```

---

# 21. API Security Rules

The following rules should be enforced by the backend:

### Rule 1 — Password Protection

Passwords should never be returned through APIs.

### Rule 2 — Authentication

Protected operations require an authenticated user.

### Rule 3 — Post Ownership

Only the owner of a post can update or delete it.

### Rule 4 — User Ownership

A user should only be able to update their own profile.

### Rule 5 — Backend Validation

Important validation rules must be enforced by the backend.

### Rule 6 — Database Protection

The React frontend should never connect directly to MongoDB.

---

# 22. API Testing

During backend development, APIs should first be tested using **Postman**.

Example testing sequence:

```text
1. Register user
       ↓
2. Login user
       ↓
3. Obtain authentication information
       ↓
4. Create post
       ↓
5. Get posts
       ↓
6. Get my posts
       ↓
7. Update post
       ↓
8. Delete post
```

Profile APIs should also be tested independently.

Only after the APIs are working correctly should they be fully integrated with the React frontend.

---

# 23. API Development Principle

The API should remain simple and focused on the actual requirements of Inkly V1.

The project does not require endpoints for features that are outside the current scope.

The following are intentionally excluded:

```text
Likes
Comments
Followers
Notifications
Messaging
Recommendations
```

These can be added later if Inkly is expanded.

---

# 24. Final API Flow

The overall API communication can be summarized as:

```text
                  React Frontend
                        │
                        │ HTTP + JSON
                        ↓
                Spring Boot REST API
                        │
             ┌──────────┼──────────┐
             ↓          ↓          ↓
           Auth       Users       Posts
             │          │          │
             └──────────┼──────────┘
                        ↓
                   Service Layer
                        ↓
                 Repository Layer
                        ↓
                     MongoDB
```

The API layer provides a clear boundary between the React frontend and the Java backend.

---

# 25. V1 API Checklist

The following endpoints should be implemented for the first working version:

* [ ] `POST /api/auth/register`
* [ ] `POST /api/auth/login`
* [ ] `GET /api/users/{userId}`
* [ ] `PUT /api/users/{userId}`
* [ ] `POST /api/posts`
* [ ] `GET /api/posts`
* [ ] `GET /api/posts/{postId}`
* [ ] `GET /api/posts/my`
* [ ] `PUT /api/posts/{postId}`
* [ ] `DELETE /api/posts/{postId}`

Once these endpoints are implemented and tested, the main V1 backend functionality will be covered.
