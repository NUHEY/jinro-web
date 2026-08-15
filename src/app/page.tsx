import { Suspense } from "react";
import { GameProvider } from "@/hooks/use-game";
import { AppShell } from "@/components/app-shell";
import { LocaleProvider } from "@/lib/i18n/locale-context";

export default function Home() {
  return (
    <Suspense fallback={<div className="flex flex-1" />}>
      <LocaleProvider>
        <GameProvider>
          <AppShell />
        </GameProvider>
      </LocaleProvider>
    </Suspense>
  );
}
