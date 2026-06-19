const { supabase } = require("../config/db");

async function getAll({ userId } = {}) {
  let query = supabase
    .from("topics")
    .select("*")
    .order("order_index", { ascending: true })
    .order("title", { ascending: true });

  query = userId
    ? query.or(`is_preset.eq.true,user_id.eq.${userId}`)
    : query.eq("is_preset", true);

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
}

async function getById(id, { userId } = {}) {
  let query = supabase
    .from("topics")
    .select("*")
    .eq("id", id);

  query = userId
    ? query.or(`is_preset.eq.true,user_id.eq.${userId}`)
    : query.eq("is_preset", true);

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function createCustomTopic({
  title,
  description,
  orderIndex,
  userId,
  subjectArea,
}) {
  const { data, error } = await supabase
    .from("topics")
    .insert([
      {
        title,
        description,
        order_index: orderIndex || 0,
        user_id: userId,
        subject_area: subjectArea || "Custom",
        is_preset: false,
      },
    ])
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function deleteCustomTopic({ id, userId }) {
  const { data, error } = await supabase
    .from("topics")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)
    .eq("is_preset", false)
    .select("id");

  if (error) {
    throw error;
  }

  return data?.[0] || null;
}

module.exports = { getAll, getById, createCustomTopic, deleteCustomTopic };
