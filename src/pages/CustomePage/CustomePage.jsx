import { useState } from "react";
import CustomFormSection from "../../components/Custome/CustomFormSection.jsx";
import StyleOptionsSection from "../../components/Custome/StyleOptionsSection.jsx";
import UserInfoSection from "../../components/Custome/UserInfoSection.jsx";
import AIImagePreview from "../../components/Custome/AIImagePreview.jsx";
import SubmitModal from "../../components/Custome/SubmitModal.jsx";

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

  return (
    <section>
      <CustomFormSection
        description={formData.description}
        image={formData.patternFile}
        setDescription={(desc) => handleDescriptionChange(desc, formData.patternFile)}
        setImage={(file) => handleDescriptionChange(formData.description, file)}
      />

      <StyleOptionsSection onOptionsChange={handleStyleOptionsChange} />

      <UserInfoSection onUserInfoChange={handleUserInfoChange} />

      <AIImagePreview
        formData={formData}
        onPromptGenerated={handleAIPromptGenerated}
      />

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <button
          onClick={() => setShowModal(true)}
          style={{ padding: "1rem 2rem", fontSize: "1rem", marginRight: "1rem" }}
        >
          Submit Design
        </button>

        <button
          onClick={handleClear}
          style={{ padding: "1rem 2rem", fontSize: "1rem", background: "#f0f0f0", color: "#333" }}
        >
          Clear All
        </button>
      </div>

      {showModal && (
        <SubmitModal formData={formData} onClose={() => setShowModal(false)} />
      )}
    </section>
  );
}
