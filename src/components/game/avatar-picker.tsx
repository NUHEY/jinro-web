"use client";

import { useRef, useState } from "react";
import { Camera, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/locale-context";
import { AvatarTooLargeError, AvatarUnsupportedError, fileToAvatarDataUrl } from "@/lib/avatar";
import { cn } from "@/lib/utils";

/**
 * 名前入力欄と組み合わせて使う、任意のプロフィール写真アップロード用コントロール。
 * ファイル選択 → 自動リサイズ・圧縮 → 円形プレビュー、までを一体で扱う。
 */
export function AvatarPicker({
  value,
  onChange,
  name,
  size = "lg",
}: {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  name: string;
  size?: "md" | "lg";
}) {
  const { t } = useLocale();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sizeClass = size === "lg" ? "size-20 text-2xl" : "size-14 text-lg";
  const initial = name.trim().slice(0, 1) || "?";

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const dataUrl = await fileToAvatarDataUrl(file);
      onChange(dataUrl);
    } catch (err) {
      if (err instanceof AvatarTooLargeError) setError(t.entry.avatarTooLarge);
      else if (err instanceof AvatarUnsupportedError) setError(t.entry.avatarUnsupported);
      else setError(t.entry.avatarUnsupported);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        aria-label={value ? t.entry.avatarChangeButton : t.entry.avatarAddButton}
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary font-bold text-secondary-foreground transition active:scale-95",
          sizeClass
        )}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="size-full object-cover" />
        ) : (
          <span>{initial}</span>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition hover:bg-black/30 hover:opacity-100">
          {busy ? <Loader2 className="size-5 animate-spin text-white" /> : <Camera className="size-5 text-white" />}
        </span>
      </button>
      <div className="flex flex-col items-start gap-1">
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={busy}>
          <Camera className="size-3.5" />
          {value ? t.entry.avatarChangeButton : t.entry.avatarAddButton}
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 px-1.5 text-xs text-muted-foreground"
            onClick={() => onChange(null)}
          >
            <X className="size-3" /> {t.entry.avatarRemoveButton}
          </Button>
        )}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
