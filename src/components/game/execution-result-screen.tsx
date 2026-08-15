"use client";

import { Gavel, Skull, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGame } from "@/hooks/use-game";
import { useLocale } from "@/lib/i18n/locale-context";
import { PhaseTag } from "@/components/game/shared";

export function ExecutionResultScreen() {
  const { publicState, privateState, session, advance } = useGame();
  const { t } = useLocale();
  if (!publicState || !session) return null;

  const me = publicState.players.find((p) => p.id === session.playerId);
  const isHost = !!me?.isHost;
  const executedName = publicState.lastExecuted
    ? publicState.players.find((p) => p.id === publicState.lastExecuted!.playerId)?.name
    : null;
  const extraDeaths = publicState.lastDeaths.filter((d) => d.playerId !== publicState.lastExecuted?.playerId);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-4 py-8 safe-top safe-bottom">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30">
          <Gavel className="size-7" />
        </div>
        <PhaseTag>{t.executionResult.tag(publicState.day)}</PhaseTag>
      </div>

      <Card>
        <CardContent className="space-y-3 py-6">
          {executedName ? (
            <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-3">
              <Skull className="size-5 shrink-0 text-destructive" />
              <div>
                <p className="text-base font-bold">{t.executionResult.executed(executedName)}</p>
                {publicState.lastExecuted?.revealedRole && (
                  <p className="text-xs text-muted-foreground">
                    {t.roles[publicState.lastExecuted.revealedRole].name}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground">{t.executionResult.noExecution}</p>
          )}

          {extraDeaths.map((d) => {
            const name = publicState.players.find((p) => p.id === d.playerId)?.name ?? "?";
            return (
              <div key={d.playerId} className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/60 px-3 py-2.5">
                <Skull className="size-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-sm font-bold">{name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.deathCause[d.cause]}
                    {d.revealedRole && ` (${t.roles[d.revealedRole].name})`}
                  </p>
                </div>
              </div>
            );
          })}

          {privateState?.mediumResult && (
            <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-3 text-xs">
              <p className="flex items-center gap-1 font-semibold text-indigo-300">
                <Sparkles className="size-3.5" /> {t.executionResult.mediumResult}
              </p>
              <p
                className={
                  "mt-0.5 " +
                  (privateState.mediumResult.isBlack ? "font-bold text-red-400" : "font-bold text-sky-300")
                }
              >
                {t.executionResult.mediumResultLine(privateState.mediumResult.targetName, privateState.mediumResult.isBlack)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {isHost && (
        <Button size="lg" className="w-full font-bold" onClick={() => advance("night")}>
          {t.executionResult.continueButton}
        </Button>
      )}
      <p className="text-center text-xs text-muted-foreground">{t.executionResult.autoNotice}</p>
    </div>
  );
}
