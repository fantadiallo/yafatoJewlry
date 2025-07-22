import { useState } from "react";
import { generateAIPrompt } from "../../utils/PromptFormatter.js";
import styles from "./AIImagePreview.module.scss";

/**
 * AIImagePreview
 *
 * Generates and shows a preview concept image based on user input.
 *
 * @param {Object} props
 * @param {Object} props.formData - full user input state
 * @param {function} props.onPromptGenerated - passes the final AI prompt to parent (optional)
 * @returns {JSX.Element}
 */
function AIImagePreview({ formData, onPromptGenerated }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const prompt = generateAIPrompt(formData);

    // Optional: pass prompt up for saving later
    if (onPromptGenerated) {
      onPromptGenerated(prompt);
    }

    // === MOCK RESPONSE ===
    // Replace this with a real API call later
    setTimeout(() => {
      const mockImage = "https://placehold.co/600x600?text=AI+Preview";
      setImageUrl(mockImage);
      setLoading(false);
    }, 2000);
  };

  return (
    <section className={styles.aiPreview}>
      <div className={styles.previewBox}>
        <h2>AI Concept Preview</h2>
        <p>
          Based on your description and options, we'll generate a concept
          sketch. This is a visual idea — final design will be reviewed by
          Yafato before production.
        </p>

        <button onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate AI Preview"}
        </button>

        {imageUrl && (
          <div className={styles.imageContainer}>
            <img src={imageUrl} alt="AI Generated Jewelry Concept" />
          </div>
        )}
      </div>
    </section>
  );
}

export default AIImagePreview;
