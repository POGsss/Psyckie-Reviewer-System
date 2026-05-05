const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL is required.");
}

const supabaseKey = supabaseServiceKey || supabaseAnonKey;
if (!supabaseKey) {
  throw new Error("Set SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY.");
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

module.exports = { supabase };
