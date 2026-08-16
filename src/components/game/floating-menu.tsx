"use client";

import { useState } from "react";
import { BookOpen, ChevronRight, IdCard, Menu, User } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useGame } from "@/hooks/use-game";
import { useLocale } from "@/lib/i18n/locale-context";
import { HelpDialog } from "@/components/game/help-dialog";
import { MyRoleDialog } from "@/components/game/my-role-dialog";
import { ProfileEditDialog } from "@/components/game/profile-edit-dialog";
import { PlayerAvatar } from "@/components/game/shared";
import { ThemeToggle } from "@/components/game/theme-toggle";
import { LanguageSwitcher } from "@/components/game/language-switcher";
import { cn } from "@/lib/utils";

type DialogKey = "profile" | "role" | "help" | null;

// TopBar に要素を詰め込みすぎると窮屈になるため、自分に関する操作(プロフィール・
// 自分の役職・遊び方・テーマ・言語)は、画面右上に浮く独立したフローティングボタン
// 1つにまとめている。ボタン自体は常にニュートラルな見た目で、タップして開いた
// メニューの中でのみ各機能にアクセスできる。
//
// メニュー内の「プロフィール」「自分の役職」「遊び方」はそれぞれ独立したダイアログを
// 開く必要があるため、行をクリックした瞬間にこのポップオーバーを閉じつつ、対応する
// ダイアログを open/onOpenChange で外部制御して開く(ポップオーバーの中に
// DialogTrigger を直接ネストすると、閉じるタイミングとダイアログの開閉が競合しうるため)。
export function FloatingMenu() {
  const { t } = useLocale();
  const { publicState, privateState, session } = useGame();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<DialogKey>(null);

  const me = publicState?.players.find((p) => p.id === session?.playerId) ?? null;
  const hasRole = !!privateState?.self?.role;

  const openDialog = (key: DialogKey) => {
    setMenuOpen(false);
    setActiveDialog(key);
  };

  return (
    <>
      <Popover open={menuOpen} onOpenChange={setMenuOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={t.common.menu}
            className="fixed top-[calc(env(safe-area-inset-top)+3.25rem)] right-3 z-40 flex size-11 items-center justify-center rounded-full border border-border/60 bg-card/95 shadow-lg backdrop-blur transition active:scale-95"
          >
            {me ? <PlayerAvatar player={me} size="sm" /> : <Menu className="size-5" />}
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" sideOffset={10} className="w-60">
          <div className="flex flex-col">
            {me && (
              <MenuRow icon={<User className="size-4" />} label={t.profile.editButton} onClick={() => openDialog("profile")} />
            )}
            {hasRole && (
              <MenuRow icon={<IdCard className="size-4" />} label={t.myRole.button} onClick={() => openDialog("role")} />
            )}
            <MenuRow icon={<BookOpen className="size-4" />} label={t.help.button} onClick={() => openDialog("help")} />

            <Separator className="my-1.5" />

            <div className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5">
              <span className="text-sm font-medium">{t.common.themeLabel}</span>
              <ThemeToggle />
            </div>
            <div className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5">
              <span className="text-sm font-medium">{t.common.languageLabel}</span>
              <LanguageSwitcher />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {me && <ProfileEditDialog trigger={null} open={activeDialog === "profile"} onOpenChange={(v) => setActiveDialog(v ? "profile" : null)} />}
      {hasRole && <MyRoleDialog trigger={null} open={activeDialog === "role"} onOpenChange={(v) => setActiveDialog(v ? "role" : null)} />}
      <HelpDialog trigger={null} open={activeDialog === "help"} onOpenChange={(v) => setActiveDialog(v ? "help" : null)} />
    </>
  );
}

function MenuRow({
  icon,
  label,
  onClick,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
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
      <span className="flex size-6 shrink-0 items-center justify-center text-muted-foreground">{icon}</span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground/60" />
    </button>
  );
}
