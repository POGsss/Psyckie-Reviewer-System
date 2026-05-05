const asyncHandler = require("../utils/asyncHandler");
const { getAll, getById } = require("../models/quizModel");

const getQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await getAll({ topicId: req.query.topic_id });
  res.json({ quizzes });
});

const getQuizById = asyncHandler(async (req, res) => {
  const quiz = await getById(req.params.id);
  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found");
  }

  res.json({ quiz });
});

module.exports = { getQuizzes, getQuizById };
