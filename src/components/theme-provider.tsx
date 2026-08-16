"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

// next-themes をアプリ全体にかぶせる薄いラッパー。
// <html> に "dark" クラスを付け外しするだけで、globals.css 側の :root/.dark の
// CSSカスタムプロパティ切り替えと自動的に連動する(既存のライト/ダーム両対応の色設計をそのまま活かせる)。
export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
