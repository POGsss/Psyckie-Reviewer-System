const { supabase } = require("../config/db");

const reviewSelect =
  "*, flashcards(id, topic_id, question, answer, difficulty, user_id, topics(id, title, subject_area))";

async function getAllByUser(userId) {
  const { data, error } = await supabase
    .from("srs_reviews")
    .select(reviewSelect)
    .eq("user_id", userId)
    .order("due_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

async function getDueByUser(userId, { now = new Date().toISOString() } = {}) {
  const { data, error } = await supabase
    .from("srs_reviews")
    .select(reviewSelect)
    .eq("user_id", userId)
    .lte("due_at", now)
    .order("due_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

async function getByIdForUser(id, userId) {
  const { data, error } = await supabase
    .from("srs_reviews")
    .select(reviewSelect)
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function createReview({
  userId,
  flashcardId,
  dueAt,
  intervalDays,
  easeFactor,
  lastReviewedAt,
}) {
  const payload = {
    user_id: userId,
    flashcard_id: flashcardId,
    due_at: dueAt || new Date().toISOString(),
    interval_days: intervalDays ?? 0,
    ease_factor: easeFactor ?? 2.5,
    last_reviewed_at: lastReviewedAt ?? null,
  };

  const { data, error } = await supabase
    .from("srs_reviews")
    .upsert(payload, { onConflict: "user_id,flashcard_id" })
    .select(reviewSelect)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function updateReviewSchedule({
  id,
  userId,
  dueAt,
  intervalDays,
  easeFactor,
  lastReviewedAt,
}) {
  const { data, error } = await supabase
    .from("srs_reviews")
    .update({
      due_at: dueAt,
      interval_days: intervalDays,
      ease_factor: easeFactor,
      last_reviewed_at: lastReviewedAt,
    })
    .eq("id", id)
    .eq("user_id", userId)
    .select(reviewSelect)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function getStatsByUser(userId, { now = new Date() } = {}) {
  const nowIso = now.toISOString();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const [{ count: totalCount, error: totalError }, dueReviews, reviewedToday] =
    await Promise.all([
      supabase
        .from("srs_reviews")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),
      getDueByUser(userId, { now: nowIso }),
      supabase
        .from("srs_reviews")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("last_reviewed_at", startOfDay.toISOString()),
    ]);

  if (totalError) {
    throw totalError;
  }

  if (reviewedToday.error) {
    throw reviewedToday.error;
  }

  const dueByTopicMap = new Map();
  for (const review of dueReviews) {
    const topic = review.flashcards?.topics;
    const topicId = review.flashcards?.topic_id || "unknown";
    const current = dueByTopicMap.get(topicId) || {
      topic_id: topicId,
      title: topic?.title || "Untitled topic",
      subject_area: topic?.subject_area || null,
      count: 0,
    };
    current.count += 1;
    dueByTopicMap.set(topicId, current);
  }

  return {
    due_count: dueReviews.length,
    total_count: totalCount || 0,
    reviewed_today_count: reviewedToday.count || 0,
    due_by_topic: Array.from(dueByTopicMap.values()).sort(
      (a, b) => b.count - a.count || a.title.localeCompare(b.title)
    ),
  };
}

async function getReviewsByIdsForUser(ids, userId) {
  if (!ids.length) {
    return [];
  }

  const { data, error } = await supabase
    .from("srs_reviews")
    .select(reviewSelect)
    .eq("user_id", userId)
    .in("id", ids);

  if (error) {
    throw error;
  }

  return data;
}

module.exports = {
  createReview,
  getAllByUser,
  getByIdForUser,
  getDueByUser,
  getReviewsByIdsForUser,
  getStatsByUser,
  updateReviewSchedule,
};
