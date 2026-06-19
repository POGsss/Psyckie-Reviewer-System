create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  full_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists topics (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  order_index int not null default 0,
  user_id uuid references users(id) on delete cascade,
  subject_area text,
  is_preset boolean not null default false,
  created_at timestamptz not null default now()
);

alter table if exists topics
  add column if not exists title text,
  add column if not exists description text,
  add column if not exists order_index int not null default 0,
  add column if not exists user_id uuid references users(id) on delete cascade,
  add column if not exists subject_area text,
  add column if not exists is_preset boolean not null default false,
  add column if not exists created_at timestamptz not null default now();

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'topics'
      and column_name = 'name'
  ) then
    execute 'update topics set title = name where title is null and name is not null';
  end if;

  if not exists (select 1 from topics where title is null) then
    alter table topics alter column title set not null;
  end if;
end $$;

create index if not exists idx_topics_title on topics(title);
create index if not exists idx_topics_user_id on topics(user_id);

create table if not exists materials (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references topics(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  title text not null,
  content text not null,
  content_type text not null default 'markdown',
  source_url text,
  created_at timestamptz not null default now()
);

alter table if exists materials
  add column if not exists user_id uuid references users(id) on delete cascade;

create table if not exists flashcards (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references topics(id) on delete cascade,
  question text not null,
  answer text not null,
  difficulty int not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists srs_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  flashcard_id uuid not null references flashcards(id) on delete cascade,
  due_at timestamptz not null default now(),
  interval_days int not null default 0,
  ease_factor numeric(4,2) not null default 2.50,
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, flashcard_id)
);

create table if not exists quizzes (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references topics(id) on delete cascade,
  title text not null,
  total_questions int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references quizzes(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  score numeric(5,2) not null default 0,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists quiz_responses (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references quiz_attempts(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  question text not null,
  correct_answer text,
  user_answer text,
  is_correct boolean,
  created_at timestamptz not null default now()
);

create table if not exists study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  topic_id uuid not null references topics(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_minutes int,
  created_at timestamptz not null default now()
);

create index if not exists idx_materials_topic_id on materials(topic_id);
create index if not exists idx_materials_user_id on materials(user_id);
create index if not exists idx_flashcards_topic_id on flashcards(topic_id);
create index if not exists idx_srs_reviews_user_id on srs_reviews(user_id);
create index if not exists idx_quizzes_topic_id on quizzes(topic_id);
create index if not exists idx_quiz_attempts_user_id on quiz_attempts(user_id);
create index if not exists idx_quiz_responses_user_id on quiz_responses(user_id);
create index if not exists idx_study_sessions_user_id on study_sessions(user_id);

notify pgrst, 'reload schema';
