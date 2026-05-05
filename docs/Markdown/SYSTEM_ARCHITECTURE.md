# Psyckie — System Architecture Plan
### BS Psychology Board Exam Reviewer Web Application

---

## 1. Project Overview

**App Name:** Psyckie  
**Target User:** BS Psychology students preparing for the Philippine Psychometrician Licensure Exam (BLEPP)  
**Platform:** Web application (mobile-responsive), accessible via browser on phone and desktop  
**Core Goal:** Turn hardcopy review materials and study notes into an AI-powered, interactive review system using flashcards, quizzes, spaced repetition, and progress tracking.  
**Stack:** Supabase (PostgreSQL + Auth + Storage) · Express · React · Node.js

---

## 2. Tech Stack

### Frontend
| Layer | Technology | Reason |
|---|---|---|
| Framework | React (Vite) | Fast, component-based, great ecosystem |
| Styling | Tailwind CSS | Rapid UI development, mobile-first |
| Font | Poppins (Google Fonts) | Clean, modern, consistent with design system |
| Icons | react-icons (ri set) | Remix Icons, consistent icon language |
| State Management | Zustand | Lightweight, simple for this scale |
| Routing | React Router v6 | Standard SPA routing |
| HTTP Client | Axios | Clean API calls with interceptors for auth tokens |
| File Upload | react-dropzone | Drag-and-drop + click-to-upload |
| Charts/Progress | Recharts | Study progress dashboards |

### Backend
| Layer | Technology | Reason |
|---|---|---|
| Runtime | Node.js | JavaScript server-side |
| Framework | Express.js | Minimal, flexible REST API framework |
| Language | JavaScript (CommonJS) | Simple, no transpile step needed |
| Database | Supabase (PostgreSQL) | Managed PostgreSQL with Auth & Storage included |
| Supabase Client | @supabase/supabase-js | Direct SQL queries with Supabase client |
| Auth | JWT (jsonwebtoken) + bcrypt | Stateless auth, secure password hashing |
| File Upload | Multer | Multipart form data handling in Express |
| File Storage | Supabase Storage | Free storage tier included with Supabase |
| OCR | Tesseract.js + pdf-parse | Both free and open-source |
| AI | Google Gemini API (gemini-1.5-flash) | Free tier: 15 RPM, 1M tokens/day |
| Spaced Repetition | Custom SM-2 algorithm | Implemented as a pure utility function |
| Email | Nodemailer + Gmail SMTP | Free for personal use |
| Environment | dotenv | Manage environment variables |
| CORS | cors | Allow frontend origin |

### Infrastructure
| Layer | Technology |
|---|---|
| Frontend Hosting | Vercel (free tier) |
| Backend Hosting | Vercel (free tier) |
| Database | Supabase PostgreSQL (free tier) |
| File Storage | Supabase Storage (free tier — 1GB) |
| Auth | Supabase Auth (included in Supabase project) |
| Domain | Vercel subdomain (free) for frontend |

---

## 3. Folder Structure

```
Psyckie/
│
├── backend/
│   ├── config/
│   │   ├── db.js                  ← Supabase client (@supabase/supabase-js)
│   │   └── gemini.js              ← Google Gemini API client setup
│   │
│   ├── controllers/
│   │   ├── authController.js      ← register, login, getMe
│   │   ├── topicController.js     ← getTopics, createTopic, deleteTopic
│   │   ├── materialController.js  ← uploadMaterial, getMaterial, deleteMaterial
│   │   ├── flashcardController.js ← getFlashcards, createFlashcard, generateFlashcards, updateFlashcard, deleteFlashcard
│   │   ├── srsController.js       ← getDueCards, submitReview, getSrsStats
│   │   ├── quizController.js      ← generateQuiz, getQuiz, startAttempt, submitAttempt, getHistory
│   │   ├── statsController.js     ← getDashboard, getWeakTopics, getStreak
│   │   └── reminderController.js  ← sendReminders
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js      ← verifyToken (JWT check on protected routes)
│   │   ├── uploadMiddleware.js    ← Multer config for file uploads
│   │   └── errorMiddleware.js     ← Global error handler
│   │
│   ├── models/
│   │   ├── userModel.js           ← SQL queries for users table
│   │   ├── topicModel.js          ← SQL queries for topics table
│   │   ├── materialModel.js       ← SQL queries for materials table
│   │   ├── flashcardModel.js      ← SQL queries for flashcards + srs_reviews
│   │   ├── quizModel.js           ← SQL queries for quizzes, questions, attempts, responses
│   │   └── statsModel.js          ← SQL queries for dashboard metrics + streak
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── topicRoutes.js
│   │   ├── materialRoutes.js
│   │   ├── flashcardRoutes.js
│   │   ├── srsRoutes.js
│   │   ├── quizRoutes.js
│   │   ├── statsRoutes.js
│   │   └── reminderRoutes.js
│   │
│   ├── utils/
│   │   ├── sm2.js                 ← SM-2 spaced repetition algorithm
│   │   └── ocr.js                 ← OCR helpers (pdf-parse + tesseract.js)
│   │
│   ├── uploads/                   ← Temp local file storage (gitignored)
│   ├── .env                       ← Backend environment variables
│   ├── server.js                  ← Express app entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   └── logo.svg
│   │   │
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── MobileDrawer.jsx
│   │   │   │   └── ProtectedLayout.jsx
│   │   │   ├── ui/
│   │   │   │   ├── StatCard.jsx
│   │   │   │   ├── TopicRow.jsx
│   │   │   │   ├── FlashCard.jsx
│   │   │   │   ├── UploadZone.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Skeleton.jsx
│   │   │   │   └── Toast.jsx
│   │   │   └── charts/
│   │   │       ├── ScoreLineChart.jsx
│   │   │       ├── CardsDonutChart.jsx
│   │   │       └── StudyBarChart.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── TopicsPage.jsx
│   │   │   ├── TopicDetailPage.jsx
│   │   │   ├── FlashcardsPage.jsx
│   │   │   ├── ReviewPage.jsx
│   │   │   ├── QuizPage.jsx
│   │   │   ├── QuizResultsPage.jsx
│   │   │   ├── ProgressPage.jsx
│   │   │   ├── UploadPage.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   │
│   │   ├── store/
│   │   │   └── authStore.js       ← Zustand: user, token, login(), logout()
│   │   │
│   │   ├── hooks/
│   │   │   ├── useApi.js          ← Axios instance with auth header injected
│   │   │   └── useDebounce.js
│   │   │
│   │   ├── lib/
│   │   │   └── axios.js           ← Axios base instance (baseURL = backend URL)
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css              ← Tailwind directives + Poppins import
│   │
│   ├── .env                       ← VITE_API_URL=http://localhost:5000
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 4. Database Schema (Supabase PostgreSQL)

Run these as plain SQL migrations in the Supabase SQL Editor against your Supabase PostgreSQL database.

### `users`
```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  display_name  TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  email_reminders BOOLEAN DEFAULT true,
  created_at    TIMESTAMP DEFAULT NOW(),
  last_active   TIMESTAMP DEFAULT NOW()
);
```

### `topics`
```sql
CREATE TABLE topics (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT,
  subject_area TEXT,
  is_preset    BOOLEAN DEFAULT false,
  created_at   TIMESTAMP DEFAULT NOW()
);
```

### `materials`
```sql
CREATE TABLE materials (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_id    UUID REFERENCES topics(id) ON DELETE CASCADE,
  file_name   TEXT NOT NULL,
  file_url    TEXT,
  file_type   TEXT CHECK (file_type IN ('pdf', 'image', 'text')),
  raw_text    TEXT,
  status      TEXT DEFAULT 'pending' CHECK (status IN ('pending','processing','done','failed')),
  uploaded_at TIMESTAMP DEFAULT NOW()
);
```

### `flashcards`
```sql
CREATE TABLE flashcards (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_id    UUID REFERENCES topics(id) ON DELETE CASCADE,
  material_id UUID REFERENCES materials(id) ON DELETE SET NULL,
  front       TEXT NOT NULL,
  back        TEXT NOT NULL,
  source      TEXT DEFAULT 'manual' CHECK (source IN ('ai_generated','manual')),
  created_at  TIMESTAMP DEFAULT NOW()
);
```

### `srs_reviews`
```sql
CREATE TABLE srs_reviews (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  flashcard_id UUID REFERENCES flashcards(id) ON DELETE CASCADE,
  ease_factor  FLOAT DEFAULT 2.5,
  interval     INTEGER DEFAULT 1,
  repetitions  INTEGER DEFAULT 0,
  due_date     DATE DEFAULT CURRENT_DATE,
  last_reviewed TIMESTAMP,
  rating       INTEGER,
  UNIQUE (user_id, flashcard_id)
);
```

### `quizzes`
```sql
CREATE TABLE quizzes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_id        UUID REFERENCES topics(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  mode            TEXT DEFAULT 'practice' CHECK (mode IN ('practice','mock_exam','weak_areas')),
  time_limit_mins INTEGER,
  created_at      TIMESTAMP DEFAULT NOW()
);
```

### `quiz_questions`
```sql
CREATE TABLE quiz_questions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id       UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  material_id   UUID REFERENCES materials(id) ON DELETE SET NULL,
  question_text TEXT NOT NULL,
  question_type TEXT DEFAULT 'mcq' CHECK (question_type IN ('mcq','true_false','identification')),
  options       JSONB,
  correct_answer TEXT NOT NULL,
  explanation   TEXT
);
```

### `quiz_attempts`
```sql
CREATE TABLE quiz_attempts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  quiz_id         UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  score           INTEGER,
  total_questions INTEGER,
  time_taken_secs INTEGER,
  started_at      TIMESTAMP DEFAULT NOW(),
  completed_at    TIMESTAMP
);
```

### `quiz_responses`
```sql
CREATE TABLE quiz_responses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id      UUID REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id     UUID REFERENCES quiz_questions(id) ON DELETE CASCADE,
  user_answer     TEXT,
  is_correct      BOOLEAN,
  time_taken_secs INTEGER
);
```

### `study_sessions`
```sql
CREATE TABLE study_sessions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID REFERENCES users(id) ON DELETE CASCADE,
  session_type   TEXT CHECK (session_type IN ('flashcard','quiz','reading')),
  topic_id       UUID REFERENCES topics(id) ON DELETE SET NULL,
  duration_secs  INTEGER DEFAULT 0,
  cards_reviewed INTEGER DEFAULT 0,
  started_at     TIMESTAMP DEFAULT NOW()
);
```

### Seed — BLEPP Preset Topics
```sql
INSERT INTO topics (id, user_id, title, description, subject_area, is_preset) VALUES
  (gen_random_uuid(), NULL, 'General Psychology & History',             'Foundations, key figures, and history of psychology',                   'General Psychology',       true),
  (gen_random_uuid(), NULL, 'Developmental Psychology',                  'Human development across the lifespan',                                  'Developmental Psychology', true),
  (gen_random_uuid(), NULL, 'Abnormal Psychology & Psychopathology',     'Mental disorders, DSM-5 classifications, and treatment approaches',      'Abnormal Psychology',      true),
  (gen_random_uuid(), NULL, 'Psychological Assessment & Testing',         'Principles of measurement, test construction, and major psych tests',   'Assessment',               true),
  (gen_random_uuid(), NULL, 'Industrial & Organizational Psychology',     'Workplace psychology, HR, leadership, and organizational behavior',      'I/O Psychology',           true),
  (gen_random_uuid(), NULL, 'Social Psychology',                          'Social influence, group dynamics, attitudes, and interpersonal behavior','Social Psychology',        true),
  (gen_random_uuid(), NULL, 'Theories of Personality',                    'Major personality theories from Freud to contemporary approaches',       'Personality',              true),
  (gen_random_uuid(), NULL, 'Research Methods & Statistics',              'Research design, statistical analysis, and interpretation',              'Research & Statistics',    true),
  (gen_random_uuid(), NULL, 'Counseling & Psychotherapy',                 'Counseling theories, therapeutic techniques, and ethical practice',      'Counseling',               true),
  (gen_random_uuid(), NULL, 'Biological Bases of Behavior',               'Neuroscience, brain structures, genetics, and biopsychology',            'Biopsychology',            true);
```

---

## 5. Application Architecture

```
┌─────────────────────────────┐       ┌──────────────────────────────────────┐
│     React Frontend (Vite)   │       │        Express Backend                │
│  Tailwind + Zustand + RR6   │──────▶│  server.js                           │
│  Hosted: Vercel             │ HTTP  │                                       │
│                             │◀─────│  routes/ → controllers/ → models/     │
│  src/                       │       │  middleware/ (auth, upload, error)    │
│   components/               │       │  utils/ (sm2, ocr)                   │
│   pages/                    │       │  config/ (db, gemini)                │
│   store/ (Zustand)          │       │                                       │
│   hooks/ (axios)            │       │  Hosted: Vercel                      │
└─────────────────────────────┘       └──────────┬───────────────────────────┘
                                                  │
                              ┌───────────────────┼───────────────────┐
                              │                   │                   │
                   ┌───────────────────────────────────┘  ┌─────────────────────┘
                   │     Supabase Project             │  │  Gemini API         │
                   │  ├─ PostgreSQL Database          │  │  gemini-1.5-flash   │
                   │  ├─ Auth Management              │  │  Free tier          │
                   │  └─ Storage (file uploads)       │  │                     │
                   └───────────────────────────────────┘  └─────────────────────┘
```

---

## 6. Express Server Entry Point (`backend/server.js`)

```js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth',      require('./routes/authRoutes'));
app.use('/api/topics',    require('./routes/topicRoutes'));
app.use('/api/materials', require('./routes/materialRoutes'));
app.use('/api/flashcards',require('./routes/flashcardRoutes'));
app.use('/api/srs',       require('./routes/srsRoutes'));
app.use('/api/quizzes',   require('./routes/quizRoutes'));
app.use('/api/stats',     require('./routes/statsRoutes'));
app.use('/api/reminders', require('./routes/reminderRoutes'));

// Global error handler
app.use(require('./middleware/errorMiddleware'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

## 7. API Routes

All routes are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>` header verified by `authMiddleware.js`.

### Auth (`/api/auth`)
```
POST   /api/auth/register       ← { display_name, email, password } → { token, user }
POST   /api/auth/login          ← { email, password } → { token, user }
GET    /api/auth/me             ← [protected] → current user profile
```

### Topics (`/api/topics`) — all protected
```
GET    /api/topics              ← list presets + user's own topics
POST   /api/topics              ← { title, description, subject_area }
DELETE /api/topics/:id
```

### Materials (`/api/materials`) — all protected
```
POST   /api/materials/upload    ← multipart: file + topic_id (Multer handles file)
GET    /api/materials/:id       ← material record + status
DELETE /api/materials/:id
```

### Flashcards (`/api/flashcards`) — all protected
```
GET    /api/flashcards?topic_id=   ← list cards for topic
POST   /api/flashcards             ← { topic_id, front, back, source } or array
POST   /api/flashcards/generate    ← { material_id, count } → Gemini generation
PUT    /api/flashcards/:id         ← { front, back }
DELETE /api/flashcards/:id
```

### SRS (`/api/srs`) — all protected
```
GET    /api/srs/due             ← flashcards due today for user
POST   /api/srs/review          ← { flashcard_id, rating } → update SM-2
GET    /api/srs/stats           ← per-topic retention stats
```

### Quizzes (`/api/quizzes`) — all protected
```
POST   /api/quizzes/generate    ← { material_id, count, mode, time_limit_mins }
GET    /api/quizzes/:id         ← quiz + questions (no correct_answer exposed)
POST   /api/quizzes/:id/attempt ← start attempt → { attempt_id }
POST   /api/quizzes/:id/submit  ← { attempt_id, responses[] } → score + results
GET    /api/quizzes/history     ← past quiz attempts
POST   /api/quizzes/explain     ← { question_text, user_answer, correct_answer }
```

### Stats (`/api/stats`) — all protected
```
GET    /api/stats/dashboard     ← all dashboard metrics
GET    /api/stats/weak-topics   ← lowest accuracy topics
GET    /api/stats/streak        ← streak data
```

### Reminders (`/api/reminders`)
```
POST   /api/reminders/send      ← trigger daily reminder emails (can be cron)
```

---

## 8. Auth Flow (JWT)

```
1. User POSTs email + password to /api/auth/login
2. Controller queries users table, compares password with bcrypt
3. On success: sign JWT with { userId, email }, return token + user to frontend
4. Frontend stores token in Zustand store + localStorage
5. Axios instance in frontend/src/lib/axios.js injects token on every request:
   axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
6. authMiddleware.js on backend verifies token on every protected route
7. Attaches req.user = { userId, email } for controllers to use
```

---

## 9. AI Prompt Design (Gemini API)

All AI calls use **`gemini-1.5-flash`** — free, fast, sufficient for personal use.

### Setup (`backend/config/gemini.js`)
```js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const getModel = () => genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
module.exports = { getModel };
```

### Flashcard Generation Prompt
```
You are a study assistant for a BS Psychology student preparing for the
Philippine Psychometrician Licensure Exam (BLEPP).

Generate exactly {count} flashcards from the material below.
Rules:
- front: question, term, or concept (max 20 words)
- back: precise answer or definition (max 50 words)
- Focus on testable facts, theorists, definitions, and key concepts
- No duplicate cards
- Return ONLY a valid JSON array. No preamble, no markdown fences.

Format: [{"front": "...", "back": "..."}, ...]

Material:
{extracted_text}
```

### Quiz Generation Prompt
```
You are a BLEPP exam question writer for BS Psychology.

Generate exactly {count} multiple-choice questions from the material below.
Rules:
- 4 options per question (A, B, C, D)
- One clearly correct answer
- Include one plausible distractor
- Include a brief explanation for the correct answer
- Return ONLY a valid JSON array. No preamble, no markdown fences.

Format:
[{
  "question_text": "...",
  "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
  "correct_answer": "A",
  "explanation": "..."
}]

Material:
{extracted_text}
```

### Wrong Answer Explainer Prompt
```
You are a friendly tutor helping a psychology student understand a wrong answer.

Question: {question_text}
Student's answer: {user_answer}
Correct answer: {correct_answer}

Explain in 2-3 sentences why the correct answer is right, using plain language.
Do not be condescending. Give a memory tip if helpful.
```

---

## 10. File Upload & Storage with Supabase

```
1. User drops file on UploadZone (react-dropzone)
2. Frontend POSTs to /api/materials/upload (multipart/form-data)
3. Multer middleware saves file to backend/uploads/ temporarily
4. materialController:
   a. Uploads file to Supabase Storage bucket → gets public URL
   b. Creates materials row in Supabase with status = 'processing'
   c. Runs OCR depending on file type:
      - PDF (text-based): pdf-parse → extracts raw text
      - Image / scanned PDF: tesseract.js → OCR
   d. Updates materials record with raw_text, status = 'done'
   e. Deletes temp file from backend/uploads/
5. Returns material record to frontend
6. Frontend shows status badge — polls GET /api/materials/:id every 3s until done

**Supabase Storage Setup:**
- Create a bucket named `materials` in Supabase Storage
- Set bucket to public (allows direct URL access)
- Files stored at: https://your-project.supabase.co/storage/v1/object/public/materials/{filename}
```

**OCR Utilities (`backend/utils/ocr.js`):**
```js
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');

const extractFromPdf = async (buffer) => {
  const data = await pdfParse(buffer);
  return data.text;
};

const extractFromImage = async (filePath) => {
  const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
  return text;
};

module.exports = { extractFromPdf, extractFromImage };
```

---

## 11. SM-2 Algorithm (`backend/utils/sm2.js`)

```js
const calculateNextReview = (srsRecord, rating) => {
  let { ease_factor, interval, repetitions } = srsRecord;

  if (rating < 3) {
    interval = 1;
    repetitions = 0;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * ease_factor);
    repetitions += 1;
  }

  ease_factor = ease_factor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
  ease_factor = Math.max(1.3, ease_factor);

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + interval);

  return { ease_factor, interval, repetitions, due_date: dueDate.toISOString().split('T')[0] };
};

const initSrsRecord = (flashcard_id, user_id) => ({
  flashcard_id, user_id,
  ease_factor: 2.5, interval: 1, repetitions: 0,
  due_date: new Date().toISOString().split('T')[0]
});

module.exports = { calculateNextReview, initSrsRecord };
```

---

## 12. Frontend Page Routes

```
/                         → Landing / Login page
/signup                   → Signup page
/dashboard                → Home: streak, due cards, recent scores
/topics                   → Topic library (presets + custom)
/topics/:id               → Topic detail: materials, flashcards, quizzes
/topics/:id/flashcards    → Flashcard list + flip view
/upload                   → Upload & scan material page
/review                   → SRS flashcard review session
/quiz/:id                 → Active quiz session
/quiz/:id/results         → Post-quiz score and breakdown
/progress                 → Full progress dashboard + charts
/settings                 → Reminder preferences, account
*                         → 404 Not Found
```

---

## 13. Environment Variables

### `backend/.env`
```bash
# Server
PORT=5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_STORAGE_BUCKET=materials

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key_from_google_ai_studio

# Email (Nodemailer + Gmail SMTP)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### `frontend/.env`
```bash
VITE_API_URL=http://localhost:5000
```

---

## 14. Cost Estimate — Mostly Free

| Service | Free Tier | Status |
|---|---|---|
| Vercel (frontend & backend) | Unlimited deploys, 100GB bandwidth, serverless functions | ✅ Free |
| Supabase (PostgreSQL + Storage) | 500MB DB, 1GB storage, 50K MAU | ✅ Free |
| Google Gemini API | 15 RPM, 1,500 req/day, 1M tokens/day | ✅ Free |
| Tesseract.js | Open source | ✅ Free |
| pdf-parse | Open source | ✅ Free |
| Gmail SMTP | Free with app password | ✅ Free |

**Total monthly cost: $0**

---

## 15. Recommended Development Order

1. Set up Supabase project, run all SQL migrations in the Supabase SQL Editor, seed BLEPP topics
2. Initialize Express backend — `server.js`, `config/db.js`, install all dependencies
3. Build auth system — `authController.js`, JWT, `authMiddleware.js`
4. Initialize Vite React frontend — Tailwind, Poppins font, react-icons, Axios instance, Zustand auth store
5. Build login/signup pages + protected routes
6. Build topic library — routes, controller, model, frontend pages
7. Build material upload — Multer, OCR pipeline, Supabase Storage
8. Integrate Gemini API — flashcard generation controller
9. Build SRS review system — SM-2 algorithm, due queue, review session UI
10. Build quiz generator + quiz session + results page
11. Build progress dashboard — stats controller, Recharts
12. Add AI wrong-answer explainer
13. Add email reminders (Nodemailer)
14. Mobile polish + streak milestones + final QA

---

*Document version 3.0 — PERN Stack (PostgreSQL · Express · React · Node.js), JWT Auth, Express REST API, Poppins + react-icons design system.*
