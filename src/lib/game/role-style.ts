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

// Tailwindの静的クラス検出のため、キーごとに完全なクラス文字列を書き出す
export const ROLE_STYLES: Record<string, RoleStyle> = {
  sky: {
    chip: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    panel: "from-sky-950 via-sky-900/40 to-slate-950 border-sky-500/40",
    ring: "ring-sky-400/50",
    text: "text-sky-300",
  },
  violet: {
    chip: "bg-violet-500/15 text-violet-300 border-violet-500/30",
    panel: "from-violet-950 via-violet-900/40 to-slate-950 border-violet-500/40",
    ring: "ring-violet-400/50",
    text: "text-violet-300",
  },
  emerald: {
    chip: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    panel: "from-emerald-950 via-emerald-900/40 to-slate-950 border-emerald-500/40",
    ring: "ring-emerald-400/50",
    text: "text-emerald-300",
  },
  indigo: {
    chip: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    panel: "from-indigo-950 via-indigo-900/40 to-slate-950 border-indigo-500/40",
    ring: "ring-indigo-400/50",
    text: "text-indigo-300",
  },
  amber: {
    chip: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    panel: "from-amber-950 via-amber-900/40 to-slate-950 border-amber-500/40",
    ring: "ring-amber-400/50",
    text: "text-amber-300",
  },
  teal: {
    chip: "bg-teal-500/15 text-teal-300 border-teal-500/30",
    panel: "from-teal-950 via-teal-900/40 to-slate-950 border-teal-500/40",
    ring: "ring-teal-400/50",
    text: "text-teal-300",
  },
  rose: {
    chip: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    panel: "from-rose-950 via-rose-900/40 to-slate-950 border-rose-500/40",
    ring: "ring-rose-400/50",
    text: "text-rose-300",
  },
  red: {
    chip: "bg-red-500/15 text-red-300 border-red-500/30",
    panel: "from-red-950 via-red-900/40 to-slate-950 border-red-500/40",
    ring: "ring-red-400/50",
    text: "text-red-300",
  },
  orange: {
    chip: "bg-orange-500/15 text-orange-300 border-orange-500/30",
    panel: "from-orange-950 via-orange-900/40 to-slate-950 border-orange-500/40",
    ring: "ring-orange-400/50",
    text: "text-orange-300",
  },
  fuchsia: {
    chip: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
    panel: "from-fuchsia-950 via-fuchsia-900/40 to-slate-950 border-fuchsia-500/40",
    ring: "ring-fuchsia-400/50",
    text: "text-fuchsia-300",
  },
  yellow: {
    chip: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
    panel: "from-yellow-950 via-yellow-900/40 to-slate-950 border-yellow-500/40",
    ring: "ring-yellow-400/50",
    text: "text-yellow-300",
  },
  pink: {
    chip: "bg-pink-500/15 text-pink-300 border-pink-500/30",
    panel: "from-pink-950 via-pink-900/40 to-slate-950 border-pink-500/40",
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
