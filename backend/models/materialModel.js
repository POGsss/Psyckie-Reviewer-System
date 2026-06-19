const { supabase } = require("../config/db");

const isMissingColumn = (error, column) =>
  error?.message?.includes(`'${column}' column`) ||
  error?.message?.includes(`materials.${column} does not exist`) ||
  (error?.message?.includes(column) && error?.message?.includes("schema cache"));

const normalizeMaterial = (material) => {
  if (!material) {
    return material;
  }

  return {
    ...material,
    title: material.title ?? material.file_name ?? "Untitled material",
    content: material.content ?? material.raw_text ?? "",
    content_type: material.content_type ?? material.file_type ?? "markdown",
    source_url: material.source_url ?? material.file_url ?? null,
  };
};

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

  return data.map(normalizeMaterial);
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

  return normalizeMaterial(data);
}

async function createMaterial({
  topicId,
  userId,
  title,
  content,
  contentType,
  sourceUrl,
}) {
  const currentPayload = {
    topic_id: topicId,
    user_id: userId,
    title,
    content,
    content_type: contentType || "markdown",
    source_url: sourceUrl || null,
  };

  const legacyPayload = {
    topic_id: topicId,
    user_id: userId,
    file_name: title,
    raw_text: content,
    file_type: contentType || "markdown",
    file_url: sourceUrl || null,
    status: "processed",
  };

  const runInsert = async (payload) =>
    supabase.from("materials").insert([payload]).select("*").single();

  let { data, error } = await runInsert(currentPayload);

  if (
    error &&
    (isMissingColumn(error, "content") ||
      isMissingColumn(error, "title") ||
      isMissingColumn(error, "content_type") ||
      isMissingColumn(error, "source_url"))
  ) {
    ({ data, error } = await runInsert(legacyPayload));
  }

  if (error) {
    throw error;
  }

  return normalizeMaterial(data);
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
