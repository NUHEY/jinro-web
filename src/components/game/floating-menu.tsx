"use client";

import { useState } from "react";
import { ChevronRight, User, XCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useGame } from "@/hooks/use-game";
import { useLocale } from "@/lib/i18n/locale-context";
import { ProfileEditDialog } from "@/components/game/profile-edit-dialog";
import { PlayerAvatar } from "@/components/game/shared";
import { ThemeToggle } from "@/components/game/theme-toggle";
import { LanguageSwitcher } from "@/components/game/language-switcher";
import { cn } from "@/lib/utils";

// ゲーム中に頻繁に使う「自分の役職」「遊び方」は TopBar(app-shell.tsx)に常時見える
// 独立ボタンとして移設したため、ここに残るのは低頻度な操作(プロフィール編集・テーマ・
// 言語)だけ。TopBar の右端に並ぶ、自分のアバターを表示する丸ボタンがトリガーで、
// タップすると開くポップオーバーの中にそれらをまとめている。
//
// 「プロフィール編集」は独立したダイアログを開く必要があるため、行をクリックした瞬間に
// このポップオーバーを閉じつつ、ダイアログを open/onOpenChange で外部制御して開く
// (ポップオーバーの中に DialogTrigger を直接ネストすると、閉じるタイミングとダイアログの
// 開閉が競合しうるため)。
export function FloatingMenu() {
  const { t } = useLocale();
  const { publicState, session, endGame } = useGame();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [confirmEndOpen, setConfirmEndOpen] = useState(false);

  const me = publicState?.players.find((p) => p.id === session?.playerId) ?? null;
  // ホストは、ロビー(まだ始まっていない)・結果画面(もう終わっている)以外の
  // ゲーム進行中ならいつでもここから途中終了できる。誤操作を防ぐため、実行前に
  // 必ずポップアップ(AlertDialog)で確認する。
  const canEndGame =
    !!me?.isHost && !!publicState && publicState.phase !== "lobby" && publicState.phase !== "game_over";

  const openProfile = () => {
    setMenuOpen(false);
    setProfileOpen(true);
  };

  const openEndGameConfirm = () => {
    setMenuOpen(false);
    setConfirmEndOpen(true);
  };

  return (
    <>
      <Popover open={menuOpen} onOpenChange={setMenuOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={t.common.menu}
            title={t.common.menu}
            className={cn(
              "flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border transition active:scale-95",
              menuOpen ? "border-primary/50 bg-primary/15" : "border-border/60 bg-card/80"
            )}
          >
            {me ? <PlayerAvatar player={me} size="sm" /> : <User className="size-4" />}
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" sideOffset={10} className="w-60">
          <div className="flex flex-col">
            {me && (
              <MenuRow
                icon={<User className="size-4 text-muted-foreground" />}
                label={t.profile.editButton}
                onClick={openProfile}
              />
            )}

            {me && <Separator className="my-1.5" />}

            <div className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5">
              <span className="text-sm font-medium">{t.common.themeLabel}</span>
              <ThemeToggle />
            </div>
            <div className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5">
              <span className="text-sm font-medium">{t.common.languageLabel}</span>
              <LanguageSwitcher />
            </div>

            {canEndGame && (
              <>
                <Separator className="my-1.5" />
                <MenuRow
                  icon={<XCircle className="size-4" />}
                  label={t.common.endGameButton}
                  onClick={openEndGameConfirm}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  hideChevron
                />
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {me && <ProfileEditDialog trigger={null} open={profileOpen} onOpenChange={setProfileOpen} />}

      {/* Popover の中に直接 AlertDialogTrigger をネストすると、ポップオーバーが閉じる
          タイミングとダイアログの開閉が競合しうるため、他のダイアログと同様に
          open/onOpenChange で外部制御し、独立したコンポーネントとして描画する。 */}
      {canEndGame && (
        <AlertDialog open={confirmEndOpen} onOpenChange={setConfirmEndOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t.confirm.endGameTitle}</AlertDialogTitle>
              <AlertDialogDescription>{t.confirm.endGameDesc}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={endGame}>
                {t.confirm.endGameAction}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}

function MenuRow({
  icon,
  label,
  onClick,
  className,
  hideChevron,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
  hideChevron?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm font-medium transition hover:bg-accent hover:text-accent-foreground",
        className
      )}
    >
      <span className="flex size-6 shrink-0 items-center justify-center">{icon}</span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {!hideChevron && <ChevronRight className="size-4 shrink-0 text-muted-foreground/60" />}
    </button>
  );
}
