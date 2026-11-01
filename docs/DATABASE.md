# Inkly — Database Design

## 1. Introduction

This document describes the database design for **Inkly**.

Inkly will use **MongoDB** as its primary database. The application uses a document-oriented data model that fits well with the user and content-based nature of the platform.

The initial version will primarily store two types of data:

* Users
* Posts

The database design is intentionally simple and focused on the requirements of V1.

---

# 2. Database Technology

The project will use:

| Component           | Technology          |
| ------------------- | ------------------- |
| Database            | MongoDB             |
| Database Shell      | mongosh             |
| Backend Integration | Spring Data MongoDB |
| Database GUI        | MongoDB Compass     |
| Backend Language    | Java                |
| Backend Framework   | Spring Boot         |

The database and its collections can be created and managed using **mongosh**.

Spring Boot will connect to the same MongoDB database through **Spring Data MongoDB**.

---

# 3. Database Structure

The initial database will contain two main collections:

```text
Inkly Database
│
├── users
│
└── posts
```

### `users`

Stores information about registered Inkly users.

### `posts`

Stores content created by users.

---

# 4. User Collection

The `users` collection stores account and basic profile information.

A simplified document can look like:

```json
{
  "_id": ObjectId("..."),
  "username": "rahul",
  "email": "rahul@example.com",
  "password": "hashed-password",
  "bio": "I love photography",
  "profileImage": "image-url"
}
```

The exact profile fields can be adjusted according to the final frontend requirements.

---

# 5. User Fields

| Field          | Type     | Required | Description                    |
| -------------- | -------- | -------- | ------------------------------ |
| `_id`          | ObjectId | Yes      | Unique identifier for the user |
| `username`     | String   | Yes      | Unique username                |
| `email`        | String   | Yes      | User's email address           |
| `password`     | String   | Yes      | Securely stored password       |
| `bio`          | String   | No       | Short user description         |
| `profileImage` | String   | No       | Profile image URL/path         |

---

# 6. Post Collection

The `posts` collection stores the content created by Inkly users.

A post contains a title, rich-text content, featured image, status, author reference, and timestamps.

A simplified document can look like:

```json
{
  "_id": ObjectId("..."),
  "userId": ObjectId("..."),
  "title": "My First Post",
  "content": "<p>This is my first post on Inkly.</p>",
  "featuredImage": "https://example.com/image.jpg",
  "status": "ACTIVE",
  "createdAt": ISODate("2026-09-16T10:30:00Z"),
  "updatedAt": ISODate("2026-09-16T10:30:00Z")
}
```

---

# 7. Post Fields

| Field           | Type     | Required | Description                         |
| --------------- | -------- | -------- | ----------------------------------- |
| `_id`           | ObjectId | Yes      | Unique identifier for the post      |
| `userId`        | ObjectId | Yes      | ID of the user who created the post |
| `title`         | String   | Yes      | Title of the post                   |
| `content`       | String   | Yes      | Rich-text editor (RTE) content      |
| `featuredImage` | String   | No       | URL/path of the featured image      |
| `status`        | String   | Yes      | Post status: `ACTIVE` or `INACTIVE` |
| `createdAt`     | Date     | Yes      | Time when the post was created      |
| `updatedAt`     | Date     | Yes      | Time when the post was last updated |

---

# 8. Post Content

The `content` field will store content produced by the Rich Text Editor (RTE).

For example:

```html
<p>
  This is my <strong>first post</strong> on Inkly.
</p>
```

The exact format depends on the Rich Text Editor used by the React frontend.

MongoDB will store this content as a string.

The frontend will be responsible for displaying the formatted content appropriately.

---

# 9. Featured Image

The `featuredImage` field stores a reference to the featured image of a post.

Example:

```json
{
  "featuredImage": "https://example.com/images/post-1.jpg"
}
```

The field can also store a path or other reference depending on how image storage is implemented.

The actual image-storage approach can be finalized during implementation.

---

# 10. Post Status

Each post will have a `status` field.

The initial supported values are:

```text
ACTIVE
INACTIVE
```

### ACTIVE

The post is available for normal viewing.

### INACTIVE

The post is not considered active and should not normally appear in the public post listing.

Example:

```json
{
  "status": "ACTIVE"
}
```

The backend should use the status when retrieving posts for normal display.

---

# 11. Why Use Post Status?

Using a status field allows a post to be disabled without necessarily deleting its database document.

For example:

```text
Post
 ↓
status = ACTIVE
 ↓
Visible
```

or:

```text
Post
 ↓
status = INACTIVE
 ↓
Not shown in normal active-post listings
```

This also gives the project flexibility for future features such as content management or moderation.

---

# 12. User and Post Relationship

A user can create multiple posts.

Therefore, the relationship is:

```text
One User
   │
   ├── Post 1
   ├── Post 2
   ├── Post 3
   └── Post 4
```

The relationship can be represented as:

```text
users
  │
  │ _id
  │
  └──────────────┐
                 │
                 ↓
               posts
                 │
                 └── userId
```

Each post stores the ID of the user who created it.

---

# 13. Referencing Users in Posts

The post will store the user's ID rather than duplicating the complete user document.

### User

```json
{
  "_id": ObjectId("user123"),
  "username": "rahul",
  "email": "rahul@example.com"
}
```

### Post

```json
{
  "_id": ObjectId("post456"),
  "userId": ObjectId("user123"),
  "title": "My First Post",
  "content": "<p>Hello Inkly!</p>",
  "status": "ACTIVE"
}
```

This allows the backend to determine who created each post.

---

# 14. User Identifier

MongoDB will provide a unique `_id` for every user.

Example:

```text
User
_id: ObjectId("...")
username: rahul
```

The user ID will be used throughout the backend to identify the user and associate posts with their creator.

---

# 15. Ownership Verification

When a user attempts to update or delete a post, the backend should verify that the user owns that post.

Example:

```text
Authenticated User
       ↓
     userId
       ↓
Find Post
       ↓
Compare authenticated userId
with post.userId
       ↓
    Match?
    /    \
  Yes     No
   ↓       ↓
 Allow    Reject
```

This prevents users from modifying posts belonging to other users.

---

# 16. Retrieving Active Posts

Normal post retrieval should only return active posts.

Conceptually:

```text
GET /api/posts
       ↓
Find posts
where status = ACTIVE
       ↓
Return posts
       ↓
React displays posts
```

A MongoDB query would conceptually look like:

```javascript
db.posts.find({
  status: "ACTIVE"
})
```

Additional sorting, filtering, or pagination can be added later if required.

---

# 17. Retrieving a User's Posts

To retrieve posts created by a particular user:

```text
User ID
   ↓
Find posts where:
userId = User ID
   ↓
Return user's posts
```

Conceptually:

```javascript
db.posts.find({
  userId: ObjectId("...")
})
```

The backend can apply additional filtering based on the required screen.

---

# 18. Database Operations

## Users

The backend should support:

```text
Create User
Find User
Find User by Username
Find User by Email
Update User
```

---

## Posts

The backend should support:

```text
Create Post
Find Post
Find Active Posts
Find Posts by User
Update Post
Delete Post
```

Changing a post's status can also be supported:

```text
ACTIVE → INACTIVE
INACTIVE → ACTIVE
```

if required by the application.

---

# 19. Validation and Data Integrity

The backend should perform basic validation before storing data.

## User

* Username should not be empty.
* Email should be valid.
* Username should be unique.
* Email should be unique.
* Password should satisfy the defined minimum requirements.

## Post

* Title should not be empty.
* Content should not be empty.
* `userId` should identify a valid user.
* `status` should contain an allowed value.
* A post update should only be allowed for its owner.

---

# 20. Allowed Post Status Values

The application should use only the defined status values:

```text
ACTIVE
INACTIVE
```

The Java backend can represent these values using an enum.

For example:

```java
public enum PostStatus {
    ACTIVE,
    INACTIVE
}
```

This helps prevent accidental use of invalid status values in the application.

---

# 21. Unique User Fields

The following fields should be unique:

```text
username
email
```

This prevents multiple accounts from using the same username or email address.

MongoDB indexes can be used to enforce uniqueness.

---

# 22. Password Storage

Passwords should never be stored as plain text.

The flow should be:

```text
User enters password
       ↓
Spring Boot receives password
       ↓
Password is hashed
       ↓
Hashed password stored
       ↓
MongoDB
```

During login:

```text
User enters password
       ↓
Backend verifies password
against stored hash
       ↓
Authentication
```

A suitable password-hashing mechanism will be selected during authentication implementation.

---

# 23. Timestamps

Each post should contain:

* `createdAt`
* `updatedAt`

Example:

```json
{
  "createdAt": ISODate("2026-09-16T10:30:00Z"),
  "updatedAt": ISODate("2026-09-16T11:00:00Z")
}
```

### `createdAt`

Records when the post was originally created.

### `updatedAt`

Records when the post was last modified.

The backend can automatically manage these values during create and update operations.

---

# 24. Creating the Database Using mongosh

The Inkly database can be created using `mongosh`.

For example:

```javascript
use inkly
```

Collections can then be created:

```javascript
db.createCollection("users")
db.createCollection("posts")
```

The collections can be verified using:

```javascript
show collections
```

Expected result:

```text
posts
users
```

MongoDB also creates collections automatically when documents are first inserted, so explicitly creating them is optional.

---

# 25. Example User Document Using mongosh

A sample user document can be inserted using:

```javascript
db.users.insertOne({
  username: "rahul",
  email: "rahul@example.com",
  password: "hashed-password",
  bio: "I love photography",
  profileImage: "https://example.com/profile.jpg"
})
```

> The password shown here is only an example. Real passwords must be securely hashed by the backend before storage.

---

# 26. Example Post Document Using mongosh

A sample post can be inserted using:

```javascript
db.posts.insertOne({
  userId: ObjectId("USER_OBJECT_ID"),
  title: "My First Post",
  content: "<p>Hello from <strong>Inkly</strong>!</p>",
  featuredImage: "https://example.com/images/post.jpg",
  status: "ACTIVE",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

The `USER_OBJECT_ID` should be replaced with the actual user's MongoDB `_id`.

---

# 27. Basic Indexes

Basic indexes can be created using `mongosh`.

For users:

```javascript
db.users.createIndex(
  { username: 1 },
  { unique: true }
)

db.users.createIndex(
  { email: 1 },
  { unique: true }
)
```

For posts:

```javascript
db.posts.createIndex({ userId: 1 })

db.posts.createIndex({ status: 1 })

db.posts.createIndex({ createdAt: -1 })
```

These indexes support common operations such as finding users, retrieving a user's posts, filtering active posts, and sorting posts by creation time.

---

# 28. No Unnecessary Collections

The initial database should contain only the collections required by V1.

```text
inkly
│
├── users
└── posts
```

We do not currently need separate collections for:

```text
likes
comments
followers
notifications
messages
recommendations
```

These features are outside the V1 scope.

---

# 29. Future Database Expansion

If Inkly is expanded in the future, additional collections may be introduced.

For example:

```text
inkly
│
├── users
├── posts
│
├── comments        ← Future
├── likes           ← Future
├── follows         ← Future
├── notifications   ← Future
└── messages        ← Future
```

These collections are intentionally excluded from the current database design.

---

# 30. Final V1 Schema

The final V1 database structure is:

```text
┌─────────────────────────────┐
│           users             │
├─────────────────────────────┤
│ _id                         │
│ username                    │
│ email                       │
│ password                    │
│ bio                         │
│ profileImage                │
└──────────────┬──────────────┘
               │
               │ 1
               │
               │
               │ N
┌──────────────▼──────────────┐
│           posts             │
├─────────────────────────────┤
│ _id                         │
│ userId                      │
│ title                       │
│ content                     │
│ featuredImage               │
│ status                      │
│ createdAt                   │
│ updatedAt                   │
└─────────────────────────────┘
```

The relationship is:

```text
One User → Many Posts
```

---

# 31. Summary

The Inkly V1 database is intentionally simple.

It contains two primary collections:

```text
users
posts
```

The `users` collection stores account and profile information.

The `posts` collection stores:

```text
userId
title
content
featuredImage
status
createdAt
updatedAt
```

Posts are associated with users through `userId`.

MongoDB can be initialized and managed using `mongosh`, while Spring Boot and Spring Data MongoDB will handle database operations during application execution.

This structure provides everything required for the current Inkly V1 features while leaving room for future expansion.
