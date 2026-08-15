"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGame } from "@/hooks/use-game";
import { useLocale } from "@/lib/i18n/locale-context";
import { Moon, CheckCircle2 } from "lucide-react";
import { PlayerPicker } from "@/components/game/player-picker";
import { RoleInfoCard } from "@/components/game/role-info-card";

export function RoleRevealScreen() {
  const { publicState, privateState, session, ackRole, earlyDivine } = useGame();
  const { t } = useLocale();
  const [revealed, setRevealed] = useState(false);
  const [divineTarget, setDivineTarget] = useState<string | null | undefined>(undefined);
  if (!publicState || !privateState || !session) return null;

  const role = privateState.self.role;
  const acked = !!privateState.roleAcked;

  const canEarlyDivine = role === "seer" && publicState.settings.seerFirstNightDivine;
  const alreadyDivined = !!privateState.seerResult && privateState.seerResult.day === 0;

  const handleReveal = () => setRevealed(true);
  const handleConfirm = () => ackRole();
  const handleDivine = () => {
    if (divineTarget) earlyDivine(divineTarget);
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
      ) : role ? (
        <div className="w-full max-w-[320px]">
          <RoleInfoCard
            role={role}
            knownAllies={privateState.knownAllies}
            allRolesKnown={privateState.allRolesKnown}
          />
        </div>
      ) : null}

      {revealed && canEarlyDivine && (
        <Card className="w-full max-w-[320px] border-violet-500/30 bg-violet-500/10">
          <CardContent className="space-y-3 py-5">
            {alreadyDivined && privateState.seerResult ? (
              <>
                <p className="text-sm font-semibold text-violet-300">{t.roleReveal.earlyDivineDone}</p>
                <p
                  className={
                    "text-sm font-bold " +
                    (privateState.seerResult.isBlack ? "text-red-400" : "text-sky-300")
                  }
                >
                  {t.night.seerResultLine(privateState.seerResult.targetName, privateState.seerResult.isBlack)}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-violet-300">{t.roleReveal.earlyDivineTitle}</p>
                <p className="text-xs text-muted-foreground">{t.roleReveal.earlyDivineDesc}</p>
                <PlayerPicker
                  candidates={publicState.players.filter((p) => p.id !== session.playerId)}
                  selectedId={divineTarget}
                  onSelect={setDivineTarget}
                />
                <Button
                  variant="outline"
                  className="w-full font-bold"
                  disabled={!divineTarget}
                  onClick={handleDivine}
                >
                  {t.roleReveal.earlyDivineButton}
                </Button>
                <p className="text-center text-[11px] text-muted-foreground">{t.roleReveal.earlyDivineSkipNote}</p>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {revealed && !acked && (
        <Button className="w-full max-w-[320px] font-bold" size="lg" onClick={handleConfirm}>
          <CheckCircle2 className="size-4" /> {t.roleReveal.confirmButton}
        </Button>
      )}

      {revealed && acked && (
        <p className="text-center text-xs text-muted-foreground">{t.roleReveal.waitingOthers}</p>
      )}

      {publicState.progress && (
        <p className="text-center text-xs font-medium text-muted-foreground">
          {t.roleReveal.progress(publicState.progress.submitted, publicState.progress.total)}
        </p>
      )}
    </div>
  );
}
