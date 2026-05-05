const express = require("express");
const {
  getStudySessions,
  createStudySession,
} = require("../controllers/studySessionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getStudySessions);
router.post("/", protect, createStudySession);

module.exports = router;
