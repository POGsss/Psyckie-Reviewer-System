const express = require("express");
const {
  getSrsReviews,
  createSrsReview,
} = require("../controllers/srsReviewController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getSrsReviews);
router.post("/", protect, createSrsReview);

module.exports = router;
