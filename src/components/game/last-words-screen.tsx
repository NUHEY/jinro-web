"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGame } from "@/hooks/use-game";
import { useLocale } from "@/lib/i18n/locale-context";
import { PhaseTag } from "@/components/game/shared";

export function LastWordsScreen() {
  const { publicState, privateState, session, proceedFromLastWords } = useGame();
  const { t } = useLocale();
  if (!publicState || !session) return null;

  const me = publicState.players.find((p) => p.id === session.playerId);
  const isHost = !!me?.isHost;
  const isTarget = !!privateState?.isPendingExecution;
  const targetName = publicState.pendingExecution?.playerName ?? "?";
  const canProceed = isHost || isTarget;

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-5 px-4 py-8 safe-bottom">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30">
        <MessageCircle className="size-8" />
      </div>
      <div className="text-center">
        <PhaseTag>{t.lastWords.tag(publicState.day)}</PhaseTag>
        <p className="mt-3 text-lg font-black">{t.lastWords.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t.lastWords.waitingFor(targetName)}</p>
      </div>

      {isTarget && (
        <Card className="w-full border-amber-500/30 bg-amber-500/10">
          <CardContent className="space-y-1.5 py-5 text-center">
            <p className="text-sm font-bold text-amber-200">{t.lastWords.youAreTitle}</p>
            <p className="text-xs text-amber-200/80">{t.lastWords.youAreDesc}</p>
          </CardContent>
        </Card>
      )}

      {canProceed ? (
        <Button size="lg" className="w-full font-bold" onClick={proceedFromLastWords}>
          {t.lastWords.proceedButton}
        </Button>
      ) : (
        <p className="text-center text-xs text-muted-foreground">{t.lastWords.waitingHost}</p>
      )}
    </div>
  );
}
