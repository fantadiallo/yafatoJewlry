import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('SB URL ok?', !!url);
console.log('SB KEY present?', !!key);

export const supabase = createClient(url, key);
