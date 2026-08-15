"use client";

import { Eye, Sparkles, IdCard, type LucideIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGame } from "@/hooks/use-game";
import { useLocale } from "@/lib/i18n/locale-context";
import { RoleInfoCard } from "@/components/game/role-info-card";
import { ROLES } from "@/lib/game/roles";
import { styleOf } from "@/lib/game/role-style";
import { cn } from "@/lib/utils";

// help-dialog(遊び方・役職一覧などの一般情報)とは別に、「自分の役職」だけを
// わかりやすく独立して確認できるようにした専用ダイアログ。
// 予言者ならこれまで占った全員の履歴、霊媒師ならこれまで判定した全員の履歴、
// 神様なら全員の役職、その他の役職なら仲間の情報を、それぞれ役職に応じて表示する。
export function MyRoleDialog({ trigger }: { trigger?: React.ReactNode }) {
  const { t } = useLocale();
  const { privateState } = useGame();
  const role = privateState?.self?.role ?? null;

  if (!role) return null; // 役職確認前はエントリーポイント自体を出さない

  const def = ROLES[role];
  const style = styleOf(def.color);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm" className={cn("border", style.chip)}>
            <IdCard className="size-3.5" /> {t.myRole.button}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="flex max-h-[85vh] max-w-md flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">{t.myRole.title}</DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
          <RoleInfoCard
            role={role}
            knownAllies={privateState?.knownAllies}
            allRolesKnown={privateState?.allRolesKnown}
          />

          {role === "seer" && (
            <HistorySection
              icon={Eye}
              title={t.myRole.seerHistoryTitle}
              emptyText={t.myRole.seerHistoryEmpty}
              entries={privateState?.seerHistory}
              colorText="text-violet-300"
              borderClass="border-violet-500/30 bg-violet-500/10"
              lineFormatter={t.night.seerResultLine}
            />
          )}

          {role === "medium" && (
            <HistorySection
              icon={Sparkles}
              title={t.myRole.mediumHistoryTitle}
              emptyText={t.myRole.mediumHistoryEmpty}
              entries={privateState?.mediumHistory}
              colorText="text-indigo-300"
              borderClass="border-indigo-500/30 bg-indigo-500/10"
              lineFormatter={t.executionResult.mediumResultLine}
            />
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button className="w-full">{t.myRole.close}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function HistorySection({
  icon: Icon,
  title,
  emptyText,
  entries,
  colorText,
  borderClass,
  lineFormatter,
}: {
  icon: LucideIcon;
  title: string;
  emptyText: string;
  entries?: Array<{ day: number; targetId: string; targetName: string; isBlack: boolean }>;
  colorText: string;
  borderClass: string;
  lineFormatter: (name: string, isBlack: boolean) => string;
}) {
  const { t } = useLocale();
  return (
    <div className={cn("w-full rounded-xl border p-3", borderClass)}>
      <p className={cn("mb-2 flex items-center gap-1.5 text-xs font-semibold", colorText)}>
        <Icon className="size-3.5" /> {title}
      </p>
      {!entries || entries.length === 0 ? (
        <p className="text-xs text-muted-foreground">{emptyText}</p>
      ) : (
        <ul className="space-y-1.5">
          {entries.map((e, i) => (
            <li key={`${e.day}-${e.targetId}-${i}`} className="flex items-center justify-between gap-2 text-xs">
              <span className="shrink-0 text-muted-foreground">{t.myRole.dayLabel(e.day)}</span>
              <span className={cn("text-right font-bold", e.isBlack ? "text-red-400" : "text-sky-300")}>
                {lineFormatter(e.targetName, e.isBlack)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
