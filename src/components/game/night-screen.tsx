"use client";

import { useState } from "react";
import { Moon, CheckCircle2, FastForward, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGame } from "@/hooks/use-game";
import { useLocale } from "@/lib/i18n/locale-context";
import { PhaseTag } from "@/components/game/shared";
import { PlayerPicker } from "@/components/game/player-picker";
import { AllyNote } from "@/components/game/ally-note";
import type { NightActionType } from "@/lib/game/roles";

export function NightScreen() {
  const { publicState, privateState, session, submitNight, forceResolveNight } = useGame();
  const { t } = useLocale();
  const [pick, setPick] = useState<string | null | undefined>(undefined);
  const [confirmed, setConfirmed] = useState(false);

  if (!publicState || !privateState || !session) return null;
  const pending = privateState.pendingNightAction;
  const alive = privateState.self.alive;
  const actionCopy = pending ? t.night.actions[pending.type as Exclude<NightActionType, "none">] : null;
  const me = publicState.players.find((p) => p.id === session.playerId);
  const isHost = !!me?.isHost;
  const isAttack = pending?.type === "attack";

  const handleSubmit = () => {
    submitNight(pick ?? null);
    setConfirmed(true);
  };

  // 人狼の襲撃選択のみ、タップした瞬間に自動送信する。
  // これにより仲間の人狼への選択状況の共有(相談用)が即座に反映される。
  const handlePick = (id: string | null) => {
    setPick(id);
    setConfirmed(false);
    if (isAttack) {
      submitNight(id);
      setConfirmed(true);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-4 py-6 safe-top safe-bottom">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/30">
          <Moon className="size-7" />
        </div>
        <PhaseTag>{t.night.tag(publicState.day)}</PhaseTag>
      </div>

      {alive && <AllyNote />}

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
            {pending.type === "attack" && publicState.day === 1 && !publicState.settings.allowFirstNightKill && (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
                {t.night.firstNightKillDisabledNotice}
              </div>
            )}
            <PlayerPicker
              candidates={pending.candidates}
              selectedId={pick}
              onSelect={handlePick}
              allowSkip
              skipLabel={actionCopy.skip}
            />
            {isAttack && pending.wolfSelections && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs">
                <p className="flex items-center gap-1.5 font-semibold text-red-300">
                  <Users className="size-3.5" /> {t.night.wolfSelectionsTitle}
                </p>
                {pending.wolfSelections.length === 0 ? (
                  <p className="mt-1 text-red-300/70">{t.night.wolfSelectionsEmpty}</p>
                ) : (
                  <ul className="mt-1.5 space-y-1">
                    {pending.wolfSelections.map((w) => (
                      <li key={w.id} className="text-red-200">
                        {t.night.wolfSelectionsLine(w.name, w.targetName)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
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

      {isHost && (
        <Button variant="outline" className="w-full" onClick={forceResolveNight}>
          <FastForward className="size-4" /> {t.night.forceAdvanceButton}
        </Button>
      )}
    </div>
  );
}
