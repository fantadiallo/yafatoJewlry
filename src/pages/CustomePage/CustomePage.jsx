import { useMemo, useState } from "react";
import CustomFormSection from "../../components/Custome/CustomFormSection.jsx";
import StyleAndAISection from "../../components/Custome/StyleAndAISection.jsx";
import UserInfoSection from "../../components/Custome/UserInfoSection.jsx";
import SubmitModal from "../../components/Custome/SubmitModal.jsx";
import styles from "./CustomePage.module.scss";

export function CustomePage() {
  const [formData, setFormData] = useState({
    description: "",
    stone: "",
    engraving: "",
    patternHint: "",
    patternFile: null,
    materialAccent: "",
    size: "",
    email: "",
    confirmSilver: false,
    aiPrompt: "",
    aiImage: "",
  });

  const [showModal, setShowModal] = useState(false);

  const handleDescriptionChange = (desc, file) => {
    setFormData((prev) => ({ ...prev, description: desc, patternFile: file }));
  };

  const handleStyleOptionsChange = (options) => {
    setFormData((prev) => ({ ...prev, ...options }));
  };

  const handleUserInfoChange = (info) => {
    setFormData((prev) => ({ ...prev, ...info }));
  };

  const handleAIPromptGenerated = (prompt, image) => {
    setFormData((prev) => ({
      ...prev,
      aiPrompt: prompt,
      aiImage: image || prev.aiImage,
    }));
  };

  const resetForm = () => {
    setFormData({
      description: "",
      stone: "",
      engraving: "",
      patternHint: "",
      patternFile: null,
      materialAccent: "",
      size: "",
      email: "",
      confirmSilver: false,
      aiPrompt: "",
      aiImage: "",
    });
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear everything?")) resetForm();
  };

  const isValid = useMemo(() => {
    const emailOk = /^\S+@\S+\.\S+$/.test(formData.email.trim());
    const sizeOk = formData.size.trim().length > 0;
    return emailOk && sizeOk && formData.confirmSilver;
  }, [formData.email, formData.size, formData.confirmSilver]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    setShowModal(true);
  };

  return (
    <section className={styles.customePage}>
      <div className={styles.hero} role="img" aria-label="Custom jewelry hero">
        <div className={styles.heroOverlay}>
          <h1>Craft Your Custom Silver Piece</h1>
          <p>Start from scratch or let AI inspire your next unique creation.</p>
          <p className={styles.helper}>1. Create yourself or 2. Let AI draft a concept</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.formWrapper} noValidate>
        <div className={styles.dualSection}>
          <div className={styles.sectionBox}>
            <h2>Customize Your Piece</h2>
            <p>Upload a reference or describe your dream design.</p>
            <CustomFormSection
              description={formData.description}
              image={formData.patternFile}
              setDescription={(desc) => handleDescriptionChange(desc, formData.patternFile)}
              setImage={(file) => handleDescriptionChange(formData.description, file)}
            />
          </div>

          <div className={styles.sectionBox}>
            <h2>Use AI To Generate</h2>
            <p>Set options and generate a concept preview.</p>
            <StyleAndAISection
              formData={formData}
              onOptionsChange={handleStyleOptionsChange}
              onPromptGenerated={handleAIPromptGenerated}
            />
          </div>
        </div>

        <div className={styles.userInfoBox}>
          <h2>Your Info</h2>
          <p>Required before submission.</p>
          <UserInfoSection onUserInfoChange={handleUserInfoChange} />
        </div>

        <div className={styles.actions}>
          <button type="submit" disabled={!isValid} aria-disabled={!isValid}>
            Submit Design
          </button>
          <button type="button" onClick={handleClear} className={styles.clearButton}>
            Clear All
          </button>
        </div>
      </form>

      {showModal && <SubmitModal formData={formData} onClose={() => setShowModal(false)} />}
    </section>
  );
}
