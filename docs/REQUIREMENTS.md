# Inkly — Requirements

## 1. Introduction

This document defines the functional and non-functional requirements for **Inkly**, a social content-sharing web platform.

The purpose of this document is to clearly define the features that will be developed in the initial version of the project and separate them from features that may be added in the future.

The project is designed as a college-level full-stack application using:

* **Frontend:** React, JavaScript, Tailwind CSS
* **Backend:** Java, Spring Boot
* **Database:** MongoDB
* **API:** REST API
* **Development Tools:** Maven, Git/GitHub, Postman, IntelliJ IDEA, MongoDB Compass

---

# 2. Project Scope

The initial version of Inkly will focus on the basic functionality required for a social content-sharing platform.

Users should be able to:

* Create an account
* Log in to their account
* Manage their profile
* Create posts
* View posts
* Update their own posts
* Delete their own posts
* Manage their own content

The application will use a React frontend to communicate with a Java Spring Boot backend through REST APIs. User and post data will be stored in MongoDB.

Features such as likes, comments, followers, messaging, notifications, and recommendations are **not part of the initial version**.

---

# 3. Functional Requirements

Functional requirements describe what the system should be able to do.

## 3.1 User Registration

The system shall allow a new user to create an account.

### Requirements

* User should provide required registration information.
* The system should validate the provided information.
* The system should prevent registration with an already-used unique identifier such as email or username.
* Valid user information should be stored in MongoDB.
* The system should return an appropriate response after successful or failed registration.

---

## 3.2 User Login

The system shall allow registered users to log in.

### Requirements

* User should provide their login credentials.
* The system should verify the provided credentials.
* Valid credentials should allow the user to access authenticated features.
* Invalid credentials should return an appropriate error response.
* The frontend should handle the login response appropriately.

> Authentication implementation may remain simple for the initial college project and can be improved later if required.

---

## 3.3 User Profile

The system shall provide a basic profile for each registered user.

### Requirements

* Users should be able to view their profile.
* Users should be able to view basic account information.
* Users should be able to update editable profile information.
* Profile information should be stored and retrieved from MongoDB.

---

## 3.4 Post Creation

The system shall allow authenticated users to create posts.

### Requirements

* A logged-in user should be able to create a post.
* A post should contain the required content.
* The post should be associated with its creator.
* The post should store creation information where required.
* Valid posts should be saved in MongoDB.

---

## 3.5 View Posts

The system shall allow users to view available posts.

### Requirements

* Users should be able to retrieve posts from the backend.
* The frontend should display the post information in a readable format.
* Post information should include relevant author information.
* Posts should be retrieved from MongoDB through the Spring Boot backend.

---

## 3.6 Update Posts

The system shall allow users to update posts created by themselves.

### Requirements

* A user should be able to select their own post for editing.
* The user should be able to modify the required post content.
* The backend should verify that the user owns the post.
* Updated information should be stored in MongoDB.

Users should not be allowed to modify posts belonging to other users.

---

## 3.7 Delete Posts

The system shall allow users to delete posts created by themselves.

### Requirements

* A user should be able to delete their own post.
* The backend should verify post ownership.
* The selected post should be removed from MongoDB.
* The frontend should update appropriately after successful deletion.

Users should not be allowed to delete posts belonging to other users.

---

## 3.8 User Content Management

The system shall allow users to manage the content they have created.

### Requirements

* Users should be able to view their own posts.
* Users should be able to edit their own posts.
* Users should be able to delete their own posts.
* The backend should maintain the relationship between users and their posts.

---

## 3.9 REST API

The backend shall provide REST APIs for communication between the frontend and backend.

### Requirements

The API should provide endpoints for major operations such as:

* User registration
* User login
* Profile retrieval
* Profile update
* Post creation
* Post retrieval
* Post update
* Post deletion

The API should use appropriate HTTP methods such as:

* `GET`
* `POST`
* `PUT` / `PATCH`
* `DELETE`

Detailed API specifications will be documented separately in `API.md`.

---

## 3.10 Database Operations

The backend shall communicate with MongoDB to store and retrieve application data.

### Requirements

The system should support database operations for:

* Creating users
* Finding users
* Updating users
* Creating posts
* Finding posts
* Updating posts
* Deleting posts

Database access will be handled using **Spring Data MongoDB**.

---

# 4. Validation Requirements

The application should perform basic validation on user input.

Examples include:

* Required fields should not be empty.
* Email format should be validated where applicable.
* Usernames or other unique identifiers should follow defined rules.
* Password input should meet the minimum requirements defined by the project.
* Post content should not be empty.
* Invalid requests should return meaningful error responses.

Validation should be implemented on the backend even when similar validation exists on the frontend.

---

# 5. Error Handling Requirements

The application should handle common errors gracefully.

Examples include:

* User not found
* Invalid login credentials
* Duplicate username/email
* Invalid request data
* Post not found
* Unauthorized modification of another user's post
* Database-related errors

The backend should return appropriate HTTP status codes and useful error messages.

The frontend should display suitable feedback to the user where required.

---

# 6. Non-Functional Requirements

Non-functional requirements describe how the system should behave.

## 6.1 Usability

* The application should have a simple and understandable user interface.
* Navigation between major sections should be straightforward.
* Users should receive clear feedback for successful and failed operations.

## 6.2 Performance

* Common operations such as loading posts, creating posts, and updating profiles should respond within a reasonable time under normal usage.
* Database queries should be kept reasonably simple for the project's expected scale.

## 6.3 Reliability

* The application should handle invalid requests without crashing.
* Backend errors should be handled appropriately.
* Important user and post data should be stored consistently.

## 6.4 Security

The initial version should implement basic security practices, including:

* Passwords should not be stored as plain text.
* Users should only be allowed to modify their own content.
* Protected operations should require authentication.
* User input should be validated on the backend.

Advanced security features are outside the initial project scope unless required later.

## 6.5 Maintainability

* Backend code should be organized into logical components.
* Java classes should follow basic object-oriented principles.
* Controllers, services, and data-access components should have clear responsibilities.
* Meaningful naming should be used throughout the project.
* The code should remain understandable to the project team.

## 6.6 Compatibility

The application should work with commonly used modern web browsers.

---

# 7. User Roles

The initial version of Inkly will primarily use a single user role:

### User

A registered user can:

* Register an account
* Log in
* View and manage their profile
* Create posts
* View posts
* Update their own posts
* Delete their own posts

An administrator role is **not required for the initial version**.

---

# 8. Must-Have Requirements

The following features are considered essential for the first working version of Inkly.

* [ ] User registration
* [ ] User login
* [ ] Basic authentication
* [ ] User profile
* [ ] Profile management
* [ ] Create post
* [ ] View posts
* [ ] View user's own posts
* [ ] Update own post
* [ ] Delete own post
* [ ] MongoDB integration
* [ ] REST API integration
* [ ] Basic input validation
* [ ] Basic error handling
* [ ] React frontend integration with Spring Boot backend

These requirements form the **minimum viable version (V1)** of the project.

---

# 9. Should-Have Requirements

The following features can be implemented if the core requirements are completed and sufficient development time remains.

* [ ] Improved form validation
* [ ] Better error messages
* [ ] Improved loading states
* [ ] Improved responsive UI
* [ ] Better post management interface
* [ ] Additional profile customization
* [ ] Improved authentication and authorization
* [ ] Basic pagination for posts

These features should not delay completion of the must-have requirements.

---

# 10. Future Scope

The following features are intentionally excluded from the initial version but may be considered for future development.

* Likes and reactions
* Comments
* Follow/followers system
* Notifications
* Private messaging
* Content recommendations
* Advanced search
* Hashtags and trending topics
* Multiple content types
* Bookmarking/saved posts
* Advanced user settings
* Admin dashboard
* Reporting and moderation system

These features are considered **future scope** and should not be treated as current project requirements.

---

# 11. Scope Boundaries

To keep the project manageable within the planned development period, the following boundaries will be maintained:

1. The initial version will focus on users, profiles, and posts.
2. Social interaction features such as likes, comments, and following will not be implemented in V1.
3. Advanced recommendation systems will not be implemented.
4. Complex administrative functionality is outside the initial scope.
5. The backend will focus on learning and demonstrating Java and Spring Boot concepts rather than implementing an enterprise-level architecture.
6. Features should be added only after the core application is working correctly.
7. The project should prioritize a complete and understandable application over a large number of incomplete features.

---

# 12. Requirement Priority

| Priority         | Meaning                                |
| ---------------- | -------------------------------------- |
| **Must Have**    | Required for the first working version |
| **Should Have**  | Useful improvements if time permits    |
| **Future Scope** | Not required for V1                    |

The project team should complete all **Must-Have** requirements before spending significant time on lower-priority features.

---

# 13. Expected Result

At the end of the initial development cycle, Inkly should provide a working full-stack application where a user can register, log in, manage their profile, create posts, view posts, and manage their own content.

The application should demonstrate communication between:

```text
React Frontend
       ↓
Spring Boot REST API
       ↓
Java Backend Logic
       ↓
MongoDB Database
```

The resulting system should be simple enough for the project team to understand, demonstrate, test, and explain during the college project evaluation.
