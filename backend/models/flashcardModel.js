const { supabase } = require("../config/db");

const selectColumns = "*, topics(title, subject_area)";

const isMissingUserIdColumn = (error) =>
  error?.message?.includes("'user_id' column") ||
  error?.message?.includes("flashcards.user_id does not exist") ||
  (error?.message?.includes("user_id") &&
    error?.message?.includes("schema cache"));

async function getAll({ topicId, userId } = {}) {
  const runQuery = async ({ includeOwnership }) => {
    let query = supabase
      .from("flashcards")
      .select(selectColumns)
      .order("created_at", { ascending: false });

    if (topicId) {
      query = query.eq("topic_id", topicId);
    }

    if (includeOwnership && userId) {
      query = query.or(`user_id.is.null,user_id.eq.${userId}`);
    }

    return query;
  };

  let { data, error } = await runQuery({ includeOwnership: true });

  if (error && userId && isMissingUserIdColumn(error)) {
    ({ data, error } = await runQuery({ includeOwnership: false }));
  }

  if (error) {
    throw error;
  }

  return data;
}

async function getById(id, { userId } = {}) {
  const runQuery = async ({ includeOwnership }) => {
    let query = supabase
      .from("flashcards")
      .select(selectColumns)
      .eq("id", id);

    if (includeOwnership && userId) {
      query = query.or(`user_id.is.null,user_id.eq.${userId}`);
    }

    return query.maybeSingle();
  };

  let { data, error } = await runQuery({ includeOwnership: true });

  if (error && userId && isMissingUserIdColumn(error)) {
    ({ data, error } = await runQuery({ includeOwnership: false }));
  }

  if (error) {
    throw error;
  }

  return data;
}

async function createFlashcard({ topicId, userId, question, answer, difficulty }) {
  const payload = {
    topic_id: topicId,
    user_id: userId,
    question,
    answer,
    difficulty,
  };

  const runInsert = async (values) =>
    supabase
      .from("flashcards")
      .insert([values])
      .select(selectColumns)
      .single();

  let { data, error } = await runInsert(payload);

  if (error && isMissingUserIdColumn(error)) {
    const legacyPayload = { ...payload };
    delete legacyPayload.user_id;
    ({ data, error } = await runInsert(legacyPayload));
  }

  if (error) {
    throw error;
  }

  return data;
}

async function updateFlashcard({ id, userId, question, answer, difficulty }) {
  const values = {
    question,
    answer,
    difficulty,
  };

  const runUpdate = async ({ includeOwnership }) => {
    let query = supabase
      .from("flashcards")
      .update(values)
      .eq("id", id);

    if (includeOwnership) {
      query = query.eq("user_id", userId);
    }

    return query.select(selectColumns);
  };

  let { data, error } = await runUpdate({ includeOwnership: true });

  if (error && isMissingUserIdColumn(error)) {
    ({ data, error } = await runUpdate({ includeOwnership: false }));
  }

  if (error) {
    throw error;
  }

  return data?.[0] || null;
}

async function deleteFlashcard({ id, userId }) {
  const runDelete = async ({ includeOwnership }) => {
    let query = supabase.from("flashcards").delete().eq("id", id);

    if (includeOwnership) {
      query = query.eq("user_id", userId);
    }

    return query.select("id");
  };

  let { data, error } = await runDelete({ includeOwnership: true });

  if (error && isMissingUserIdColumn(error)) {
    ({ data, error } = await runDelete({ includeOwnership: false }));
  }

  if (error) {
    throw error;
  }

  return data?.[0] || null;
}

module.exports = {
  createFlashcard,
  deleteFlashcard,
  getAll,
  getById,
  updateFlashcard,
};
