"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Copy, Crown, LogOut, Send, Settings2, Sparkles, UserX, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { OFFICIAL_SETTINGS } from "@/lib/game/engine";
import type { RoomSettings } from "@/lib/game/types";
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
import { RoleCompositionSummary, RoomSettingsSummary } from "@/components/game/room-config-summary";
import { PlayerAvatar } from "@/components/game/shared";
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

  const inviteUrl = () => `${window.location.origin}/?code=${publicState.code}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl());
      toast.success(t.lobby.copyLinkToast);
    } catch {
      toast.error(t.lobby.copyErrorToast);
    }
  };

  // スマホのOS標準の共有シート(LINE・メッセージ・メールなど、端末に入っている好きなアプリを選べる)を開く。
  // 対応していない環境(主にPCブラウザ)では、これまで通りリンクのコピーにフォールバックする。
  const shareInvite = async () => {
    const url = inviteUrl();
    const text = t.lobby.shareMessage(publicState.code);
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: t.meta.title, text, url });
      } catch {
        // ユーザーが共有シートをキャンセルした場合などはエラーを無視する(コピーへのフォールバックもしない)
      }
      return;
    }
    await copyLink();
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 py-6 safe-bottom">
      <Card className="animate-in fade-in-0 zoom-in-95 border-primary/30 bg-primary/5 duration-500">
        <CardContent className="flex flex-col items-center gap-2 py-4">
          <p className="text-xs text-muted-foreground">{t.lobby.codeLabel}</p>
          <p className="font-mono text-4xl font-black tracking-[0.25em] text-primary">{publicState.code}</p>
          <Button className="w-full font-bold" onClick={shareInvite}>
            <Send className="size-3.5" /> {t.lobby.shareLink}
          </Button>
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
          <CardContent className="space-y-4">
            <RoleCompositionSummary counts={publicState.roleCounts} totalSeats={publicState.totalSeats} playerCount={n} />
            <Separator />
            <div>
              <p className="mb-2 px-1 text-xs font-bold text-muted-foreground">{t.lobby.settingsTitle}</p>
              <RoomSettingsSummary settings={publicState.settings} />
            </div>
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

// 現在の値が公式ルールの基準値と一致している設定にだけ、小さな「公式ルール」バッジを表示する。
// 基準を持たない項目(このアプリ独自の追加ルール)には何も表示しない。
function OfficialBadge({ settingKey, value }: { settingKey: keyof RoomSettings; value: boolean }) {
  const { t } = useLocale();
  const official = OFFICIAL_SETTINGS[settingKey];
  if (official === undefined || official !== value) return null;
  return (
    <Badge
      variant="outline"
      className="shrink-0 gap-1 border-emerald-500/40 bg-emerald-500/10 text-[10px] font-bold text-emerald-300"
    >
      <Check className="size-2.5" /> {t.common.officialRuleBadge}
    </Badge>
  );
}

function SettingRow({
  id,
  label,
  desc,
  checked,
  onCheckedChange,
  badge,
}: {
  id: string;
  label: string;
  desc?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  badge?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={id} className="flex-1">
          {label}
        </Label>
        <div className="flex shrink-0 items-center gap-2">
          {badge}
          <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
        </div>
      </div>
      {desc && <p className="text-xs leading-relaxed text-muted-foreground">{desc}</p>}
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
      <DialogContent className="flex max-h-[85dvh] max-w-md flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>{t.lobby.settingsTitle}</DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto py-2 pr-1">
          <div>
            <p className="mb-3 px-0.5 text-xs font-bold text-muted-foreground">{t.lobby.officialRulesSectionTitle}</p>
            <div className="space-y-5">
              <SettingRow
                id="reveal-death"
                label={t.lobby.revealOnDeath}
                checked={s.revealRoleOnDeath}
                onCheckedChange={(v) => updateSettings({ revealRoleOnDeath: v })}
                badge={<OfficialBadge settingKey="revealRoleOnDeath" value={s.revealRoleOnDeath} />}
              />
              <Separator />
              <SettingRow
                id="first-night-kill"
                label={t.lobby.allowFirstNightKill}
                desc={t.lobby.allowFirstNightKillDesc}
                checked={s.allowFirstNightKill}
                onCheckedChange={(v) => updateSettings({ allowFirstNightKill: v })}
                badge={<OfficialBadge settingKey="allowFirstNightKill" value={s.allowFirstNightKill} />}
              />
              <Separator />
              <SettingRow
                id="first-vote-execution"
                label={t.lobby.allowFirstVoteExecution}
                desc={t.lobby.allowFirstVoteExecutionDesc}
                checked={s.allowFirstVoteExecution}
                onCheckedChange={(v) => updateSettings({ allowFirstVoteExecution: v })}
                badge={<OfficialBadge settingKey="allowFirstVoteExecution" value={s.allowFirstVoteExecution} />}
              />
              <Separator />
              <SettingRow
                id="wolf-friendly-fire"
                label={t.lobby.allowWolfFriendlyFire}
                desc={t.lobby.allowWolfFriendlyFireDesc}
                checked={s.allowWolfFriendlyFire}
                onCheckedChange={(v) => updateSettings({ allowWolfFriendlyFire: v })}
                badge={<OfficialBadge settingKey="allowWolfFriendlyFire" value={s.allowWolfFriendlyFire} />}
              />
              <Separator />
              <SettingRow
                id="seer-early-divine"
                label={t.lobby.seerFirstNightDivine}
                desc={t.lobby.seerFirstNightDivineDesc}
                checked={s.seerFirstNightDivine}
                onCheckedChange={(v) => updateSettings({ seerFirstNightDivine: v })}
                badge={
                  <Badge
                    variant="outline"
                    className="shrink-0 gap-1 border-violet-500/40 bg-violet-500/10 text-[10px] font-bold text-violet-300"
                  >
                    {t.common.optionalRuleBadge}
                  </Badge>
                }
              />
            </div>
          </div>

          <Separator className="my-1" />

          <div>
            <p className="mb-1 px-0.5 text-xs font-bold text-muted-foreground">{t.lobby.extraRulesSectionTitle}</p>
            <p className="mb-3 px-0.5 text-[11px] leading-relaxed text-muted-foreground">{t.lobby.extraRulesSectionDesc}</p>
            <div className="space-y-5">
              <SettingRow
                id="allow-self-vote"
                label={t.lobby.allowSelfVote}
                checked={s.allowSelfVote}
                onCheckedChange={(v) => updateSettings({ allowSelfVote: v })}
              />
              <Separator />
              <SettingRow
                id="reveal-vote-choices"
                label={t.lobby.revealVoteChoices}
                desc={t.lobby.revealVoteChoicesDesc}
                checked={s.revealVoteChoices}
                onCheckedChange={(v) => updateSettings({ revealVoteChoices: v })}
              />
              <Separator />
              <SettingRow
                id="second-tie-random"
                label={t.lobby.secondTieExecutesRandomly}
                desc={t.lobby.secondTieExecutesRandomlyDesc}
                checked={s.secondTieExecutesRandomly}
                onCheckedChange={(v) => updateSettings({ secondTieExecutesRandomly: v })}
              />
              <Separator />
              <SettingRow
                id="bodyguard-self-guard"
                label={t.lobby.allowBodyguardSelfGuard}
                checked={s.allowBodyguardSelfGuard}
                onCheckedChange={(v) => updateSettings({ allowBodyguardSelfGuard: v })}
              />
              <Separator />
              <SettingRow
                id="dictator-self-target"
                label={t.lobby.dictatorCanTargetSelf}
                checked={s.dictatorCanTargetSelf}
                onCheckedChange={(v) => updateSettings({ dictatorCanTargetSelf: v })}
              />
            </div>
          </div>

          <Separator />

          <p className="text-xs leading-relaxed text-muted-foreground">{t.lobby.settingsPacingNote}</p>
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
