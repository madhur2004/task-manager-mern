# Task Manager Backend

A production-ready REST API backend for a Task Management System, built with Node.js, Express, and MongoDB. Provides user authentication and full CRUD operations for tasks. Designed to be consumed by a separate frontend application.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** bcryptjs
- **Security & Utilities:** helmet, cors, compression, morgan, express-rate-limit, express-async-handler, validator, dotenv

## Folder Structure

```
backend/
├── config/
│   └── db.js                # MongoDB connection logic
├── controllers/
│   ├── authController.js    # Register, login, get current user
│   └── taskController.js    # Task CRUD logic
├── middleware/
│   ├── authMiddleware.js    # JWT verification / route protection
│   └── errorMiddleware.js   # Centralized error handling
├── models/
│   ├── User.js               # User schema
│   └── Task.js               # Task schema
├── routes/
│   ├── authRoutes.js         # /api/auth routes
│   └── taskRoutes.js         # /api/tasks routes
├── utils/
│   └── generateToken.js      # JWT signing helper
├── server.js                 # App entry point
├── package.json
├── .env.example
└── README.md
```

## API Documentation

All responses follow this shape:

**Success**
```json
{ "success": true, "message": "...", "data": ... }
```

**Error**
```json
{ "success": false, "message": "..." }
```

**Validation Error**
```json
{ "success": false, "message": "Validation failed", "errors": ["..."] }
```

### Auth Routes (`/api/auth`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|----------------|-------------|
| POST | /api/auth/register | No | Register a new user. Body: `{ name, email, password }` |
| POST | /api/auth/login | No | Login. Body: `{ email, password }` |
| GET | /api/auth/me | Yes | Get currently authenticated user |

### Task Routes (`/api/tasks`) — all require authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/tasks | Create a new task. Body: `{ title, description?, dueDate?, priority?, status? }` |
| GET | /api/tasks | Get all tasks belonging to the authenticated user |
| GET | /api/tasks/:id | Get a single task by id |
| PUT | /api/tasks/:id | Update a task (title, description, dueDate, priority, status) |
| DELETE | /api/tasks/:id | Delete a task |

### Authentication

Protected routes require an `Authorization` header:

```
Authorization: Bearer <token>
```

The token is returned from the `/api/auth/register` and `/api/auth/login` endpoints and is valid for 7 days.

## Environment Variables

Create a `.env` file in the project root based on `.env.example`:

| Variable | Description |
|----------|-------------|
| PORT | Port the server listens on (e.g. 5000) |
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | Secret key used to sign JWTs |
| NODE_ENV | `development` or `production` |

## Setup Steps

1. Clone the repository and navigate into the `backend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```
4. Start MongoDB (locally or use a hosted cluster such as MongoDB Atlas) and make sure `MONGO_URI` points to it.
5. Run the server in development mode (auto-restarts on changes):
   ```bash
   npm run dev
   ```
   Or run in production mode:
   ```bash
   npm start
   ```
6. The API will be available at `http://localhost:<PORT>`.

## Deployment Notes

- Set `NODE_ENV=production` in your production environment — this hides stack traces in error responses.
- Use a process manager such as PM2 or your hosting platform's process supervisor to keep the app running.
- Ensure `MONGO_URI` points to a production-ready MongoDB instance (e.g., MongoDB Atlas) with network access rules configured for your deployment environment.
- Use a strong, random `JWT_SECRET` in production.
- The current CORS configuration allows all origins; restrict this to your frontend's domain(s) before going live.
- Rate limiting is applied globally; tune the window/limits in `server.js` to match expected traffic.
- Run behind a reverse proxy (e.g., Nginx) or a platform that terminates TLS (HTTPS) for production traffic.
