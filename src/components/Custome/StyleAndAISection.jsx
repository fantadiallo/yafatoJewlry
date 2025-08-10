import { useState } from "react";
import styles from "./StyleAndAISection.module.scss";
import { generateAIPrompt } from "../../utils/PromptFormatter.js";

export default function StyleAndAISection({ formData, onOptionsChange, onPromptGenerated }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const [materialAccent, setMaterialAccent] = useState("");
  const [stone, setStone] = useState("");
  const [engraving, setEngraving] = useState("");
  const [patternFile, setPatternFile] = useState(null);
  const [patternHint, setPatternHint] = useState("");

  const handleChange = (newValues) => {
    const allData = {
      materialAccent,
      stone,
      engraving,
      patternHint,
      patternFile,
      ...newValues,
    };
    onOptionsChange(allData);
  };

  const handleGenerateAI = () => {
    setLoading(true);
    const prompt = generateAIPrompt({
      ...formData,
      materialAccent,
      stone,
      engraving,
      patternHint,
    });

    if (onPromptGenerated) {
      onPromptGenerated(prompt);
    }

    setTimeout(() => {
      const mockImage = "https://placehold.co/600x600?text=AI+Preview";
      setImageUrl(mockImage);
      setLoading(false);
    }, 2000);
  };

  return (
    <section className={styles.styleAndAI}>
      <h2>2. create with AI</h2>

      <p className={styles.note}>
        All jewelry is based on <strong>Silver 925</strong>. You may add optional accents or generate a preview based on your ideas.
      </p>

      <div className={styles.formSection}>
        <div className={styles.selectBox}>
          <label>Would you like to add accents?</label>
          <select value={materialAccent} onChange={(e) => {
            setMaterialAccent(e.target.value);
            handleChange({ materialAccent: e.target.value });
          }}>
            <option value="">Silver 925 only</option>
            <option value="bronze">Silver + Bronze</option>
            <option value="gold">Silver + Gold (reviewed)</option>
          </select>
        </div>

        <div className={styles.selectBox}>
          <label>Stone or Pearl</label>
          <select value={stone} onChange={(e) => {
            setStone(e.target.value);
            handleChange({ stone: e.target.value });
          }}>
            <option value="">Choose one (optional)</option>
            <option value="none">No Stone</option>
            <option value="pearl">Pearl</option>
            <option value="small gemstone">Small Gemstone</option>
            <option value="large gemstone">Large Gemstone</option>
            <option value="diamond-style stone">Diamond-style Stone</option>
          </select>
        </div>

        <div className={styles.inputRow}>
          <label>Engraving</label>
          <input
            type="text"
            value={engraving}
            onChange={(e) => {
              setEngraving(e.target.value);
              handleChange({ engraving: e.target.value });
            }}
            placeholder="Name, quote, or initials"
          />
        </div>

        <div className={styles.patternBox}>
          <label>Upload Pattern (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setPatternFile(file);
              handleChange({ patternFile: file });
            }}
          />
          <textarea
            rows={2}
            value={patternHint}
            onChange={(e) => {
              setPatternHint(e.target.value);
              handleChange({ patternHint: e.target.value });
            }}
            placeholder="Describe motif: e.g. tribal, waves, symbols"
          />
        </div>
      </div>

      <div className={styles.previewArea}>
        <button onClick={handleGenerateAI} disabled={loading}>
          {loading ? "Generating..." : "Generate AI Preview"}
        </button>

        {imageUrl && (
          <div className={styles.imageBox}>
            <img src={imageUrl} alt="AI Preview" />
            <p>AI Concept — will be reviewed before production</p>
          </div>
        )}
      </div>

   
    </section>
  );
}
