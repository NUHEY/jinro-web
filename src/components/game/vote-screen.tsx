"use client";

import { useState } from "react";
import { Vote as VoteIcon, CheckCircle2, FastForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGame } from "@/hooks/use-game";
import { useLocale } from "@/lib/i18n/locale-context";
import { PhaseTag } from "@/components/game/shared";
import { PlayerPicker } from "@/components/game/player-picker";

export function VoteScreen() {
  const { publicState, privateState, session, vote, forceResolveVote } = useGame();
  const { t } = useLocale();
  const [pick, setPick] = useState<string | null | undefined>(undefined);
  const [confirmed, setConfirmed] = useState(false);
  if (!publicState || !privateState || !session) return null;

  const alive = privateState.self.alive;
  const isRunoff = !!publicState.runoffCandidateIds && publicState.runoffCandidateIds.length > 0;
  const candidates = publicState.players.filter(
    (p) => p.alive && (!isRunoff || publicState.runoffCandidateIds!.includes(p.id))
  );
  const me = publicState.players.find((p) => p.id === session.playerId);
  const isHost = !!me?.isHost;

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-4 py-6 safe-top safe-bottom">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30">
          <VoteIcon className="size-7" />
        </div>
        <PhaseTag>{isRunoff ? t.vote.runoffTag(publicState.day) : t.vote.tag(publicState.day)}</PhaseTag>
      </div>

      {isRunoff && (
        <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-center text-xs text-amber-300">
          {t.vote.runoffNotice}
        </p>
      )}

      {!alive ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            {t.vote.cannotVote}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="space-y-4 py-5">
            <p className="text-sm font-bold">{t.vote.instructions}</p>
            <PlayerPicker
              candidates={candidates}
              selectedId={pick}
              onSelect={(id) => {
                setPick(id);
                setConfirmed(false);
              }}
            />
            <Button
              className="w-full font-bold"
              size="lg"
              disabled={!pick}
              onClick={() => {
                if (!pick) return;
                vote(pick);
                setConfirmed(true);
              }}
            >
              {privateState.hasVoted || confirmed ? (
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-4" /> {t.vote.submittedButton}
                </span>
              ) : (
                t.vote.submitButton
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {publicState.progress && (
        <p className="text-center text-xs text-muted-foreground">
          {t.vote.progress(publicState.progress.submitted, publicState.progress.total)}
        </p>
      )}

      {isHost && (
        <Button variant="outline" className="w-full" onClick={forceResolveVote}>
          <FastForward className="size-4" /> {t.vote.forceAdvanceButton}
        </Button>
      )}
    </div>
  );
}
