import type { RoleId } from "./roles";

export type Phase =
  | "lobby" // 部屋待機中(役職構成の設定)
  | "role_reveal" // 各自役職確認
  | "night" // 夜フェーズ(能力行動)
  | "day_result" // 朝の結果発表
  | "discussion" // 昼の議論
  | "vote" // 投票
  | "last_words" // 追放が決まった人の最後の一言
  | "appeal_vote" // 本当に追放するか、生かすかの2択決選
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
  // プレイヤーが任意で設定できるプロフィール写真(小さくリサイズ済みのdata URL、未設定ならnull)
  avatarUrl: string | null;
}

export interface RoleCounts {
  [role: string]: number;
}

export interface RoomSettings {
  revealRoleOnDeath: boolean; // 死亡時に役職を公開するか(デフォルトOFF)
  seerFirstNightDivine: boolean; // 予言者が役職確認のタイミングで1人占える発展ルール(デフォルトOFF、説明書11ページ)
  allowFirstNightKill: boolean; // 最初の夜(1日目の夜)に人狼が襲撃できるか(デフォルトON=通常ルール)
  allowFirstVoteExecution: boolean; // 最初の投票(1日目の投票)で実際に追放が発生するか(デフォルトON=通常ルール)
  allowSelfVote: boolean; // 投票で自分自身を対象に選べるか(デフォルトON=これまでの挙動のまま)
  revealVoteChoices: boolean; // 投票中、誰が誰に投票しているかを全員に公開するか(デフォルトOFF=集計数のみ)
  hunterRevengeOnAnyDeath: boolean; // ハンターの道連れを、襲撃・処刑以外(呪殺・後追い)の死亡でも発動させるか(デフォルトOFF)
  allowBodyguardSelfGuard: boolean; // ボディーガードが自分自身を護衛対象にできるか(デフォルトOFF)
  secondTieExecutesRandomly: boolean; // 決選投票でも同数タイだった場合、ランダムに1人処刑するか。OFFなら誰も処刑されない(デフォルトON=これまでの挙動のまま)
  dictatorCanTargetSelf: boolean; // 独裁者が自分自身を強制処刑の対象にできるか(デフォルトON=これまでの挙動のまま)
}

export interface NightSubmission {
  actorId: string;
  targetId: string | null;
}

export interface VoteSubmission {
  voterId: string;
  targetId: string;
}

export type AppealChoice = "execute" | "spare";

export interface AppealVoteSubmission {
  voterId: string;
  choice: AppealChoice;
}

export interface AppealVoteResult {
  targetId: string;
  executeCount: number;
  spareCount: number;
  spared: boolean;
}

export interface PublicGameState {
  code: string;
  phase: Phase;
  day: number;
  settings: RoomSettings;
  players: PublicPlayer[];
  lastDeaths: DeathRecord[]; // 直近の発表分
  lastExecuted: {
    playerId: string;
    revealedRole?: RoleId;
    spared?: boolean;
    // spared === true になった理由。生存決選投票(決選投票)の結果によるものか、
    // 「最初の投票では実際には追放しない」設定によるものかをUI側で正しく出し分けるために持たせる。
    sparedReason?: "appeal_vote" | "first_vote_rule" | null;
  } | null;
  voteTally: Record<string, number> | null; // targetId -> count (公開後)
  // 設定 revealVoteChoices がONの場合のみ、投票フェーズ中に誰が誰に投票したかをリアルタイムで全員に公開する
  voteChoices: Array<{ voterId: string; voterName: string; targetId: string; targetName: string }> | null;
  runoffCandidateIds: string[] | null; // 決選投票中: 投票できる対象をこのIDに限定
  pendingExecution: { playerId: string; playerName: string } | null; // 最後の一言・生存決選投票の対象
  appealVoteResult: AppealVoteResult | null; // 直近の生存決選投票の結果(結果発表画面用)
  winner: WinnerInfo | null;
  phaseEndsAt: number | null; // epoch ms, タイマーの終了予定時刻(このアプリでは常にnull)
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
  avatarUrl: string | null;
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
  // 予言者・霊媒師が「自分の役職」画面でこれまでの全結果を振り返れるように、最新の1件だけでなく全履歴も持たせる(新しい順)。
  seerHistory?: Array<{ day: number; targetId: string; targetName: string; isBlack: boolean }>;
  mediumHistory?: Array<{ day: number; targetId: string; targetName: string; isBlack: boolean }>;
  allRolesKnown?: Array<{ id: string; name: string; role: RoleId }>; // 神様専用
  canUseDictator?: boolean;
  pendingNightAction?: {
    type: string;
    candidates: PublicPlayer[];
    submitted: boolean;
    // 人狼の襲撃時のみ: 仲間の人狼それぞれが今どこを選んでいるか(相談用、リアルタイム更新)
    wolfSelections?: Array<{ id: string; name: string; targetId: string | null; targetName: string | null }>;
    // 人狼の襲撃時のみ: 生存する人狼全員が同じ相手(または全員「襲撃しない」)を選んでいるか。
    // false の間は、全員提出済みでも夜は自動的に終わらない(合意が必要なため)。
    wolfConsensusReached?: boolean;
  };
  pendingHunterRevenge?: { candidates: PublicPlayer[] } | null;
  hasVoted?: boolean;
  roleAcked?: boolean;
  isPendingExecution?: boolean; // 自分が最後の一言・生存決選投票の対象かどうか
  hasVotedAppeal?: boolean;
  // 仲間内だけで見える短いメモ(人狼+内通者/共有者/恋人)。周りに悟られず意思疎通するための簡易な手段。
  allyNote?: { text: string; groupSize: number };
}
