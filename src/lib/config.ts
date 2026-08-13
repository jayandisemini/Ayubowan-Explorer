// Site Contact & WhatsApp Configuration
export const SITE_CONFIG = {
  // Your WhatsApp number (country code + number, NO plus or spaces).
  // Example for Sri Lanka +94 77 123 4567 -> "94771234567"
  whatsappNumber: (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_WHATSAPP_NUMBER) || "94771234567",
  whatsappFormatted: "+94 77 123 4567",
  phone: "+94 11 234 5678",
  email: "hello@ayubowantravels.lk",
};
