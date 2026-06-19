const { supabase } = require("../config/db");

async function getAllByUser(userId, { quizId } = {}) {
  let query = supabase
    .from("quiz_attempts")
    .select("*, quizzes(title, topic_id, topics(title, subject_area))")
    .eq("user_id", userId)
    .order("started_at", { ascending: false });

  if (quizId) {
    query = query.eq("quiz_id", quizId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
}

async function getByIdForUser(id, userId) {
  const { data, error } = await supabase
    .from("quiz_attempts")
    .select("*, quizzes(title, topic_id, topics(title, subject_area))")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function createAttempt({
  userId,
  quizId,
  score,
  startedAt,
  completedAt,
  mode,
  totalQuestions,
}) {
  const payload = {
    user_id: userId,
    quiz_id: quizId,
    score: score ?? 0,
    correct_count: 0,
    total_questions: totalQuestions ?? 0,
    mode: mode || "practice",
    started_at: startedAt || new Date().toISOString(),
    completed_at: completedAt ?? null,
  };

  const { data, error } = await supabase
    .from("quiz_attempts")
    .insert([payload])
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function updateAttemptResult({
  attemptId,
  userId,
  score,
  correctCount,
  totalQuestions,
  completedAt,
}) {
  const { data, error } = await supabase
    .from("quiz_attempts")
    .update({
      score,
      correct_count: correctCount,
      total_questions: totalQuestions,
      completed_at: completedAt || new Date().toISOString(),
    })
    .eq("id", attemptId)
    .eq("user_id", userId)
    .select("*, quizzes(title, topic_id, topics(title, subject_area))")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

module.exports = {
  createAttempt,
  getAllByUser,
  getByIdForUser,
  updateAttemptResult,
};
