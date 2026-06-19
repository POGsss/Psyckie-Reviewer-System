const { supabase } = require("../config/db");

const quizSelectColumns = "*, topics(title, subject_area)";
const questionPublicColumns =
  "id, quiz_id, question_text, options, order_index, created_at";
const questionAnswerColumns =
  "id, quiz_id, question_text, options, correct_answer, explanation, order_index, created_at";

async function getAll({ topicId } = {}) {
  let query = supabase
    .from("quizzes")
    .select(quizSelectColumns)
    .order("created_at", { ascending: false });

  if (topicId) {
    query = query.eq("topic_id", topicId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
}

async function getById(id, { includeAnswers = false } = {}) {
  const { data, error } = await supabase
    .from("quizzes")
    .select(
      `${quizSelectColumns}, quiz_questions(${
        includeAnswers ? questionAnswerColumns : questionPublicColumns
      })`
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return data;
  }

  return {
    ...data,
    quiz_questions: (data.quiz_questions || []).sort(
      (a, b) => (a.order_index || 0) - (b.order_index || 0)
    ),
  };
}

async function getQuestionsByQuizId(quizId) {
  const { data, error } = await supabase
    .from("quiz_questions")
    .select(questionAnswerColumns)
    .eq("quiz_id", quizId)
    .order("order_index", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

async function createQuiz({ topicId, title, totalQuestions }) {
  const { data, error } = await supabase
    .from("quizzes")
    .insert([
      {
        topic_id: topicId,
        title,
        total_questions: totalQuestions || 0,
      },
    ])
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function createQuestions(questions) {
  const { data, error } = await supabase
    .from("quiz_questions")
    .insert(questions)
    .select(questionAnswerColumns);

  if (error) {
    throw error;
  }

  return data;
}

module.exports = {
  createQuestions,
  createQuiz,
  getAll,
  getById,
  getQuestionsByQuizId,
};
