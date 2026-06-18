# Psyckie Development Phases

Spec-driven continuation guide for the current implementation.

This project already has an Express backend, a Supabase schema, JWT authentication, a Vite React frontend, a protected dashboard shell, and the current visual theme. Future agents should continue from the existing codebase instead of recreating the project from scratch.

## Agent Operating Rules

- Inspect the current files before making changes.
- Preserve the existing app structure unless a phase explicitly requires changing it.
- Preserve the current visual direction: red Psyckie header, DM Sans body font, DM Serif Display accent headings, light gray app background, white dashboard cards, and the existing SVG asset language.
- Keep route names and database column names aligned with the current implementation unless a migration is intentionally introduced.
- Prefer incremental, working vertical slices over large speculative rewrites.
- Treat this file as a specification, not as code to paste.

## Current Baseline

The implementation currently includes:

- Backend Express app mounted from `backend/server.js`.
- Supabase client setup in `backend/config/db.js`.
- JWT auth with signup, login, and current-user lookup.
- Database schema in `backend/utils/schema.sql`.
- Seed script for preset topics in `backend/utils/seed.js`.
- Read-only APIs for topics, materials, flashcards, quizzes, quiz attempts, quiz responses, SRS reviews, and study sessions.
- Frontend React app with auth store, axios client, login page, signup page, protected layout, header, and a styled dashboard mock.
- Environment examples in `backend/.env.example` and `frontend/.env.example`.

The current implementation is best understood as Phase 1 partially complete, with a polished dashboard mock that visually previews later phases.

---

# Phase 1: Project Setup and Auth Baseline

## Overview

Stabilize the existing project foundation without replacing it. The goal is to make the current backend, frontend, Supabase schema, authentication flow, environment setup, and dashboard shell reliably runnable by a new developer.

## Requirements

- Keep the existing Express, React, Vite, Zustand, Axios, Tailwind, and Supabase setup.
- Keep JWT auth as the application auth model.
- Keep the current `/api/auth/signup`, `/api/auth/login`, and `/api/auth/me` API behavior.
- Keep the current frontend shell at `/app`.
- Keep the current visual design theme and layout direction.
- Make sure the schema, seed script, env examples, and setup instructions are consistent with the current code.

## User Stories

- As a new developer, I can clone the repo, fill in environment variables, run the schema, seed topics, and boot the frontend and backend.
- As a student, I can create an account, sign in, stay authenticated, and reach the protected dashboard.
- As a returning user, I can refresh the app and have my session restored from local storage.

## Tasks

- Audit backend startup, environment loading, Supabase connection, and auth routes.
- Verify that `backend/utils/schema.sql` matches the model files currently used by the backend.
- Verify that `backend/utils/seed.js` works against the current `topics` table shape.
- Verify that frontend auth redirects are intentional and consistent.
- Add or update README setup instructions if they are missing or stale.
- Fix bugs in the current auth flow only if they block Phase 1 acceptance.
- Keep dashboard data hardcoded for this phase unless wiring one small live value is necessary to prove integration.

## Expected Output

- A runnable backend on port `5000`.
- A runnable frontend on port `5173`.
- A working signup, login, logout, and session restore flow.
- Supabase schema and seed instructions that match the current implementation.
- Environment example files that match the current runtime requirements.

## Acceptance Criteria

- `GET /api/health` returns a healthy response.
- A new user can sign up from the frontend.
- An existing user can log in from the frontend.
- Authenticated users can open `/app`.
- Unauthenticated users are redirected to `/login`.
- Refreshing `/app` keeps the user signed in when the token is valid.
- The preset topic seed can run without schema errors.

---

# Phase 2: Topics and Material Library

## Overview

Turn the existing read-only topic and material endpoints into a usable topic library and material management flow. This phase should build on the current schema first, then introduce migrations only when required for ownership, upload metadata, or processing status.

## Requirements

- Preserve the current topic design language shown in the dashboard.
- Add real frontend routes for topic browsing and topic detail pages.
- Support preset topics and user-created custom topics if the schema is expanded for ownership.
- Support material listing per topic.
- Implement material upload only after the material data model is clearly aligned with the target behavior.
- Keep protected routes protected where user-owned data is involved.

## User Stories

- As a student, I can browse BLEPP topic categories.
- As a student, I can open a topic and see related materials.
- As a student, I can add a custom topic if the app supports personal organization.
- As a student, I can upload or create material content for a topic.

## Tasks

- Add frontend pages for topics and topic detail using the current red header shell.
- Connect topic lists to `GET /api/topics`.
- Add backend create and delete behavior for custom topics if ownership is added.
- Add material creation or upload behavior based on the current `materials` table or a deliberate migration.
- Add upload middleware only when file upload is actually implemented.
- Add OCR processing only after the file upload path works end to end.
- Add loading, empty, and error states using the existing card and badge style.

## Expected Output

- `/app/topics` displays live topic data.
- `/app/topics/:id` displays the selected topic and its materials.
- Users can add material records or upload files depending on the chosen implementation path.
- The dashboard upload panel either links to the real material flow or is replaced by the working route.

## Acceptance Criteria

- Topic pages use live API data.
- Material lists can be filtered by topic.
- User-owned mutations require authentication.
- Failed API calls show useful UI feedback.
- The implementation does not break login, signup, or the dashboard shell.

---

# Phase 3: Flashcards

## Overview

Build the flashcard creation, listing, editing, deletion, and review preparation workflow. AI generation may be introduced in this phase only after manual flashcard CRUD is working.

## Requirements

- Keep the current `flashcards` table shape unless a migration is intentionally planned.
- Use the current fields `question`, `answer`, `difficulty`, and `topic_id`, or migrate carefully if renaming to `front` and `back`.
- Build manual flashcard CRUD before AI generation.
- Keep flashcard UI consistent with the dashboard card system.
- Do not require Gemini for the basic flashcard feature to work.

## User Stories

- As a student, I can see flashcards for a topic.
- As a student, I can create a flashcard manually.
- As a student, I can edit or delete my flashcards.
- As a student, I can generate draft flashcards from processed material when AI is configured.

## Tasks

- Add protected backend mutations for flashcards.
- Add frontend flashcard list and manual create/edit/delete UI.
- Add topic-scoped flashcard filtering.
- Add AI draft generation only after material text exists and Gemini configuration is added.
- Add validation for empty questions and answers.
- Add empty states that guide the user toward creating the first card.

## Expected Output

- A working flashcard page for topic-specific cards.
- Manual flashcard CRUD works without AI services.
- Optional AI-generated draft cards can be reviewed before saving.

## Acceptance Criteria

- Flashcards are persisted in Supabase.
- Flashcard actions do not expose or mutate another user's private data if ownership is added.
- Users can create at least one flashcard and see it after refresh.
- AI failures do not block manual flashcard workflows.

---

# Phase 4: Spaced Repetition Review

## Overview

Turn flashcards into a daily review queue using the existing `srs_reviews` table as the starting point. Build a real review session with due cards, rating controls, scheduling updates, and a session summary.

## Requirements

- Keep the existing `srs_reviews` route and model as the baseline.
- Implement a real scheduling algorithm in a utility module.
- Make review sessions authenticated.
- Record study activity when reviews are completed.
- Keep the review UI focused and mobile-friendly.

## User Stories

- As a student, I can see which cards are due today.
- As a student, I can reveal an answer and rate my recall.
- As a student, I can finish a review session and see a summary.
- As a student, my next review dates update based on my rating.

## Tasks

- Add backend endpoints for due cards, submitting a review rating, and review stats.
- Implement a spaced repetition calculation using the current `due_at`, `interval_days`, and `ease_factor` fields.
- Create a `/app/review` frontend page.
- Connect the dashboard due-today panel to live review data.
- Record study sessions when a review session finishes.

## Expected Output

- A daily review queue based on due SRS records.
- Rating buttons that update the next due date.
- A review summary screen.
- Dashboard due counts that reflect real data.

## Acceptance Criteria

- Cards due now appear in the review queue.
- Reviewing a card updates its SRS record.
- Completed sessions can be reflected in study session data.
- Empty review state appears when all cards are caught up.

---

# Phase 5: Quiz and Mock Exam Mode

## Overview

Build quiz generation, quiz attempts, answer capture, scoring, and results. Manual or seeded quizzes should work before AI quiz generation is required.

## Requirements

- Preserve the current quiz, quiz attempt, and quiz response model boundaries unless a migration is required.
- Support topic-scoped quizzes.
- Support quiz attempts and persisted responses.
- Keep mock exam UI aligned with the current red, white, and gray dashboard theme.
- Add AI generation only after the quiz data model supports full question, option, answer, and explanation storage.

## User Stories

- As a student, I can start a quiz for a topic.
- As a student, I can answer questions and submit my attempt.
- As a student, I can see my score and which answers were correct.
- As a student, I can use mock exam mode with stricter navigation or timing when available.

## Tasks

- Review the current quiz schema and add question storage if needed.
- Add backend endpoints for starting attempts, submitting responses, and returning results.
- Add frontend quiz session and results pages.
- Add score calculation and answer correctness storage.
- Add optional Gemini generation for quizzes from material content.
- Add route links from dashboard, topics, and header navigation.

## Expected Output

- Users can complete a quiz attempt end to end.
- Quiz responses are persisted.
- Results show score, answer status, and review information.
- Mock exam mode can be enabled without disrupting practice mode.

## Acceptance Criteria

- A quiz can be opened from the frontend.
- A quiz attempt can be submitted.
- Results remain available after refresh or navigation.
- Bad or incomplete submissions are validated server-side.

---

# Phase 6: Progress Dashboard

## Overview

Replace hardcoded dashboard metrics with live progress data and add a dedicated progress page. This phase should preserve the current dashboard layout while wiring it to real backend stats.

## Requirements

- Preserve the current dashboard visual composition as much as possible.
- Replace hardcoded cards, topic mastery rows, due counts, streaks, and profile stats with API data.
- Add backend stats endpoints for dashboard and progress views.
- Use compact, scannable charts only where they help the student understand progress.

## User Stories

- As a student, I can see how many cards I have, how many are due, and how many quizzes I completed.
- As a student, I can see weak topics and decide what to study next.
- As a student, I can track quiz score trends and study time.
- As a student, I can see my study streak.

## Tasks

- Add backend stats model, controller, and routes.
- Compute dashboard totals from flashcards, SRS reviews, quiz attempts, quiz responses, and study sessions.
- Add weak-topic detection based on quiz performance.
- Add frontend progress page.
- Replace hardcoded dashboard numbers with API data.
- Add skeleton states that match the current UI.

## Expected Output

- Dashboard reflects live user data.
- Progress page displays score history, cards overview, weak topics, and study time.
- Empty accounts show motivating empty states instead of fake values.

## Acceptance Criteria

- Dashboard metrics change when user data changes.
- Weak topics are computed from persisted quiz results.
- Progress page works for both new and active users.
- Loading and error states do not break the protected shell.

---

# Phase 7: Polish, Settings, Reminders, and Mobile

## Overview

Finish the app experience with settings, reminders, mobile polish, error handling, and production readiness. This phase should refine the existing product rather than change its core architecture.

## Requirements

- Keep the existing theme and route structure.
- Add settings only after the user profile API supports updates.
- Add reminders only after due-card data is reliable.
- Add production-minded error handling, loading states, and documentation.
- Ensure mobile navigation works across all implemented routes.

## User Stories

- As a student, I can manage my profile and preferences.
- As a student, I can receive reminders when I have due cards.
- As a mobile user, I can navigate the app comfortably on a small screen.
- As a developer, I can deploy the app with clear environment and setup instructions.

## Tasks

- Add settings API and frontend page.
- Add email reminder infrastructure only if email variables are configured.
- Add complete mobile navigation for implemented pages.
- Add toast notifications for key create, update, delete, and failure events.
- Add error boundaries and friendly fallback screens.
- Add deployment notes for Supabase, frontend hosting, and backend hosting.
- Clean up unused template artifacts after confirming they are not imported.

## Expected Output

- A polished app with complete navigation and resilient UI states.
- Settings and reminders work when configured.
- Setup and deployment instructions are current.
- The app is ready for broader testing.

## Acceptance Criteria

- Core workflows work on desktop and mobile.
- Missing optional integrations fail gracefully.
- The app has no obvious dead links in the header or dashboard.
- Documentation matches the final implemented routes, env vars, schema, and commands.

