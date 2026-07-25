import React, { createContext, useContext, useState, useEffect } from "react";

export type CurrencyCode = "USD" | "LKR" | "EUR" | "GBP" | "AUD" | "CAD";

export type CurrencyOption = {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rate: number; // relative to USD base
};

export const CURRENCIES: CurrencyOption[] = [
  { code: "USD", symbol: "$", name: "US Dollar", rate: 1.0 },
  { code: "LKR", symbol: "Rs", name: "Sri Lankan Rupee", rate: 305.5 },
  { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  { code: "GBP", symbol: "£", name: "British Pound", rate: 0.78 },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", rate: 1.52 },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", rate: 1.38 },
];

type CurrencyContextType = {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountUSD: number) => string;
  currentCurrencyObj: CurrencyOption;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");

  useEffect(() => {
    const saved = localStorage.getItem("ayubowan_currency") as CurrencyCode;
    if (saved && CURRENCIES.some((c) => c.code === saved)) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem("ayubowan_currency", code);
  };

  const currentCurrencyObj = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

  const formatPrice = (amountUSD: number): string => {
    const converted = Math.round(amountUSD * currentCurrencyObj.rate);
    if (currency === "LKR") {
      return `Rs. ${converted.toLocaleString()} LKR`;
    }
    return `${currentCurrencyObj.symbol}${converted.toLocaleString()} ${currency}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, currentCurrencyObj }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    return {
      currency: "USD" as CurrencyCode,
      setCurrency: () => {},
      formatPrice: (amt: number) => `$${Math.round(amt)} USD`,
      currentCurrencyObj: CURRENCIES[0],
    };
  }
  return ctx;
}
