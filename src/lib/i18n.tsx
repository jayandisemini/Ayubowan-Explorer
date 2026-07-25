import React, { createContext, useContext, useState, useEffect } from "react";

export type LanguageCode = "en" | "si" | "ta" | "de" | "fr";

export type LanguageOption = {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
};

export const LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "si", name: "Sinhala", nativeName: "සිංහල", flag: "🇱🇰" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇱🇰" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
];

type Translations = Record<string, string>;

const TRANSLATIONS: Record<LanguageCode, Translations> = {
  en: {
    nav_destinations: "Destinations",
    nav_tours: "Tours",
    nav_cuisine: "Cuisine",
    nav_about: "About",
    nav_contact: "Contact",
    nav_dashboard: "Dashboard",
    nav_signin: "Sign In",
    hero_welcome: "ආයුබෝවන් · Welcome to Sri Lanka",
    hero_title: "The Pearl of the Indian Ocean, curated for the modern traveler.",
    hero_lead: "AI-crafted itineraries, live train logistics, and immersive storytelling — from the misty peaks of Ella to the golden shores of Mirissa.",
    btn_begin: "Begin your journey",
    btn_explore: "Explore experiences",
    btn_book_online: "Book & Pay Online",
    btn_customize: "Customize in AI Dashboard",
    label_heritage: "Cultural Heritage",
    label_expeditions: "Scenic Expeditions",
    label_cuisine: "Authentic Cuisine",
  },
  si: {
    nav_destinations: "ගමනාන්ත",
    nav_tours: "සංචාර",
    nav_cuisine: "දේශීය ආහාර",
    nav_about: "අප ගැන",
    nav_contact: "සම්බන්ධ වන්න",
    nav_dashboard: "පාලන පුවරුව",
    nav_signin: "ඇතුළු වන්න",
    hero_welcome: "ආයුබෝවන් · ශ්‍රී ලංකාවට සාදරයෙන් පිළිගනිමු",
    hero_title: "ඉන්දියන් සාගරයේ අමිල මුතු ඇටය, නවීන සංචාරකයා උදෙසා.",
    hero_lead: "කෘතිම බුද්ධි සංචාරක සැලසුම්, සජීවී දුම්රිය තොරතුරු, සහ සුන්දර ගමනාන්ත අත්දැකීම්.",
    btn_begin: "ඔබේ සංචාරය ඇරඹුම",
    btn_explore: "ස්ථාන නරඹන්න",
    btn_book_online: "අන්තර්ජාලයෙන් ගෙවා වෙන්කරවා ගන්න",
    btn_customize: "සැලසුම සකස්කරන්න",
    label_heritage: "සංස්කෘතික උරුමය",
    label_expeditions: "සුන්දර ගවේෂණ",
    label_cuisine: "දේශීය ආහාර රස",
  },
  ta: {
    nav_destinations: "இலக்குகள்",
    nav_tours: "சுற்றுலாக்கள்",
    nav_cuisine: "உணவுப் பழக்கம்",
    nav_about: "எங்களைப் பற்றி",
    nav_contact: "தொடர்பு கொள்ள",
    nav_dashboard: "டாஷ்போர்டு",
    nav_signin: "உள்நுழைய",
    hero_welcome: "ஆயுபோவன் · இலங்கைக்கு நல்வரவு",
    hero_title: "இந்தியப் பெருங்கடலின் முத்துப் புள்ளி, நவீன பயணிகளுக்கு.",
    hero_lead: "AI பயணத் திட்டங்கள், நேரலை ரயில் தகவல்கள் மற்றும் அதிவேக அனுபவங்கள்.",
    btn_begin: "பயணத்தை தொடங்குங்கள்",
    btn_explore: "அனுபவங்களை ஆராயுங்கள்",
    btn_book_online: "ஆன்லைனில் முன்பதிவு செய்யுங்கள்",
    btn_customize: "தனிப்பயனாக்கவும்",
    label_heritage: "பண்பாட்டு பாரம்பரியம்",
    label_expeditions: "இயற்கை பயணங்கள்",
    label_cuisine: "உண்மையான உணவு",
  },
  de: {
    nav_destinations: "Reiseziele",
    nav_tours: "Touren",
    nav_cuisine: "Kulinarik",
    nav_about: "Über Uns",
    nav_contact: "Kontakt",
    nav_dashboard: "Dashboard",
    nav_signin: "Anmelden",
    hero_welcome: "Ayubowan · Willkommen in Sri Lanka",
    hero_title: "Die Perle des Indischen Ozeans, kuratiert für moderne Reisende.",
    hero_lead: "KI-erstellte Reiserouten, Live-Zugfahrpläne und unvergessliche Erlebnisse in Sri Lanka.",
    btn_begin: "Reise Beginnen",
    btn_explore: "Erlebnisse Entdecken",
    btn_book_online: "Online Buchen & Bezahlen",
    btn_customize: "Im Dashboard Anpassen",
    label_heritage: "Kulturerbe",
    label_expeditions: "Natur & Abenteuer",
    label_cuisine: "Authentische Küche",
  },
  fr: {
    nav_destinations: "Destinations",
    nav_tours: "Circuits",
    nav_cuisine: "Gastronomie",
    nav_about: "À Propos",
    nav_contact: "Contact",
    nav_dashboard: "Tableau de Bord",
    nav_signin: "Se Connecter",
    hero_welcome: "Ayubowan · Bienvenue au Sri Lanka",
    hero_title: "La Perle de l'Océan Indien, pensée pour le voyageur moderne.",
    hero_lead: "Itinéraires par IA, logistique ferroviaire en direct et découvertes culturelles uniques.",
    btn_begin: "Commencer le voyage",
    btn_explore: "Explorer les activités",
    btn_book_online: "Réserver & Payer en Ligne",
    btn_customize: "Personnaliser l'Itinéraire",
    label_heritage: "Patrimoine Culturel",
    label_expeditions: "Expéditions Panoramiques",
    label_cuisine: "Cuisine Authentique",
  },
};

type LanguageContextType = {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: (key: string, defaultText?: string) => string;
  currentLangObj: LanguageOption;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    const saved = localStorage.getItem("ayubowan_lang") as LanguageCode;
    if (saved && TRANSLATIONS[saved]) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (code: LanguageCode) => {
    setLanguageState(code);
    localStorage.setItem("ayubowan_lang", code);
  };

  const t = (key: string, defaultText?: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || defaultText || key;
  };

  const currentLangObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currentLangObj }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Fallback if rendered outside provider
    return {
      language: "en" as LanguageCode,
      setLanguage: () => {},
      t: (key: string, defaultText?: string) => TRANSLATIONS.en[key] || defaultText || key,
      currentLangObj: LANGUAGES[0],
    };
  }
  return ctx;
}
