// Site Contact & WhatsApp Configuration
export const SITE_CONFIG = {
  // Your WhatsApp number (country code + number, NO plus or spaces).
  // Sri Lanka number: 0740489343 -> 94740489343
  whatsappNumber: (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_WHATSAPP_NUMBER) || "94740489343",
  whatsappFormatted: "+94 74 048 9343",
  phone: "+94 74 048 9343",
  email: "hello@ayubowantravels.lk",
};
