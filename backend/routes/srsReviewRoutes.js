const express = require("express");
const {
  finishSrsSession,
  getDueSrsReviews,
  getSrsReviews,
  getSrsReviewStats,
  createSrsReview,
  submitSrsRating,
} = require("../controllers/srsReviewController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/due", getDueSrsReviews);
router.get("/stats", getSrsReviewStats);
router.post("/sessions/finish", finishSrsSession);
router.post("/:id/rate", submitSrsRating);
router.get("/", getSrsReviews);
router.post("/", createSrsReview);

module.exports = router;
