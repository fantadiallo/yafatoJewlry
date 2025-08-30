import emailjs from "emailjs-com";

export function sendCustomDesignEmail(formData) {
  const templateParams = {
    description: formData.description || "",
    stone: formData.stone || "",
    engraving: formData.engraving || "",
    materialAccent: formData.materialAccent || "",
    size: formData.size || "",
    confirmSilver: formData.confirmSilver ? "Yes" : "No",
    imageUrl: formData.aiImage || formData.patternFileUrl || "",
    email: formData.email || "",
    user_email: formData.email || "", // ← used in CC
  };

  return emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    templateParams,
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  );
}
