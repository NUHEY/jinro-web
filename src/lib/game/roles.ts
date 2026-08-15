// 人狼DX 新装版 - 13役職の構造定義(表示文言は src/lib/i18n/strings.ts に集約)
// 参照: 幻冬舎edu 商品ページ / 大阪人狼Lab. 役職解説

export type Team = "village" | "werewolf" | "fox" | "god" | "lover";

export type RoleId =
  | "villager" // 市民
  | "seer" // 予言者
  | "bodyguard" // ボディーガード
  | "medium" // 霊媒師
  | "hunter" // ハンター
  | "mason" // 共有者
  | "dictator" // 独裁者
  | "werewolf" // 人狼
  | "traitor" // 裏切り者
  | "insider" // 内通者
  | "fox" // 妖狐
  | "god" // 神様
  | "lover"; // 恋人

export type NightActionType =
  | "attack" // 人狼の襲撃
  | "guard" // ボディーガードの護衛
  | "divine" // 予言者の占い
  | "none";

export interface RoleDef {
  id: RoleId;
  team: Team;
  isWerewolfSide: boolean; // 人狼カウント(勝敗判定)に含まれるか
  nightAction: NightActionType;
  color: string; // UIアクセントカラー(tailwind class用キー)
  icon: string; // lucideアイコン名
}

export const ROLES: Record<RoleId, RoleDef> = {
  villager: { id: "villager", team: "village", isWerewolfSide: false, nightAction: "none", color: "sky", icon: "User" },
  seer: { id: "seer", team: "village", isWerewolfSide: false, nightAction: "divine", color: "violet", icon: "Eye" },
  bodyguard: { id: "bodyguard", team: "village", isWerewolfSide: false, nightAction: "guard", color: "emerald", icon: "Shield" },
  medium: { id: "medium", team: "village", isWerewolfSide: false, nightAction: "none", color: "indigo", icon: "Sparkles" },
  hunter: { id: "hunter", team: "village", isWerewolfSide: false, nightAction: "none", color: "amber", icon: "Crosshair" },
  mason: { id: "mason", team: "village", isWerewolfSide: false, nightAction: "none", color: "teal", icon: "Users" },
  dictator: { id: "dictator", team: "village", isWerewolfSide: false, nightAction: "none", color: "rose", icon: "Gavel" },
  werewolf: { id: "werewolf", team: "werewolf", isWerewolfSide: true, nightAction: "attack", color: "red", icon: "Moon" },
  traitor: { id: "traitor", team: "werewolf", isWerewolfSide: true, nightAction: "none", color: "orange", icon: "UserX" },
  insider: { id: "insider", team: "werewolf", isWerewolfSide: true, nightAction: "none", color: "fuchsia", icon: "UserCog" },
  fox: { id: "fox", team: "fox", isWerewolfSide: false, nightAction: "none", color: "orange", icon: "Flame" },
  god: { id: "god", team: "god", isWerewolfSide: false, nightAction: "none", color: "yellow", icon: "Crown" },
  lover: { id: "lover", team: "lover", isWerewolfSide: false, nightAction: "none", color: "pink", icon: "Heart" },
};

export const ROLE_ORDER: RoleId[] = [
  "villager",
  "seer",
  "bodyguard",
  "medium",
  "hunter",
  "mason",
  "dictator",
  "werewolf",
  "traitor",
  "insider",
  "fox",
  "god",
  "lover",
];

export function judgeAsBlack(roleId: RoleId): boolean {
  // 占い師・霊媒師の判定結果: 「人狼」のみ黒、それ以外はすべて白
  return roleId === "werewolf";
}
