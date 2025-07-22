import { supabase } from "../supabse/Client";
import { uploadPatternFile } from "./uploadPatternFile";

export async function submitDesign(formData) {
  const { email, aiImage, patternFile, ...rest } = formData;

  const { count, error: countError } = await supabase
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .eq("email", email);

  if (countError) throw new Error("Failed to check submissions.");

  const isFirstTime = count === 0;
  const extraFee = !isFirstTime;

  let uploadedPatternUrl = null;
  if (patternFile) {
    uploadedPatternUrl = await uploadPatternFile(patternFile, email);
  }

  const { error: insertError } = await supabase.from("submissions").insert([
    {
      email,
      form_data: rest,
      ai_image_url: aiImage || null,
      pattern_url: uploadedPatternUrl,
      extra_fee: extraFee,
    },
  ]);

  if (insertError) throw new Error("Failed to save your submission.");

  return {
    success: true,
    message: isFirstTime
      ? "✅ Design submitted! We’ll reply in 24h."
      : "✅ Design submitted! We’ve noted the 20 kr fee — it will be added to your deposit.",
  };
}
