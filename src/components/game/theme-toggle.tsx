"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";

// ライトモード/ダークモードをいつでも切り替えられるトグルボタン。
// next-themes が localStorage への保存とちらつき防止(ハイドレーション前のクラス適用)を担う。
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useLocale();
  // サーバー側では現在のテーマが分からないため、マウント後にだけ実際のアイコンを出す
  // (ハイドレーション不一致を避けるため、それまではプレースホルダーを表示する)。
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn("size-8", className)}
      aria-label={isDark ? t.common.themeToggleToLight : t.common.themeToggleToDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted && (isDark ? <Sun className="size-4" /> : <Moon className="size-4" />)}
    </Button>
  );
}
