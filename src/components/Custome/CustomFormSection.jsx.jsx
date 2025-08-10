import styles from "./CustomForm.module.scss";

/**
 * CustomFormSection
 * Allows users to describe their jewelry idea + upload a reference image.
 */
function CustomFormSection({ description, image, setDescription, setImage }) {
  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <section className={styles.customFormSection}>
      <div className={styles.sectionTitle}>
        <h2> 1. Design Your Piece</h2>
        <p>Tell us your vision for your dream Yafato silver jewelry.</p>
        <p></p>
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
            {image ? image.name : "+"}
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
