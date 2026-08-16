"use client";

import { Sun, Skull, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useGame } from "@/hooks/use-game";
import { useLocale } from "@/lib/i18n/locale-context";
import { PhaseTag, ConfirmButton } from "@/components/game/shared";

export function DayResultScreen() {
  const { publicState, privateState, session, advance } = useGame();
  const { t } = useLocale();
  if (!publicState || !session) return null;

  const me = publicState.players.find((p) => p.id === session.playerId);
  const isHost = !!me?.isHost;
  const deaths = publicState.lastDeaths;
  // 今夜占った結果のみ表示する(過去の古い占い結果を「今」の結果のように見せないため)
  const freshSeerResult =
    privateState?.seerResult && privateState.seerResult.day === publicState.day ? privateState.seerResult : null;

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-4 py-8 safe-bottom">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl animate-pop-in bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30">
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

      {freshSeerResult && (
        <div className="rounded-lg border border-violet-500/30 bg-violet-500/10 p-3 text-xs">
          <p className="flex items-center gap-1.5 font-semibold text-violet-300">
            <Eye className="size-3.5" /> {t.dayResult.seerResult}
          </p>
          <p
            className={
              "mt-0.5 text-sm " + (freshSeerResult.isBlack ? "font-bold text-red-400" : "font-bold text-sky-300")
            }
          >
            {t.night.seerResultLine(freshSeerResult.targetName, freshSeerResult.isBlack)}
          </p>
        </div>
      )}

      {isHost ? (
        <ConfirmButton
          title={t.confirm.advanceTitle}
          description={t.confirm.advanceDesc}
          confirmLabel={t.confirm.advanceAction}
          onConfirm={() => advance("discussion")}
          className="w-full font-bold"
        >
          {t.dayResult.continueButton}
        </ConfirmButton>
      ) : (
        <p className="text-center text-xs text-muted-foreground">{t.dayResult.waitingHost}</p>
      )}
    </div>
  );
}
