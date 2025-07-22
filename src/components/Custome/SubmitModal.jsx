import { useState } from "react";
import styles from "./SubmitModal.module.scss";
import { generateAIImage } from "../../utils/openai";
import { generateAIPrompt } from "../../utils/PromptFormatter.js";
import { submitDesign } from "../../utils/submitDesign.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * SubmitModal
 *
 * Modal to preview design info before final submit.
 *
 * @param {Object} props
 * @param {Function} props.onClose - Function to close the modal
 * @param {Object} props.formData - All collected form data
 */
function SubmitModal({ onClose, formData }) {
  const {
    description,
    stone,
    engraving,
    patternHint,
    patternFile,
    materialAccent,
    size,
    email,
    confirmSilver,
    aiImage,
  } = formData;

  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!email || !description) {
      toast.error("Please fill in both email and description.");
      return;
    }

    try {
      setLoading(true);
      let aiImageFinal = aiImage;

      if (!aiImage && confirmSilver) {
        const prompt = generateAIPrompt(formData);
        aiImageFinal = await generateAIImage(prompt);
      }

      const finalData = {
        ...formData,
        aiImage: aiImageFinal,
      };

      const result = await submitDesign(finalData);

      toast.success(result.message, {
        autoClose: 6000,
      });

      toast.info(
        "⏳ We’ll review and reply within 24h. If you accept the price, you pay 50% to begin.",
        { autoClose: 10000 }
      );

      onClose();
    } catch (error) {
      console.error(error);
      toast.error("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h2>Confirm Your Design</h2>
        <p>Here’s a preview of your custom Yafato piece:</p>

        <div className={styles.previewGroup}>
          <strong>Description:</strong>
          <p>{description}</p>

          {stone && (
            <>
              <strong>Stone:</strong> <p>{stone}</p>
            </>
          )}

          {engraving && (
            <>
              <strong>Engraving:</strong> <p>{engraving}</p>
            </>
          )}

          {patternHint && (
            <>
              <strong>Pattern Hint:</strong> <p>{patternHint}</p>
            </>
          )}

          {materialAccent && (
            <>
              <strong>Material Accent:</strong> <p>{materialAccent}</p>
            </>
          )}

          {size && (
            <>
              <strong>Size:</strong> <p>{size}</p>
            </>
          )}

          <strong>Email:</strong>
          <p>{email}</p>

          <strong>Silver Confirmation:</strong>
          <p>{confirmSilver ? "✅ Yes" : "❌ Not Confirmed"}</p>
        </div>

        <div className={styles.imagePreview}>
          {aiImage ? (
            <img src={aiImage} alt="AI Preview" />
          ) : patternFile ? (
            <img src={URL.createObjectURL(patternFile)} alt="Uploaded Sketch" />
          ) : (
            <p>No image provided.</p>
          )}
        </div>

        <div className={styles.rulesBox}>
          <p>✅ You get <strong>1 free design submit</strong>.</p>
          <p>Next time it will cost <strong>20 kr</strong> per design.</p>
          <p>
            We will review your idea and send back a custom price. You’ll pay a
            50% deposit if you accept the offer.
          </p>
        </div>

        <div className={styles.modalActions}>
          <button onClick={onClose} className={styles.cancel} disabled={loading}>
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={styles.confirm}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Confirm & Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubmitModal;
