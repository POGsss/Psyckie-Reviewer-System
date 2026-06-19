# Psyckie System Architecture

Current implementation and target architecture for the BS Psychology board exam reviewer web application.

## Product Direction

Psyckie is a browser-based review system for BS Psychology students preparing for BLEPP. The product direction remains the same: topics, materials, flashcards, spaced repetition, quizzes, mock exams, and progress tracking.

The current repository is an early implementation. It should be continued incrementally, not restarted.

## Current Implementation Snapshot

Implemented today:

- React + Vite frontend in `frontend/`.
- Express backend in `backend/`.
- Supabase PostgreSQL access through `@supabase/supabase-js`.
- JWT authentication with bcrypt password hashing.
- Protected frontend app shell at `/app`.
- Styled login, signup, header, protected layout, and dashboard mock.
- Supabase schema and topic seed script.
- Read-only API coverage for core resources.

Partially implemented:

- SRS review records can be created, but the full review queue workflow is not built.
- Study sessions can be created, but dashboard stats are not yet computed from them.
- Dashboard UI exists, but most values are hardcoded.

Not implemented yet:

- Material upload and OCR.
- Flashcard CRUD.
- AI flashcard generation.
- Quiz attempt flow and scoring.
- Progress analytics.
- Settings and reminders.

## Runtime Architecture

Frontend:

- Framework: React with Vite.
- Routing: React Router.
- State: Zustand for auth state.
- HTTP client: Axios with bearer token injection.
- Styling: Tailwind CSS with project theme tokens.
- Fonts: DM Sans and DM Serif Display from `@fontsource`.

Backend:

- Runtime: Node.js.
- Framework: Express.
- Database client: Supabase JavaScript client.
- Auth: JWT tokens signed by the backend.
- Password hashing: bcryptjs.
- Environment loading: dotenv.
- Error handling: centralized Express error middleware.

Database:

- Supabase PostgreSQL.
- Current schema source: `backend/utils/schema.sql`.
- Current seed source: `backend/utils/seed.js`.

## Design System

The existing implementation defines the product theme in `frontend/src/index.css` and `frontend/tailwind.config.js`.

Core theme:

- Primary red: `#E8252A`.
- Primary dark red: `#c41e22`.
- Soft red: `#FCE8EA`.
- App background: `#f4f5f7`.
- Card background: `#ffffff`.
- Text: `#1a1a2e`.
- Muted text: `#6b7280`.
- Border: `#e5e7eb`.
- Success green: `#10b981`.
- Warning orange: `#f59e0b`.
- Info blue: `#3b82f6`.
- Card radius: `14px`.
- Card shadow: `0 2px 8px rgba(0,0,0,0.06)`.
- Hover shadow: `0 6px 20px rgba(0,0,0,0.1)`.
- Sans font: DM Sans.
- Display font: DM Serif Display.

Visual rules for future work:

- Preserve the flat red sticky header.
- Preserve the white card dashboard style.
- Use SVG assets from `frontend/src/assets` where they match existing navigation or dashboard patterns.
- Avoid introducing a separate visual system unless the full app is intentionally redesigned.
- Replace hardcoded dashboard values with live data without changing the overall composition unnecessarily.

## Frontend Structure

Current important files:

- `frontend/src/main.jsx`: React root and router provider.
- `frontend/src/App.jsx`: route table.
- `frontend/src/lib/api.js`: axios client and auth header injection.
- `frontend/src/store/authStore.js`: auth state, login, signup, logout, session restore.
- `frontend/src/components/layout/Header.jsx`: red app header and navigation shell.
- `frontend/src/components/layout/ProtectedLayout.jsx`: protected page wrapper.
- `frontend/src/pages/LoginPage.jsx`: login UI.
- `frontend/src/pages/SignupPage.jsx`: signup UI.
- `frontend/src/pages/Dashboard.jsx`: current dashboard mock and profile shell.

Current routes:

- `/`: redirects to `/app`.
- `/login`: login page.
- `/signup`: signup page.
- `/app`: protected dashboard.
- unknown routes redirect to `/app`.

Target route growth:

- `/app/topics`.
- `/app/topics/:id`.
- `/app/topics/:id/flashcards`.
- `/app/review`.
- `/app/quiz/:id`.
- `/app/quiz/:id/results`.
- `/app/progress`.
- `/app/upload`.
- `/app/settings`.

## Backend Structure

Current important files:

- `backend/server.js`: Express app, middleware, route mounts, health endpoint.
- `backend/config/db.js`: Supabase client.
- `backend/controllers/authController.js`: signup, login, get current user.
- `backend/middleware/authMiddleware.js`: JWT verification.
- `backend/middleware/errorMiddleware.js`: JSON error responses.
- `backend/models/*`: Supabase queries by resource.
- `backend/routes/*`: Express route modules.
- `backend/utils/schema.sql`: current database schema.
- `backend/utils/seed.js`: preset topic seed.

Current API routes:

- `GET /api/health`.
- `POST /api/auth/signup`.
- `POST /api/auth/login`.
- `GET /api/auth/me`.
- `GET /api/topics`.
- `GET /api/topics/:id`.
- `GET /api/materials`.
- `GET /api/materials/:id`.
- `GET /api/flashcards`.
- `GET /api/flashcards/:id`.
- `GET /api/quizzes`.
- `GET /api/quizzes/:id`.
- `GET /api/quiz-attempts`.
- `POST /api/quiz-attempts`.
- `GET /api/quiz-responses`.
- `POST /api/quiz-responses`.
- `GET /api/srs-reviews`.
- `POST /api/srs-reviews`.
- `GET /api/study-sessions`.
- `POST /api/study-sessions`.

## Data Model

Current tables:

- `users`: app-managed users with email, password hash, and full name.
- `topics`: preset and future user-owned topic catalog. Current label column is `title`; `user_id` is null for preset topics, and `is_preset` marks seeded rows.
- `materials`: topic-linked content records.
- `flashcards`: topic-linked cards with question, answer, and difficulty.
- `srs_reviews`: per-user flashcard scheduling records.
- `quizzes`: topic-linked quiz records.
- `quiz_attempts`: per-user quiz attempt records.
- `quiz_responses`: per-user quiz response records.
- `study_sessions`: per-user study activity records.

Schema evolution guidance:

- Do not rename columns casually. Existing models expect the current names.
- If user-owned topics, materials, flashcards, or quizzes are required, introduce migrations deliberately.
- If AI quiz generation is implemented, add durable question and option storage before building the frontend session.
- If file upload is implemented, extend `materials` deliberately with file metadata and processing state.

## Environment Variables

Backend currently reads:

- `PORT`.
- `NODE_ENV`.
- `FRONTEND_ORIGIN`.
- `SUPABASE_URL`.
- `SUPABASE_SERVICE_ROLE_KEY`.
- `SUPABASE_ANON_KEY`.
- `JWT_SECRET`.

Frontend currently reads:

- `VITE_API_URL`.

Optional future variables should be introduced only when the matching feature is implemented:

- `GEMINI_API_KEY` for AI generation.
- `SUPABASE_STORAGE_BUCKET` for file upload storage.
- `EMAIL_USER` and `EMAIL_PASS` for reminders.

## Development Commands

Backend:

- Install dependencies from `backend/`.
- Run the server with the backend start script.
- Run the seed script only after applying `backend/utils/schema.sql`.

Frontend:

- Install dependencies from `frontend/`.
- Run the Vite dev server with the frontend dev script.
- Keep `VITE_API_URL` pointed at the backend API base URL.

## Implementation Roadmap

The development plan is preserved:

- Phase 1: Project setup and auth baseline.
- Phase 2: Topics and material library.
- Phase 3: Flashcards.
- Phase 4: Spaced repetition review.
- Phase 5: Quiz and mock exam mode.
- Phase 6: Progress dashboard.
- Phase 7: Polish, settings, reminders, and mobile.

The difference from the original plan is execution style: future work should be spec-driven, incremental, and based on the current implementation rather than generated from large code examples.

