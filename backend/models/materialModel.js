const { supabase } = require("../config/db");

async function getAll({ topicId, userId } = {}) {
  let query = supabase
    .from("materials")
    .select("*")
    .order("created_at", { ascending: false });

  if (topicId) {
    query = query.eq("topic_id", topicId);
  }

  query = userId
    ? query.or(`user_id.is.null,user_id.eq.${userId}`)
    : query.is("user_id", null);

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
}

async function getById(id, { userId } = {}) {
  let query = supabase
    .from("materials")
    .select("*")
    .eq("id", id);

  query = userId
    ? query.or(`user_id.is.null,user_id.eq.${userId}`)
    : query.is("user_id", null);

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function createMaterial({
  topicId,
  userId,
  title,
  content,
  contentType,
  sourceUrl,
}) {
  const { data, error } = await supabase
    .from("materials")
    .insert([
      {
        topic_id: topicId,
        user_id: userId,
        title,
        content,
        content_type: contentType || "markdown",
        source_url: sourceUrl || null,
      },
    ])
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function deleteMaterial({ id, userId }) {
  const { data, error } = await supabase
    .from("materials")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)
    .select("id");

  if (error) {
    throw error;
  }

  return data?.[0] || null;
}

module.exports = { createMaterial, deleteMaterial, getAll, getById };
