import { useState } from "react";
import styles from "./CustomForm.module.scss";

/**
 * CustomFormSection
 *
 * This component renders the first step of the Yafato custom jewelry experience.
 * It allows users to describe their dream jewelry and optionally upload a reference image.
 * This section sets the tone for the luxury, guided experience — not a standard form.
 *
 * Features:
 * - Textarea for freeform design input
 * - Optional image/sketch upload
 * - Elegant layout and branding language
 *
 * @returns {JSX.Element} The styled visual entry section for custom jewelry creation.
 */
function CustomFormSection() {
  const [description, setDescription] = useState(""); // Stores user input description
  const [image, setImage] = useState(null); // Stores uploaded image file (if any)

  /**
   * Handles image upload and stores the file in local state
   * @param {React.ChangeEvent<HTMLInputElement>} e - The file input change event
   */
  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <section className={styles.customFormSection}>
      <div className={styles.sectionTitle}>
        <h2>Design Your Piece</h2>
        <p>Tell us your vision for your dream Yafato silver jewelry.</p>
      </div>

      <div className={styles.designInputGroup}>
        <textarea
          className={styles.descriptionBox}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your idea — silver base with pearl, engraving, pattern, etc."
        />

        <div className={styles.uploadContainer}>
          <label htmlFor="imageUpload" className={styles.uploadLabel}>
            {image ? image.name : "+ Add Sketch or Image (Optional)"}
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className={styles.uploadInput}
          />
        </div>
      </div>
    </section>
  );
}

export default CustomFormSection;
