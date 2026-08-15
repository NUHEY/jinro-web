"use client";

import { cn } from "@/lib/utils";
import { PlayerAvatar } from "@/components/game/shared";
import type { PublicPlayer } from "@/lib/game/types";
import { Ban } from "lucide-react";

export function PlayerPicker({
  candidates,
  selectedId,
  onSelect,
  disabled,
  allowSkip,
  skipLabel,
}: {
  candidates: PublicPlayer[];
  selectedId: string | null | undefined;
  onSelect: (id: string | null) => void;
  disabled?: boolean;
  allowSkip?: boolean;
  skipLabel?: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {candidates.map((p) => {
        const active = selectedId === p.id;
        return (
          <button
            key={p.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(p.id)}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-all duration-150 active:scale-[0.97] disabled:opacity-50",
              active
                ? "scale-[1.02] border-primary bg-primary/15 ring-1 ring-primary shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_15%,transparent)]"
                : "border-border/60 bg-card/60 hover:bg-card"
            )}
          >
            <PlayerAvatar player={p} size="sm" />
            <span className="truncate text-sm font-medium">{p.name}</span>
          </button>
        );
      })}
      {allowSkip && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelect(null)}
          className={cn(
            "col-span-2 flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition active:scale-[0.97] disabled:opacity-50",
            selectedId === null && selectedId !== undefined
              ? "border-primary bg-primary/15 ring-1 ring-primary"
              : "border-border/60 bg-card/40 text-muted-foreground hover:bg-card"
          )}
        >
          <Ban className="size-3.5" />
          {skipLabel}
        </button>
      )}
    </div>
  );
}
