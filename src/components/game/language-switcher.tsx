"use client";

import { cn } from "@/lib/utils";
import { LOCALES, useLocale, type Locale } from "@/lib/i18n/locale-context";

const LOCALE_LABEL: Record<Locale, string> = {
  ja: "日本語",
  en: "English",
  ko: "한국어",
};

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  return (
    <div className={cn("inline-flex items-center rounded-full border border-border/60 bg-card/60 p-0.5", className)}>
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-label={LOCALE_LABEL[l]}
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide transition",
            locale === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
