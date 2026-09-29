import emailjs from '@emailjs/browser'

// Identifiants EmailJS (publics par conception) — surchargez-les dans .env.local si besoin.
export const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_6c7w5uj'
export const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_28ecf18'
export const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'ZuuXzMtP5NNOYwuMI'

/** Envoie un message à l'adresse de l'entreprise via le modèle EmailJS (champs from_name, from_email, message). */
export async function sendEmail(params: { from_name: string; from_email: string; message: string }) {
  await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params, { publicKey: EMAILJS_PUBLIC_KEY })
}

export function sendFormEmail(form: HTMLFormElement) {
  return emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form, { publicKey: EMAILJS_PUBLIC_KEY })
}
