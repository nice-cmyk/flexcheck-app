// Bouton flottant WhatsApp, visible sur tout le site (LP + app). Numéro en dur
// pour l'instant (07 67 71 75 86) - à remplacer facilement si besoin.
const WHATSAPP_NUMBER = '33767717586' // format international sans le +
const WHATSAPP_MESSAGE = "Salut ! J'ai une question sur FlexCheck"

export default function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter sur WhatsApp"
      className="fixed bottom-5 right-5 z-[70] w-14 h-14 rounded-full bg-primary hover:bg-primary-light transition-colors shadow-[0_4px_20px_rgba(124,58,237,0.5)] flex items-center justify-center"
    >
      <svg viewBox="0 0 24 24" width="26" height="26" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.45 1.27 4.9L2 22l5.25-1.38a9.96 9.96 0 0 0 4.79 1.22h.01c5.52 0 10-4.48 10-10s-4.48-10-10-10zm0 18.15h-.01a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.11.82.83-3.03-.2-.31a8.17 8.17 0 0 1-1.26-4.36c0-4.52 3.68-8.2 8.22-8.2 2.2 0 4.26.86 5.82 2.41a8.15 8.15 0 0 1 2.4 5.8c0 4.53-3.68 8.19-8.22 8.19zm4.5-6.14c-.25-.12-1.47-.72-1.7-.8-.23-.08-.4-.12-.56.13-.17.24-.65.8-.79.97-.15.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.48-1.39-1.73-.14-.24-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.24.24-.4.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.16 0-.43.06-.66.31-.23.24-.86.85-.86 2.06 0 1.22.88 2.4 1 2.56.13.17 1.73 2.65 4.2 3.71.59.26 1.05.41 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.19.2-.58.2-1.08.14-1.19-.06-.1-.23-.17-.48-.29z" />
      </svg>
    </a>
  )
}
