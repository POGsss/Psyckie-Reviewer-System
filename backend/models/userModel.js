const { supabase } = require("../config/db");

async function findByEmail(email) {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, password_hash, full_name, created_at")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function findById(id) {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, full_name, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function createUser({ email, passwordHash, fullName }) {
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        email,
        password_hash: passwordHash,
        full_name: fullName,
      },
    ])
    .select("id, email, full_name, created_at")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

module.exports = {
  findByEmail,
  findById,
  createUser,
};
