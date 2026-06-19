const { supabase } = require("../config/db");

async function getAllByUser(userId, { attemptId } = {}) {
  let query = supabase
    .from("quiz_responses")
    .select("*")
    .eq("user_id", userId);

  if (attemptId) {
    query = query.eq("attempt_id", attemptId);
  }

  query = query.order("created_at", { ascending: Boolean(attemptId) });

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
}

async function createResponse({
  userId,
  attemptId,
  questionId,
  question,
  correctAnswer,
  userAnswer,
  isCorrect,
  explanation,
}) {
  const payload = {
    user_id: userId,
    attempt_id: attemptId,
    question_id: questionId ?? null,
    question,
    correct_answer: correctAnswer ?? null,
    user_answer: userAnswer ?? null,
    is_correct: isCorrect ?? null,
    explanation: explanation ?? null,
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

async function createResponses(responses) {
  const { data, error } = await supabase
    .from("quiz_responses")
    .insert(
      responses.map((response) => ({
        user_id: response.userId,
        attempt_id: response.attemptId,
        question_id: response.questionId,
        question: response.question,
        correct_answer: response.correctAnswer,
        user_answer: response.userAnswer,
        is_correct: response.isCorrect,
        explanation: response.explanation ?? null,
      }))
    )
    .select("*");

  if (error) {
    throw error;
  }

  return data;
}

async function deleteByAttempt({ attemptId, userId }) {
  const { error } = await supabase
    .from("quiz_responses")
    .delete()
    .eq("attempt_id", attemptId)
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
}

module.exports = {
  createResponse,
  createResponses,
  deleteByAttempt,
  getAllByUser,
};
