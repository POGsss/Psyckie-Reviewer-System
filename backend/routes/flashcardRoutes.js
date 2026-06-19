const express = require("express");
const {
  createFlashcard,
  deleteFlashcard,
  getFlashcards,
  getFlashcardById,
  updateFlashcard,
} = require("../controllers/flashcardController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getFlashcards);
router.post("/", createFlashcard);
router.get("/:id", getFlashcardById);
router.put("/:id", updateFlashcard);
router.delete("/:id", deleteFlashcard);

module.exports = router;
