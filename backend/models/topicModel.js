const { supabase } = require("../config/db");

async function getAll() {
  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

async function getById(id) {
  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

module.exports = { getAll, getById };
