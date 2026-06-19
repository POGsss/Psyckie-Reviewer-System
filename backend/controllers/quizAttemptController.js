const asyncHandler = require("../utils/asyncHandler");
const {
  getAllByUser,
  createAttempt,
  getByIdForUser,
  updateAttemptResult,
} = require("../models/quizAttemptModel");
const { getById, getQuestionsByQuizId } = require("../models/quizModel");
const {
  createResponses,
  deleteByAttempt,
  getAllByUser: getResponsesByUser,
} = require("../models/quizResponseModel");

const normalizeMode = (mode) => (mode === "mock" ? "mock" : "practice");

const normalizeAnswer = (value) =>
  typeof value === "string" ? value.trim() : "";

const getQuizAttempts = asyncHandler(async (req, res) => {
  const attempts = await getAllByUser(req.user.id, {
    quizId: req.query.quiz_id,
  });
  res.json({ attempts });
});

const createQuizAttempt = asyncHandler(async (req, res) => {
  const { quiz_id, score, started_at, completed_at, mode } = req.body;

  if (!quiz_id) {
    res.status(400);
    throw new Error("quiz_id is required");
  }

  const quiz = await getById(quiz_id);
  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found");
  }

  if (!quiz.quiz_questions || quiz.quiz_questions.length === 0) {
    res.status(400);
    throw new Error("Quiz does not have questions yet");
  }

  const scoreValue = Number(score);

  const attempt = await createAttempt({
    userId: req.user.id,
    quizId: quiz_id,
    score: Number.isFinite(scoreValue) ? scoreValue : undefined,
    startedAt: started_at,
    completedAt: completed_at,
    mode: normalizeMode(mode),
    totalQuestions: quiz.quiz_questions.length,
  });

  res.status(201).json({ attempt });
});

const submitQuizAttempt = asyncHandler(async (req, res) => {
  const attempt = await getByIdForUser(req.params.id, req.user.id);
  if (!attempt) {
    res.status(404);
    throw new Error("Quiz attempt not found");
  }

  if (attempt.completed_at) {
    res.status(400);
    throw new Error("Quiz attempt has already been submitted");
  }

  const submittedResponses = Array.isArray(req.body.responses)
    ? req.body.responses
    : [];

  if (submittedResponses.length === 0) {
    res.status(400);
    throw new Error("responses are required");
  }

  const questions = await getQuestionsByQuizId(attempt.quiz_id);
  if (questions.length === 0) {
    res.status(400);
    throw new Error("Quiz does not have questions yet");
  }

  const responsesByQuestionId = new Map();
  for (const response of submittedResponses) {
    if (!response.question_id) {
      res.status(400);
      throw new Error("Each response must include question_id");
    }

    if (responsesByQuestionId.has(response.question_id)) {
      res.status(400);
      throw new Error("Duplicate question responses are not allowed");
    }

    responsesByQuestionId.set(response.question_id, response);
  }

  const missingQuestion = questions.find(
    (question) => !responsesByQuestionId.has(question.id)
  );
  if (missingQuestion) {
    res.status(400);
    throw new Error("All quiz questions must be answered before submitting");
  }

  const unknownResponse = submittedResponses.find(
    (response) => !questions.some((question) => question.id === response.question_id)
  );
  if (unknownResponse) {
    res.status(400);
    throw new Error("Response includes a question outside this quiz");
  }

  const scoredResponses = questions.map((question) => {
    const submitted = responsesByQuestionId.get(question.id);
    const userAnswer = normalizeAnswer(submitted.user_answer);
    const correctAnswer = normalizeAnswer(question.correct_answer);
    const isCorrect =
      userAnswer.toLocaleLowerCase() === correctAnswer.toLocaleLowerCase();

    return {
      userId: req.user.id,
      attemptId: attempt.id,
      questionId: question.id,
      question: question.question_text,
      correctAnswer: question.correct_answer,
      userAnswer,
      isCorrect,
      explanation: question.explanation,
    };
  });

  await deleteByAttempt({ attemptId: attempt.id, userId: req.user.id });
  const responses = await createResponses(scoredResponses);
  const correctCount = scoredResponses.filter((response) => response.isCorrect)
    .length;
  const score = Number(((correctCount / questions.length) * 100).toFixed(2));
  const updatedAttempt = await updateAttemptResult({
    attemptId: attempt.id,
    userId: req.user.id,
    score,
    correctCount,
    totalQuestions: questions.length,
    completedAt: req.body.completed_at,
  });

  res.json({
    attempt: updatedAttempt,
    responses,
    results: {
      score,
      correct_count: correctCount,
      total_questions: questions.length,
    },
  });
});

const getQuizAttemptResults = asyncHandler(async (req, res) => {
  const attempt = await getByIdForUser(req.params.id, req.user.id);
  if (!attempt) {
    res.status(404);
    throw new Error("Quiz attempt not found");
  }

  const responses = await getResponsesByUser(req.user.id, {
    attemptId: attempt.id,
  });

  res.json({
    attempt,
    responses,
  });
});

module.exports = {
  createQuizAttempt,
  getQuizAttemptResults,
  getQuizAttempts,
  submitQuizAttempt,
};
