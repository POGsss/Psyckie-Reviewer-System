const { supabase } = require("../config/db");

async function getAllByUser(userId, { topicId } = {}) {
  let query = supabase
    .from("study_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("started_at", { ascending: false });

  if (topicId) {
    query = query.eq("topic_id", topicId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
}

async function createSession({
  userId,
  topicId,
  startedAt,
  endedAt,
  durationMinutes,
}) {
  const payload = {
    user_id: userId,
    topic_id: topicId,
    started_at: startedAt || new Date().toISOString(),
    ended_at: endedAt ?? null,
    duration_minutes: durationMinutes ?? null,
  };

  const { data, error } = await supabase
    .from("study_sessions")
    .insert([payload])
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

module.exports = { getAllByUser, createSession };
