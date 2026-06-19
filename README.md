# Psyckie Reviewer System

Psyckie is an Express, React, Vite, Zustand, Axios, Tailwind, and Supabase app for psychology review workflows. Phase 1 keeps the dashboard data mostly hardcoded while stabilizing the project setup and JWT auth baseline.

## Prerequisites

- Node.js 20 or newer
- npm
- A Supabase project

## 1. Install Dependencies

From the repo root:

```powershell
cd backend
npm install

cd ..\frontend
npm install
```

## 2. Configure Supabase

In Supabase, open the SQL editor and run:

```sql
-- Copy and run the full contents of backend/utils/schema.sql
```

The schema creates the app-owned `users` table used by JWT auth, plus topics, materials, flashcards, SRS reviews, quizzes, quiz attempts, quiz responses, and study sessions.

## 3. Configure Environment Variables

Create `backend/.env` from `backend/.env.example`:

```env
PORT=5000
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:5173
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=change_this_to_a_long_random_secret
```

Create `frontend/.env` from `frontend/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

`SUPABASE_SERVICE_ROLE_KEY` is recommended for local backend development. The backend can fall back to `SUPABASE_ANON_KEY`, but the configured Supabase permissions must allow the backend table operations.

## 4. Seed Preset Topics

After running the schema and configuring `backend/.env`:

```powershell
cd backend
npm run seed
```

The seed script inserts missing preset BLEPP topics and refreshes existing preset rows by `title`. This matches the current Phase 2-ready `topics` shape, which supports preset rows and future user-owned topics through `user_id`, `subject_area`, and `is_preset`.

If Supabase reports a missing topic column, rerun the full `backend/utils/schema.sql` file in the Supabase SQL editor. Older project databases may already have a `topics` table, and `schema.sql` includes compatibility guards plus a PostgREST schema-cache reload notification.

## 5. Run the App

Start the backend:

```powershell
cd backend
npm run dev
```

The API runs at `http://localhost:5000`.

In a second terminal, start the frontend:

```powershell
cd frontend
npm run dev
```

The app runs at `http://localhost:5173`.

## Health Check

```powershell
Invoke-RestMethod http://localhost:5000/api/health
```

Expected response:

```json
{ "status": "ok" }
```

## Auth Baseline

- `POST /api/auth/signup` creates an app user, hashes the password, and returns a JWT.
- `POST /api/auth/login` verifies credentials and returns a JWT.
- `GET /api/auth/me` reads the JWT bearer token and returns the current user.
- The frontend stores the token in `localStorage` under `psyckie_token`.
- `/app` is protected; unauthenticated users are redirected to `/login`.
- Refreshing `/app` restores the session by calling `/api/auth/me` when the stored token is still valid.
