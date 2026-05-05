const asyncHandler = require("../utils/asyncHandler");
const { getAllByUser, createAttempt } = require("../models/quizAttemptModel");

const getQuizAttempts = asyncHandler(async (req, res) => {
  const attempts = await getAllByUser(req.user.id, {
    quizId: req.query.quiz_id,
  });
  res.json({ attempts });
});

const createQuizAttempt = asyncHandler(async (req, res) => {
  const { quiz_id, score, started_at, completed_at } = req.body;

  if (!quiz_id) {
    res.status(400);
    throw new Error("quiz_id is required");
  }

  const scoreValue = Number(score);

  const attempt = await createAttempt({
    userId: req.user.id,
    quizId: quiz_id,
    score: Number.isFinite(scoreValue) ? scoreValue : undefined,
    startedAt: started_at,
    completedAt: completed_at,
  });

  res.status(201).json({ attempt });
});

module.exports = { getQuizAttempts, createQuizAttempt };
