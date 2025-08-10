import { useState } from "react";
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
    if (confirm("Are you sure you want to clear everything?")) {
      resetForm();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.size || !formData.confirmSilver) {
      alert("Please complete your info before submitting.");
      return;
    }

    setShowModal(true);
  };

  return (
    <section className={styles.customePage}>
      <div className={styles.hero}>
        <div className={styles.heroOverlay}>
          <h1>Craft Your Custom Silver Piece</h1>
          <p>Start from scratch or let AI inspire your next unique creation.</p>
          <p>1 create or 2 use ai to create for you</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.formWrapper}>
        <div className={styles.dualSection}>
          <div className={styles.sectionBox}>
            <h2>Customize your piece yourself</h2>
            <p>Upload your design idea or describe your dream piece in detail.</p>
            <CustomFormSection
              description={formData.description}
              image={formData.patternFile}
              setDescription={(desc) =>
                handleDescriptionChange(desc, formData.patternFile)
              }
              setImage={(file) =>
                handleDescriptionChange(formData.description, file)
              }
            />
          </div>

          <div className={styles.sectionBox}>
            <h2>Use AI to generate your piece</h2>
            <p>Describe your idea and let our AI generate a visual concept.</p>
            <StyleAndAISection
              formData={formData}
              onOptionsChange={handleStyleOptionsChange}
              onPromptGenerated={handleAIPromptGenerated}
            />
          </div>
        </div>

        {/* User info section (outside main form layout) */}
        <div className={styles.userInfoBox}>
          <h2>Your Info</h2>
          <p>Required before submission — tell us how to reach you and size your piece.</p>
          <UserInfoSection onUserInfoChange={handleUserInfoChange} />
        </div>

        <div className={styles.actions}>
          <button type="submit">Submit Design</button>
          <button type="button" onClick={handleClear} className={styles.clearButton}>
            Clear All
          </button>
        </div>
      </form>

      {showModal && (
        <SubmitModal formData={formData} onClose={() => setShowModal(false)} />
      )}
    </section>
  );
}
