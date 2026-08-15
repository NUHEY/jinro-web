"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Moon, Wifi, WifiOff, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/hooks/use-game";
import { useLocale } from "@/lib/i18n/locale-context";
import { HelpDialog } from "@/components/game/help-dialog";
import { EntryScreen } from "@/components/game/entry-screen";
import { LobbyScreen } from "@/components/game/lobby-screen";
import { RoleRevealScreen } from "@/components/game/role-reveal-screen";
import { NightScreen } from "@/components/game/night-screen";
import { HunterRevengeScreen } from "@/components/game/hunter-revenge-screen";
import { DayResultScreen } from "@/components/game/day-result-screen";
import { DiscussionScreen } from "@/components/game/discussion-screen";
import { VoteScreen } from "@/components/game/vote-screen";
import { LastWordsScreen } from "@/components/game/last-words-screen";
import { AppealVoteScreen } from "@/components/game/appeal-vote-screen";
import { ExecutionResultScreen } from "@/components/game/execution-result-screen";
import { GameOverScreen } from "@/components/game/game-over-screen";
import { LanguageSwitcher } from "@/components/game/language-switcher";

function LoadingScreen() {
  const { t } = useLocale();
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
      <Loader2 className="size-8 animate-spin" />
      <p className="text-sm">{t.common.connecting}</p>
    </div>
  );
}

function TopBar() {
  const { status, connected, publicState } = useGame();
  const { t } = useLocale();
  if (status !== "in_room" || !publicState) return null;
  return (
    <div className="flex items-center justify-between border-b border-border/60 bg-background/70 px-4 py-2 backdrop-blur safe-top">
      <div className="flex items-center gap-1.5 font-heading text-base font-bold">
        <Moon className="size-4 text-primary" />
        {t.meta.title}
        <span className="ml-1 font-mono text-xs text-muted-foreground">#{publicState.code}</span>
      </div>
      <div className="flex items-center gap-2">
        {connected ? (
          <Wifi className="size-4 text-emerald-400" />
        ) : (
          <span className="flex items-center gap-1 text-xs text-destructive">
            <WifiOff className="size-4" /> {t.common.reconnecting}
          </span>
        )}
        <HelpDialog
          trigger={
            <Button variant="ghost" size="icon" className="size-8" aria-label={t.help.button}>
              <BookOpen className="size-4" />
            </Button>
          }
        />
        <LanguageSwitcher />
      </div>
    </div>
  );
}

export function AppShell() {
  const { status, publicState, error, clearError } = useGame();

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  return (
    <div className="flex min-h-dvh flex-1 flex-col">
      <TopBar />
      <ScreenRouter status={status} publicState={publicState} />
    </div>
  );
}

function ScreenRouter({
  status,
  publicState,
}: {
  status: ReturnType<typeof useGame>["status"];
  publicState: ReturnType<typeof useGame>["publicState"];
}) {
  if (status === "connecting") return <LoadingScreen />;
  if (status === "entry" || !publicState) return <EntryScreen />;

  if (publicState.awaitingHunterRevenge) return <HunterRevengeScreen />;

  switch (publicState.phase) {
    case "lobby":
      return <LobbyScreen />;
    case "role_reveal":
      return <RoleRevealScreen />;
    case "night":
      return <NightScreen />;
    case "day_result":
      return <DayResultScreen />;
    case "discussion":
      return <DiscussionScreen />;
    case "vote":
      return <VoteScreen />;
    case "last_words":
      return <LastWordsScreen />;
    case "appeal_vote":
      return <AppealVoteScreen />;
    case "execution_result":
      return <ExecutionResultScreen />;
    case "game_over":
      return <GameOverScreen />;
    default:
      return <LoadingScreen />;
  }
}
