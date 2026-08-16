"use client";

import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { LOCALES, useLocale, type Locale } from "@/lib/i18n/locale-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// 言語が3つ以上に増えたため、横並びボタンではなくドロップダウンで選択できるようにする。
// 今後言語が増えても横幅が広がらず、UIが崩れない。
const LOCALE_LABEL: Record<Locale, string> = {
  ja: "日本語",
  en: "English",
  ko: "한국어",
};

const LOCALE_FLAG: Record<Locale, string> = {
  ja: "🇯🇵",
  en: "🇺🇸",
  ko: "🇰🇷",
};

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  return (
    <Select value={locale} onValueChange={(v) => setLocale(v as Locale)}>
      <SelectTrigger
        size="sm"
        className={cn(
          "h-8 gap-1.5 rounded-full border-border/60 bg-card/60 px-3 text-xs font-semibold shadow-none",
          className
        )}
        aria-label={LOCALE_LABEL[locale]}
      >
        <Languages className="size-3.5 opacity-70" />
        <SelectValue>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden>{LOCALE_FLAG[locale]}</span>
            {LOCALE_LABEL[locale]}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="end">
        {LOCALES.map((l) => (
          <SelectItem key={l} value={l}>
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden>{LOCALE_FLAG[l]}</span>
              {LOCALE_LABEL[l]}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
