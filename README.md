# TaskTracker

A lightweight task management SaaS app where users can sign up, create tasks, mark them as done, and see a dashboard of their tasks.

## Features

- **User Authentication** — Signup & Login with JWT
- **CRUD Tasks** — Create, Read, Update, Delete tasks
- **Mark as Complete** — Toggle task completion status
- **Dashboard** — View all tasks with stats (Total / Active / Completed)
- **Filter Tasks** — Filter by All / Active / Completed

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React.js (Create React App)             |
| Backend  | Node.js + Express                       |
| Database | SQLite (via `better-sqlite3`)           |
| Auth     | JWT + bcryptjs                          |

## Project Structure

```
.
├── backend/          # Node.js + Express API
│   ├── routes/
│   │   ├── auth.js   # Signup & Login
│   │   └── tasks.js  # CRUD endpoints
│   ├── middleware/
│   │   └── auth.js   # JWT verification
│   ├── db.js         # SQLite setup
│   ├── server.js     # Entry point
│   └── .env.example
└── frontend/         # React app
    └── src/
        ├── pages/
        │   ├── Login.js
        │   ├── Signup.js
        │   └── Dashboard.js
        ├── components/
        │   └── TaskCard.js
        ├── context/
        │   └── AuthContext.js
        ├── api.js
        └── App.js
```

## Getting Started

### 1. Backend

```bash
cd backend
cp .env.example .env       # edit JWT_SECRET before deploying
npm install
npm start                  # runs on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm start                  # runs on http://localhost:3000
```

The frontend dev server proxies `/api` requests to `localhost:5000` automatically.

## API Endpoints

| Method | Path               | Auth | Description           |
|--------|--------------------|------|-----------------------|
| POST   | /api/auth/signup   | No   | Register a new user   |
| POST   | /api/auth/login    | No   | Login, receive JWT    |
| GET    | /api/tasks         | Yes  | List user's tasks     |
| POST   | /api/tasks         | Yes  | Create a task         |
| PUT    | /api/tasks/:id     | Yes  | Update a task         |
| DELETE | /api/tasks/:id     | Yes  | Delete a task         |
| GET    | /api/health        | No   | Health check          |