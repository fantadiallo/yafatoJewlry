import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('SB URL ok?', !!url);
console.log('SB KEY present?', !!key);
console.log("Supabase KEY present?", !!import.meta.env.VITE_SUPABASE_ANON_KEY);

export const supabase = createClient(url, key);
