// src/utils/sendCustomDesignEmail.js
import emailjs from '@emailjs/browser'

export function sendCustomDesignEmail(formEl) {
  return emailjs.sendForm(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TPL_CUSTOM, // template_86onwbc
    formEl,
    { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
  )
}
