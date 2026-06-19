const asyncHandler = require("../utils/asyncHandler");
const { calculateNextReview, normalizeRating } = require("../utils/srsScheduler");
const { createSession } = require("../models/studySessionModel");
const {
  createReview,
  getAllByUser,
  getByIdForUser,
  getDueByUser,
  getReviewsByIdsForUser,
  getStatsByUser,
  updateReviewSchedule,
} = require("../models/srsReviewModel");

const getSrsReviews = asyncHandler(async (req, res) => {
  const reviews = await getAllByUser(req.user.id);
  res.json({ reviews });
});

const getDueSrsReviews = asyncHandler(async (req, res) => {
  const reviews = await getDueByUser(req.user.id);
  res.json({ reviews });
});

const getSrsReviewStats = asyncHandler(async (req, res) => {
  const stats = await getStatsByUser(req.user.id);
  res.json({ stats });
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

const submitSrsRating = asyncHandler(async (req, res) => {
  const { rating } = req.body;
  const normalizedRating = normalizeRating(rating);

  if (!normalizedRating) {
    res.status(400);
    throw new Error("rating must be one of: again, hard, good, easy");
  }

  const existingReview = await getByIdForUser(req.params.id, req.user.id);
  if (!existingReview) {
    res.status(404);
    throw new Error("SRS review not found");
  }

  const schedule = calculateNextReview({
    dueAt: existingReview.due_at,
    intervalDays: existingReview.interval_days,
    easeFactor: existingReview.ease_factor,
    rating: normalizedRating,
  });

  const review = await updateReviewSchedule({
    id: existingReview.id,
    userId: req.user.id,
    dueAt: schedule.due_at,
    intervalDays: schedule.interval_days,
    easeFactor: schedule.ease_factor,
    lastReviewedAt: schedule.reviewed_at,
  });

  res.json({ review, schedule });
});

const finishSrsSession = asyncHandler(async (req, res) => {
  const { reviewed_review_ids, started_at, ended_at, duration_minutes } =
    req.body;

  const reviewedIds = Array.isArray(reviewed_review_ids)
    ? [...new Set(reviewed_review_ids.filter(Boolean))]
    : [];

  if (reviewedIds.length === 0) {
    res.status(400);
    throw new Error("reviewed_review_ids is required");
  }

  const reviews = await getReviewsByIdsForUser(reviewedIds, req.user.id);
  const topicIds = [
    ...new Set(
      reviews
        .map((review) => review.flashcards?.topic_id)
        .filter((topicId) => Boolean(topicId))
    ),
  ];

  if (topicIds.length === 0) {
    res.status(400);
    throw new Error("No reviewed flashcards with topics were found");
  }

  const endedAt = ended_at || new Date().toISOString();
  const startedAt = started_at || endedAt;
  const parsedDuration = Number(duration_minutes);
  const fallbackDuration = Math.max(
    1,
    Math.round((new Date(endedAt) - new Date(startedAt)) / 60000) || 1
  );
  const totalDuration = Number.isFinite(parsedDuration)
    ? Math.max(1, Math.round(parsedDuration))
    : fallbackDuration;
  const perTopicDuration = Math.max(1, Math.round(totalDuration / topicIds.length));

  const sessions = await Promise.all(
    topicIds.map((topicId) =>
      createSession({
        userId: req.user.id,
        topicId,
        startedAt,
        endedAt,
        durationMinutes: perTopicDuration,
      })
    )
  );

  res.status(201).json({
    sessions,
    summary: {
      reviewed_count: reviews.length,
      topic_count: topicIds.length,
      duration_minutes: totalDuration,
    },
  });
});

module.exports = {
  createSrsReview,
  finishSrsSession,
  getDueSrsReviews,
  getSrsReviewStats,
  getSrsReviews,
  submitSrsRating,
};
