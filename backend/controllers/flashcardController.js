const asyncHandler = require("../utils/asyncHandler");
const { getAll, getById } = require("../models/flashcardModel");

const getFlashcards = asyncHandler(async (req, res) => {
  const flashcards = await getAll({ topicId: req.query.topic_id });
  res.json({ flashcards });
});

const getFlashcardById = asyncHandler(async (req, res) => {
  const flashcard = await getById(req.params.id);
  if (!flashcard) {
    res.status(404);
    throw new Error("Flashcard not found");
  }

  res.json({ flashcard });
});

module.exports = { getFlashcards, getFlashcardById };
