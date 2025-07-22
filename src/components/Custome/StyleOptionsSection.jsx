import { useState } from "react";
import styles from "./StyleOptionsSection.module.scss";

/**
 * StyleOptionsSection
 *
 * Users can customize their jewelry with:
 * - Base: Always includes Silver 925
 * - Optional accents: Bronze or Gold
 * - Optional stone, engraving, pattern
 */
function StyleOptionsSection({ onOptionsChange }) {
  const [materialAccent, setMaterialAccent] = useState("");
  const [stone, setStone] = useState("");
  const [engraving, setEngraving] = useState("");
  const [patternFile, setPatternFile] = useState(null);
  const [patternHint, setPatternHint] = useState("");

  const handleChange = (newValues) => {
    onOptionsChange({
      materialAccent,
      stone,
      engraving,
      patternHint,
      patternFile,
      ...newValues,
    });
  };

  const handleMaterialAccentChange = (e) => {
    setMaterialAccent(e.target.value);
    handleChange({ materialAccent: e.target.value });
  };

  const handleStoneChange = (e) => {
    setStone(e.target.value);
    handleChange({ stone: e.target.value });
  };

  const handleEngravingChange = (e) => {
    setEngraving(e.target.value);
    handleChange({ engraving: e.target.value });
  };

  const handlePatternUpload = (e) => {
    const file = e.target.files[0];
    setPatternFile(file);
    handleChange({ patternFile: file });
  };

  const handlePatternHintChange = (e) => {
    setPatternHint(e.target.value);
    handleChange({ patternHint: e.target.value });
  };

  return (
    <section className={styles.styleOptionsSection}>
      <div className={styles.sectionTitle}>
        <h2>Materials & Personal Style</h2>
        <p>
          All custom pieces are crafted in <strong>Silver 925</strong>.  
          You can request optional <strong>bronze</strong> or <strong>gold</strong> accents.
          Bronze-only pieces are not accepted. Gold requests are manually reviewed.
        </p>
      </div>

      <div className={styles.optionsGroup}>
        <div className={styles.selectBox}>
          <label>Would you like to add accents?</label>
          <select value={materialAccent} onChange={handleMaterialAccentChange}>
            <option value="">Silver 925 only</option>
            <option value="bronze">Silver + Bronze</option>
            <option value="gold">Silver + Gold (request only)</option>
          </select>
        </div>

        <div className={styles.selectBox}>
          <label>Stone or Pearl</label>
          <select value={stone} onChange={handleStoneChange}>
            <option value="">Choose one (optional)</option>
            <option value="none">No Stone</option>
            <option value="pearl">Pearl</option>
            <option value="small gemstone">Small Gemstone</option>
            <option value="large gemstone">Large Gemstone</option>
            <option value="diamond-style stone">Diamond-style Stone</option>
          </select>
        </div>

        <div className={styles.engravingBox}>
          <label>Engraving</label>
          <input
            type="text"
            value={engraving}
            onChange={handleEngravingChange}
            placeholder="Name, quote, or symbol"
          />
        </div>

        <div className={styles.patternBox}>
          <label>Upload Pattern (optional)</label>
          <input type="file" accept="image/*" onChange={handlePatternUpload} />
          <textarea
            value={patternHint}
            onChange={handlePatternHintChange}
            placeholder="Describe your motif (e.g. wave, tribal, symbol)"
            rows={2}
          />
        </div>
      </div>
    </section>
  );
}

export default StyleOptionsSection;
