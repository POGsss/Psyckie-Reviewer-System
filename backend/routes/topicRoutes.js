const express = require("express");
const {
  createTopic,
  deleteTopic,
  getTopics,
  getTopicById,
} = require("../controllers/topicController");
const { optionalAuth, protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", optionalAuth, getTopics);
router.post("/", protect, createTopic);
router.get("/:id", optionalAuth, getTopicById);
router.delete("/:id", protect, deleteTopic);

module.exports = router;
