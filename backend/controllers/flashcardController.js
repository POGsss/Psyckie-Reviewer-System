const asyncHandler = require("../utils/asyncHandler");
const {
  createFlashcard: insertFlashcard,
  deleteFlashcard: deleteOwnedFlashcard,
  getAll,
  getById,
  updateFlashcard: updateOwnedFlashcard,
} = require("../models/flashcardModel");
const { getById: getTopicById } = require("../models/topicModel");

const normalizeDifficulty = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 1;
  }

  return Math.min(Math.max(Math.round(parsed), 1), 5);
};

const getFlashcards = asyncHandler(async (req, res) => {
  const flashcards = await getAll({
    topicId: req.query.topic_id,
    userId: req.user.id,
  });
  res.json({ flashcards });
});

const getFlashcardById = asyncHandler(async (req, res) => {
  const flashcard = await getById(req.params.id, { userId: req.user.id });
  if (!flashcard) {
    res.status(404);
    throw new Error("Flashcard not found");
  }

  res.json({ flashcard });
});

const createFlashcard = asyncHandler(async (req, res) => {
  const { topic_id, question, answer, difficulty } = req.body;

  if (!topic_id) {
    res.status(400);
    throw new Error("Topic is required");
  }

  if (!question || !question.trim()) {
    res.status(400);
    throw new Error("Flashcard question is required");
  }

  if (!answer || !answer.trim()) {
    res.status(400);
    throw new Error("Flashcard answer is required");
  }

  const topic = await getTopicById(topic_id, { userId: req.user.id });
  if (!topic) {
    res.status(404);
    throw new Error("Topic not found");
  }

  const flashcard = await insertFlashcard({
    topicId: topic_id,
    userId: req.user.id,
    question: question.trim(),
    answer: answer.trim(),
    difficulty: normalizeDifficulty(difficulty),
  });

  res.status(201).json({ flashcard });
});

const updateFlashcard = asyncHandler(async (req, res) => {
  const { question, answer, difficulty } = req.body;

  if (!question || !question.trim()) {
    res.status(400);
    throw new Error("Flashcard question is required");
  }

  if (!answer || !answer.trim()) {
    res.status(400);
    throw new Error("Flashcard answer is required");
  }

  const flashcard = await updateOwnedFlashcard({
    id: req.params.id,
    userId: req.user.id,
    question: question.trim(),
    answer: answer.trim(),
    difficulty: normalizeDifficulty(difficulty),
  });

  if (!flashcard) {
    res.status(404);
    throw new Error("Flashcard not found");
  }

  res.json({ flashcard });
});

const deleteFlashcard = asyncHandler(async (req, res) => {
  const deleted = await deleteOwnedFlashcard({
    id: req.params.id,
    userId: req.user.id,
  });

  if (!deleted) {
    res.status(404);
    throw new Error("Flashcard not found");
  }

  res.json({ message: "Flashcard deleted" });
});

module.exports = {
  createFlashcard,
  deleteFlashcard,
  getFlashcards,
  getFlashcardById,
  updateFlashcard,
};
