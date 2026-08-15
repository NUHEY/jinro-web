"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGame } from "@/hooks/use-game";
import { useLocale } from "@/lib/i18n/locale-context";
import { ROLES } from "@/lib/game/roles";
import { ICONS, styleOf } from "@/lib/game/role-style";
import { Eye, Moon } from "lucide-react";

export function RoleRevealScreen() {
  const { publicState, privateState, session, ackRole, advance } = useGame();
  const { t } = useLocale();
  const [revealed, setRevealed] = useState(false);
  if (!publicState || !privateState || !session) return null;

  const me = publicState.players.find((p) => p.id === session.playerId);
  const isHost = !!me?.isHost;
  const role = privateState.self.role;
  const def = role ? ROLES[role] : null;
  const text = role ? t.roles[role] : null;
  const style = def ? styleOf(def.color) : null;
  const Icon = def ? (ICONS[def.icon] ?? Eye) : Eye;

  const handleReveal = () => {
    setRevealed(true);
    ackRole();
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6 px-4 py-8 safe-top safe-bottom">
      <p className="text-sm text-muted-foreground">{t.roleReveal.label}</p>

      {!revealed ? (
        <button
          onClick={handleReveal}
          className="flex aspect-[3/4] w-full max-w-[280px] flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-primary/40 bg-card/60 text-center transition active:scale-[0.98]"
        >
          <Moon className="size-10 text-primary" />
          <p className="text-lg font-bold">{t.roleReveal.tapToReveal}</p>
          <p className="px-6 text-xs text-muted-foreground">{t.roleReveal.privacyHint}</p>
        </button>
      ) : def && style && text ? (
        <Card className={`w-full max-w-[320px] overflow-hidden border-2 bg-gradient-to-b ${style.panel}`}>
          <CardContent className="flex flex-col items-center gap-3 px-6 py-8 text-center">
            <div className={`flex size-16 items-center justify-center rounded-2xl border ${style.chip}`}>
              <Icon className="size-8" />
            </div>
            <div>
              <p className="font-heading text-3xl font-bold">{text.name}</p>
              <Badge variant="outline" className={`mt-1 ${style.text}`}>
                {t.team[def.team]}
              </Badge>
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">{text.detail}</p>

            {privateState.knownAllies && privateState.knownAllies.length > 0 && (
              <div className="mt-2 w-full rounded-xl border border-border/60 bg-background/40 p-3">
                <p className="mb-1 text-xs font-semibold text-muted-foreground">{t.roleReveal.allies}</p>
                <p className="text-sm font-medium">
                  {privateState.knownAllies.map((a) => a.name).join("、")}
                </p>
              </div>
            )}

            {privateState.allRolesKnown && (
              <div className="mt-2 w-full space-y-1 rounded-xl border border-border/60 bg-background/40 p-3 text-left">
                <p className="mb-1 text-xs font-semibold text-muted-foreground">{t.roleReveal.allRoles}</p>
                {privateState.allRolesKnown.map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-xs">
                    <span>{p.name}</span>
                    <span className="text-muted-foreground">{t.roles[p.role].name}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}

      {revealed && (
        <p className="text-center text-xs text-muted-foreground">{t.roleReveal.waitingOthers}</p>
      )}

      {revealed && isHost && (
        <Button variant="outline" className="w-full max-w-[320px] font-bold" onClick={() => advance("night")}>
          {t.roleReveal.skipButton}
        </Button>
      )}
    </div>
  );
}
