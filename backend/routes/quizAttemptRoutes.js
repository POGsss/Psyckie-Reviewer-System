const express = require("express");
const {
  getQuizAttempts,
  createQuizAttempt,
  getQuizAttemptResults,
  submitQuizAttempt,
} = require("../controllers/quizAttemptController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getQuizAttempts);
router.post("/", protect, createQuizAttempt);
router.get("/:id/results", protect, getQuizAttemptResults);
router.post("/:id/submit", protect, submitQuizAttempt);

module.exports = router;
