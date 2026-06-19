const express = require("express");
const {
  generateQuiz,
  getQuizzes,
  getQuizById,
} = require("../controllers/quizController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getQuizzes);
router.post("/generate", protect, generateQuiz);
router.get("/:id", getQuizById);

module.exports = router;
