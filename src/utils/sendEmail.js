import emailjs from '@emailjs/browser'

export async function sendEmail(payload, templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID) {
  return emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    templateId,
    payload,
    { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
  )
}
