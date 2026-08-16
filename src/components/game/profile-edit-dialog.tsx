"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGame } from "@/hooks/use-game";
import { useLocale } from "@/lib/i18n/locale-context";
import { AvatarPicker } from "@/components/game/avatar-picker";

// ユーザーが任意でいつでも(ロビー中でもゲーム中でも)表示名とプロフィール写真を
// 変更できるようにするための編集ダイアログ。フローティングメニューからいつでも開ける。
// trigger を渡さず open/onOpenChange で外部から制御することもできる(フローティングメニュー用)。
export function ProfileEditDialog({
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { t } = useLocale();
  const { publicState, session, updateProfile } = useGame();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const me = publicState?.players.find((p) => p.id === session?.playerId);
  const [name, setName] = useState(me?.name ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(me?.avatarUrl ?? null);

  const setOpen = (next: boolean) => {
    if (isControlled) {
      setControlledOpen?.(next);
    } else {
      setUncontrolledOpen(next);
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (next) {
      // 開くたびに、その時点の最新プロフィールで編集フォームをリセットする
      setName(me?.name ?? "");
      setAvatarUrl(me?.avatarUrl ?? null);
    }
    setOpen(next);
  };

  const handleSave = () => {
    const trimmed = name.trim();
    updateProfile({ name: trimmed.length > 0 ? trimmed : undefined, avatarUrl });
    toast.success(t.profile.savedToast);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">{t.profile.title}</DialogTitle>
          <DialogDescription>{t.profile.desc}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <div className="space-y-1.5">
            <Label>{t.profile.avatarLabel}</Label>
            <AvatarPicker value={avatarUrl} onChange={setAvatarUrl} name={name} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="profile-name">{t.profile.nameLabel}</Label>
            <Input
              id="profile-name"
              value={name}
              maxLength={16}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t.profile.closeButton}
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            {t.profile.saveButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
