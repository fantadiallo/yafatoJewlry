import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("Anon key exists?", !!import.meta.env.VITE_SUPABASE_ANON_KEY);
