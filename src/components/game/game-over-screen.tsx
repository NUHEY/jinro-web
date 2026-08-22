"use client";

import { PartyPopper, OctagonX, RefreshCcw, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGame } from "@/hooks/use-game";
import { useLocale } from "@/lib/i18n/locale-context";
import { ROLES } from "@/lib/game/roles";
import { styleOf } from "@/lib/game/role-style";
import { RoleAvatar } from "@/components/game/role-avatar";
import { cn } from "@/lib/utils";
import { ConfirmButton } from "@/components/game/shared";

const PRIMARY_COLOR: Record<"village" | "werewolf" | "draw", string> = {
  village: "text-sky-300",
  werewolf: "text-red-400",
  draw: "text-muted-foreground",
};

export function GameOverScreen() {
  const { publicState, session, newGame, leaveRoom } = useGame();
  const { t } = useLocale();
  if (!publicState || !session || !publicState.winner) return null;

  const me = publicState.players.find((p) => p.id === session.playerId);
  const isHost = !!me?.isHost;
  const winner = publicState.winner;

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-4 py-8 safe-bottom">
      <div className="flex animate-pop-in flex-col items-center gap-2 text-center">
        {winner.hostEnded ? (
          <>
            <OctagonX className="size-10 text-muted-foreground" />
            <h2 className="font-heading text-2xl font-bold text-muted-foreground">{t.gameOver.hostEndedTitle}</h2>
            <p className="text-sm text-muted-foreground">{t.gameOver.hostEndedDesc}</p>
          </>
        ) : (
          <>
            <PartyPopper className="size-10 text-primary" />
            <h2 className={cn("font-heading text-3xl font-bold", PRIMARY_COLOR[winner.primary])}>
              {t.gameOver.primary[winner.primary]}
            </h2>
            {winner.extra.map((e) => (
              <p key={e.team} className="text-sm font-semibold text-amber-300">
                {t.gameOver.extra[e.team]}
              </p>
            ))}
          </>
        )}
      </div>

      <Card>
        <CardContent className="space-y-1.5 py-4">
          <p className="mb-2 px-1 text-xs font-bold text-muted-foreground">{t.gameOver.allRoles}</p>
          {winner.allRoles.map((r) => {
            const style = styleOf(ROLES[r.role].color);
            const player = publicState.players.find((p) => p.id === r.playerId);
            return (
              <div key={r.playerId} className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/60 px-3 py-2">
                <RoleAvatar role={r.role} size={32} />
                <span className={cn("flex-1 truncate text-sm font-medium", !player?.alive && "text-muted-foreground")}>
                  {r.name}
                </span>
                <Badge variant="outline" className={style.text}>
                  {t.roles[r.role].name}
                </Badge>
                {!player?.alive && <Badge variant="secondary">{t.gameOver.eliminated}</Badge>}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2 pb-4">
        {isHost ? (
          <ConfirmButton
            title={t.confirm.newGameTitle}
            description={t.confirm.newGameDesc}
            confirmLabel={t.confirm.newGameAction}
            onConfirm={newGame}
            className="w-full font-bold"
          >
            <RefreshCcw className="size-4" /> {t.gameOver.newGameButton}
          </ConfirmButton>
        ) : (
          <p className="text-center text-sm text-muted-foreground">{t.gameOver.waitingHost}</p>
        )}
        <Button variant="ghost" className="text-muted-foreground" onClick={leaveRoom}>
          <LogOut className="size-4" /> {t.gameOver.leaveButton}
        </Button>
      </div>
    </div>
  );
}
