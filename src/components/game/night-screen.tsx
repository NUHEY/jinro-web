"use client";

import { useState } from "react";
import { Moon, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGame } from "@/hooks/use-game";
import { useLocale } from "@/lib/i18n/locale-context";
import { CountdownBar, PhaseTag } from "@/components/game/shared";
import { PlayerPicker } from "@/components/game/player-picker";
import type { NightActionType } from "@/lib/game/roles";

export function NightScreen() {
  const { publicState, privateState, submitNight } = useGame();
  const { t } = useLocale();
  const [pick, setPick] = useState<string | null | undefined>(undefined);
  const [confirmed, setConfirmed] = useState(false);

  if (!publicState || !privateState) return null;
  const pending = privateState.pendingNightAction;
  const alive = privateState.self.alive;
  const actionCopy = pending ? t.night.actions[pending.type as Exclude<NightActionType, "none">] : null;

  const handleSubmit = () => {
    submitNight(pick ?? null);
    setConfirmed(true);
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-4 py-6 safe-top safe-bottom">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/30">
          <Moon className="size-7" />
        </div>
        <PhaseTag>{t.night.tag(publicState.day)}</PhaseTag>
      </div>

      <CountdownBar endsAt={publicState.phaseEndsAt} totalSeconds={publicState.settings.nightSeconds} />

      {!alive ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            {t.night.deadNotice}
          </CardContent>
        </Card>
      ) : pending && actionCopy ? (
        <Card>
          <CardContent className="space-y-4 py-5">
            <div>
              <p className="text-base font-bold">{actionCopy.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{actionCopy.desc}</p>
            </div>
            <PlayerPicker
              candidates={pending.candidates}
              selectedId={pick}
              onSelect={(id) => {
                setPick(id);
                setConfirmed(false);
              }}
              allowSkip
              skipLabel={actionCopy.skip}
            />
            {privateState.seerResult && (
              <div className="rounded-lg border border-violet-500/30 bg-violet-500/10 p-3 text-xs">
                <p className="font-semibold text-violet-300">
                  {t.night.previousSeerResult(privateState.seerResult.day)}
                </p>
                <p
                  className={
                    "mt-0.5 " +
                    (privateState.seerResult.isBlack ? "font-bold text-red-400" : "font-bold text-sky-300")
                  }
                >
                  {t.night.seerResultLine(privateState.seerResult.targetName, privateState.seerResult.isBlack)}
                </p>
              </div>
            )}
            <Button
              className="w-full font-bold"
              size="lg"
              disabled={pick === undefined}
              onClick={handleSubmit}
            >
              {pending.submitted || confirmed ? (
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-4" /> {t.night.resubmitButton}
                </span>
              ) : (
                t.night.submitButton
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-10 text-center text-sm text-muted-foreground">
            <Moon className="size-6 opacity-60" />
            <p>{t.night.dormant}</p>
            <p className="text-xs">{t.night.dormantDesc}</p>
          </CardContent>
        </Card>
      )}

      {publicState.progress && (
        <p className="text-center text-xs text-muted-foreground">
          {t.night.progress(publicState.progress.submitted, publicState.progress.total)}
        </p>
      )}
    </div>
  );
}
