const { supabase } = require("../config/db");

async function getAll({ topicId } = {}) {
  let query = supabase
    .from("flashcards")
    .select("*")
    .order("created_at", { ascending: false });

  if (topicId) {
    query = query.eq("topic_id", topicId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
}

async function getById(id) {
  const { data, error } = await supabase
    .from("flashcards")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

module.exports = { getAll, getById };
