"use client";

import { useState } from "react";
import { Crosshair, FastForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGame } from "@/hooks/use-game";
import { useLocale } from "@/lib/i18n/locale-context";
import { PlayerPicker } from "@/components/game/player-picker";

export function HunterRevengeScreen() {
  const { publicState, privateState, session, hunterRevenge, skipHunterRevenge } = useGame();
  const { t } = useLocale();
  const [pick, setPick] = useState<string | null | undefined>(undefined);
  const [sent, setSent] = useState(false);
  if (!publicState || !session) return null;

  const isMe = !!privateState?.pendingHunterRevenge;
  const me = publicState.players.find((p) => p.id === session.playerId);
  const isHost = !!me?.isHost;

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-5 px-4 py-8 safe-top safe-bottom">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30">
        <Crosshair className="size-8" />
      </div>
      <div className="text-center">
        <p className="text-lg font-black">{t.hunterRevenge.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {t.hunterRevenge.waitingFor(publicState.awaitingHunterRevenge?.hunterName ?? "?")}
        </p>
      </div>

      {isMe && privateState?.pendingHunterRevenge && (
        <Card className="w-full">
          <CardContent className="space-y-4 py-5">
            <p className="text-sm">{t.hunterRevenge.youAre}</p>
            <PlayerPicker
              candidates={privateState.pendingHunterRevenge.candidates}
              selectedId={pick}
              onSelect={(id) => {
                setPick(id);
                setSent(false);
              }}
              allowSkip
              skipLabel={t.hunterRevenge.skip}
            />
            <Button
              className="w-full font-bold"
              size="lg"
              disabled={pick === undefined || sent}
              onClick={() => {
                hunterRevenge(pick ?? null);
                setSent(true);
              }}
            >
              {sent ? t.hunterRevenge.submitted : t.hunterRevenge.submit}
            </Button>
          </CardContent>
        </Card>
      )}

      {!isMe && isHost && (
        <Button variant="outline" onClick={skipHunterRevenge}>
          <FastForward className="size-4" /> {t.hunterRevenge.hostSkipButton}
        </Button>
      )}
    </div>
  );
}
