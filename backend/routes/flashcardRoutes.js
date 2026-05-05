const express = require("express");
const {
  getFlashcards,
  getFlashcardById,
} = require("../controllers/flashcardController");

const router = express.Router();

router.get("/", getFlashcards);
router.get("/:id", getFlashcardById);

module.exports = router;
