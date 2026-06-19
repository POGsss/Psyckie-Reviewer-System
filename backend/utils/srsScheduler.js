const REVIEW_RATINGS = {
  again: {
    label: "Again",
    score: 1,
  },
  hard: {
    label: "Hard",
    score: 2,
  },
  good: {
    label: "Good",
    score: 3,
  },
  easy: {
    label: "Easy",
    score: 4,
  },
};

const MIN_EASE = 1.3;
const MAX_EASE = 3.0;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const normalizeRating = (rating) => {
  const value = String(rating || "").toLowerCase().trim();
  if (!REVIEW_RATINGS[value]) {
    return null;
  }

  return value;
};

const addDays = (date, days) => {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
};

const addMinutes = (date, minutes) => {
  const nextDate = new Date(date);
  nextDate.setUTCMinutes(nextDate.getUTCMinutes() + minutes);
  return nextDate;
};

function calculateNextReview({
  dueAt,
  intervalDays = 0,
  easeFactor = 2.5,
  rating,
  reviewedAt = new Date(),
}) {
  const normalizedRating = normalizeRating(rating);
  if (!normalizedRating) {
    throw new Error("rating must be one of: again, hard, good, easy");
  }

  const currentInterval = Math.max(0, Math.round(Number(intervalDays) || 0));
  const currentEase = clamp(Number(easeFactor) || 2.5, MIN_EASE, MAX_EASE);
  const reviewDate = reviewedAt instanceof Date ? reviewedAt : new Date(reviewedAt);
  const previousDueAt = dueAt ? new Date(dueAt) : reviewDate;

  let nextIntervalDays = currentInterval;
  let nextEaseFactor = currentEase;
  let nextDueAt;

  switch (normalizedRating) {
    case "again":
      nextIntervalDays = 0;
      nextEaseFactor = clamp(currentEase - 0.2, MIN_EASE, MAX_EASE);
      nextDueAt = addMinutes(reviewDate, 10);
      break;
    case "hard":
      nextIntervalDays = Math.max(1, Math.ceil(currentInterval * 1.2));
      nextEaseFactor = clamp(currentEase - 0.15, MIN_EASE, MAX_EASE);
      nextDueAt = addDays(reviewDate, nextIntervalDays);
      break;
    case "easy":
      nextIntervalDays =
        currentInterval === 0
          ? 4
          : Math.max(2, Math.ceil(currentInterval * currentEase * 1.3));
      nextEaseFactor = clamp(currentEase + 0.15, MIN_EASE, MAX_EASE);
      nextDueAt = addDays(reviewDate, nextIntervalDays);
      break;
    case "good":
    default:
      nextIntervalDays =
        currentInterval === 0
          ? 1
          : Math.max(1, Math.ceil(currentInterval * currentEase));
      nextDueAt = addDays(reviewDate, nextIntervalDays);
      break;
  }

  return {
    previous_due_at: previousDueAt.toISOString(),
    reviewed_at: reviewDate.toISOString(),
    rating: normalizedRating,
    rating_score: REVIEW_RATINGS[normalizedRating].score,
    due_at: nextDueAt.toISOString(),
    interval_days: nextIntervalDays,
    ease_factor: Number(nextEaseFactor.toFixed(2)),
  };
}

module.exports = {
  REVIEW_RATINGS,
  calculateNextReview,
  normalizeRating,
};
