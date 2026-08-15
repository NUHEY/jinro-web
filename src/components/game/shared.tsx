"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { PublicPlayer } from "@/lib/game/types";
import { Wifi, WifiOff, Skull } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";

export function PlayerAvatar({
  player,
  size = "md",
  highlighted = false,
}: {
  player: PublicPlayer;
  size?: "sm" | "md" | "lg";
  highlighted?: boolean;
}) {
  const sizeClass = size === "sm" ? "size-8 text-xs" : size === "lg" ? "size-14 text-lg" : "size-10 text-sm";
  const initial = player.name.trim().slice(0, 1) || "?";
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full border font-bold select-none",
        sizeClass,
        player.alive
          ? "bg-secondary text-secondary-foreground border-border"
          : "bg-muted/40 text-muted-foreground border-border/50 grayscale",
        highlighted && "ring-2 ring-primary"
      )}
    >
      {initial}
      {!player.alive && (
        <Skull className="absolute -bottom-1 -right-1 size-4 rounded-full bg-background p-0.5 text-muted-foreground" />
      )}
      {!player.connected && player.alive && (
        <WifiOff className="absolute -bottom-1 -right-1 size-4 rounded-full bg-background p-0.5 text-destructive" />
      )}
    </div>
  );
}

export function PlayerRow({
  player,
  right,
}: {
  player: PublicPlayer;
  right?: React.ReactNode;
}) {
  const { t } = useLocale();
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/60 px-3 py-2">
      <PlayerAvatar player={player} size="sm" />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className={cn("truncate text-sm font-medium", !player.alive && "text-muted-foreground line-through")}>
          {player.name}
        </span>
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
          {player.isHost && <Badge variant="outline" className="h-4 px-1 text-[10px]">{t.common.host}</Badge>}
          {player.connected ? (
            <span className="inline-flex items-center gap-0.5">
              <Wifi className="size-3" /> {t.common.connected}
            </span>
          ) : (
            <span className="inline-flex items-center gap-0.5 text-destructive">
              <WifiOff className="size-3" /> {t.common.disconnected}
            </span>
          )}
        </span>
      </div>
      {right}
    </div>
  );
}

export function PhaseTag({ children }: { children: React.ReactNode }) {
  return (
    <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-semibold tracking-wide">
      {children}
    </Badge>
  );
}
