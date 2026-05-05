const { supabase } = require("../config/db");

async function getAllByUser(userId, { quizId } = {}) {
  let query = supabase
    .from("quiz_attempts")
    .select("*")
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

async function createAttempt({ userId, quizId, score, startedAt, completedAt }) {
  const payload = {
    user_id: userId,
    quiz_id: quizId,
    score: score ?? 0,
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

module.exports = { getAllByUser, createAttempt };
