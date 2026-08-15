"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Crown, LogOut, Settings2, Sparkles, UserX, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
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
import { RoleCompositionEditor } from "@/components/game/role-composition-editor";
import { PlayerAvatar } from "@/components/game/shared";
import { HelpDialog } from "@/components/game/help-dialog";
import { suggestComposition, validateComposition, MIN_PLAYERS, MAX_PLAYERS } from "@/lib/game/composition";

export function LobbyScreen() {
  const { publicState, session, updateComposition, kick, transferHost, startGame, leaveRoom } = useGame();
  const { t } = useLocale();
  const [starting, setStarting] = useState(false);
  if (!publicState || !session) return null;

  const me = publicState.players.find((p) => p.id === session.playerId);
  const isHost = !!me?.isHost;
  const n = publicState.players.length;
  const { valid, issues } = validateComposition(publicState.roleCounts, n);

  const handleStart = async () => {
    setStarting(true);
    const res = await startGame();
    setStarting(false);
    if (!res.ok && res.errorCode !== "INVALID_COMPOSITION") {
      toast.error(t.errors[res.errorCode]);
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(publicState.code);
      toast.success(t.lobby.copyCodeToast);
    } catch {
      toast.error(t.lobby.copyErrorToast);
    }
  };

  const copyLink = async () => {
    try {
      const url = `${window.location.origin}/?code=${publicState.code}`;
      await navigator.clipboard.writeText(url);
      toast.success(t.lobby.copyLinkToast);
    } catch {
      toast.error(t.lobby.copyErrorToast);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 py-6 safe-top safe-bottom">
      <div className="flex justify-end">
        <HelpDialog />
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex flex-col items-center gap-2 py-4">
          <p className="text-xs text-muted-foreground">{t.lobby.codeLabel}</p>
          <p className="font-mono text-4xl font-black tracking-[0.25em] text-primary">{publicState.code}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyCode}>
              <Copy className="size-3.5" /> {t.lobby.copyCode}
            </Button>
            <Button variant="outline" size="sm" onClick={copyLink}>
              {t.lobby.copyLink}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="size-4" /> {t.lobby.participants(n)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5">
          {publicState.players.map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/60 px-3 py-2">
              <PlayerAvatar player={p} size="sm" />
              <span className="flex-1 truncate text-sm font-medium">{p.name}</span>
              {p.isHost && <Badge variant="outline" className="text-[10px]">{t.common.host}</Badge>}
              {!p.connected && <Badge variant="destructive" className="text-[10px]">{t.common.disconnected}</Badge>}
              {isHost && p.id !== session.playerId && p.connected && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-7 text-muted-foreground">
                      <Crown className="size-3.5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t.lobby.makeHostConfirmTitle}</AlertDialogTitle>
                      <AlertDialogDescription>{t.lobby.makeHostConfirmDesc(p.name)}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
                      <AlertDialogAction onClick={() => transferHost(p.id)}>
                        {t.lobby.makeHostConfirmAction}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              {isHost && p.id !== session.playerId && (
                <Button variant="ghost" size="icon" className="size-7 text-muted-foreground" onClick={() => kick(p.id)}>
                  <UserX className="size-3.5" />
                </Button>
              )}
            </div>
          ))}
          {n < MIN_PLAYERS && (
            <p className="pt-1 text-center text-xs text-muted-foreground">
              {t.lobby.waitingForMorePlayers(MIN_PLAYERS - n)}
            </p>
          )}
        </CardContent>
      </Card>

      {isHost ? (
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">{t.lobby.composition}</CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateComposition(suggestComposition(n))}
              >
                <Sparkles className="size-3.5" /> {t.lobby.suggest}
              </Button>
              <SettingsDialog />
            </div>
          </CardHeader>
          <CardContent>
            <RoleCompositionEditor
              counts={publicState.roleCounts}
              onChange={updateComposition}
              playerCount={n}
            />
            {!valid && (
              <div className="mt-3 space-y-1 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                {issues.map((issue, i) => (
                  <p key={i}>・{t.validation(issue)}</p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t.lobby.compositionReadonly}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t.lobby.compositionReadonlyDesc(publicState.roleCounts.werewolf ?? 0, publicState.totalSeats)}
            </p>
          </CardContent>
        </Card>
      )}

      <Separator />

      <div className="flex flex-col gap-2 pb-4">
        {isHost ? (
          <Button
            size="lg"
            className="w-full text-base font-bold"
            disabled={!valid || n < MIN_PLAYERS || n > MAX_PLAYERS || starting}
            onClick={handleStart}
          >
            {t.lobby.startButton}
          </Button>
        ) : (
          <p className="text-center text-sm text-muted-foreground">{t.lobby.waitingHost}</p>
        )}
        <Button variant="ghost" className="text-muted-foreground" onClick={leaveRoom}>
          <LogOut className="size-4" /> {t.lobby.leaveButton}
        </Button>
      </div>
    </div>
  );
}

function SettingsDialog() {
  const { publicState, updateSettings } = useGame();
  const { t } = useLocale();
  if (!publicState) return null;
  const s = publicState.settings;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings2 className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.lobby.settingsTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="reveal-death">{t.lobby.revealOnDeath}</Label>
            <Switch
              id="reveal-death"
              checked={s.revealRoleOnDeath}
              onCheckedChange={(v) => updateSettings({ revealRoleOnDeath: v })}
            />
          </div>
          <TimeField
            label={t.lobby.nightSeconds}
            value={s.nightSeconds}
            onChange={(v) => updateSettings({ nightSeconds: v })}
          />
          <TimeField
            label={t.lobby.discussionSeconds}
            value={s.discussionSeconds}
            onChange={(v) => updateSettings({ discussionSeconds: v })}
          />
          <TimeField
            label={t.lobby.voteSeconds}
            value={s.voteSeconds}
            onChange={(v) => updateSettings({ voteSeconds: v })}
          />
          <TimeField
            label={t.lobby.roleRevealSeconds}
            value={s.roleRevealSeconds}
            onChange={(v) => updateSettings({ roleRevealSeconds: v })}
          />
          <TimeField
            label={t.lobby.resultPauseSeconds}
            value={s.resultPauseSeconds}
            onChange={(v) => updateSettings({ resultPauseSeconds: v })}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="w-full">{t.common.close}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TimeField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const { t } = useLocale();
  return (
    <div className="flex items-center justify-between gap-3">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="size-7" onClick={() => onChange(Math.max(10, value - 15))}>
          -
        </Button>
        <span className="w-14 text-center font-mono text-sm tabular-nums">{t.common.seconds(value)}</span>
        <Button variant="outline" size="icon" className="size-7" onClick={() => onChange(Math.min(600, value + 15))}>
          +
        </Button>
      </div>
    </div>
  );
}
