import {
  User,
  Eye,
  Shield,
  Sparkles,
  Crosshair,
  Users,
  Gavel,
  Moon,
  UserX,
  UserCog,
  Flame,
  Crown,
  Heart,
  type LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  User,
  Eye,
  Shield,
  Sparkles,
  Crosshair,
  Users,
  Gavel,
  Moon,
  UserX,
  UserCog,
  Flame,
  Crown,
  Heart,
};

interface RoleStyle {
  chip: string; // 小さいバッジ用
  panel: string; // 役職確認画面などの大きいパネル用
  ring: string;
  text: string;
}

// Tailwindの静的クラス検出のため、キーごとに完全なクラス文字列を書き出す。
// panel はダークモードでは元通りの「濃いグラデーションパネル」、ライトモードでは
// カード背景をベースにした薄い色味のグラデーションになるよう dark: バリアントで出し分ける
// (ライトモードで固定の暗い背景のままだと、globals.css 側でライトモード用に濃くした
// 文字色との組み合わせで暗い文字が暗い背景に埋もれてしまうため)。
export const ROLE_STYLES: Record<string, RoleStyle> = {
  sky: {
    chip: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    panel:
      "from-sky-100 via-card to-card border-sky-300 dark:from-sky-950 dark:via-sky-900/40 dark:to-slate-950 dark:border-sky-500/40",
    ring: "ring-sky-400/50",
    text: "text-sky-300",
  },
  violet: {
    chip: "bg-violet-500/15 text-violet-300 border-violet-500/30",
    panel:
      "from-violet-100 via-card to-card border-violet-300 dark:from-violet-950 dark:via-violet-900/40 dark:to-slate-950 dark:border-violet-500/40",
    ring: "ring-violet-400/50",
    text: "text-violet-300",
  },
  emerald: {
    chip: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    panel:
      "from-emerald-100 via-card to-card border-emerald-300 dark:from-emerald-950 dark:via-emerald-900/40 dark:to-slate-950 dark:border-emerald-500/40",
    ring: "ring-emerald-400/50",
    text: "text-emerald-300",
  },
  indigo: {
    chip: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    panel:
      "from-indigo-100 via-card to-card border-indigo-300 dark:from-indigo-950 dark:via-indigo-900/40 dark:to-slate-950 dark:border-indigo-500/40",
    ring: "ring-indigo-400/50",
    text: "text-indigo-300",
  },
  amber: {
    chip: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    panel:
      "from-amber-100 via-card to-card border-amber-300 dark:from-amber-950 dark:via-amber-900/40 dark:to-slate-950 dark:border-amber-500/40",
    ring: "ring-amber-400/50",
    text: "text-amber-300",
  },
  teal: {
    chip: "bg-teal-500/15 text-teal-300 border-teal-500/30",
    panel:
      "from-teal-100 via-card to-card border-teal-300 dark:from-teal-950 dark:via-teal-900/40 dark:to-slate-950 dark:border-teal-500/40",
    ring: "ring-teal-400/50",
    text: "text-teal-300",
  },
  rose: {
    chip: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    panel:
      "from-rose-100 via-card to-card border-rose-300 dark:from-rose-950 dark:via-rose-900/40 dark:to-slate-950 dark:border-rose-500/40",
    ring: "ring-rose-400/50",
    text: "text-rose-300",
  },
  red: {
    chip: "bg-red-500/15 text-red-300 border-red-500/30",
    panel:
      "from-red-100 via-card to-card border-red-300 dark:from-red-950 dark:via-red-900/40 dark:to-slate-950 dark:border-red-500/40",
    ring: "ring-red-400/50",
    text: "text-red-300",
  },
  orange: {
    chip: "bg-orange-500/15 text-orange-300 border-orange-500/30",
    panel:
      "from-orange-100 via-card to-card border-orange-300 dark:from-orange-950 dark:via-orange-900/40 dark:to-slate-950 dark:border-orange-500/40",
    ring: "ring-orange-400/50",
    text: "text-orange-300",
  },
  fuchsia: {
    chip: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
    panel:
      "from-fuchsia-100 via-card to-card border-fuchsia-300 dark:from-fuchsia-950 dark:via-fuchsia-900/40 dark:to-slate-950 dark:border-fuchsia-500/40",
    ring: "ring-fuchsia-400/50",
    text: "text-fuchsia-300",
  },
  yellow: {
    chip: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
    panel:
      "from-yellow-100 via-card to-card border-yellow-300 dark:from-yellow-950 dark:via-yellow-900/40 dark:to-slate-950 dark:border-yellow-500/40",
    ring: "ring-yellow-400/50",
    text: "text-yellow-300",
  },
  pink: {
    chip: "bg-pink-500/15 text-pink-300 border-pink-500/30",
    panel:
      "from-pink-100 via-card to-card border-pink-300 dark:from-pink-950 dark:via-pink-900/40 dark:to-slate-950 dark:border-pink-500/40",
    ring: "ring-pink-400/50",
    text: "text-pink-300",
  },
};

export function styleOf(color: string): RoleStyle {
  return ROLE_STYLES[color] ?? ROLE_STYLES.sky;
}

export function iconOf(roleIcon: string): LucideIcon {
  return ICONS[roleIcon] ?? User;
}
