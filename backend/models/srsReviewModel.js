const { supabase } = require("../config/db");

async function getAllByUser(userId) {
  const { data, error } = await supabase
    .from("srs_reviews")
    .select("*")
    .eq("user_id", userId)
    .order("due_at", { ascending: true });

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
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

module.exports = { getAllByUser, createReview };
