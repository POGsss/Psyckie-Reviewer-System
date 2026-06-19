const asyncHandler = require("../utils/asyncHandler");
const { getAllByUser, createResponse } = require("../models/quizResponseModel");

const parseBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
};

const getQuizResponses = asyncHandler(async (req, res) => {
  const responses = await getAllByUser(req.user.id, {
    attemptId: req.query.attempt_id,
  });
  res.json({ responses });
});

const createQuizResponse = asyncHandler(async (req, res) => {
  const {
    attempt_id,
    question_id,
    question,
    correct_answer,
    user_answer,
    is_correct,
    explanation,
  } = req.body;

  if (!attempt_id || !question) {
    res.status(400);
    throw new Error("attempt_id and question are required");
  }

  let normalizedIsCorrect = parseBoolean(is_correct);

  if (
    typeof normalizedIsCorrect !== "boolean" &&
    typeof correct_answer === "string" &&
    typeof user_answer === "string"
  ) {
    normalizedIsCorrect = correct_answer.trim() === user_answer.trim();
  }

  const response = await createResponse({
    userId: req.user.id,
    attemptId: attempt_id,
    questionId: question_id,
    question,
    correctAnswer: correct_answer,
    userAnswer: user_answer,
    isCorrect: normalizedIsCorrect,
    explanation,
  });

  res.status(201).json({ response });
});

module.exports = { getQuizResponses, createQuizResponse };
