"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROLES, ROLE_ORDER, type RoleId, type Team } from "@/lib/game/roles";
import { ROLE_LIMITS, totalSeats } from "@/lib/game/composition";
import { RoleAvatar } from "@/components/game/role-avatar";
import type { RoleCounts } from "@/lib/game/types";
import { useLocale } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";

export const TEAM_GROUPS: Array<{ team: Team | "solo"; roles: RoleId[] }> = [
  {
    team: "village",
    roles: ROLE_ORDER.filter((r) => ROLES[r].team === "village"),
  },
  {
    team: "werewolf",
    roles: ROLE_ORDER.filter((r) => ROLES[r].team === "werewolf"),
  },
  {
    team: "solo",
    roles: ROLE_ORDER.filter((r) => ["fox", "god", "lover"].includes(ROLES[r].team)),
  },
];

export function RoleCompositionEditor({
  counts,
  onChange,
  playerCount,
  disabled,
}: {
  counts: RoleCounts;
  onChange: (counts: RoleCounts) => void;
  playerCount: number;
  disabled?: boolean;
}) {
  const { t } = useLocale();
  const total = totalSeats(counts);

  const setCount = (role: RoleId, value: number) => {
    const limit = ROLE_LIMITS[role];
    const clamped = Math.max(limit.min, Math.min(limit.max, value));
    onChange({ ...counts, [role]: clamped });
  };

  return (
    <div className="space-y-5">
      <div
        className={cn(
          "flex items-center justify-between rounded-lg border px-3 py-2 text-sm font-semibold",
          total === playerCount
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
            : "border-destructive/40 bg-destructive/10 text-destructive"
        )}
      >
        <span>{t.lobby.seatTotal}</span>
        <span className="font-mono">{t.lobby.seatTotalOf(total, playerCount)}</span>
      </div>

      {TEAM_GROUPS.map((group) => (
        <div key={group.team} className="space-y-2">
          <p className="px-1 text-xs font-bold text-muted-foreground">
            {group.team === "solo" ? t.lobby.soloGroupLabel : t.team[group.team]}
          </p>
          <div className="space-y-1.5">
            {group.roles.map((role) => {
              const text = t.roles[role];
              const limit = ROLE_LIMITS[role];
              const count = counts[role] ?? 0;
              return (
                <div
                  key={role}
                  className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/60 px-3 py-2"
                >
                  <RoleAvatar role={role} size={36} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{text.name}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{text.short}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-7"
                      disabled={disabled || count <= limit.min}
                      onClick={() => setCount(role, count - limit.step)}
                    >
                      <Minus className="size-3.5" />
                    </Button>
                    <span className="w-5 text-center font-mono text-sm tabular-nums">{count}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-7"
                      disabled={disabled || count >= limit.max}
                      onClick={() => setCount(role, count + limit.step)}
                    >
                      <Plus className="size-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
