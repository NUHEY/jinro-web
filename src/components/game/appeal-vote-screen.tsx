"use client";

import { useState } from "react";
import { Scale, CheckCircle2, FastForward, Skull, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGame } from "@/hooks/use-game";
import { useLocale } from "@/lib/i18n/locale-context";
import { PhaseTag, ConfirmButton } from "@/components/game/shared";
import { cn } from "@/lib/utils";
import type { AppealChoice } from "@/lib/game/types";

export function AppealVoteScreen() {
  const { publicState, privateState, session, submitAppeal, forceResolveAppealVote } = useGame();
  const { t } = useLocale();
  const [pick, setPick] = useState<AppealChoice | undefined>(undefined);
  const [confirmed, setConfirmed] = useState(false);
  if (!publicState || !privateState || !session) return null;

  const targetName = publicState.pendingExecution?.playerName ?? "?";
  const canVote = privateState.self.alive && !privateState.isPendingExecution;
  const me = publicState.players.find((p) => p.id === session.playerId);
  const isHost = !!me?.isHost;

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-4 py-6 safe-bottom">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl animate-pop-in bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30">
          <Scale className="size-7" />
        </div>
        <PhaseTag>{t.appealVote.tag(publicState.day)}</PhaseTag>
        <p className="text-sm font-bold">{t.appealVote.instructions(targetName)}</p>
      </div>

      {!canVote ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            {t.appealVote.cannotVote}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="space-y-4 py-5">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setPick("execute");
                  setConfirmed(false);
                }}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border px-3 py-5 transition active:scale-[0.97]",
                  pick === "execute"
                    ? "border-destructive bg-destructive/15 ring-1 ring-destructive"
                    : "border-border/60 bg-card/60 hover:bg-card"
                )}
              >
                <Skull className="size-6 text-destructive" />
                <span className="text-sm font-bold">{t.appealVote.executeOption}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPick("spare");
                  setConfirmed(false);
                }}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border px-3 py-5 transition active:scale-[0.97]",
                  pick === "spare"
                    ? "border-emerald-500 bg-emerald-500/15 ring-1 ring-emerald-500"
                    : "border-border/60 bg-card/60 hover:bg-card"
                )}
              >
                <HeartHandshake className="size-6 text-emerald-400" />
                <span className="text-sm font-bold">{t.appealVote.spareOption}</span>
              </button>
            </div>
            <Button
              className="w-full font-bold"
              size="lg"
              disabled={!pick}
              onClick={() => {
                if (!pick) return;
                submitAppeal(pick);
                setConfirmed(true);
              }}
            >
              {privateState.hasVotedAppeal || confirmed ? (
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-4" /> {t.appealVote.submittedButton}
                </span>
              ) : (
                t.appealVote.submitButton
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {publicState.progress && (
        <p className="text-center text-xs text-muted-foreground">
          {t.appealVote.progress(publicState.progress.submitted, publicState.progress.total)}
        </p>
      )}

      {isHost && (
        <ConfirmButton
          title={t.confirm.forceResolveTitle}
          description={t.confirm.forceResolveDesc}
          confirmLabel={t.confirm.forceResolveAction}
          onConfirm={forceResolveAppealVote}
          variant="outline"
          className="w-full"
        >
          <FastForward className="size-4" /> {t.appealVote.forceAdvanceButton}
        </ConfirmButton>
      )}
    </div>
  );
}
