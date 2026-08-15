import type { RoleId } from "./roles";

export type Phase =
  | "lobby" // 部屋待機中(役職構成の設定)
  | "role_reveal" // 各自役職確認
  | "night" // 夜フェーズ(能力行動)
  | "day_result" // 朝の結果発表
  | "discussion" // 昼の議論
  | "vote" // 投票
  | "execution_result" // 追放結果発表
  | "game_over"; // 決着

export type DeathCause = "attack" | "execution" | "curse" | "hunter" | "lover_grief";

export interface DeathRecord {
  playerId: string;
  cause: DeathCause;
  day: number; // 何日目の出来事か(夜明けの日数を基準)
  revealedRole?: RoleId; // 死亡時に公開する場合のみ
}

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  connected: boolean;
  alive: boolean;
  role: RoleId | null;
  joinedAt: number;
}

export interface RoleCounts {
  [role: string]: number;
}

export interface RoomSettings {
  revealRoleOnDeath: boolean; // 死亡時に役職を公開するか(デフォルトOFF)
  discussionSeconds: number; // 議論タイマーの秒数
  voteSeconds: number; // 投票タイマーの秒数
  nightSeconds: number; // 夜フェーズタイマーの秒数
  roleRevealSeconds: number; // 役職確認フェーズの自動進行までの秒数
  resultPauseSeconds: number; // 朝の結果発表→議論、追放結果→次の夜、の自動進行までの秒数
}

export interface NightSubmission {
  actorId: string;
  targetId: string | null;
}

export interface VoteSubmission {
  voterId: string;
  targetId: string;
}

export interface PublicGameState {
  code: string;
  phase: Phase;
  day: number;
  settings: RoomSettings;
  players: PublicPlayer[];
  lastDeaths: DeathRecord[]; // 直近の発表分
  lastExecuted: { playerId: string; revealedRole?: RoleId } | null;
  voteTally: Record<string, number> | null; // targetId -> count (公開後)
  runoffCandidateIds: string[] | null; // 決選投票中: 投票できる対象をこのIDに限定
  winner: WinnerInfo | null;
  phaseEndsAt: number | null; // epoch ms, タイマーの終了予定時刻
  roleCounts: RoleCounts;
  totalSeats: number;
  dictatorUsed: boolean;
  awaitingHunterRevenge: { hunterId: string; hunterName: string } | null;
  progress: { submitted: number; total: number } | null;
}

export interface PublicPlayer {
  id: string;
  name: string;
  isHost: boolean;
  connected: boolean;
  alive: boolean;
}

export interface WinnerInfo {
  primary: "village" | "werewolf" | "draw";
  extra: Array<{ team: "fox" | "god" | "lover"; playerIds: string[] }>;
  allRoles: Array<{ playerId: string; name: string; role: RoleId }>;
}

// クライアントごとに送る「自分専用」情報
export interface PrivateViewState {
  self: {
    id: string;
    role: RoleId | null;
    alive: boolean;
  };
  // 役職に応じて見える追加情報
  knownAllies?: Array<{ id: string; name: string; role: RoleId }>; // 共有者・人狼・内通者・恋人
  seerResult?: { day: number; targetId: string; targetName: string; isBlack: boolean } | null;
  mediumResult?: { day: number; targetId: string; targetName: string; isBlack: boolean } | null;
  allRolesKnown?: Array<{ id: string; name: string; role: RoleId }>; // 神様専用
  canUseDictator?: boolean;
  pendingNightAction?: { type: string; candidates: PublicPlayer[]; submitted: boolean };
  pendingHunterRevenge?: { candidates: PublicPlayer[] } | null;
  hasVoted?: boolean;
  roleAcked?: boolean;
}
