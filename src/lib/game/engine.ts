import { nanoid } from "nanoid";
import { ROLES, judgeAsBlack, type RoleId } from "./roles";
import type {
  DeathCause,
  DeathRecord,
  Phase,
  Player,
  RoleCounts,
  RoomSettings,
  VoteSubmission,
  WinnerInfo,
} from "./types";

export interface NightActorSubmission {
  actorId: string;
  targetId: string | null;
}

export interface ResolutionContext {
  kind: "night" | "execution";
  queue: Array<{ playerId: string; cause: DeathCause }>;
}

export interface SeerLog {
  day: number;
  seerId: string;
  targetId: string;
  isBlack: boolean;
}

export interface MediumLog {
  day: number;
  mediumId: string;
  targetId: string;
  isBlack: boolean;
}

export interface GameState {
  code: string;
  createdAt: number;
  phase: Phase;
  day: number;
  settings: RoomSettings;
  players: Player[];
  roleCounts: RoleCounts;

  wolfIds: string[];
  insiderIds: string[];
  traitorIds: string[];
  masonIds: string[];
  loverIds: [string, string] | null;
  foxId: string | null;
  godId: string | null;

  attackSubmissions: NightActorSubmission[];
  guardSubmissions: NightActorSubmission[];
  divineSubmissions: NightActorSubmission[];

  seerLogs: SeerLog[];
  mediumLogs: MediumLog[];

  votes: VoteSubmission[];
  voteTally: Record<string, number> | null;
  runoffCandidateIds: string[] | null; // 決選投票中: 投票対象をこのIDに限定する

  roundDeaths: DeathRecord[];
  lastDeaths: DeathRecord[];
  lastExecuted: { playerId: string; revealedRole?: RoleId } | null;

  resolution: ResolutionContext | null;
  awaitingHunterRevenge: { hunterId: string; cause: DeathCause } | null;
  hunterRevengeUsed: Set<string>;

  dictatorUsed: boolean;
  phaseEndsAt: number | null;

  winner: WinnerInfo | null;

  deathLog: DeathRecord[];

  roleAcked: Set<string>;
}

export const DEFAULT_SETTINGS: RoomSettings = {
  revealRoleOnDeath: false,
  discussionSeconds: 180,
  voteSeconds: 30,
  nightSeconds: 60,
  roleRevealSeconds: 25,
  resultPauseSeconds: 10,
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function createLobbyState(code: string, settings: RoomSettings): GameState {
  return {
    code,
    createdAt: Date.now(),
    phase: "lobby",
    day: 0,
    settings,
    players: [],
    roleCounts: {},
    wolfIds: [],
    insiderIds: [],
    traitorIds: [],
    masonIds: [],
    loverIds: null,
    foxId: null,
    godId: null,
    attackSubmissions: [],
    guardSubmissions: [],
    divineSubmissions: [],
    seerLogs: [],
    mediumLogs: [],
    votes: [],
    voteTally: null,
    runoffCandidateIds: null,
    roundDeaths: [],
    lastDeaths: [],
    lastExecuted: null,
    resolution: null,
    awaitingHunterRevenge: null,
    hunterRevengeUsed: new Set(),
    dictatorUsed: false,
    phaseEndsAt: null,
    winner: null,
    deathLog: [],
    roleAcked: new Set(),
  };
}

// ロビーの参加者に役職を配って役職確認フェーズへ進める(既存プレイヤーの入退室状態は保持)
export function assignRolesAndStart(state: GameState, roleCounts: RoleCounts) {
  const roleSlots: RoleId[] = [];
  for (const [role, count] of Object.entries(roleCounts)) {
    for (let i = 0; i < (count || 0); i++) roleSlots.push(role as RoleId);
  }
  const shuffledSlots = shuffle(roleSlots);
  const shuffledOrder = shuffle(state.players.map((p) => p.id));

  for (const p of state.players) {
    p.alive = true;
    p.role = null;
  }
  shuffledOrder.forEach((id, i) => {
    const player = getPlayer(state, id);
    if (player) player.role = shuffledSlots[i] ?? "villager";
  });

  const byRole = (r: RoleId) => state.players.filter((p) => p.role === r).map((p) => p.id);
  state.wolfIds = byRole("werewolf");
  state.insiderIds = byRole("insider");
  state.traitorIds = byRole("traitor");
  state.masonIds = byRole("mason");
  const loverIdsArr = byRole("lover");
  state.loverIds = loverIdsArr.length === 2 ? [loverIdsArr[0], loverIdsArr[1]] : null;
  state.foxId = byRole("fox")[0] ?? null;
  state.godId = byRole("god")[0] ?? null;

  state.roleCounts = roleCounts;
  state.day = 0;
  state.attackSubmissions = [];
  state.guardSubmissions = [];
  state.divineSubmissions = [];
  state.seerLogs = [];
  state.mediumLogs = [];
  state.votes = [];
  state.voteTally = null;
  state.runoffCandidateIds = null;
  state.roundDeaths = [];
  state.lastDeaths = [];
  state.lastExecuted = null;
  state.resolution = null;
  state.awaitingHunterRevenge = null;
  state.hunterRevengeUsed = new Set();
  state.dictatorUsed = false;
  state.winner = null;
  state.deathLog = [];
  state.roleAcked = new Set();
  state.phase = "role_reveal";
  state.phaseEndsAt = Date.now() + state.settings.roleRevealSeconds * 1000;
}

// ゲーム終了後、同じ部屋・同じメンバーで再戦できるようにロビーへ戻す
export function resetToLobby(state: GameState) {
  for (const p of state.players) {
    p.alive = true;
    p.role = null;
  }
  state.phase = "lobby";
  state.day = 0;
  state.wolfIds = [];
  state.insiderIds = [];
  state.traitorIds = [];
  state.masonIds = [];
  state.loverIds = null;
  state.foxId = null;
  state.godId = null;
  state.attackSubmissions = [];
  state.guardSubmissions = [];
  state.divineSubmissions = [];
  state.seerLogs = [];
  state.mediumLogs = [];
  state.votes = [];
  state.voteTally = null;
  state.runoffCandidateIds = null;
  state.roundDeaths = [];
  state.lastDeaths = [];
  state.lastExecuted = null;
  state.resolution = null;
  state.awaitingHunterRevenge = null;
  state.hunterRevengeUsed = new Set();
  state.dictatorUsed = false;
  state.winner = null;
  state.deathLog = [];
  state.roleAcked = new Set();
  state.phaseEndsAt = null;
}

export function ackRole(state: GameState, playerId: string) {
  state.roleAcked.add(playerId);
}

export function allAliveAcked(state: GameState): boolean {
  const alive = state.players.filter((p) => p.alive);
  if (alive.length === 0) return false;
  return alive.every((p) => state.roleAcked.has(p.id));
}

export function alivePlayers(state: GameState): Player[] {
  return state.players.filter((p) => p.alive);
}

export function getPlayer(state: GameState, id: string): Player | undefined {
  return state.players.find((p) => p.id === id);
}

export function startNight(state: GameState) {
  state.phase = "night";
  state.day += 1;
  state.attackSubmissions = [];
  state.guardSubmissions = [];
  state.divineSubmissions = [];
  state.phaseEndsAt = Date.now() + state.settings.nightSeconds * 1000;
}

export function submitAttack(state: GameState, actorId: string, targetId: string | null) {
  state.attackSubmissions = state.attackSubmissions.filter((s) => s.actorId !== actorId);
  state.attackSubmissions.push({ actorId, targetId });
}

export function submitGuard(state: GameState, actorId: string, targetId: string | null) {
  state.guardSubmissions = state.guardSubmissions.filter((s) => s.actorId !== actorId);
  state.guardSubmissions.push({ actorId, targetId });
}

export function submitDivine(state: GameState, actorId: string, targetId: string | null) {
  state.divineSubmissions = state.divineSubmissions.filter((s) => s.actorId !== actorId);
  state.divineSubmissions.push({ actorId, targetId });
}

function resolveAttackTarget(submissions: NightActorSubmission[]): string | null {
  const votes = submissions.filter((s) => s.targetId).map((s) => s.targetId as string);
  if (votes.length === 0) return null;
  const tally: Record<string, number> = {};
  for (const v of votes) tally[v] = (tally[v] || 0) + 1;
  const max = Math.max(...Object.values(tally));
  const top = Object.keys(tally).filter((k) => tally[k] === max);
  return pickRandom(top);
}

function pushDeath(state: GameState, playerId: string, cause: DeathCause) {
  if (!state.resolution) return;
  state.resolution.queue.push({ playerId, cause });
}

function pumpDeathQueue(state: GameState) {
  if (!state.resolution) return;
  while (state.resolution.queue.length > 0) {
    const next = state.resolution.queue.shift()!;
    const player = getPlayer(state, next.playerId);
    if (!player || !player.alive) continue;
    player.alive = false;
    const record: DeathRecord = {
      playerId: player.id,
      cause: next.cause,
      day: state.day,
      revealedRole: state.settings.revealRoleOnDeath ? (player.role ?? undefined) : undefined,
    };
    state.deathLog.push(record);
    state.roundDeaths.push(record);

    // 恋人の後追い
    if (player.role === "lover" && state.loverIds) {
      const partnerId = state.loverIds.find((id) => id !== player.id);
      if (partnerId) {
        const partner = getPlayer(state, partnerId);
        if (partner && partner.alive) {
          pushDeath(state, partnerId, "lover_grief");
        }
      }
    }

    // ハンターの道連れ(割り込み待ち)
    if (
      player.role === "hunter" &&
      (next.cause === "attack" || next.cause === "execution") &&
      !state.hunterRevengeUsed.has(player.id)
    ) {
      record.revealedRole = "hunter"; // ハンターは道連れ発動時に必ず正体を公開する
      state.awaitingHunterRevenge = { hunterId: player.id, cause: next.cause };
      return; // 一時停止。プレイヤーの選択を待つ
    }
  }
  finalizeResolution(state);
}

function finalizeResolution(state: GameState) {
  if (!state.resolution) return;
  const kind = state.resolution.kind;
  if (kind === "night") {
    state.lastDeaths = state.roundDeaths;
    state.phase = "day_result";
    // 霊媒師ログは前日の処刑結果に対して発生するため夜resolveの前に積まれている
  } else {
    state.lastDeaths = state.roundDeaths;
    state.phase = "execution_result";
  }
  state.roundDeaths = [];
  state.resolution = null;
  state.phaseEndsAt = Date.now() + state.settings.resultPauseSeconds * 1000;
  checkWinConditions(state);
}

export function resolveNight(state: GameState) {
  state.roundDeaths = [];
  state.resolution = { kind: "night", queue: [] };

  const attackTargetId = resolveAttackTarget(state.attackSubmissions);
  const guardedIds = new Set(
    state.guardSubmissions.filter((s) => s.targetId).map((s) => s.targetId as string)
  );

  // 予言者の占い処理(結果を記録 + 妖狐なら呪殺)
  for (const sub of state.divineSubmissions) {
    if (!sub.targetId) continue;
    const target = getPlayer(state, sub.targetId);
    if (!target) continue;
    const isBlack = judgeAsBlack(target.role as RoleId);
    state.seerLogs.push({ day: state.day, seerId: sub.actorId, targetId: target.id, isBlack });
    if (target.role === "fox" && target.alive) {
      pushDeath(state, target.id, "curse");
    }
  }

  // 人狼の襲撃処理
  if (attackTargetId) {
    const target = getPlayer(state, attackTargetId);
    if (target && target.alive) {
      const protectedByGuard = guardedIds.has(attackTargetId);
      const isFox = target.role === "fox";
      if (!protectedByGuard && !isFox) {
        pushDeath(state, attackTargetId, "attack");
      }
    }
  }

  pumpDeathQueue(state);
}

export function submitHunterRevenge(state: GameState, hunterId: string, targetId: string | null) {
  if (!state.awaitingHunterRevenge || state.awaitingHunterRevenge.hunterId !== hunterId) return;
  state.hunterRevengeUsed.add(hunterId);
  state.awaitingHunterRevenge = null;
  if (targetId) {
    const target = getPlayer(state, targetId);
    if (target && target.alive && state.resolution) {
      state.resolution.queue.unshift({ playerId: targetId, cause: "hunter" });
    }
  }
  pumpDeathQueue(state);
}

export function recordMediumReading(state: GameState) {
  if (!state.lastExecuted) return;
  const target = getPlayer(state, state.lastExecuted.playerId);
  if (!target || !target.role) return;
  const isBlack = judgeAsBlack(target.role);
  const mediums = state.players.filter((p) => p.role === "medium" && p.alive);
  for (const m of mediums) {
    state.mediumLogs.push({ day: state.day, mediumId: m.id, targetId: target.id, isBlack });
  }
}

export function startDiscussion(state: GameState) {
  state.phase = "discussion";
  state.phaseEndsAt = Date.now() + state.settings.discussionSeconds * 1000;
}

// ホストが議論タイムを任意の回数だけ延長できる(上限なし)
export function extendDiscussion(state: GameState, extraSeconds: number) {
  if (state.phase !== "discussion" || !state.phaseEndsAt) return;
  state.phaseEndsAt += extraSeconds * 1000;
}

export function startVote(state: GameState) {
  state.phase = "vote";
  state.votes = [];
  state.voteTally = null;
  state.phaseEndsAt = Date.now() + state.settings.voteSeconds * 1000;
}

export function submitVote(state: GameState, voterId: string, targetId: string) {
  state.votes = state.votes.filter((v) => v.voterId !== voterId);
  state.votes.push({ voterId, targetId });
}

// 投票結果を集計する。
// 同数トップが複数いた場合: 1回目のタイなら対象をそのトップ集団に絞った上で
// 話し合い(決選投票前の話し合い)フェーズへ戻す。決選投票でもなお同数なら、
// そこで初めてランダムに1人を選ぶ。
export function resolveVote(state: GameState) {
  const tally: Record<string, number> = {};
  for (const v of state.votes) tally[v.targetId] = (tally[v.targetId] || 0) + 1;
  state.voteTally = tally;

  let top: string[] = [];
  if (Object.keys(tally).length > 0) {
    const max = Math.max(...Object.values(tally));
    top = Object.keys(tally).filter((k) => tally[k] === max);
  }

  if (top.length > 1 && !state.runoffCandidateIds) {
    // 初回のタイ: 決選投票の対象をこの上位集団に絞り、話し合いへ戻る
    state.runoffCandidateIds = top;
    state.votes = [];
    startDiscussion(state);
    return;
  }

  const executedId = top.length > 0 ? pickRandom(top) : null;
  state.runoffCandidateIds = null;
  executeTarget(state, executedId);
}

export function dictatorExecute(state: GameState, dictatorId: string, targetId: string) {
  const dictator = getPlayer(state, dictatorId);
  if (!dictator || dictator.role !== "dictator" || state.dictatorUsed || !dictator.alive) return;
  state.dictatorUsed = true;
  state.voteTally = null;
  state.votes = [];
  state.runoffCandidateIds = null;
  executeTarget(state, targetId);
}

function executeTarget(state: GameState, targetId: string | null) {
  state.roundDeaths = [];
  state.resolution = { kind: "execution", queue: [] };
  if (targetId) {
    const target = getPlayer(state, targetId);
    state.lastExecuted = {
      playerId: targetId,
      revealedRole: state.settings.revealRoleOnDeath ? (target?.role ?? undefined) : undefined,
    };
    pushDeath(state, targetId, "execution");
  } else {
    state.lastExecuted = null;
  }
  pumpDeathQueue(state);
  if (state.lastExecuted) {
    recordMediumReading(state);
  }
}

export function checkWinConditions(state: GameState) {
  const alive = alivePlayers(state);
  const aliveWolves = alive.filter((p) => p.role === "werewolf");
  const aliveWolfSide = alive.filter(
    (p) => p.role === "werewolf" || p.role === "traitor" || p.role === "insider"
  );
  const aliveOthers = alive.length - aliveWolfSide.length;

  let primary: WinnerInfo["primary"] | null = null;
  if (aliveWolves.length === 0) {
    primary = "village";
  } else if (aliveWolfSide.length >= aliveOthers) {
    primary = "werewolf";
  }

  if (!primary) return;

  const extra: WinnerInfo["extra"] = [];
  if (state.foxId) {
    const fox = getPlayer(state, state.foxId);
    if (fox && fox.alive) extra.push({ team: "fox", playerIds: [fox.id] });
  }
  if (state.godId) {
    const god = getPlayer(state, state.godId);
    if (god && god.alive) extra.push({ team: "god", playerIds: [god.id] });
  }
  if (state.loverIds) {
    const [a, b] = state.loverIds;
    const pa = getPlayer(state, a);
    const pb = getPlayer(state, b);
    if (pa && pb && pa.alive && pb.alive) extra.push({ team: "lover", playerIds: [a, b] });
  }

  state.winner = {
    primary,
    extra,
    allRoles: state.players.map((p) => ({
      playerId: p.id,
      name: p.name,
      role: (p.role ?? "villager") as RoleId,
    })),
  };
  state.phase = "game_over";
  state.phaseEndsAt = null;
}

export function newRoomCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 紛らわしい文字を除外
  let code = "";
  for (let i = 0; i < 5; i++) code += alphabet[Math.floor(Math.random() * alphabet.length)];
  return code;
}

export function newPlayerId(): string {
  return nanoid(12);
}

export { ROLES };
