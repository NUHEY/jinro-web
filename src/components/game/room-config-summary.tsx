"use client";

import { Check, X } from "lucide-react";
import { ROLES, type RoleId } from "@/lib/game/roles";
import { ICONS, styleOf } from "@/lib/game/role-style";
import { TEAM_GROUPS } from "@/components/game/role-composition-editor";
import type { RoleCounts, RoomSettings } from "@/lib/game/types";
import { OFFICIAL_SETTINGS } from "@/lib/game/engine";
import { useLocale } from "@/lib/i18n/locale-context";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ホストが設定した役職構成・ゲーム設定を、ホスト以外の全員もリアルタイムに(ロビーでもゲーム中でも)
// 確認できるようにするための読み取り専用の一覧表示。publicState は元々全員に配信されているため、
// ここでは表示するだけで新しい通信は不要。
export function RoleCompositionSummary({
  counts,
  totalSeats,
  playerCount,
}: {
  counts: RoleCounts;
  totalSeats: number;
  playerCount?: number;
}) {
  const { t } = useLocale();
  const activeGroups = TEAM_GROUPS.map((group) => ({
    ...group,
    roles: group.roles.filter((r) => (counts[r] ?? 0) > 0),
  })).filter((group) => group.roles.length > 0);

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "flex items-center justify-between rounded-lg border px-3 py-2 text-sm font-semibold",
          playerCount === undefined || totalSeats === playerCount
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
            : "border-amber-500/40 bg-amber-500/10 text-amber-300"
        )}
      >
        <span>{t.lobby.seatTotal}</span>
        <span className="font-mono">
          {playerCount === undefined ? totalSeats : t.lobby.seatTotalOf(totalSeats, playerCount)}
        </span>
      </div>

      {activeGroups.length === 0 ? (
        <p className="text-center text-xs text-muted-foreground">{t.lobby.compositionEmpty}</p>
      ) : (
        activeGroups.map((group) => (
          <div key={group.team} className="space-y-1.5">
            <p className="px-1 text-xs font-bold text-muted-foreground">
              {group.team === "solo" ? t.lobby.soloGroupLabel : t.team[group.team]}
            </p>
            <div className="space-y-1.5">
              {group.roles.map((role) => {
                const def = ROLES[role as RoleId];
                const text = t.roles[role as RoleId];
                const style = styleOf(def.color);
                const Icon = ICONS[def.icon] ?? ICONS.User;
                return (
                  <div
                    key={role}
                    className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/60 px-3 py-2"
                  >
                    <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-full border", style.chip)}>
                      <Icon className="size-4" />
                    </div>
                    <p className="min-w-0 flex-1 truncate text-sm font-medium">{text.name}</p>
                    <span className={cn("shrink-0 font-mono text-sm font-bold", style.text)}>
                      × {counts[role as RoleId] ?? 0}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export function RoomSettingsSummary({ settings }: { settings: RoomSettings }) {
  const { t } = useLocale();
  const officialRows: Array<{ key: keyof RoomSettings; label: string; desc?: string; on: boolean; optional?: boolean }> = [
    { key: "revealRoleOnDeath", label: t.lobby.revealOnDeath, on: settings.revealRoleOnDeath },
    {
      key: "allowFirstNightKill",
      label: t.lobby.allowFirstNightKill,
      desc: t.lobby.allowFirstNightKillDesc,
      on: settings.allowFirstNightKill,
    },
    {
      key: "allowFirstVoteExecution",
      label: t.lobby.allowFirstVoteExecution,
      desc: t.lobby.allowFirstVoteExecutionDesc,
      on: settings.allowFirstVoteExecution,
    },
    {
      key: "allowWolfFriendlyFire",
      label: t.lobby.allowWolfFriendlyFire,
      desc: t.lobby.allowWolfFriendlyFireDesc,
      on: settings.allowWolfFriendlyFire,
    },
    {
      key: "seerFirstNightDivine",
      label: t.lobby.seerFirstNightDivine,
      desc: t.lobby.seerFirstNightDivineDesc,
      on: settings.seerFirstNightDivine,
      optional: true,
    },
  ];
  const extraRows: Array<{ label: string; desc?: string; on: boolean }> = [
    { label: t.lobby.allowSelfVote, on: settings.allowSelfVote },
    { label: t.lobby.revealVoteChoices, desc: t.lobby.revealVoteChoicesDesc, on: settings.revealVoteChoices },
    {
      label: t.lobby.secondTieExecutesRandomly,
      desc: t.lobby.secondTieExecutesRandomlyDesc,
      on: settings.secondTieExecutesRandomly,
    },
    { label: t.lobby.allowBodyguardSelfGuard, on: settings.allowBodyguardSelfGuard },
    { label: t.lobby.dictatorCanTargetSelf, on: settings.dictatorCanTargetSelf },
  ];

  const renderRow = (row: { label: string; desc?: string; on: boolean }, badge?: React.ReactNode, i?: number) => (
    <div key={i} className="rounded-lg border border-border/60 bg-card/60 px-3 py-2.5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">{row.label}</p>
        <div className="flex shrink-0 items-center gap-1.5">
          {badge}
          <span
            className={cn(
              "flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold",
              row.on
                ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30"
                : "bg-muted text-muted-foreground ring-1 ring-border/60"
            )}
          >
            {row.on ? <Check className="size-3" /> : <X className="size-3" />}
            {row.on ? t.common.on : t.common.off}
          </span>
        </div>
      </div>
      {row.desc && <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{row.desc}</p>}
    </div>
  );

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-1.5 px-1 text-[11px] font-bold text-muted-foreground">{t.lobby.officialRulesSectionTitle}</p>
        <div className="space-y-1.5">
          {officialRows.map((row, i) => {
            const official = OFFICIAL_SETTINGS[row.key];
            const badge = row.optional ? (
              <Badge
                variant="outline"
                className="shrink-0 gap-1 border-violet-500/40 bg-violet-500/10 px-1.5 py-0 text-[9px] font-bold text-violet-300"
              >
                {t.common.optionalRuleBadge}
              </Badge>
            ) : official !== undefined && official === row.on ? (
              <Badge
                variant="outline"
                className="shrink-0 gap-1 border-emerald-500/40 bg-emerald-500/10 px-1.5 py-0 text-[9px] font-bold text-emerald-300"
              >
                <Check className="size-2.5" /> {t.common.officialRuleBadge}
              </Badge>
            ) : null;
            return renderRow(row, badge, i);
          })}
        </div>
      </div>
      <div>
        <p className="mb-1.5 px-1 text-[11px] font-bold text-muted-foreground">{t.lobby.extraRulesSectionTitle}</p>
        <div className="space-y-1.5">{extraRows.map((row, i) => renderRow(row, undefined, i))}</div>
      </div>
    </div>
  );
}
