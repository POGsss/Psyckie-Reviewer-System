const express = require("express");
const { getQuizzes, getQuizById } = require("../controllers/quizController");

const router = express.Router();

router.get("/", getQuizzes);
router.get("/:id", getQuizById);

module.exports = router;
