# TaskTracker

A full-stack SaaS task management application built with Node.js/Express backend and Next.js frontend.

## Features

- User authentication (signup & login with JWT)
- Create, read, update, and delete tasks
- Mark tasks as completed / toggle status
- Protected dashboard showing all your tasks

## Tech Stack

- **Backend**: Node.js, Express, better-sqlite3, bcryptjs, jsonwebtoken
- **Frontend**: Next.js 15, React 19, Tailwind CSS

## Project Structure

```
.
├── backend/          # Express API server
│   ├── src/
│   │   ├── index.js          # Entry point
│   │   ├── db.js             # SQLite database setup
│   │   ├── middleware/
│   │   │   └── auth.js       # JWT middleware
│   │   └── routes/
│   │       ├── auth.js       # /api/auth/signup and /api/auth/login
│   │       └── tasks.js      # /api/tasks CRUD + toggle
│   └── package.json
└── frontend/         # Next.js app
    ├── src/
    │   ├── app/              # App Router pages
    │   ├── components/       # TaskCard, TaskForm
    │   └── lib/
    │       └── api.js        # API client
    └── package.json
```

## Setup & Running

### Backend

```bash
cd backend
cp .env.example .env          # Edit JWT_SECRET for production
npm install
npm run dev                   # Starts on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev                   # Starts on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

| Method | Path                      | Description              |
|--------|---------------------------|--------------------------|
| POST   | /api/auth/signup          | Register a new user      |
| POST   | /api/auth/login           | Login and receive JWT    |
| GET    | /api/tasks                | List all tasks           |
| POST   | /api/tasks                | Create a task            |
| PUT    | /api/tasks/:id            | Update a task            |
| DELETE | /api/tasks/:id            | Delete a task            |
| PATCH  | /api/tasks/:id/toggle     | Toggle completed status  |
