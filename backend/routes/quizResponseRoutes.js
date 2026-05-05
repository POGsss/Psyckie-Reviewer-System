const express = require("express");
const {
  getQuizResponses,
  createQuizResponse,
} = require("../controllers/quizResponseController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getQuizResponses);
router.post("/", protect, createQuizResponse);

module.exports = router;
