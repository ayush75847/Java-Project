# Inkly — Feature Design

## 1. Introduction

This document describes the design and expected behavior of the main features of **Inkly**.

The purpose of this document is to define how users will interact with the application and how the major features will work before implementation begins.

The initial version of Inkly focuses on three main areas:

* User Management
* Profile Management
* Post Management

The feature design is intentionally kept simple so that the project remains manageable and understandable while demonstrating Java, Spring Boot, REST APIs, MongoDB, and React integration.

---

# 2. Feature Overview

The initial version of Inkly will contain the following major features:

| Feature            | Description                                        |
| ------------------ | -------------------------------------------------- |
| Registration       | Allows new users to create an account              |
| Login              | Allows registered users to access their account    |
| Profile            | Allows users to view their profile                 |
| Profile Management | Allows users to update their profile information   |
| Create Post        | Allows users to publish new content                |
| View Posts         | Allows users to browse available posts             |
| My Posts           | Allows users to view content created by themselves |
| Edit Post          | Allows users to update their own posts             |
| Delete Post        | Allows users to remove their own posts             |

---

# 3. User Registration

## 3.1 Purpose

The registration feature allows a new user to create an Inkly account.

## 3.2 User Flow

```text
User opens Registration page
        ↓
Enters registration details
        ↓
Frontend validates basic input
        ↓
Registration request sent to backend
        ↓
Backend validates data
        ↓
Check whether user already exists
        ↓
Create user
        ↓
Store user in MongoDB
        ↓
Return response
        ↓
User can proceed to Login
```

## 3.3 Input

The registration form may contain:

* Username
* Email
* Password

Additional profile fields can be added if required by the final UI.

## 3.4 System Behavior

The backend should:

1. Receive the registration request.
2. Validate the input.
3. Check for an existing user using the unique identifier.
4. Reject duplicate account information.
5. Securely process the password.
6. Create a new user.
7. Store the user in MongoDB.
8. Return an appropriate response.

## 3.5 Error Cases

Possible errors include:

* Required field missing
* Invalid email
* Invalid password
* Username already exists
* Email already exists
* Database error

---

# 4. User Login

## 4.1 Purpose

The login feature allows registered users to authenticate themselves.

## 4.2 User Flow

```text
User opens Login page
        ↓
Enters credentials
        ↓
Frontend sends login request
        ↓
Backend finds user
        ↓
Backend verifies credentials
        ↓
Authentication successful
        ↓
User receives authentication information
        ↓
User accesses protected features
```

## 4.3 Input

The login form will contain:

* Username or email
* Password

The exact login identifier can be finalized during backend implementation.

## 4.4 System Behavior

The backend should:

1. Receive login credentials.
2. Find the corresponding user.
3. Verify the password.
4. Reject invalid credentials.
5. Create or return the required authentication information.
6. Allow the authenticated user to access protected operations.

## 4.5 Error Cases

Possible errors include:

* User does not exist
* Incorrect password
* Missing credentials
* Invalid request
* Authentication failure

---

# 5. User Profile

## 5.1 Purpose

The profile feature allows users to view their account information.

## 5.2 User Flow

```text
User logs in
      ↓
Opens Profile
      ↓
Frontend requests profile data
      ↓
Spring Boot API processes request
      ↓
User data retrieved from MongoDB
      ↓
Profile data returned
      ↓
Frontend displays profile
```

## 5.3 Profile Information

The profile can contain basic information such as:

* Username
* Email
* Profile image, if implemented
* Bio, if implemented
* Other basic profile information required by the frontend

Only fields that are actually required by the final application should be implemented.

---

# 6. Profile Management

## 6.1 Purpose

Profile management allows users to update editable information associated with their account.

## 6.2 User Flow

```text
User opens Profile
      ↓
Selects Edit Profile
      ↓
Updates profile information
      ↓
Submits changes
      ↓
Frontend sends request
      ↓
Backend validates request
      ↓
User information updated
      ↓
MongoDB updated
      ↓
Updated profile displayed
```

## 6.3 Rules

* Only authenticated users can update their profile.
* A user can update only their own profile.
* Editable fields should be validated.
* Unique fields should not create conflicts with another user.
* Password changes, if implemented, should be handled separately from normal profile updates.

---

# 7. Create Post

## 7.1 Purpose

The create post feature allows authenticated users to publish content on Inkly.

## 7.2 User Flow

```text
User logs in
      ↓
Opens Create Post
      ↓
Enters post content
      ↓
Submits post
      ↓
Frontend sends request
      ↓
Backend validates content
      ↓
Post associated with logged-in user
      ↓
Post saved in MongoDB
      ↓
Success response returned
      ↓
Post appears in the application
```

## 7.3 Post Information

A basic post may contain:

* Post ID
* Author/User ID
* Content
* Creation timestamp
* Updated timestamp

Additional fields should only be added if they are required by the actual application.

## 7.4 Rules

* Only authenticated users can create posts.
* Post content should not be empty.
* The post should be associated with the user who created it.
* The backend should generate the required post identifier.
* The post should be stored in MongoDB.

---

# 8. View Posts

## 8.1 Purpose

The view posts feature allows users to retrieve and read content available on Inkly.

## 8.2 User Flow

```text
User opens Posts/Home page
        ↓
Frontend requests posts
        ↓
Spring Boot receives request
        ↓
Backend retrieves posts from MongoDB
        ↓
Posts returned through REST API
        ↓
React displays posts
```

## 8.3 Post Display

Each post can display:

* Author information
* Post content
* Creation time
* Other basic information required by the UI

The initial version does not require social interaction features such as:

* Likes
* Comments
* Shares
* Followers

These are reserved for future scope.

---

# 9. My Posts

## 9.1 Purpose

The My Posts feature allows a user to view the content they have created.

## 9.2 User Flow

```text
User opens My Posts
       ↓
Frontend requests user's posts
       ↓
Backend identifies authenticated user
       ↓
Posts belonging to that user are retrieved
       ↓
Data returned to frontend
       ↓
User's posts displayed
```

## 9.3 Rules

* Only the authenticated user's posts should be returned.
* The backend should use the authenticated user's identity when filtering posts.
* Users should be able to manage their own posts from this section.

---

# 10. Edit Post

## 10.1 Purpose

The edit post feature allows users to modify content they previously created.

## 10.2 User Flow

```text
User opens My Posts
       ↓
Selects Edit
       ↓
Existing post content displayed
       ↓
User modifies content
       ↓
Submits changes
       ↓
Backend validates request
       ↓
Backend verifies post ownership
       ↓
Post updated in MongoDB
       ↓
Updated post returned/displayed
```

## 10.3 Rules

* Only the post owner can edit a post.
* The post must exist.
* Updated content must pass validation.
* The backend must verify ownership rather than relying only on frontend restrictions.

---

# 11. Delete Post

## 11.1 Purpose

The delete post feature allows users to remove content they have created.

## 11.2 User Flow

```text
User opens My Posts
       ↓
Selects Delete
       ↓
Confirmation shown
       ↓
User confirms
       ↓
Delete request sent to backend
       ↓
Backend verifies ownership
       ↓
Post removed from MongoDB
       ↓
Success response returned
       ↓
Frontend updates post list
```

## 11.3 Rules

* Only the post owner can delete a post.
* The post must exist.
* The backend must verify ownership.
* Deleted posts should no longer appear in normal post retrieval.

---

# 12. Authorization and Ownership

Authorization is required for operations that modify user-specific data.

The basic ownership model is:

```text
User
 │
 ├── Profile
 │
 └── Posts
       ├── Post 1
       ├── Post 2
       └── Post 3
```

For operations such as editing or deleting a post, the backend should verify:

```text
Authenticated User ID
        ↓
Compare with Post Author ID
        ↓
     Match?
      /   \
    Yes    No
     ↓      ↓
 Allow    Reject
```

The frontend should provide appropriate controls to the user, but the backend remains responsible for enforcing ownership rules.

---

# 13. Frontend and Backend Interaction

Inkly will use REST APIs to communicate between the React frontend and Spring Boot backend.

The general interaction will be:

```text
┌──────────────────┐
│   React Frontend │
└────────┬─────────┘
         │
         │ HTTP Request
         ↓
┌──────────────────┐
│ Spring Boot API  │
└────────┬─────────┘
         │
         │ Business Logic
         ↓
┌──────────────────┐
│ Spring Data      │
│ MongoDB          │
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│     MongoDB      │
└──────────────────┘
```

The backend processes requests, performs validation and business logic, communicates with MongoDB, and sends a response back to the frontend.

---

# 14. Feature Dependency

Some features depend on other features being completed first.

```text
Registration
     ↓
  Login
     ↓
Authentication
     ↓
 ┌───┴───────────────┐
 ↓                   ↓
Profile           Create Post
 ↓                   ↓
Profile Update   View Posts
                     ↓
                  My Posts
                     ↓
              ┌──────┴──────┐
              ↓             ↓
          Edit Post      Delete Post
```

This dependency helps determine the implementation order during backend development.

---

# 15. Feature-to-Technology Mapping

| Feature        | React             | Spring Boot                   | MongoDB                 |
| -------------- | ----------------- | ----------------------------- | ----------------------- |
| Registration   | Registration form | Registration API + validation | User document           |
| Login          | Login form        | Authentication API            | User lookup             |
| Profile        | Profile UI        | Profile API                   | User document           |
| Profile Update | Edit profile UI   | Update API                    | User update             |
| Create Post    | Post form         | Create Post API               | Post document           |
| View Posts     | Post display      | Get Posts API                 | Post retrieval          |
| My Posts       | User post list    | User Posts API                | Filtered post retrieval |
| Edit Post      | Edit form         | Update Post API               | Post update             |
| Delete Post    | Delete action     | Delete Post API               | Post deletion           |

---

# 16. Features Outside V1

The following are deliberately not included in the current feature design:

* Likes
* Comments
* Follow/followers
* Notifications
* Private messaging
* Recommendations
* Advanced search
* Advanced moderation
* Complex social interactions

These may be designed later as separate features if Inkly is extended beyond V1.

---

# 17. Design Principles

The feature design follows these principles:

### Keep It Simple

Features should be simple enough for the project team to understand and explain.

### Backend Validation

Important rules should be enforced by the backend rather than depending only on the frontend.

### Clear Responsibilities

Each part of the application should have a clear responsibility:

* React handles the user interface.
* Controllers handle HTTP requests.
* Services handle application/business logic.
* Repositories handle database access.
* MongoDB stores application data.

### Build Core Features First

The project should prioritize completing the core user, profile, and post functionality before adding optional features.

### Avoid Unnecessary Complexity

The project is intended to demonstrate practical Java Spring Boot and full-stack concepts. Enterprise-level architecture and unnecessary abstractions are not required.

---

# 18. Expected Feature Set for V1

The completed V1 application should support the following basic workflow:

```text
Register
   ↓
Login
   ↓
View Profile
   ↓
Update Profile
   ↓
Create Post
   ↓
View Posts
   ↓
View My Posts
   ↓
Edit Own Post
   ↓
Delete Own Post
```

This workflow represents the core feature set that will be implemented and demonstrated in the initial version of Inkly.
