# Inkly — Development Roadmap

## 1. Purpose

This document is the **step-by-step development roadmap for the Inkly project**.

The purpose of this roadmap is not only to divide the project into weeks, but to define the actual order in which we will **learn, build, test, and complete** the application.

We will follow this roadmap from beginning to end.

The project will be developed incrementally so that each stage gives us the knowledge and working components required for the next stage.

---

# 2. Project Development Approach

Inkly will be developed using a simple and practical approach:

```text
Learn → Build → Test → Understand → Continue
```

We will avoid trying to build everything at once.

The main development flow will be:

```text
Project Understanding
        ↓
Java Fundamentals
        ↓
Spring Boot Fundamentals
        ↓
MongoDB
        ↓
Backend Development
        ↓
Frontend Development
        ↓
Full-Stack Integration
        ↓
Testing & Improvement
        ↓
Final Project
```

The main rule is:

> **Complete and understand the core features before adding extra features.**

---

# 3. V1 Features

The first version of Inkly will focus on:

### User Features

* User registration
* User login
* Basic authentication
* View profile
* Update profile

### Post Features

* Create post
* View posts
* View individual post
* View own posts
* Update own post
* Delete own post
* Activate/deactivate post

### Technical Features

* React frontend
* Java Spring Boot backend
* REST APIs
* MongoDB database
* Spring Data MongoDB
* Basic validation
* Basic error handling
* Frontend-backend integration

---

# 4. Future Scope

The following features are **not part of V1** and will not be required for the initial project:

* Likes
* Comments
* Follow/followers
* Notifications
* Private messaging
* Recommendations
* Advanced search
* Hashtags/trending
* Bookmarks
* Admin dashboard
* Advanced moderation

These features may be added later if there is enough time.

---

# 5. Eight-Week Roadmap

## Week 1 — Project & Web Fundamentals

### Goal

Understand what we are building and learn the basic concepts required to understand how the frontend, backend, database, and APIs communicate.

### Learn

* What a web application is
* Frontend vs backend
* Client-server architecture
* HTTP basics
* HTTP methods

  * GET
  * POST
  * PUT
  * DELETE
* HTTP status codes
* REST API basics
* JSON
* Request and response
* URL and endpoints
* Basic Git and GitHub workflow

### Project Work

* Finalize project scope
* Understand Inkly features
* Set up Git repository
* Create project folder structure
* Create documentation
* Understand the existing React frontend
* Understand the planned Spring Boot backend
* Understand the MongoDB database structure

### Documents

Complete:

```text
docs/
├── PROJECT_OVERVIEW.md
├── REQUIREMENTS.md
├── FEATURE_DESIGN.md
├── ARCHITECTURE.md
├── DATABASE.md
├── API.md
└── ROADMAP.md
```

### Checkpoint

Before moving to Week 2, we should be able to explain:

```text
React
  ↓
HTTP Request
  ↓
Spring Boot REST API
  ↓
MongoDB
```

and understand what each part does.

### Done When

* [ ] Project scope is finalized
* [ ] V1 features are understood
* [ ] Git repository is ready
* [ ] Documentation structure is ready
* [ ] REST and HTTP basics are understood
* [ ] Overall Inkly architecture is understood

---

# Week 2 — Java & Spring Boot

### Goal

Learn the Java and Spring Boot concepts required to create the Inkly backend.

### Learn Java

Focus only on the concepts needed for the project:

* Classes and objects
* Variables and data types
* Methods
* Constructors
* Encapsulation
* Access modifiers
* Inheritance basics
* Interfaces
* Lists and collections
* Exceptions
* Enums
* Basic Java syntax
* Basic OOP concepts

### Learn Spring Boot

* What Spring Boot is
* Spring Boot project structure
* Maven
* Dependencies
* Main application class
* Controllers
* Services
* Repositories
* Dependency Injection
* Annotations
* REST controllers
* Request mapping
* Request body
* Path variables
* HTTP responses

### Project Work

Create the backend project.

Initial structure:

```text
backend/
└── src/
    └── main/
        └── java/
            └── com/
                └── inkly/
                    ├── InklyApplication.java
                    ├── controller/
                    ├── service/
                    ├── repository/
                    ├── model/
                    └── config/
```

Create a basic Spring Boot application.

Then create simple test endpoints to understand:

```text
GET
POST
PUT
DELETE
```

### Testing

Use Postman to test the first Spring Boot endpoints.

### Checkpoint

We should understand the flow:

```text
HTTP Request
     ↓
Controller
     ↓
Service
     ↓
Response
```

### Done When

* [ ] Java fundamentals are understood
* [ ] Basic OOP is understood
* [ ] Maven project is working
* [ ] Spring Boot application runs
* [ ] Controller is understood
* [ ] Service layer is understood
* [ ] Dependency Injection is understood
* [ ] Basic REST endpoint works
* [ ] Postman can communicate with backend

---

# Week 3 — MongoDB & Spring Data MongoDB

### Goal

Learn how Inkly will store and retrieve data.

### Learn MongoDB

* Database
* Collection
* Document
* Field
* ObjectId
* CRUD operations
* MongoDB queries
* Basic indexing

### Tools

Use:

* MongoDB
* mongosh
* MongoDB Compass

### Database

Create the Inkly database:

```text
inkly
├── users
└── posts
```

### User Document

```text
users
├── _id
├── username
├── email
├── password
├── bio
└── profileImage
```

### Post Document

```text
posts
├── _id
├── userId
├── title
├── content
├── featuredImage
├── status
├── createdAt
└── updatedAt
```

### Post Status

```text
ACTIVE
INACTIVE
```

### Learn Spring Data MongoDB

* MongoDB connection
* Spring Data MongoDB
* Repository interfaces
* CRUD operations
* Query methods
* Mapping Java objects to MongoDB documents

### Project Work

Connect Spring Boot to MongoDB.

Create:

```text
User.java
Post.java

UserRepository.java
PostRepository.java
```

Test database operations.

### Checkpoint

We should understand:

```text
Java Object
    ↓
Repository
    ↓
MongoDB
```

and:

```text
MongoDB
    ↓
Repository
    ↓
Java Object
```

### Done When

* [ ] MongoDB is installed/configured
* [ ] mongosh works
* [ ] MongoDB Compass works
* [ ] `inkly` database is understood
* [ ] Users collection is understood
* [ ] Posts collection is understood
* [ ] Spring Boot connects to MongoDB
* [ ] User repository works
* [ ] Post repository works
* [ ] Basic CRUD is tested

---

# Week 4 — Backend Development

### Goal

Build the actual Inkly backend.

This is the main Java development phase.

---

## 4.1 User Module

Build:

```text
User
UserRepository
UserService
UserController
```

Implement:

### Registration

```http
POST /api/auth/register
```

Responsibilities:

* Validate input
* Check username
* Check email
* Store user
* Hash password
* Return appropriate response

### Login

```http
POST /api/auth/login
```

Responsibilities:

* Find user
* Verify credentials
* Return authentication information

The exact authentication/token implementation will be finalized during backend development.

---

## 4.2 Profile Module

Implement:

```http
GET /api/users/{userId}
PUT /api/users/{userId}
```

Allow users to:

* View profile
* Update username where supported
* Update bio
* Update profile image reference

No separate profile collection is required.

---

## 4.3 Post Module

Build:

```text
Post
PostRepository
PostService
PostController
```

Implement:

### Create

```http
POST /api/posts
```

### View All Active Posts

```http
GET /api/posts
```

### View Individual Post

```http
GET /api/posts/{postId}
```

### View Own Posts

```http
GET /api/posts/my
```

### Update Post

```http
PUT /api/posts/{postId}
```

### Delete Post

```http
DELETE /api/posts/{postId}
```

### Post Data

Each post should support:

```text
title
content
featuredImage
status
createdAt
updatedAt
userId
```

The `content` field will store the Rich Text Editor content as a string.

---

## 4.4 Authorization

Implement basic ownership checks.

Example:

```text
User A
   ↓
tries to edit
   ↓
User B's post
   ↓
Request rejected
```

A user should only be able to modify their own posts.

---

## 4.5 Validation

Add basic validation for:

* Required fields
* Empty title
* Empty content
* Invalid user
* Invalid post
* Invalid status
* Duplicate username
* Duplicate email

---

## 4.6 Error Handling

Handle common cases:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

### Testing

Test every API using Postman.

### Checkpoint

At the end of Week 4, the backend should be independently usable.

We should be able to perform:

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
Edit Own Post
   ↓
Delete Own Post
```

### Done When

* [ ] User registration works
* [ ] User login works
* [ ] Authentication works
* [ ] Profile retrieval works
* [ ] Profile update works
* [ ] Create post works
* [ ] View posts works
* [ ] View individual post works
* [ ] View own posts works
* [ ] Update own post works
* [ ] Delete own post works
* [ ] ACTIVE/INACTIVE status works
* [ ] Ownership checks work
* [ ] Validation works
* [ ] Basic error handling works
* [ ] APIs are tested with Postman

---

# Week 5 — React & Frontend

### Goal

Understand and build the frontend required to use the backend APIs.

The React frontend already exists, but for the project learning process we will understand its structure and implement/connect the required parts systematically.

### Learn/Revise

* React components
* Props
* State
* Hooks
* `useState`
* `useEffect`
* Forms
* Event handling
* Conditional rendering
* React Router
* API calls
* Loading states
* Error states
* Basic Tailwind CSS

### Required Screens

Build or prepare:

```text
Register
Login
Home / Posts
Profile
Edit Profile
Create Post
My Posts
Edit Post
View Post
```

### Post Editor

The post creation/editing screen should support:

```text
Title
Rich Text Content
Featured Image
Status
```

### Frontend Responsibilities

React should handle:

* UI
* Forms
* User interaction
* Page navigation
* API requests
* Displaying API responses
* Loading/error states

Spring Boot should handle:

* Validation
* Authentication
* Authorization
* Business logic
* Database operations

### Done When

* [ ] React project runs
* [ ] Required pages exist
* [ ] Routing works
* [ ] Forms work
* [ ] Post editor works
* [ ] Profile UI works
* [ ] API communication structure is ready
* [ ] Loading/error states are handled

---

# Week 6 — Full-Stack Integration

### Goal

Connect the React frontend to the Spring Boot backend and make Inkly work as a complete application.

### Main Flow

```text
React
  ↓
REST API
  ↓
Spring Boot
  ↓
MongoDB
```

---

## Integration Tasks

### Registration

```text
Register Form
     ↓
POST /api/auth/register
     ↓
Spring Boot
     ↓
MongoDB
```

### Login

```text
Login Form
     ↓
POST /api/auth/login
     ↓
Spring Boot
     ↓
Authentication Response
     ↓
React
```

### Profile

```text
React Profile
     ↓
GET /api/users/{userId}
     ↓
Spring Boot
     ↓
MongoDB
```

### Update Profile

```text
Edit Profile
     ↓
PUT /api/users/{userId}
     ↓
Spring Boot
     ↓
MongoDB
```

### Create Post

```text
Create Post
     ↓
POST /api/posts
     ↓
Spring Boot
     ↓
MongoDB
```

### View Posts

```text
Home Page
     ↓
GET /api/posts
     ↓
Spring Boot
     ↓
MongoDB
     ↓
React
```

### Edit/Delete

Connect:

```text
PUT /api/posts/{postId}
DELETE /api/posts/{postId}
```

### Integration Testing

Test complete user flows instead of testing individual APIs only.

Example:

```text
Register
   ↓
Login
   ↓
Create Post
   ↓
View Post
   ↓
Open My Posts
   ↓
Edit Post
   ↓
View Updated Post
   ↓
Delete Post
```

### Done When

* [ ] React communicates with Spring Boot
* [ ] Registration works from UI
* [ ] Login works from UI
* [ ] Profile works from UI
* [ ] Profile update works from UI
* [ ] Post creation works from UI
* [ ] Posts display correctly
* [ ] Own posts display correctly
* [ ] Post editing works
* [ ] Post deletion works
* [ ] Authentication information is handled correctly
* [ ] Frontend and backend work together

---

# Week 7 — Testing & Improvement

### Goal

Find problems and improve the application before final submission.

### Test Categories

## Functional Testing

Check:

* Registration
* Login
* Profile
* Profile update
* Create post
* View post
* Edit post
* Delete post
* ACTIVE/INACTIVE behavior

## Validation Testing

Try:

* Empty username
* Empty email
* Invalid email
* Empty password
* Empty title
* Empty content
* Invalid post ID
* Invalid user ID

## Authorization Testing

Try:

```text
User A → Edit User B's Post
User A → Delete User B's Post
```

The backend should reject unauthorized actions.

## Database Testing

Verify MongoDB contains correct:

* Users
* Posts
* `userId`
* Status
* Timestamps
* Profile information

## UI Testing

Check:

* Navigation
* Forms
* Buttons
* Error messages
* Loading states
* Responsive layout
* Post display
* Profile display

### Bug Fixing

Fix:

* API errors
* Database errors
* Authentication issues
* UI bugs
* Validation problems
* Incorrect API responses
* Incorrect ownership behavior

### Code Cleanup

Review:

* Duplicate code
* Unused imports
* Unnecessary classes
* Naming
* Comments
* Folder structure
* Error handling

### Done When

* [ ] Core features have been tested
* [ ] Major bugs are fixed
* [ ] Validation works
* [ ] Authorization works
* [ ] Database data is correct
* [ ] UI works properly
* [ ] Code is reasonably clean
* [ ] No unnecessary features are blocking completion

---

# Week 8 — Finalization & Presentation

### Goal

Prepare Inkly for final demonstration, submission, and evaluation.

### Final Testing

Perform a complete end-to-end test:

```text
Start Application
      ↓
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
View Own Posts
      ↓
Edit Post
      ↓
Delete Post
      ↓
Logout / End Session
```

### Documentation

Finalize:

```text
README.md
PROJECT_OVERVIEW.md
REQUIREMENTS.md
FEATURE_DESIGN.md
ARCHITECTURE.md
DATABASE.md
API.md
ROADMAP.md
```

### Add Project Materials

Prepare:

* Screenshots
* Architecture diagram
* Database structure
* API examples
* UI screenshots
* Project explanation
* Setup instructions

### Presentation Preparation

Be able to explain:

### 1. What is Inkly?

A social content-sharing web platform.

### 2. Why Java?

The project demonstrates Java backend development using Spring Boot.

### 3. Why Spring Boot?

It provides the framework for building the REST backend and organizing application logic.

### 4. Why MongoDB?

It provides document-based storage suitable for the project's content-oriented data.

### 5. How does the system work?

```text
React
  ↓
REST API
  ↓
Spring Boot
  ↓
MongoDB
```

### 6. What is the Controller?

Receives HTTP requests and returns responses.

### 7. What is the Service?

Contains business logic.

### 8. What is the Repository?

Handles database access.

### 9. How are posts connected to users?

Each post contains:

```text
userId
```

which identifies its author.

### 10. How is post ownership handled?

The backend checks the authenticated user's ID against the post's `userId`.

### Done When

* [ ] Final application works
* [ ] Final testing is complete
* [ ] Documentation is complete
* [ ] Screenshots are ready
* [ ] Architecture diagram is ready
* [ ] Database design is ready to explain
* [ ] API flow can be explained
* [ ] Presentation/demo flow is ready
* [ ] GitHub repository is organized

---

# 6. Master Development Checklist

This is the overall project checklist.

## Phase 1 — Planning

* [ ] Project idea finalized
* [ ] Requirements finalized
* [ ] Features finalized
* [ ] Architecture finalized
* [ ] Database design finalized
* [ ] API design finalized
* [ ] Roadmap finalized

## Phase 2 — Backend Foundation

* [ ] Java basics
* [ ] OOP basics
* [ ] Maven
* [ ] Spring Boot
* [ ] REST APIs
* [ ] Controller
* [ ] Service
* [ ] Repository
* [ ] Dependency Injection

## Phase 3 — Database

* [ ] MongoDB
* [ ] mongosh
* [ ] MongoDB Compass
* [ ] Users collection
* [ ] Posts collection
* [ ] Spring Data MongoDB
* [ ] Database connection

## Phase 4 — Backend Features

* [ ] Registration
* [ ] Login
* [ ] Authentication
* [ ] Profile
* [ ] Profile update
* [ ] Create post
* [ ] View posts
* [ ] View own posts
* [ ] Edit post
* [ ] Delete post
* [ ] Post status
* [ ] Ownership checks
* [ ] Validation
* [ ] Error handling

## Phase 5 — Frontend

* [ ] React structure understood
* [ ] Register page
* [ ] Login page
* [ ] Home/posts page
* [ ] Profile page
* [ ] Edit profile page
* [ ] Create post page
* [ ] My posts page
* [ ] Edit post page
* [ ] View post page

## Phase 6 — Integration

* [ ] React → Spring Boot
* [ ] Spring Boot → MongoDB
* [ ] Registration flow
* [ ] Login flow
* [ ] Profile flow
* [ ] Post creation flow
* [ ] Post viewing flow
* [ ] Post editing flow
* [ ] Post deletion flow

## Phase 7 — Testing

* [ ] Functional testing
* [ ] Validation testing
* [ ] Authorization testing
* [ ] Database testing
* [ ] UI testing
* [ ] Bug fixing
* [ ] Code cleanup

## Phase 8 — Finalization

* [ ] Final application
* [ ] Documentation
* [ ] Screenshots
* [ ] Architecture diagram
* [ ] Database explanation
* [ ] API explanation
* [ ] Presentation
* [ ] Demo
* [ ] GitHub cleanup

---

# 7. How We Will Use This Roadmap

This roadmap will be treated as the **master project guide**.

We will not try to complete the entire roadmap at once.

We will work through it in order:

```text
Week 1
  ↓
Finish Week 1
  ↓
Week 2
  ↓
Finish Week 2
  ↓
Week 3
  ↓
Finish Week 3
  ↓
...
  ↓
Week 8
  ↓
Completed Inkly
```

Within each week, we will also work step by step.

For example, during backend development:

```text
Learn Controller
      ↓
Create Controller
      ↓
Learn Service
      ↓
Create Service
      ↓
Learn Repository
      ↓
Create Repository
      ↓
Connect MongoDB
      ↓
Test API
```

We will **not move to the next major step until the current step is understood and working**.

---

# 8. Definition of Project Completion

Inkly will be considered complete when a user can:

```text
Register
   ↓
Login
   ↓
Manage Profile
   ↓
Create Post
   ↓
View Posts
   ↓
Manage Own Posts
   ↓
Edit Post
   ↓
Delete Post
```

with the complete system working as:

```text
┌─────────────────┐
│ React Frontend  │
└────────┬────────┘
         │
         │ REST / HTTP
         ↓
┌─────────────────┐
│ Spring Boot API │
└────────┬────────┘
         │
         │ Spring Data MongoDB
         ↓
┌─────────────────┐
│    MongoDB      │
└─────────────────┘
```

The final project should demonstrate:

* Java programming
* Object-oriented programming
* Spring Boot
* REST API development
* MongoDB
* Database operations
* Authentication
* Authorization
* Validation
* React integration
* Full-stack application development
* Git/GitHub workflow

---

# 9. Important Project Rule

> **Do not add complexity just because a production application might need it.**

Inkly is a college project.

Our priority is:

```text
Working
   ↓
Understandable
   ↓
Tested
   ↓
Well documented
   ↓
Presentable
```

rather than:

```text
Over-engineered
   ↓
Too complex
   ↓
Difficult to understand
   ↓
Incomplete
```

The goal is to build a project that the team can **actually explain, demonstrate, modify, and defend during evaluation**.
