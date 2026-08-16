"use client";

import { ChevronDown, Moon, Repeat, Sparkles, Sun, UserCheck } from "lucide-react";
import type { RoomSettings } from "@/lib/game/types";
import { useLocale } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";

// 「夜0日、昼1日など数え方がわかりにくい」という声を受けて追加した図解。
// このアプリの日数の数え方は「夜N」とその直後の「朝→議論→投票」がセットで
// 同じ「N日目」になる、という一本のルールだけなので、それを縦のタイムラインで
// 視覚的に示す。あわせて、数え方に関わる設定(最初の夜の襲撃・最初の投票の追放・
// 役職確認時の占い)は、実際にこの部屋で有効かどうかをその場でバッジ表示することで、
// 「ルール設定による変更が一目でわかるように」という要望にも応える。
export function DayNightDiagram({ settings }: { settings?: RoomSettings }) {
  const { t } = useLocale();
  const steps = t.help.flowSteps; // [役職確認, 最初の話し合い, 夜, 朝, 議論, 投票, くり返し]

  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 p-3">
      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-primary">
        <Sparkles className="size-3.5" /> {t.help.diagramTitle}
      </p>
      <p className="mb-3 text-xs leading-relaxed text-muted-foreground">{t.help.diagramIntro}</p>

      <div className="flex flex-col items-stretch">
        <DiagramNode icon={<UserCheck className="size-4" />} label={steps[0].title} tone="neutral">
          {settings && (
            <SettingChip label={t.lobby.seerFirstNightDivine} on={settings.seerFirstNightDivine} />
          )}
        </DiagramNode>
        <Connector label={steps[1].title} dashed />

        <DiagramNode icon={<Moon className="size-4" />} label={t.night.tag(1)} tone="night">
          {settings && <SettingChip label={t.lobby.allowFirstNightKill} on={settings.allowFirstNightKill} />}
        </DiagramNode>
        <Connector />

        <DiagramNode icon={<Sun className="size-4" />} label={t.help.diagramDayLabel(1)} tone="day">
          <span className="text-[10px] text-muted-foreground">
            {steps[3].title} → {steps[4].title} → {steps[5].title}
          </span>
          {settings && <SettingChip label={t.lobby.allowFirstVoteExecution} on={settings.allowFirstVoteExecution} />}
        </DiagramNode>
        <Connector />

        <DiagramNode icon={<Moon className="size-4" />} label={t.night.tag(2)} tone="night" />
        <Connector />

        <DiagramNode icon={<Sun className="size-4" />} label={t.help.diagramDayLabel(2)} tone="day">
          <span className="text-[10px] text-muted-foreground">
            {steps[3].title} → {steps[4].title} → {steps[5].title}
          </span>
        </DiagramNode>
        <Connector label={steps[6].title} icon={<Repeat className="size-3 shrink-0" />} />

        <DiagramNode icon={<Sparkles className="size-4" />} label={t.help.diagramOutcomeLabel} tone="neutral" last />
      </div>

      <p className="mt-3 rounded-lg border border-border/60 bg-card/60 px-2.5 py-2 text-[11px] leading-relaxed text-muted-foreground">
        {t.help.diagramSameDayNote}
      </p>

      {settings ? (
        <div className="mt-2 space-y-1.5">
          <p className="px-0.5 text-[11px] font-bold text-muted-foreground">{t.help.diagramSettingsHeading}</p>
          <div className="flex flex-wrap gap-1.5">
            <SettingChip label={t.lobby.allowWolfFriendlyFire} on={settings.allowWolfFriendlyFire} />
            <SettingChip label={t.lobby.revealOnDeath} on={settings.revealRoleOnDeath} />
          </div>
        </div>
      ) : (
        <p className="mt-2 px-0.5 text-[11px] leading-relaxed text-muted-foreground">{t.help.diagramNoRoomNote}</p>
      )}
    </div>
  );
}

function DiagramNode({
  icon,
  label,
  tone,
  last,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  tone: "neutral" | "night" | "day";
  last?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-lg border px-3 py-2",
        tone === "night" && "border-indigo-500/30 bg-indigo-500/10",
        tone === "day" && "border-amber-500/30 bg-amber-500/10",
        tone === "neutral" && "border-border/60 bg-card/60",
        last && "border-emerald-500/40 bg-emerald-500/10"
      )}
    >
      <div
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full",
          tone === "night" && "bg-indigo-500/20 text-indigo-300",
          tone === "day" && "bg-amber-500/20 text-amber-300",
          tone === "neutral" && "bg-muted text-muted-foreground",
          last && "bg-emerald-500/20 text-emerald-300"
        )}
      >
        {icon}
      </div>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
        <span className="text-sm font-semibold">{label}</span>
        {children}
      </div>
    </div>
  );
}

function Connector({
  label,
  dashed,
  icon,
}: {
  label?: string;
  dashed?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 py-0.5 pl-[15px]">
      <div className={cn("h-3 w-px", dashed ? "border-l border-dashed border-border" : "bg-border")} />
      <ChevronDown className="size-3 shrink-0 text-muted-foreground/70" />
      {label && (
        <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
          {icon}
          {label}
        </span>
      )}
    </div>
  );
}

function SettingChip({ label, on }: { label: string; on: boolean }) {
  const { t } = useLocale();
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold",
        on
          ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30"
          : "bg-muted text-muted-foreground ring-1 ring-border/60"
      )}
    >
      {label}: {on ? t.common.on : t.common.off}
    </span>
  );
}
