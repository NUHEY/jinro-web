"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { LOCALES, STRINGS, type Locale, type Strings } from "./strings";

const KEY = "jinro-dx-locale";

function detectInitialLocale(): Locale {
  if (typeof window === "undefined") return "ja";
  try {
    const saved = window.localStorage.getItem(KEY);
    if (saved === "ja" || saved === "en" || saved === "ko") return saved;
  } catch {
    // ignore
  }
  const nav = window.navigator?.language ?? "ja";
  const lower = nav.toLowerCase();
  if (lower.startsWith("ja")) return "ja";
  if (lower.startsWith("ko")) return "ko";
  return "en";
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Strings;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ja");

  useEffect(() => {
    const id = setTimeout(() => setLocaleState(detectInitialLocale()), 0);
    return () => clearTimeout(id);
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(KEY, l);
    } catch {
      // ignore
    }
  };

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, t: STRINGS[locale] }),
    [locale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

export { LOCALES };
export type { Locale };
