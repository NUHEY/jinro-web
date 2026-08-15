"use client";

import { useEffect, useRef, useState } from "react";
import { Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useGame } from "@/hooks/use-game";
import { useLocale } from "@/lib/i18n/locale-context";

// 仲間内だけで見える短いメモ(チャットログではなく1本のメモを都度上書きする方式)。
// 周りの人に「タイピングしている様子」を怪しまれにくいよう、夜フェーズ・議論フェーズなど
// 既にスマホ操作が自然な画面の中に埋め込んで表示する。
export function AllyNote() {
  const { privateState, setAllyNote } = useGame();
  const { t } = useLocale();
  const [text, setText] = useState("");
  const focusedRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const serverText = privateState?.allyNote?.text ?? "";

  useEffect(() => {
    if (focusedRef.current) return;
    setText(serverText);
  }, [serverText]);

  if (!privateState?.allyNote) return null;
  const { groupSize } = privateState.allyNote;
  if (groupSize <= 1) return null; // 自分ひとりだけのグループでは意味がないため非表示

  return (
    <div className="space-y-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 p-3">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-violet-300">
        <Users className="size-3.5" /> {t.allyNote.title}
        <span className="ml-auto font-normal text-violet-300/70">{t.allyNote.groupSize(groupSize)}</span>
      </p>
      <Input
        value={text}
        placeholder={t.allyNote.placeholder}
        maxLength={200}
        onFocus={() => {
          focusedRef.current = true;
        }}
        onBlur={() => {
          focusedRef.current = false;
          if (debounceRef.current) clearTimeout(debounceRef.current);
          setAllyNote(text);
        }}
        onChange={(e) => {
          const v = e.target.value.slice(0, 200);
          setText(v);
          if (debounceRef.current) clearTimeout(debounceRef.current);
          debounceRef.current = setTimeout(() => setAllyNote(v), 250);
        }}
        className="bg-background/60"
      />
      <p className="text-[11px] leading-relaxed text-violet-300/70">{t.allyNote.hint}</p>
    </div>
  );
}
