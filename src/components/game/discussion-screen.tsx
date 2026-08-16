"use client";

import { useState } from "react";
import { MessagesSquare, Gavel, Vote as VoteIcon, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useGame } from "@/hooks/use-game";
import { useLocale } from "@/lib/i18n/locale-context";
import { PhaseTag, PlayerAvatar, ConfirmButton } from "@/components/game/shared";
import { PlayerPicker } from "@/components/game/player-picker";
import { AllyNote } from "@/components/game/ally-note";

export function DiscussionScreen() {
  const { publicState, privateState, session, advance, dictatorAct } = useGame();
  const { t } = useLocale();
  const [dictatorTarget, setDictatorTarget] = useState<string | null | undefined>(undefined);
  if (!publicState || !session) return null;

  const me = publicState.players.find((p) => p.id === session.playerId);
  const isHost = !!me?.isHost;
  const isFirstRound = publicState.day === 0;
  const aliveCandidates = publicState.players.filter((p) => p.alive && p.id !== session.playerId);
  const runoffNames = publicState.runoffCandidateIds
    ?.map((id) => publicState.players.find((p) => p.id === id)?.name)
    .filter((n): n is string => !!n);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-4 py-6 safe-bottom">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl animate-pop-in bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30">
          <MessagesSquare className="size-7" />
        </div>
        <PhaseTag>{isFirstRound ? t.discussion.firstRoundTag : t.discussion.tag(publicState.day)}</PhaseTag>
      </div>

      {isFirstRound && (
        <Card className="border-sky-500/30 bg-sky-500/10">
          <CardContent className="py-4 text-center text-sm text-sky-200">
            {t.discussion.firstRoundNotice}
          </CardContent>
        </Card>
      )}

      <AllyNote />

      {runoffNames && runoffNames.length > 0 && (
        <Card className="border-amber-500/40 bg-amber-500/10">
          <CardContent className="space-y-1.5 py-4 text-center">
            <p className="flex items-center justify-center gap-1.5 text-sm font-semibold text-amber-300">
              <VoteIcon className="size-4" /> {t.discussion.runoffNotice}
            </p>
            <p className="text-xs text-muted-foreground">
              {t.discussion.runoffCandidatesLabel}: {runoffNames.join(t.common.listSeparator)}
            </p>
          </CardContent>
        </Card>
      )}

      <div>
        <p className="mb-2 px-1 text-xs font-bold text-muted-foreground">{t.discussion.survivors}</p>
        <div className="grid grid-cols-4 gap-2">
          {publicState.players.map((p) => (
            <div key={p.id} className="flex flex-col items-center gap-1">
              <PlayerAvatar player={p} />
              <span className="max-w-full truncate text-[11px]">{p.name}</span>
            </div>
          ))}
        </div>
      </div>

      {privateState?.canUseDictator && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="lg" className="w-full font-bold">
              <Gavel className="size-4" /> {t.discussion.dictatorButton}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t.discussion.dictatorConfirmTitle}</AlertDialogTitle>
              <AlertDialogDescription>{t.discussion.dictatorConfirmDesc}</AlertDialogDescription>
            </AlertDialogHeader>
            <PlayerPicker candidates={aliveCandidates} selectedId={dictatorTarget} onSelect={setDictatorTarget} />
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDictatorTarget(undefined)}>{t.common.cancel}</AlertDialogCancel>
              <AlertDialogAction
                disabled={!dictatorTarget}
                onClick={() => dictatorTarget && dictatorAct(dictatorTarget)}
              >
                {t.discussion.dictatorConfirmAction}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {isHost && (
        <div className="flex flex-col gap-2">
          {isFirstRound ? (
            <ConfirmButton
              title={t.confirm.advanceTitle}
              description={t.confirm.advanceDesc}
              confirmLabel={t.confirm.advanceAction}
              onConfirm={() => advance("night")}
              className="w-full font-bold"
            >
              <Moon className="size-4" /> {t.discussion.proceedToNightButton}
            </ConfirmButton>
          ) : (
            <ConfirmButton
              title={t.confirm.advanceTitle}
              description={t.confirm.advanceDesc}
              confirmLabel={t.confirm.advanceAction}
              onConfirm={() => advance("vote")}
              className="w-full font-bold"
            >
              {t.discussion.skipButton}
            </ConfirmButton>
          )}
        </div>
      )}
      {!isHost && (
        <p className="text-center text-xs text-muted-foreground">{t.discussion.waitingHost}</p>
      )}
    </div>
  );
}
