const { supabase } = require("../config/db");

async function getAllByUser(userId, { attemptId } = {}) {
  let query = supabase
    .from("quiz_responses")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (attemptId) {
    query = query.eq("attempt_id", attemptId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
}

async function createResponse({
  userId,
  attemptId,
  question,
  correctAnswer,
  userAnswer,
  isCorrect,
}) {
  const payload = {
    user_id: userId,
    attempt_id: attemptId,
    question,
    correct_answer: correctAnswer ?? null,
    user_answer: userAnswer ?? null,
    is_correct: isCorrect ?? null,
  };

  const { data, error } = await supabase
    .from("quiz_responses")
    .insert([payload])
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

module.exports = { getAllByUser, createResponse };
