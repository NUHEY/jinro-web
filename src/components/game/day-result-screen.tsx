"use client";

import { Sun, Skull } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGame } from "@/hooks/use-game";
import { useLocale } from "@/lib/i18n/locale-context";
import { PhaseTag } from "@/components/game/shared";

export function DayResultScreen() {
  const { publicState, session, advance } = useGame();
  const { t } = useLocale();
  if (!publicState || !session) return null;

  const me = publicState.players.find((p) => p.id === session.playerId);
  const isHost = !!me?.isHost;
  const deaths = publicState.lastDeaths;

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-4 py-8 safe-top safe-bottom">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30">
          <Sun className="size-7" />
        </div>
        <PhaseTag>{t.dayResult.tag(publicState.day)}</PhaseTag>
      </div>

      <Card>
        <CardContent className="space-y-3 py-6">
          {deaths.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">{t.dayResult.noDeaths}</p>
          ) : (
            deaths.map((d) => {
              const name = publicState.players.find((p) => p.id === d.playerId)?.name ?? "?";
              return (
                <div key={d.playerId} className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5">
                  <Skull className="size-5 shrink-0 text-destructive" />
                  <div>
                    <p className="text-sm font-bold">{name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.deathCause[d.cause]}
                      {d.revealedRole && ` (${t.roles[d.revealedRole].name})`}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {isHost ? (
        <Button size="lg" className="w-full font-bold" onClick={() => advance("discussion")}>
          {t.dayResult.continueButton}
        </Button>
      ) : (
        <p className="text-center text-xs text-muted-foreground">{t.dayResult.waitingHost}</p>
      )}
    </div>
  );
}
