"use client";

import { Gavel, Skull, Sparkles, HeartHandshake } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useGame } from "@/hooks/use-game";
import { useLocale } from "@/lib/i18n/locale-context";
import { PhaseTag, ConfirmButton } from "@/components/game/shared";

export function ExecutionResultScreen() {
  const { publicState, privateState, session, advance } = useGame();
  const { t } = useLocale();
  if (!publicState || !session) return null;

  const me = publicState.players.find((p) => p.id === session.playerId);
  const isHost = !!me?.isHost;
  const executedName = publicState.lastExecuted
    ? publicState.players.find((p) => p.id === publicState.lastExecuted!.playerId)?.name
    : null;
  const wasSpared = !!publicState.lastExecuted?.spared;
  const extraDeaths = publicState.lastDeaths.filter((d) => d.playerId !== publicState.lastExecuted?.playerId);
  // 今回の処刑に対する霊媒結果のみ表示する(過去の古い霊媒結果を「今」の結果のように見せないため)
  const freshMediumResult =
    privateState?.mediumResult && privateState.mediumResult.day === publicState.day
      ? privateState.mediumResult
      : null;

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-4 py-8 safe-top safe-bottom">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl animate-pop-in bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30">
          <Gavel className="size-7" />
        </div>
        <PhaseTag>{t.executionResult.tag(publicState.day)}</PhaseTag>
      </div>

      <Card>
        <CardContent className="space-y-3 py-6">
          {executedName && wasSpared ? (
            <div className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-3">
              <HeartHandshake className="size-5 shrink-0 text-emerald-400" />
              <div>
                <p className="text-base font-bold">{t.executionResult.spared(executedName)}</p>
              </div>
            </div>
          ) : executedName ? (
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

          {freshMediumResult && (
            <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-3 text-xs">
              <p className="flex items-center gap-1 font-semibold text-indigo-300">
                <Sparkles className="size-3.5" /> {t.executionResult.mediumResult}
              </p>
              <p
                className={
                  "mt-0.5 " + (freshMediumResult.isBlack ? "font-bold text-red-400" : "font-bold text-sky-300")
                }
              >
                {t.executionResult.mediumResultLine(freshMediumResult.targetName, freshMediumResult.isBlack)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {isHost ? (
        <ConfirmButton
          title={t.confirm.advanceTitle}
          description={t.confirm.advanceDesc}
          confirmLabel={t.confirm.advanceAction}
          onConfirm={() => advance("night")}
          className="w-full font-bold"
        >
          {t.executionResult.continueButton}
        </ConfirmButton>
      ) : (
        <p className="text-center text-xs text-muted-foreground">{t.executionResult.waitingHost}</p>
      )}
    </div>
  );
}
