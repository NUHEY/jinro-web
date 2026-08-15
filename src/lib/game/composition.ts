import type { RoleId } from "./roles";
import type { RoleCounts } from "./types";
import type { ValidationIssue } from "@/lib/i18n/strings";

export const MIN_PLAYERS = 4;
export const MAX_PLAYERS = 20;

// 役職ごとのUI上の増減範囲(ステッパーの上限)。人狼DX新装版の同梱枚数を目安に設定。
export const ROLE_LIMITS: Record<RoleId, { min: number; max: number; step: number }> = {
  villager: { min: 0, max: 20, step: 1 },
  seer: { min: 0, max: 2, step: 1 },
  bodyguard: { min: 0, max: 2, step: 1 },
  medium: { min: 0, max: 2, step: 1 },
  hunter: { min: 0, max: 1, step: 1 },
  mason: { min: 0, max: 4, step: 2 }, // 必ず偶数(2人1組)
  dictator: { min: 0, max: 1, step: 1 },
  werewolf: { min: 0, max: 6, step: 1 },
  traitor: { min: 0, max: 1, step: 1 },
  insider: { min: 0, max: 1, step: 1 },
  fox: { min: 0, max: 1, step: 1 },
  god: { min: 0, max: 1, step: 1 },
  lover: { min: 0, max: 2, step: 2 }, // 必ず偶数(2人1組)
};

export function totalSeats(counts: RoleCounts): number {
  return Object.values(counts).reduce((a, b) => a + (b || 0), 0);
}

export function validateComposition(
  counts: RoleCounts,
  playerCount: number
): { valid: boolean; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];
  const total = totalSeats(counts);
  if (total !== playerCount) {
    issues.push({ code: "SEAT_MISMATCH", total, playerCount });
  }
  if ((counts.werewolf || 0) < 1) {
    issues.push({ code: "NO_WEREWOLF" });
  }
  if ((counts.mason || 0) % 2 !== 0) {
    issues.push({ code: "MASON_ODD" });
  }
  if ((counts.lover || 0) !== 0 && (counts.lover || 0) !== 2) {
    issues.push({ code: "LOVER_INVALID" });
  }
  // 勝敗判定(checkWinConditions)の頭数ルールと一致させる:
  // 人狼としてカウントされるのは人狼カードのみ。妖狐は頭数から除外。
  // 裏切り者/内通者/神様/恋人は人間側としてカウントされる。
  const wolfCount = counts.werewolf || 0;
  const foxCount = counts.fox || 0;
  const humanCount = total - wolfCount - foxCount;
  if (wolfCount >= humanCount && total === playerCount) {
    issues.push({ code: "WOLF_TOO_MANY" });
  }
  return { valid: issues.length === 0, issues };
}

// 人数に応じたおすすめ配役を自動生成する(ホストが後から自由に編集可能)
export function suggestComposition(playerCount: number): RoleCounts {
  const n = Math.max(MIN_PLAYERS, Math.min(MAX_PLAYERS, playerCount));
  const counts: RoleCounts = {};
  let remaining = n;

  const add = (role: RoleId, count: number) => {
    if (count <= 0) return;
    if (remaining < count) return;
    counts[role] = (counts[role] || 0) + count;
    remaining -= count;
  };

  const wolfCount = Math.max(1, Math.floor(n / 4));
  add("werewolf", Math.min(wolfCount, remaining - 1 >= 0 ? wolfCount : 1));

  if (n >= 5) add("seer", 1);
  if (n >= 6) add("bodyguard", 1);
  if (n >= 7) add("medium", 1);
  if (n >= 8) add("traitor", 1);
  if (n >= 9) add("hunter", 1);
  if (n >= 10) add("mason", 2);
  if (n >= 11) add("dictator", 1);
  if (n >= 12) add("fox", 1);
  if (n >= 13) add("lover", 2);
  if (n >= 16) add("insider", 1);
  if (n >= 18) add("mason", 2); // 2組目の共有者

  add("villager", remaining);

  return counts;
}
