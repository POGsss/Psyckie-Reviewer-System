const asyncHandler = require("../utils/asyncHandler");
const { getAllByUser, createReview } = require("../models/srsReviewModel");

const getSrsReviews = asyncHandler(async (req, res) => {
  const reviews = await getAllByUser(req.user.id);
  res.json({ reviews });
});

const createSrsReview = asyncHandler(async (req, res) => {
  const { flashcard_id, due_at, interval_days, ease_factor, last_reviewed_at } =
    req.body;

  if (!flashcard_id) {
    res.status(400);
    throw new Error("flashcard_id is required");
  }

  const intervalDays = Number(interval_days);
  const easeFactor = Number(ease_factor);

  const review = await createReview({
    userId: req.user.id,
    flashcardId: flashcard_id,
    dueAt: due_at,
    intervalDays: Number.isFinite(intervalDays) ? intervalDays : undefined,
    easeFactor: Number.isFinite(easeFactor) ? easeFactor : undefined,
    lastReviewedAt: last_reviewed_at,
  });

  res.status(201).json({ review });
});

module.exports = { getSrsReviews, createSrsReview };
