/**
 * generateAIPrompt
 * Converts user input into a formatted prompt string for AI image generation.
 *
 * @param {Object} formData - All user input data
 * @returns {string} - A formatted AI prompt
 */
export function generateAIPrompt(formData) {
  const {
    description,
    stone,
    engraving,
    patternHint,
    materialAccent,
    size,
  } = formData;

  let prompt = `Design a luxurious handcrafted silver jewelry piece.`;

  if (description) prompt += ` ${description}.`;
  if (stone) prompt += ` Include a ${stone} stone.`;
  if (engraving) prompt += ` Engraving text: "${engraving}".`;
  if (patternHint) prompt += ` Inspired by: ${patternHint}.`;

  if (materialAccent === "gold") prompt += ` Accentuated with gold.`;
  if (materialAccent === "bronze") prompt += ` Accentuated with bronze.`;

  if (size) prompt += ` Size: ${size}.`;

  prompt += ` Crafted in 925 sterling silver. Show elegance, detail, and authenticity.`;

  return prompt;
}
