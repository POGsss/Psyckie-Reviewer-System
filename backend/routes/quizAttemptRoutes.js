const express = require("express");
const {
  getQuizAttempts,
  createQuizAttempt,
} = require("../controllers/quizAttemptController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getQuizAttempts);
router.post("/", protect, createQuizAttempt);

module.exports = router;
