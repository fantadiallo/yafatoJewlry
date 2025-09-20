import { supabase } from "../supabase/Client";


export async function uploadPatternFile(file, email) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${email}_${Date.now()}.${fileExt}`;
  const filePath = `patterns/${fileName}`;

  const { error } = await supabase.storage
    .from("custom-patterns")
    .upload(filePath, file);

  if (error) throw new Error("❌ Failed to upload your sketch.");

  const { data } = supabase.storage
    .from("custom-patterns")
    .getPublicUrl(filePath);

  return data.publicUrl;
}
