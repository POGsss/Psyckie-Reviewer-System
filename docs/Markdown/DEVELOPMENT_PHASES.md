# Psyckie — Development Phase Guide
### Prompt-ready instructions per phase for AI-assisted development (Supabase + Express + React + Node.js)

---

> **How to use this file:**  
> Each phase contains a ready-to-use prompt block. Copy it and paste it into your AI coding assistant (Cursor, Claude, ChatGPT, etc.) as your starting instruction for that phase. Before each prompt, add your current file tree so the AI knows what already exists.

> **Stack reminder:** Supabase (PostgreSQL + Auth + Storage) · Express.js · React (Vite) · Node.js · JWT Auth · Gemini AI · Tailwind CSS · Poppins · react-icons/ri

---

## PHASE 1 — Project Setup & Authentication

**Goal:** Scaffold both the backend (Express) and frontend (React), connect to Supabase (PostgreSQL + Auth + Storage), and implement a working JWT-based login and signup flow with protected routes.

**What you'll have at the end:**
- Express server running on port 5000 with all routes registered
- Supabase database with all tables created and BLEPP topics seeded
- JWT register/login/me endpoints working
- React frontend with login, signup, and a protected dashboard shell
- Axios instance in frontend that injects the JWT token on every request

---

### ✦ Phase 1 Prompt

```
You are building Psyckie — a BS Psychology BLEPP board exam reviewer app using the PERN stack.

TECH STACK:
- Backend: Node.js + Express.js (CommonJS, no TypeScript), @supabase/supabase-js, JWT (jsonwebtoken), bcrypt, dotenv, cors
- Frontend: React + Vite + Tailwind CSS + React Router v6 + Zustand + Axios + react-icons (ri set) + Poppins font
- Database: Supabase (PostgreSQL managed + Auth + Storage)

FOLDER STRUCTURE — follow this exactly:
  backend/
    config/         ← db.js (pg Pool), gemini.js
    controllers/    ← authController.js (and others later)
    middleware/     ← authMiddleware.js, errorMiddleware.js
    models/         ← userModel.js (and others later)
    routes/         ← authRoutes.js (and others later)
    utils/          ← sm2.js, ocr.js (stubs for now)
    uploads/        ← temp file storage (add to .gitignore)
    .env
    server.js
    package.json

  frontend/
    public/
    src/
      assets/
      components/
        layout/     ← Header.jsx, MobileDrawer.jsx, ProtectedLayout.jsx
        ui/         ← Button.jsx, Badge.jsx, Modal.jsx, Skeleton.jsx
      pages/        ← LoginPage.jsx, SignupPage.jsx, DashboardPage.jsx
      store/        ← authStore.js (Zustand)
      hooks/        ← useApi.js
      lib/          ← axios.js
      App.jsx
      main.jsx
      index.css
    .env
    tailwind.config.js
    vite.config.js
    package.json

TASKS FOR THIS PHASE:

1. BACKEND SETUP
   - Initialize backend with: npm init -y
   - Install: express cors dotenv @supabase/supabase-js jsonwebtoken bcryptjs multer @google/generative-ai
   - Create backend/.env with:
       PORT=5000
       FRONTEND_URL=http://localhost:5173
       SUPABASE_URL=https://your-project.supabase.co
       SUPABASE_ANON_KEY=your_anon_key
       SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
       JWT_SECRET=your_secret_key
       JWT_EXPIRES_IN=7d
       GEMINI_API_KEY=
       SUPABASE_STORAGE_BUCKET=materials
       EMAIL_USER=
       EMAIL_PASS=

2. DATABASE
   - Create backend/config/db.js: initialize Supabase client using process.env.SUPABASE_URL and process.env.SUPABASE_SERVICE_ROLE_KEY, export client
   - Create and run the migration script in Supabase SQL Editor that creates ALL tables:
       users, topics, materials, flashcards, srs_reviews, quizzes, quiz_questions,
       quiz_attempts, quiz_responses, study_sessions
     Use the exact schema from the architecture doc (UUID PKs, correct FKs, CHECK constraints)
   - Write backend/config/seed.sql that inserts the 10 BLEPP preset topics with is_preset = true:
       General Psychology & History, Developmental Psychology, Abnormal Psychology & Psychopathology,
       Psychological Assessment & Testing, Industrial & Organizational Psychology, Social Psychology,
       Theories of Personality, Research Methods & Statistics, Counseling & Psychotherapy,
       Biological Bases of Behavior

3. AUTH BACKEND
   - backend/models/userModel.js:
       findByEmail(email), createUser({ display_name, email, password_hash }), findById(id)
   - backend/controllers/authController.js:
       register: hash password with bcrypt, insert user, return JWT + user
       login: find by email, compare password, return JWT + user
       getMe: return user from req.user (set by middleware)
   - backend/middleware/authMiddleware.js:
       verify Authorization: Bearer <token> header using jsonwebtoken
       attach req.user = { userId, email } on success, return 401 on failure
   - backend/middleware/errorMiddleware.js:
       global Express error handler — return { error: message } JSON with correct status
   - backend/routes/authRoutes.js:
       POST /register → authController.register
       POST /login    → authController.login
       GET  /me       → authMiddleware + authController.getMe
   - backend/server.js:
       set up Express, cors, express.json(), mount all routes under /api/*, use errorMiddleware
       Add placeholder route mounts for: topics, materials, flashcards, srs, quizzes, stats, reminders (so server doesn't crash when other routes are added later)

4. FRONTEND SETUP
   - Initialize frontend with: npm create vite@latest frontend -- --template react
   - Install: tailwindcss postcss autoprefixer react-router-dom zustand axios react-icons react-dropzone recharts
   - Configure Tailwind (tailwind.config.js + index.css with @tailwind directives)
   - Add Poppins font import to frontend/src/index.css:
       @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
       body { font-family: 'Poppins', sans-serif; background: #F4F5F7; color: #1A1A2E; }
   - Create frontend/.env: VITE_API_URL=http://localhost:5000
   - Create frontend/src/lib/axios.js:
       Axios instance with baseURL = import.meta.env.VITE_API_URL
       Request interceptor that reads token from localStorage and injects Authorization: Bearer header
   - Create frontend/src/store/authStore.js (Zustand):
       state: { user: null, token: null, isLoading: false }
       actions: login(email, password), register(name, email, password), logout(), initialize()
       On login/register: call API, store token in localStorage + state
       initialize(): read token from localStorage on app boot, call /api/auth/me to restore session

5. AUTH FRONTEND PAGES
   - frontend/src/pages/LoginPage.jsx:
       Email + password form, "Sign In" button, link to /signup
       On submit: call authStore.login(), redirect to /dashboard on success
       Show error message if login fails
   - frontend/src/pages/SignupPage.jsx:
       Name + email + password form, link to /login
       On submit: call authStore.register(), redirect to /dashboard on success
   - frontend/src/components/layout/ProtectedLayout.jsx:
       Wraps protected pages — if no token, redirect to /login
       Renders <Header /> + <Outlet /> for nested routes
   - frontend/src/components/layout/Header.jsx:
       Two-row sticky header with flat red (#E8252A) background, no gradient
       Row 1 left: logo icon (white box, red "P") + "Psyckie" text
       Row 1 right: user pill (avatar + name)
       Row 2 left: nav links (Dashboard, Topics, Flashcards, Mock Exam, Progress, Upload) using react-icons/ri
       Row 2 right: "Start Review" white pill button
       On mobile (≤640px): both rows switch to flex-row, nav links hidden, hamburger appears
       Active link: bg-white/20, inactive: text-white/80
   - frontend/src/App.jsx:
       Routes: / → LoginPage, /signup → SignupPage
       Protected: /dashboard, /topics, /topics/:id, /topics/:id/flashcards,
                  /upload, /review, /quiz/:id, /quiz/:id/results, /progress, /settings
       On mount: call authStore.initialize()
   - frontend/src/pages/DashboardPage.jsx:
       Placeholder — just show "Dashboard — coming in Phase 6" with user's name and logout button

6. DESIGN — match these exact values:
   - Header bg: #E8252A (flat, no gradient)
   - Page bg: #F4F5F7
   - Card bg: #FFFFFF, border-radius: 14px, box-shadow: 0 2px 8px rgba(0,0,0,0.06)
   - Primary button: bg #E8252A, text white, border-radius 9999px, font Poppins 600
   - Login/signup cards: centered max-w-md, white card, red "P" logo at top

Provide all file contents in full. Do not use placeholders — write complete, working code.
```

---

## PHASE 2 — Topics & Material Upload

**Goal:** Build the topic library, topic detail page, file upload with OCR text extraction, and the material management backend.

**What you'll have at the end:**
- Topic library page with all 10 BLEPP preset topics displayed
- Topic detail page showing uploaded materials per topic
- File upload (PDF or image) with Multer + OCR pipeline
- Material status badge that polls until processing is done

---

### ✦ Phase 2 Prompt

```
You are continuing development of Psyckie (PERN stack).
Phase 1 is complete: Express server running, PostgreSQL connected, JWT auth working, React frontend with login/signup.

FOLDER STRUCTURE:
  backend/  → config/, controllers/, middleware/, models/, routes/, utils/, uploads/, server.js
  frontend/src/ → assets/, components/layout/, components/ui/, pages/, store/, hooks/, lib/

TECH STACK: Node.js + Express + PostgreSQL (pg) + React + Vite + Tailwind + Axios + react-icons/ri + Poppins

TASKS FOR THIS PHASE:

1. BACKEND — TOPICS
   - backend/models/topicModel.js:
       getAllTopics(userId): SELECT topics WHERE is_preset = true OR user_id = $1
       createTopic({ user_id, title, description, subject_area }): INSERT, return new topic
       deleteTopic(id, userId): DELETE WHERE id = $1 AND user_id = $2
   - backend/controllers/topicController.js:
       getTopics: call topicModel.getAllTopics(req.user.userId), return JSON
       createTopic: validate body, call topicModel.createTopic, return 201
       deleteTopic: call topicModel.deleteTopic, return 200
   - backend/routes/topicRoutes.js:
       All routes protected with authMiddleware
       GET    /       → topicController.getTopics
       POST   /       → topicController.createTopic
       DELETE /:id    → topicController.deleteTopic

2. BACKEND — MATERIALS + OCR
   - backend/utils/ocr.js:
       extractFromPdf(buffer): use pdf-parse, return text string
       extractFromImage(filePath): use tesseract.js, recognize 'eng', return text string
   - backend/middleware/uploadMiddleware.js:
       Configure Multer: dest = 'uploads/', accept pdf/jpg/jpeg/png, max 20MB
       Export single file upload middleware as uploadMiddleware
   - backend/models/materialModel.js:
       createMaterial({ user_id, topic_id, file_name, file_url, file_type, status })
       updateMaterial(id, { raw_text, status })
       getMaterialById(id)
       getMaterialsByTopic(topic_id, user_id)
       deleteMaterial(id, user_id)
   - backend/controllers/materialController.js:
       uploadMaterial:
         1. Receive file via req.file (Multer), topic_id via req.body
         2. Upload file to Supabase Storage using @supabase/supabase-js, get public URL
         3. Insert materials row with status = 'processing'
         4. Run OCR based on file type (pdf-parse for PDF, tesseract.js for image)
         5. Update materials row with raw_text and status = 'done'
         6. Delete temp file from uploads/ with fs.unlink
         7. Return full material record
       getMaterial: return material by ID (only if user owns it)
       deleteMaterial: delete from storage + DB
   - backend/routes/materialRoutes.js:
       POST   /upload      → uploadMiddleware + materialController.uploadMaterial
       GET    /:id         → materialController.getMaterial
       DELETE /:id         → materialController.deleteMaterial
   - Install: @supabase/supabase-js pdf-parse tesseract.js

3. FRONTEND — TOPIC LIBRARY PAGE
   - frontend/src/pages/TopicsPage.jsx:
       On mount: GET /api/topics, display in a responsive grid
       Each topic card: colored left border, title, subject_area badge, "Study →" button → /topics/:id
       "+" button opens a modal (use Modal.jsx) to create a custom topic
       Create topic form: title input + description textarea, calls POST /api/topics, refreshes list
       Preset topics have a special "BLEPP" badge
   - frontend/src/components/ui/Modal.jsx:
       Reusable modal with overlay, close button, title prop, children

4. FRONTEND — TOPIC DETAIL PAGE
   - frontend/src/pages/TopicDetailPage.jsx (route /topics/:id):
       Fetch topic + its materials on mount
       Show: topic title, description, subject area badge
       Materials list: file name, upload date, status badge (yellow=processing, green=done, red=failed)
       UploadZone component for adding new materials
       Poll GET /api/materials/:id every 3 seconds for any material with status != 'done'
       Show "Generate Flashcards" button next to each done material → navigates to /topics/:id/flashcards?material_id=X

5. FRONTEND — UPLOAD ZONE COMPONENT
   - frontend/src/components/ui/UploadZone.jsx:
       Uses react-dropzone
       Dashed border (#E5E7EB), hover: border turns red (#E8252A), bg #FFF5F5
       Accepts pdf, jpg, png
       Shows file name after drop
       On file selected: POST /api/materials/upload as multipart/form-data with file + topic_id
       Shows upload progress or loading state

6. FRONTEND — NAVIGATION + LAYOUT
   - frontend/src/components/layout/ProtectedLayout.jsx:
       Renders <Header /> above <Outlet />
       All authenticated pages use this as their parent route in App.jsx

7. DESIGN — match design system from DESIGN_GUIDELINES.md:
   - Topic cards: white bg, 14px radius, shadow-card, colored left border (4px) by topic color
   - Status badges: yellow=processing, green=done, red=failed (use Badge.jsx)
   - Topic color assignment: cycle through #E8252A, #10B981, #3B82F6, #F59E0B, #8B5CF6, #EC4899 per topic index

Provide all file contents in full. Do not use placeholders. Install required packages with exact npm install commands.
```

---

## PHASE 3 — AI Flashcard Generation & Manual Flashcards

**Goal:** Use Gemini API to auto-generate flashcards from uploaded material text. Build the flashcard review/edit flow and manual card creation.

**What you'll have at the end:**
- "Generate Flashcards" flow: Gemini returns cards, user edits/deletes, saves to DB
- Manual flashcard creation form
- Flashcard list with CSS flip animation

---

### ✦ Phase 3 Prompt

```
You are continuing development of Psyckie (PERN stack).
Phases 1 and 2 are complete: auth, topics, and material upload with OCR all work.

FOLDER STRUCTURE:
  backend/  → config/(db.js, gemini.js), controllers/, middleware/, models/, routes/, utils/
  frontend/src/ → components/(layout/, ui/, charts/), pages/, store/, hooks/, lib/

TECH STACK: Node.js + Express + PostgreSQL + React + Vite + Tailwind + Axios + react-icons/ri + Poppins

TASKS FOR THIS PHASE:

1. BACKEND — GEMINI SETUP
   - backend/config/gemini.js:
       const { GoogleGenerativeAI } = require('@google/generative-ai')
       Initialize with process.env.GEMINI_API_KEY
       Export getModel() → returns genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

2. BACKEND — FLASHCARD MODEL & CONTROLLER
   - backend/models/flashcardModel.js:
       getFlashcardsByTopic(topic_id, user_id)
       createFlashcards(cardsArray) ← bulk insert, each: { user_id, topic_id, material_id, front, back, source }
       updateFlashcard(id, user_id, { front, back })
       deleteFlashcard(id, user_id)
   - backend/controllers/flashcardController.js:
       getFlashcards: query by topic_id + user_id
       createFlashcards: accept single object or array, bulk insert, return saved cards
       generateFlashcards:
         1. Accept { material_id, count = 15 } from req.body
         2. Fetch material.raw_text from DB — if empty or status != 'done', return 400
         3. Build Gemini prompt (exact prompt from architecture doc)
         4. Call Gemini API, parse JSON response
         5. Return array to frontend (do NOT save yet — user reviews first)
       updateFlashcard: update front/back for card owned by user
       deleteFlashcard: delete card owned by user
   - backend/routes/flashcardRoutes.js:
       All protected with authMiddleware
       GET    /            → flashcardController.getFlashcards (query: ?topic_id=)
       POST   /            → flashcardController.createFlashcards
       POST   /generate    → flashcardController.generateFlashcards
       PUT    /:id         → flashcardController.updateFlashcard
       DELETE /:id         → flashcardController.deleteFlashcard

3. FRONTEND — FLASHCARD GENERATION REVIEW PAGE
   - frontend/src/pages/FlashcardsPage.jsx (route /topics/:id/flashcards):
       Section 1 — Generation Panel (shown when ?material_id= is in URL):
         "Generate Flashcards" button → POST /api/flashcards/generate
         Show skeleton loading while Gemini generates
         Display generated cards in an editable list:
           Each row: front input (editable) | back textarea (editable) | delete icon (RiDeleteBinLine)
         "Save All" button → POST /api/flashcards with final array + source = 'ai_generated'
         "Regenerate" button to call generate again
       Section 2 — Existing Flashcards:
         Fetch GET /api/flashcards?topic_id=:id
         Show cards in a grid, each is a FlashCard component (see below)
         "Create Manual Card" button opens modal with front/back inputs
         Count badge: "24 cards"

4. FRONTEND — FLASHCARD COMPONENT
   - frontend/src/components/ui/FlashCard.jsx:
       CSS 3D flip animation on click:
         perspective: 1000px on wrapper
         card has two faces (front/back) with backface-visibility: hidden
         transform: rotateY(180deg) when flipped state is true
       Front face: question/term in bold, centered, Poppins 600
       Back face: answer/definition in smaller text
       Edit icon (RiEditLine) and delete icon (RiDeleteBinLine) on hover overlay
       White bg, 14px border radius, shadow-card, hover shadow-card-hover

5. DESIGN:
   - Generated card list: clean rows with inline edit inputs, red delete icon on right
   - Loading: 6 skeleton cards (Skeleton.jsx component, gray pulsing boxes)
   - Empty state: illustration + "No flashcards yet. Upload material and generate your first set."
   - Manual card modal: white modal, front label + input, back label + textarea, save button

Provide all file contents in full. Do not use placeholders.
```

---

## PHASE 4 — Spaced Repetition Review Session

**Goal:** Build the daily flashcard review session powered by the SM-2 algorithm. Users flip cards, rate their recall 1–5, and the algorithm schedules the next review date.

**What you'll have at the end:**
- Daily due card queue fetched from the backend
- Card flip interaction with 5-point recall rating
- SM-2 updates saved per card after each review
- Session summary screen at the end

---

### ✦ Phase 4 Prompt

```
You are continuing development of Psyckie (PERN stack).
Phases 1–3 are complete: auth, topics, material upload, OCR, and AI flashcard generation all work.

FOLDER STRUCTURE:
  backend/  → config/(db.js, gemini.js), controllers/, middleware/, models/, routes/, utils/(sm2.js, ocr.js)
  frontend/src/ → components/(layout/, ui/, charts/), pages/, store/, hooks/, lib/

TECH STACK: Node.js + Express + PostgreSQL + React + Vite + Tailwind + Axios + react-icons/ri + Poppins

TASKS FOR THIS PHASE:

1. BACKEND — SM-2 ALGORITHM
   - backend/utils/sm2.js — implement exactly:
       calculateNextReview(srsRecord, rating):
         if rating < 3: interval = 1, repetitions = 0
         if rating >= 3:
           if repetitions === 0: interval = 1
           if repetitions === 1: interval = 6
           else: interval = Math.round(interval * ease_factor)
           repetitions += 1
         ease_factor = ease_factor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02))
         ease_factor = Math.max(1.3, ease_factor)
         due_date = today + interval days (ISO date string)
         return { ease_factor, interval, repetitions, due_date }
       initSrsRecord(flashcard_id, user_id):
         return { flashcard_id, user_id, ease_factor: 2.5, interval: 1, repetitions: 0, due_date: today }

2. BACKEND — SRS MODEL & CONTROLLER
   - backend/models/flashcardModel.js (add to existing):
       getDueCards(user_id): 
         SELECT flashcards.*, srs_reviews.* 
         FROM flashcards 
         LEFT JOIN srs_reviews ON flashcards.id = srs_reviews.flashcard_id AND srs_reviews.user_id = $1
         WHERE flashcards.user_id = $1 AND (srs_reviews.due_date <= CURRENT_DATE OR srs_reviews.id IS NULL)
       getSrsRecord(flashcard_id, user_id)
       upsertSrsRecord({ flashcard_id, user_id, ease_factor, interval, repetitions, due_date })
       logStudySession({ user_id, session_type, topic_id, duration_secs, cards_reviewed })
   - backend/controllers/srsController.js:
       getDueCards: call getDueCards(userId), return array
       submitReview:
         1. Accept { flashcard_id, rating } from req.body
         2. Get existing srs_reviews row; if none, use initSrsRecord()
         3. Run calculateNextReview(record, rating)
         4. Upsert result to srs_reviews table
         5. Return updated record
       getSrsStats: per-topic counts of total/due/mastered cards for user
   - backend/routes/srsRoutes.js:
       All protected with authMiddleware
       GET  /due       → srsController.getDueCards
       POST /review    → srsController.submitReview
       GET  /stats     → srsController.getSrsStats

3. FRONTEND — REVIEW SESSION PAGE
   - frontend/src/pages/ReviewPage.jsx (route /review):
       On mount: GET /api/srs/due — fetch today's card queue
       If empty: show "All caught up! 🎉" with next session date + back to dashboard button
       Show a progress bar at top: "Card 3 of 12"
       Show current card's FRONT text centered (large, Poppins 700, 24px)
       "Show Answer" button (white pill, red border) flips card to show BACK
       After flip: show 5 rating buttons in a row:
         1 — Blackout (bg #FDE8E8, text red)
         2 — Wrong (bg #FEE2E2, text red)
         3 — Hard (bg #FEF9C3, text amber)
         4 — Good (bg #DCFCE7, text green)
         5 — Perfect (bg #D1FAE5, text green)
       On rating click: POST /api/srs/review { flashcard_id, rating }, advance to next card
       After last card: show SESSION SUMMARY:
         Cards reviewed, breakdown by rating (how many 1s, 2s, etc.), avg rating
         Next review date, "Back to Dashboard" red pill button

4. DASHBOARD UPDATE
   - frontend/src/pages/DashboardPage.jsx — replace placeholder:
       GET /api/srs/stats to get due card count
       Show "Due Today" card with count and "Start Review →" button linking to /review
       Show study streak counter (stub for now, real data in Phase 6)
       Show 3 quick action buttons: "Review Cards", "Take a Quiz", "View Progress"

5. DESIGN:
   - Review card: large white card, 3D flip animation, front text 24px Poppins 700
   - Progress bar: thin #E8252A bar at top showing progress
   - Rating buttons: full-width on mobile, side-by-side on desktop
   - Color-coded rating buttons as specified above
   - Session summary: clean stat layout, motivational message if avg rating > 3.5

Provide all file contents in full. Do not use placeholders.
```

---

## PHASE 5 — AI Quiz Generator & Mock Exam Mode

**Goal:** Generate MCQ quizzes from uploaded materials using Gemini. Support practice mode (untimed) and mock exam mode (timed). Show a detailed results breakdown with per-question AI explanations.

**What you'll have at the end:**
- Quiz generation flow from any processed material
- Timed mock exam mode with auto-submit
- Results page with score, correct answers, and AI explanations
- "Explain this" button for wrong answers

---

### ✦ Phase 5 Prompt

```
You are continuing development of Psyckie (PERN stack).
Phases 1–4 are complete: auth, topics, upload, OCR, flashcard generation, and SRS review all work.

FOLDER STRUCTURE:
  backend/  → config/(db.js, gemini.js), controllers/, middleware/, models/, routes/, utils/(sm2.js, ocr.js)
  frontend/src/ → components/(layout/, ui/, charts/), pages/, store/, hooks/, lib/

TECH STACK: Node.js + Express + PostgreSQL + React + Vite + Tailwind + Axios + react-icons/ri + Poppins

TASKS FOR THIS PHASE:

1. BACKEND — QUIZ MODEL
   - backend/models/quizModel.js:
       createQuiz({ user_id, topic_id, title, mode, time_limit_mins })
       createQuizQuestions(questionsArray) ← bulk insert for quiz_questions
       getQuizById(id, user_id) ← return quiz + questions (omit correct_answer in response)
       getQuizWithAnswers(id, user_id) ← return quiz + questions WITH correct_answer (for scoring)
       createAttempt({ user_id, quiz_id })
       saveResponses(responsesArray) ← bulk insert quiz_responses
       updateAttempt(id, { score, total_questions, time_taken_secs, completed_at })
       getQuizHistory(user_id) ← past completed attempts with quiz title + score

2. BACKEND — QUIZ CONTROLLER
   - backend/controllers/quizController.js:
       generateQuiz:
         1. Accept { material_id, count = 20, mode, time_limit_mins }
         2. Fetch material.raw_text from DB
         3. Send to Gemini with exact quiz prompt from architecture doc
         4. Parse JSON response (array of questions)
         5. Create quiz row, bulk-insert questions
         6. Return { quiz_id, question_count }
       getQuiz: return quiz + questions WITHOUT correct_answer
       startAttempt: create quiz_attempts row, return attempt_id
       submitAttempt:
         1. Accept { attempt_id, responses: [{ question_id, user_answer, time_taken_secs }] }
         2. Fetch questions WITH correct_answer
         3. Grade each response (is_correct), calculate score
         4. Bulk-insert quiz_responses
         5. Update quiz_attempts with score, time, completed_at
         6. Also insert study_sessions record
         7. Return { score, total, responses with correct_answer + explanation }
       explainAnswer:
         Accept { question_text, user_answer, correct_answer }
         Call Gemini with explainer prompt from architecture doc
         Return { explanation }
       getHistory: return quiz history for user
   - backend/routes/quizRoutes.js:
       All protected with authMiddleware
       POST /generate     → quizController.generateQuiz
       GET  /history      → quizController.getHistory
       GET  /:id          → quizController.getQuiz
       POST /:id/attempt  → quizController.startAttempt
       POST /:id/submit   → quizController.submitAttempt
       POST /explain      → quizController.explainAnswer

3. FRONTEND — QUIZ GENERATION UI
   On topic detail page (TopicDetailPage.jsx), next to each processed material:
   - "Generate Quiz" button opens a modal:
       Select count (10 / 20 / 30), mode (Practice / Mock Exam), time limit if mock exam
       On submit: POST /api/quizzes/generate, then navigate to /quiz/:id

4. FRONTEND — QUIZ SESSION PAGE
   - frontend/src/pages/QuizPage.jsx (route /quiz/:id):
       On mount: GET /api/quizzes/:id, POST /api/quizzes/:id/attempt
       Show one question at a time
       Progress: "Question 5 of 20"
       4 answer option buttons (full-width, white bg, hover: red border)
       Selected answer: highlight in indigo
       If time_limit_mins set: countdown timer badge (top right), red when < 60 seconds, auto-submit at 0
       Track time per question
       Practice mode: can navigate back; mock exam mode: cannot go back
       "Next" button → advance; on last question: "Submit Quiz"

5. FRONTEND — QUIZ RESULTS PAGE
   - frontend/src/pages/QuizResultsPage.jsx (route /quiz/:id/results):
       Receive results from navigation state or re-fetch
       Score circle: large (score/total %) in red if < 75%, green if >= 75%
       Pass/fail badge: "PASSED ✓" (green) or "NEEDS REVIEW ✗" (red) — BLEPP passing = 75%
       Question list (all questions):
         Question text
         User's answer (green chip if correct, red chip if wrong)
         Correct answer shown for wrong answers only
         Explanation text collapsed by default, expand on click
         "Explain this" button for wrong answers:
           POST /api/quizzes/explain → show AI explanation inline with spinner while loading
       "Retake Quiz" and "Back to Topics" buttons

6. DESIGN:
   - Quiz options: large rounded buttons (12px radius), selected = bg red-light + red border
   - Timer: pill badge, red bg when < 60s
   - Score circle: large (100px diameter), stroke-dasharray animation on mount
   - Explain button: small outline pill button (border #E8252A, text #E8252A)

Provide all file contents in full. Do not use placeholders.
```

---

## PHASE 6 — Progress Dashboard & Weak Topic Detection

**Goal:** Build the full progress dashboard with Recharts visualizations, study streak calculation, weak topic detection, and time-studied tracking.

**What you'll have at the end:**
- Complete stat dashboard with 4 overview tiles
- Quiz score history line chart with 75% threshold line
- Cards overview donut chart
- Weak topics table with Study Now buttons
- Study time bar chart

---

### ✦ Phase 6 Prompt

```
You are continuing development of Psyckie (PERN stack).
Phases 1–5 are complete: all core study features work — auth, topics, upload, flashcards, SRS, quizzes, results.

FOLDER STRUCTURE:
  backend/  → config/(db.js, gemini.js), controllers/, middleware/, models/, routes/, utils/
  frontend/src/ → components/(layout/, ui/, charts/), pages/, store/, hooks/, lib/

TECH STACK: Node.js + Express + PostgreSQL + React + Vite + Tailwind + Recharts + Axios + react-icons/ri + Poppins

TASKS FOR THIS PHASE:

1. BACKEND — STATS MODEL
   - backend/models/statsModel.js:
       getDashboardStats(user_id): single function returning:
         total_flashcards, cards_due_today, cards_mastered (interval > 21),
         quizzes_taken, average_quiz_score, cards_reviewed_this_week,
         recent_quiz_scores (last 7 attempts: { date, score, quiz_title })
       getWeakTopics(user_id):
         Topics with at least 1 completed attempt, sorted by avg score ASC
         Return top 5: { topic_id, topic_title, average_score, attempts_count, last_attempted }
       getStreak(user_id):
         Query study_sessions grouped by DATE(started_at)
         Calculate current_streak (consecutive days up to today)
         Calculate longest_streak (max consecutive day run)
         Return { current_streak, longest_streak, last_studied_date }
       getStudyTimeThisWeek(user_id):
         Return array of { day: 'Mon', minutes: N } for the last 7 days

2. BACKEND — STATS CONTROLLER & ROUTES
   - backend/controllers/statsController.js:
       getDashboard: call all statsModel functions, combine into one response, return JSON
       getWeakTopics: call statsModel.getWeakTopics
       getStreak: call statsModel.getStreak
   - backend/routes/statsRoutes.js:
       All protected with authMiddleware
       GET /dashboard    → statsController.getDashboard
       GET /weak-topics  → statsController.getWeakTopics
       GET /streak       → statsController.getStreak

3. FRONTEND — CHART COMPONENTS
   - frontend/src/components/charts/ScoreLineChart.jsx:
       Recharts LineChart, data = recent_quiz_scores
       X: date, Y: score (0–100)
       ReferenceLine at y=75 with label "BLEPP Pass Threshold" in red
       Line color: #E8252A, tooltip showing quiz_title + score

   - frontend/src/components/charts/CardsDonutChart.jsx:
       Recharts PieChart (donut style, innerRadius=60)
       Segments: Due Today (red #E8252A), Mastered (green #10B981), In Progress (blue #3B82F6), New (gray #9CA3AF)
       Legend below

   - frontend/src/components/charts/StudyBarChart.jsx:
       Recharts BarChart, data = study time per day (Mon–Sun)
       Bars: fill #E8252A, X: day label, Y: minutes

4. FRONTEND — PROGRESS PAGE
   - frontend/src/pages/ProgressPage.jsx (route /progress):
       On mount: GET /api/stats/dashboard + GET /api/stats/weak-topics + GET /api/stats/streak
       Section 1 — 4 stat tiles (grid-cols-4 → grid-cols-2 on mobile):
         Cards Due Today (red icon, link to /review)
         Cards Mastered (green icon)
         Study Streak — N days 🔥 (amber icon, animated pulse if > 7)
         Avg Quiz Score — N% (blue icon)
       Section 2 — Quiz Score History: <ScoreLineChart />
       Section 3 — Cards Overview: <CardsDonutChart />
       Section 4 — Weak Topics table:
         Columns: Topic | Avg Score | Quizzes | Action
         Avg Score: red text if < 60%, amber if 60–74%, green if >= 75%
         Action: "Study Now →" red pill button → /topics/:id
       Section 5 — Study Time This Week: <StudyBarChart />

5. DASHBOARD FINAL UPDATE
   - frontend/src/pages/DashboardPage.jsx — fully complete:
       GET /api/stats/dashboard + /api/stats/streak
       Row 1: 4 stat tiles same as progress page
       Row 2 left: Top 3 weak topics (card with red/amber/green score badges) + "See all →" link to /progress
       Row 2 right: Profile card (avatar, name, email, BLEPP badge, flashcard + quiz counts)
                    Streak card (red bg, big number, 7-day dot row)
                    Due Today card (list of due topics with counts)

6. DESIGN — match DESIGN_GUIDELINES.md exactly:
   - Stat tile icons: 38×38px colored bg boxes, react-icons/ri icons
   - Charts: ResponsiveContainer wrapper, clean axis labels in Poppins 12px
   - Weak topic table rows: left border colored by score (red/amber/green)
   - All cards: bg white, 14px radius, shadow 0 2px 8px rgba(0,0,0,0.06)

Provide all file contents in full. Do not use placeholders.
```

---

## PHASE 7 — Polish, Email Reminders & Mobile Optimization

**Goal:** Final polish pass — email study reminders via Nodemailer, streak milestone celebrations, complete mobile UI, loading states, and error handling.

**What you'll have at the end:**
- Daily email reminders via Nodemailer + Gmail SMTP
- Streak milestone modals with confetti
- Fully polished mobile UI with bottom tab nav
- Skeleton loading states and error boundaries throughout

---

### ✦ Phase 7 Prompt

```
You are finishing development of Psyckie (PERN stack).
Phases 1–6 are complete. All features work: auth, topics, upload, OCR, flashcards, SRS, quizzes, progress dashboard.

FOLDER STRUCTURE:
  backend/  → config/(db.js, gemini.js), controllers/(all), middleware/(all), models/(all), routes/(all), utils/(sm2.js, ocr.js)
  frontend/src/ → components/(layout/, ui/, charts/), pages/(all), store/, hooks/, lib/

TECH STACK: Node.js + Express + PostgreSQL + React + Vite + Tailwind + Axios + react-icons/ri + Poppins + Nodemailer

TASKS FOR THIS PHASE:

1. EMAIL REMINDERS (Nodemailer)
   - Install: nodemailer
   - Add to backend/.env: EMAIL_USER, EMAIL_PASS (Gmail app password)
   - backend/controllers/reminderController.js:
       sendReminders:
         1. Query all users with srs_reviews.due_date <= today (at least 1 card)
         2. For each user, send email via Nodemailer (Gmail SMTP, port 587):
            Subject: "You have {count} cards due for review today 📚"
            HTML body: card count, "Start Reviewing" button linking to FRONTEND_URL/review, motivational quote
         3. Return { sent: N } JSON
   - backend/routes/reminderRoutes.js:
       POST /send → reminderController.sendReminders (can be called manually or via cron)
   - Add a note in README: set up a free cron job at cron-job.org to POST to /api/reminders/send daily at 8AM PHT

2. SETTINGS PAGE
   - frontend/src/pages/SettingsPage.jsx (route /settings):
       Display name update: input + "Save" → PUT /api/auth/me
       Email reminders toggle: on/off → PATCH /api/users/settings { email_reminders: boolean }
       "Delete my account" button with confirmation modal → DELETE /api/auth/me (cascade deletes all data)
       Show Gemini API free tier note: "15 requests/min, 1,500 req/day"
   - Add PUT /api/auth/me and DELETE /api/auth/me to authController + authRoutes

3. STREAK MILESTONE CELEBRATIONS
   - Install: canvas-confetti
   - frontend/src/components/ui/StreakModal.jsx:
       Shown when streak reaches 3, 7, 14, or 30 days
       Fire canvas-confetti on mount
       Show milestone badge name: "3 Day Starter", "Week Warrior", "2 Week Legend", "Month Master"
       "Keep it up!" close button
       Track shown milestones in localStorage key 'Psyckie_milestones' to never show twice
   - Add to DashboardPage and ReviewPage: check streak after each session, show StreakModal if milestone hit

4. MOBILE UI POLISH
   - frontend/src/components/layout/MobileDrawer.jsx: already exists, finalize it
   - Add a MobileTabBar.jsx component (shown only on mobile ≤640px):
       Fixed bottom bar with 4 tabs: Dashboard (RiDashboardLine), Topics (RiBookOpenLine), Review (RiTimeLine), Progress (RiBarChartLine)
       Active tab: red icon + red underline dot
       Hidden on desktop (hidden md:flex)
   - Audit every page at 375px width — fix any overflow, cramped spacing, or hidden content
   - Quiz answer buttons: w-full on mobile
   - Flashcard flip: works on tap (not just hover)
   - Upload zone: add accept="image/*,application/pdf" and capture="environment" for mobile camera

5. LOADING STATES
   - frontend/src/components/ui/Skeleton.jsx:
       Reusable skeleton block: gray pulsing rounded box (animate-pulse)
       Props: width, height, className
   - Add skeleton states to: DashboardPage (4 stat tiles), TopicsPage (grid), FlashcardsPage (card list), QuizPage (question loading), ProgressPage (charts)
   - Add empty states with icons for: no topics, no flashcards, no materials, no quiz history
   - Wrap App in an ErrorBoundary component that shows a friendly "Something went wrong" page with a reload button

6. TOAST NOTIFICATIONS
   - Install: react-hot-toast
   - Add <Toaster /> to App.jsx
   - Add toast.success / toast.error calls in:
       Login fail, signup fail
       Flashcard saved, deleted
       Quiz submitted
       Material upload success/fail
       Settings saved

7. PERFORMANCE & FINAL TOUCHES
   - Lazy load all page components with React.lazy + Suspense
   - Add <title>Psyckie</title> and favicon to frontend/public/
   - Add a LandingPage at route / (before login):
       App name, tagline, feature highlights (flashcards, SRS, AI quizzes)
       Two CTAs: "Sign In" and "Get Started Free"
       Same red header design
   - Add 404 NotFoundPage for unmatched routes
   - README.md: setup instructions for both backend and frontend, env variable list, how to run migrations, how to set up Gmail SMTP app password

Provide all file contents in full. Do not use placeholders.
```

---

## Quick Reference — Phase Summary

| Phase | Focus | Key Output |
|---|---|---|
| 1 | PERN Setup + JWT Auth | Express server, PostgreSQL schema, React login/signup |
| 2 | Topics + Upload + OCR | Topic library, Multer upload, pdf-parse + tesseract.js |
| 3 | AI Flashcards | Gemini generation, flip card UI, manual CRUD |
| 4 | Spaced Repetition | SM-2 algorithm, daily review session, rating UI |
| 5 | Quizzes + Exam Mode | AI MCQ generation, timed exam, results + explainer |
| 6 | Progress Dashboard | Recharts, stats API, weak topics, streak tracking |
| 7 | Polish + Mobile + Email | Nodemailer reminders, mobile UI, toasts, skeleton loading |

---

> **Tip before each phase:** Paste your current folder tree (`tree -I node_modules`) at the top of the prompt so the AI knows exactly what files already exist and doesn't recreate or overwrite things incorrectly.

---

*Document version 2.0 — PERN Stack (PostgreSQL · Express · React · Node.js) · JWT Auth · Gemini AI · Poppins + react-icons/ri*
