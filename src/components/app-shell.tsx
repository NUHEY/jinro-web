"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, Moon, Wifi, WifiOff, BookOpen, IdCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGame, GameContext } from "@/hooks/use-game";
import { useLocale } from "@/lib/i18n/locale-context";
import type { PrivateViewState, PublicGameState } from "@/lib/game/types";
import { ROLES } from "@/lib/game/roles";
import { styleOf } from "@/lib/game/role-style";
import { cn } from "@/lib/utils";
import { HelpDialog } from "@/components/game/help-dialog";
import { MyRoleDialog } from "@/components/game/my-role-dialog";
import { ProfileEditDialog } from "@/components/game/profile-edit-dialog";
import { PlayerAvatar } from "@/components/game/shared";
import { ThemeToggle } from "@/components/game/theme-toggle";
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
  const { status, showReconnecting, publicState, privateState, session } = useGame();
  const { t } = useLocale();
  if (status !== "in_room" || !publicState) return null;
  const myRole = privateState?.self?.role ?? null;
  const roleStyle = myRole ? styleOf(ROLES[myRole].color) : null;
  const me = publicState.players.find((p) => p.id === session?.playerId);
  return (
    <div className="flex items-center justify-between gap-2 border-b border-border/60 bg-background/70 px-4 py-2 backdrop-blur safe-top">
      <div className="flex min-w-0 items-center gap-1.5 font-heading text-base font-bold">
        <Moon className="size-4 shrink-0 text-primary" />
        <span className="truncate">{t.meta.title}</span>
        <span className="ml-1 shrink-0 font-mono text-xs text-muted-foreground">#{publicState.code}</span>
      </div>
      <div className="flex items-center gap-2">
        {showReconnecting ? (
          <span className="flex items-center gap-1 text-xs text-destructive">
            <WifiOff className="size-4 animate-pulse" /> {t.common.reconnecting}
          </span>
        ) : (
          <Wifi className="size-4 text-emerald-400" />
        )}
        {me && (
          <ProfileEditDialog
            trigger={
              <button type="button" aria-label={t.profile.editButton} className="rounded-full transition active:scale-95">
                <PlayerAvatar player={me} size="sm" />
              </button>
            }
          />
        )}
        {myRole && roleStyle && (
          <MyRoleDialog
            trigger={
              <Button
                variant="outline"
                size="icon"
                className={cn("relative size-8 border", roleStyle.chip)}
                aria-label={t.myRole.button}
              >
                <span className={cn("absolute inset-0 rounded-md ring-1", roleStyle.ring)} />
                <IdCard className="size-4" />
              </Button>
            }
          />
        )}
        <HelpDialog
          trigger={
            <Button variant="ghost" size="icon" className="size-8" aria-label={t.help.button}>
              <BookOpen className="size-4" />
            </Button>
          }
        />
        <ThemeToggle />
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

/** 現在表示すべき「画面」を一意に表す文字列キー。フェーズ切り替えの検知に使う。 */
function computeScreenKey(publicState: PublicGameState | null): string {
  if (!publicState) return "none";
  if (publicState.awaitingHunterRevenge) return "hunter_revenge";
  return publicState.phase;
}

function renderScreenForKey(key: string) {
  switch (key) {
    case "hunter_revenge":
      return <HunterRevengeScreen />;
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

/**
 * フェーズ移行の際に画面が「即座に」切り替わってしまうのを防ぐための緩衝オーバーレイ。
 * 夜のアクションで最後の1人が確定した瞬間などに、間を置かずに次の画面へ切り替わると
 * 慌ただしく感じるため、少しの間このオーバーレイを挟んでから次の画面を表示する。
 * ゲームロジック(サーバー側のフェーズ遷移)自体はここでは一切変更しない —
 * あくまで「もう決まった次のフェーズを、画面にどのタイミングで反映するか」という
 * 表示専用の遅延であることに注意。
 */
function PhaseTransitionOverlay() {
  const { t } = useLocale();
  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-sm animate-in fade-in-0 duration-200">
      <div className="relative flex size-16 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/25" />
        <span className="absolute inset-0 rounded-full bg-primary/10" />
        <Moon className="relative size-7 animate-pulse text-primary" />
      </div>
      <p className="text-sm font-medium text-muted-foreground">{t.common.transitioning}</p>
    </div>
  );
}

const TRANSITION_BUFFER_MS = 650;

function ScreenRouter({
  status,
  publicState,
}: {
  status: ReturnType<typeof useGame>["status"];
  publicState: ReturnType<typeof useGame>["publicState"];
}) {
  const gameCtx = useGame();
  const [screenKey, setScreenKey] = useState(() => computeScreenKey(publicState));
  const [frozenView, setFrozenView] = useState<{
    publicState: PublicGameState | null;
    privateState: PrivateViewState | null;
  } | null>(null);

  const lastStableRef = useRef<{ publicState: PublicGameState | null; privateState: PrivateViewState | null }>({
    publicState,
    privateState: gameCtx.privateState,
  });
  const pendingKeyRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // レンダー結果がブラウザに描画される前(useLayoutEffect)に検知することで、
  // 「新しいフェーズのデータ」が古い画面コンポーネントに一瞬でも混ざって見えるのを防ぐ。
  useLayoutEffect(() => {
    if (status !== "in_room") return;
    const nextKey = computeScreenKey(publicState);

    if (nextKey === screenKey) {
      // 画面キーは変わっていない(同じフェーズ内の進捗更新など)。直近の安定データとして保持する。
      lastStableRef.current = { publicState, privateState: gameCtx.privateState };
      return;
    }

    if (frozenView) {
      // 既に緩衝中: タイマーはそのまま、切り替え先のキーだけ最新化する。
      pendingKeyRef.current = nextKey;
      return;
    }

    // フェーズが切り替わった瞬間: 直前の画面のデータを凍結して少しの間表示を維持してから切り替える。
    setFrozenView(lastStableRef.current);
    pendingKeyRef.current = nextKey;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setScreenKey(pendingKeyRef.current ?? nextKey);
      setFrozenView(null);
      pendingKeyRef.current = null;
      timerRef.current = null;
    }, TRANSITION_BUFFER_MS);
  }, [publicState, gameCtx.privateState, status, screenKey, frozenView]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (status === "connecting") return <LoadingScreen />;
  if (status === "entry" || !publicState) return <EntryScreen />;

  if (frozenView) {
    // 緩衝中は直前のフェーズのデータで固定した Context を子要素にかぶせ、
    // 裏側で既に進んでいる新フェーズのデータが古い画面に漏れないようにする。
    const overriddenValue = {
      ...gameCtx,
      publicState: frozenView.publicState,
      privateState: frozenView.privateState,
    };
    return (
      <div className="relative flex flex-1 flex-col">
        <div key={screenKey} className="flex flex-1 flex-col animate-in fade-in-0 duration-300">
          <GameContext.Provider value={overriddenValue}>{renderScreenForKey(screenKey)}</GameContext.Provider>
        </div>
        <PhaseTransitionOverlay />
      </div>
    );
  }

  return (
    <div
      key={screenKey}
      className="flex flex-1 flex-col animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
    >
      {renderScreenForKey(screenKey)}
    </div>
  );
}
