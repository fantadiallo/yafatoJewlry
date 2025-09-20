import emailjs from '@emailjs/browser'

const SERVICE = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE = import.meta.env.VITE_EMAILJS_TPL_CONTACT
const PUBLIC   = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

await emailjs.sendForm(SERVICE, TEMPLATE, formRef.current, { publicKey: PUBLIC })
