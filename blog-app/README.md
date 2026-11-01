# Blog App — Spring Boot + React + MongoDB

A beginner-friendly full-stack blog:

- **Anyone** can read posts.
- **Users** can write posts and delete their own posts.
- **Admins** can delete any post and promote/demote users.
- **Two ways to sign in**
  1. Email + password, with a **6-digit OTP sent by email** to verify the account
  2. **Login with Google** (OAuth2)

```
blog-app/
├── backend/    Spring Boot 3 (Java 21) REST API  → http://localhost:8080
└── frontend/   React 18 + Vite                    → http://localhost:5173
```

---

## 1. Install the tools

| Tool | Why | Get it |
|---|---|---|
| JDK 21+ | Runs Spring Boot | https://adoptium.net |
| Maven (or IntelliJ, which bundles it) | Builds the backend | https://maven.apache.org/download.cgi |
| Node.js 20+ | Runs React | https://nodejs.org |
| MongoDB | Database | Local: https://www.mongodb.com/try/download/community — or free cloud: https://www.mongodb.com/atlas |
| MongoDB Compass (optional) | See your data in a GUI | https://www.mongodb.com/products/compass |
| Postman (optional) | Test the API by hand | https://www.postman.com |

Recommended editors: **IntelliJ IDEA Community** for `backend/`, **VS Code** for `frontend/`.

---

## 2. Run it (no Google / email setup needed yet)

**Start MongoDB** (if installed locally it usually runs as a service already), or with Docker:

```bash
docker run -d -p 27017:27017 --name mongo mongo:7
```

**Backend**

```bash
cd backend
mvn spring-boot:run
```

(In IntelliJ: open the `backend` folder, then run `BlogApplication`.)

On first start it creates an admin account: **admin@blog.com / admin123** (change in `application.properties`).

**Frontend** (new terminal)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

> **Where is my OTP?** By default `app.mail.enabled=false`, so the OTP is printed in the **backend console**:
> `========== OTP for you@example.com is 123456 ==========`

---

## 3. Turn on real OTP emails (Gmail)

1. Turn on 2-Step Verification on your Google account.
2. Create an **App password**: https://myaccount.google.com/apppasswords
3. Set these (environment variables, or edit `application.properties`):

```
MAIL_ENABLED=true
MAIL_USERNAME=your.address@gmail.com
MAIL_PASSWORD=the-16-char-app-password
```

Never commit real passwords to Git.

## 4. Turn on "Login with Google"

1. Go to https://console.cloud.google.com → create a project.
2. **APIs & Services → OAuth consent screen** → External → fill in app name + your email → add yourself as a test user.
3. **Credentials → Create credentials → OAuth client ID** → *Web application*
   - Authorized JavaScript origin: `http://localhost:5173`
   - Authorized redirect URI: **`http://localhost:8080/login/oauth2/code/google`**
4. Copy the client ID/secret into:

```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

---

## 5. How it works

### Authentication flows

```
EMAIL + OTP
React /register ──POST /api/auth/register──▶ save user (verified=false) + OTP ──▶ email
React /verify-otp ─POST /api/auth/verify-otp─▶ check code & expiry ──▶ verified=true, return JWT
React /login ─────POST /api/auth/login───────▶ check BCrypt password ──▶ return JWT

GOOGLE
React button ──▶ http://localhost:8080/oauth2/authorization/google ──▶ Google login page
Google ──▶ /login/oauth2/code/google (Spring handles it) ──▶ OAuth2SuccessHandler
  ──▶ find/create user in MongoDB ──▶ redirect to React /oauth2/callback?token=JWT
```

After either flow the React app stores the **JWT** in `localStorage` and `api.js` adds
`Authorization: Bearer <token>` to every request. `JwtAuthFilter` reads it on the server.

### Authorization (roles)

| Rule | Where it lives |
|---|---|
| Who can call which URL | `security/SecurityConfig.java` |
| Admin-only endpoints | `/api/admin/**` + `@PreAuthorize("hasRole('ADMIN')")` in `AdminController` |
| "Delete own post, or any post if admin" | `service/PostService.delete()` |
| Hiding buttons/pages in the UI | `ProtectedRoute.jsx`, `PostCard.jsx` (UI only — the backend is the real guard) |

### API

| Method | URL | Who |
|---|---|---|
| POST | `/api/auth/register` | anyone |
| POST | `/api/auth/verify-otp` | anyone |
| POST | `/api/auth/resend-otp` | anyone |
| POST | `/api/auth/login` | anyone |
| GET | `/api/auth/me` | logged in |
| GET | `/api/posts`, `/api/posts/{id}` | anyone |
| GET | `/api/posts/me` | logged in |
| POST | `/api/posts` | logged in |
| DELETE | `/api/posts/{id}` | author or admin |
| GET | `/api/admin/users` | admin |
| PUT | `/api/admin/users/{id}/role?role=ADMIN` | admin |

### Backend file map

```
com.example.blog
├── model/        User, Post, Role, AuthProvider       (MongoDB documents)
├── repository/   UserRepository, PostRepository       (Spring Data — no SQL/queries to write)
├── dto/          Dtos.java                            (request/response shapes)
├── security/     SecurityConfig, JwtService, JwtAuthFilter, OAuth2SuccessHandler
├── service/      AuthService (OTP logic), PostService, EmailService
├── controller/   AuthController, PostController, AdminController
├── config/       AdminSeeder (creates the first admin)
└── exception/    ApiException, GlobalExceptionHandler  (errors → { "message": "..." })
```

---

## 6. Suggested build order (if you want to write it yourself step by step)

1. Spring Initializr (https://start.spring.io): Web, Data MongoDB, Security, OAuth2 Client, Mail, Validation.
2. `Post` model + repository + controller **without security** → test with Postman.
3. `User` model, register/login with BCrypt + JWT.
4. Add OTP: generate, store with expiry, print to console, then send by email.
5. Add roles + `SecurityConfig` rules + admin seeder.
6. Add Google OAuth2.
7. React: posts list → login/register → OTP page → create/delete → admin page → Google button.

## 7. Learning resources

- Spring Boot guides: https://spring.io/guides (start with *Building a RESTful Web Service* and *Accessing Data with MongoDB*)
- Spring Security reference: https://docs.spring.io/spring-security/reference/
  - Servlet architecture (filters): https://docs.spring.io/spring-security/reference/servlet/architecture.html
  - OAuth2 Login: https://docs.spring.io/spring-security/reference/servlet/oauth2/login/core.html
- Spring guide *Spring Boot and OAuth2*: https://spring.io/guides/tutorials/spring-boot-oauth2
- Spring Data MongoDB: https://docs.spring.io/spring-data/mongodb/reference/
- Sending email with Spring: https://docs.spring.io/spring-framework/reference/integration/email.html
- JWT intro: https://jwt.io/introduction — library used: https://github.com/jwtk/jjwt
- React docs (Learn section): https://react.dev/learn
- React Router: https://reactrouter.com
- MongoDB University (free courses): https://learn.mongodb.com

## 8. Ideas for next steps

- Edit posts (PUT `/api/posts/{id}`), comments, likes, pagination
- Hash the OTP and limit wrong attempts / resend rate
- Refresh tokens, or store the JWT in an HttpOnly cookie instead of `localStorage`
- Add GitHub login: just add another `spring.security.oauth2.client.registration.github.*` block
- Deploy: backend to Render/Railway, frontend to Vercel/Netlify, DB on MongoDB Atlas

## Notes on security shortcuts taken for learning

- The OTP is stored as plain text in the user document (fine for learning; hash it in production).
- The JWT is passed back from Google login in the URL and kept in `localStorage` — simple, but an HttpOnly cookie is safer.
- Default admin password and JWT secret **must** be changed outside of local development.
