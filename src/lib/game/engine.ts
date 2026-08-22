import { nanoid } from "nanoid";
import { ROLES, judgeAsBlack, type RoleId } from "./roles";
import type {
  AppealChoice,
  AppealVoteResult,
  AppealVoteSubmission,
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
  previousGuardTargets: Record<string, string>; // ボディーガードactorId -> 前回守った相手(連続ガード禁止用)

  // 投票で追放先が決定した後、実際の追放前に行う「最後の一言」「生かすか殺すかの決選投票」用の状態
  pendingExecution: { targetId: string } | null;
  appealVotes: AppealVoteSubmission[];
  appealVoteResult: AppealVoteResult | null;

  // 仲間内だけで見える短いメモ(周りに悟られず意思疎通するための簡易な手段)
  groupNotes: { wolf: string; mason: string; lover: string };

  roundDeaths: DeathRecord[];
  lastDeaths: DeathRecord[];
  lastExecuted: {
    playerId: string;
    revealedRole?: RoleId;
    spared?: boolean;
    sparedReason?: "appeal_vote" | "first_vote_rule" | null;
  } | null;

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
  allowFirstNightKill: true,
  allowFirstVoteExecution: true,
  allowWolfFriendlyFire: false,
  seerFirstNightDivine: false,
  allowSelfVote: true,
  revealVoteChoices: false,
  allowBodyguardSelfGuard: false,
  secondTieExecutesRandomly: true,
  dictatorCanTargetSelf: true,
};

// 「公式ルール」バッジをUIに表示するための基準値。ここに載っている項目だけが
// 対象で、それ以外(このアプリ独自の追加ルール)には表示しない。
export const OFFICIAL_SETTINGS: Partial<RoomSettings> = {
  revealRoleOnDeath: false,
  allowFirstNightKill: true,
  allowFirstVoteExecution: true,
  allowWolfFriendlyFire: false,
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
    previousGuardTargets: {},
    pendingExecution: null,
    appealVotes: [],
    appealVoteResult: null,
    groupNotes: { wolf: "", mason: "", lover: "" },
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
  state.previousGuardTargets = {};
  state.pendingExecution = null;
  state.appealVotes = [];
  state.appealVoteResult = null;
  state.groupNotes = { wolf: "", mason: "", lover: "" };
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
  state.phaseEndsAt = null;
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
  state.previousGuardTargets = {};
  state.pendingExecution = null;
  state.appealVotes = [];
  state.appealVoteResult = null;
  state.groupNotes = { wolf: "", mason: "", lover: "" };
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

// 発展ルール: 予言者が「役職確認」のタイミングで1人だけ占える(公式の上級ルールとして案内されている遊び方。設定でON/OFF可能)。
// 1ゲームにつき1回のみ。結果は通常の占い結果(seerLogs, day:0)として記録され、
// 以降の画面でも「前回の占い結果」として自然に表示される。
export function submitEarlyDivine(state: GameState, seerId: string, targetId: string) {
  if (!state.settings.seerFirstNightDivine) return;
  if (state.phase !== "role_reveal") return;
  const seer = getPlayer(state, seerId);
  const target = getPlayer(state, targetId);
  if (!seer || seer.role !== "seer" || !target || target.id === seerId) return;
  if (state.seerLogs.some((l) => l.seerId === seerId && l.day === 0)) return; // 1ゲームにつき1回まで
  const isBlack = judgeAsBlack(target.role as RoleId);
  state.seerLogs.push({ day: 0, seerId, targetId: target.id, isBlack });
}

export function alivePlayers(state: GameState): Player[] {
  return state.players.filter((p) => p.alive);
}

export function getPlayer(state: GameState, id: string): Player | undefined {
  return state.players.find((p) => p.id === id);
}

// 最初の役職確認の直後に行う「最初の昼(議論のみ、追放投票なし)」。
// ここでは人狼の襲撃などの夜の能力はまだ発動しない(公式ルールブック通り)。
export function startFirstDiscussion(state: GameState) {
  state.phase = "discussion";
  state.phaseEndsAt = null;
}

export function startNight(state: GameState) {
  // 直前の夜にボディーガードが守った相手を記録しておく(連続ガード禁止のため)
  for (const sub of state.guardSubmissions) {
    if (sub.targetId) state.previousGuardTargets[sub.actorId] = sub.targetId;
  }
  state.phase = "night";
  state.day += 1;
  state.attackSubmissions = [];
  state.guardSubmissions = [];
  state.divineSubmissions = [];
  state.phaseEndsAt = null;
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

// 生存している人狼(襲撃アクションを持つロール)が2人以上いる場合、全員が同じ相手
// (または全員「今夜は襲撃しない」)を選ぶまでは合意が取れていないとみなす。
// 1人しかいない場合は常に合意済み扱い。ホストの「全員の行動を待たずに進める」操作は
// この合意チェックをバイパスし、resolveAttackTarget() の多数決/ランダム決定にフォールバックする。
export function wolfAttackConsensusReached(state: GameState): boolean {
  const aliveWolfActors = alivePlayers(state).filter(
    (p) => p.role && ROLES[p.role].nightAction === "attack"
  );
  if (aliveWolfActors.length <= 1) return true;
  const targets = aliveWolfActors.map((p) => {
    const sub = state.attackSubmissions.find((s) => s.actorId === p.id);
    return sub ? sub.targetId : undefined;
  });
  if (targets.some((t) => t === undefined)) return false; // まだ全員提出していない
  const first = targets[0];
  return targets.every((t) => t === first);
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

    // ハンターの道連れ(割り込み待ち)。公式ルール通り、襲撃・処刑による死亡時のみ発動する。
    // (呪殺は妖狐だけ、後追いは恋人だけが対象になる死因のため、通常の1人ハンター構成では
    // ハンター自身がそれらの死因で死ぬことはなく、トリガー対象に含めても意味を持たない)
    const hunterRevengeTriggerCauses: DeathCause[] = ["attack", "execution"];
    if (
      player.role === "hunter" &&
      hunterRevengeTriggerCauses.includes(next.cause) &&
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
  state.phaseEndsAt = null;
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

  // 人狼の襲撃処理(設定で「最初の夜は人狼が殺せない」がONの場合、day===1の襲撃は不発になる)
  const firstNightKillBlocked = state.day === 1 && !state.settings.allowFirstNightKill;
  if (attackTargetId && !firstNightKillBlocked) {
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
  state.phaseEndsAt = null;
}

export function startVote(state: GameState) {
  state.phase = "vote";
  state.votes = [];
  state.voteTally = null;
  state.phaseEndsAt = null;
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

  if (top.length > 1 && state.runoffCandidateIds && !state.settings.secondTieExecutesRandomly) {
    // 決選投票でもなお同数タイ。設定がOFFの場合はランダム処刑をせず、誰も処刑しない。
    state.runoffCandidateIds = null;
    executeTarget(state, null);
    return;
  }

  const executedId = top.length > 0 ? pickRandom(top) : null;
  state.runoffCandidateIds = null;

  if (!executedId) {
    executeTarget(state, null);
    return;
  }

  // 発展ルール: 最初の投票(1日目)では設定がOFFの場合、実際には追放されない(生かされる)。
  // このケースは「最後の一言」「生存決選投票(決選投票)」を一切経由しないため、
  // 決選投票の結果として生かされたわけではないことがUI上で正しく伝わるよう、
  // sparedReason を "first_vote_rule" として明示的に区別する(バグ修正: 以前は
  // 決選投票を行っていないのに「決選投票の結果、生かされました」と表示されていた)。
  const firstVoteExecutionBlocked = state.day === 1 && !state.settings.allowFirstVoteExecution;
  if (firstVoteExecutionBlocked) {
    executeTarget(state, executedId, true, "first_vote_rule");
    return;
  }

  // 通常はここで即座に処刑せず、「最後の一言」→「生かすか殺すかの決選投票」へ進む
  startLastWords(state, executedId);
}

export function dictatorExecute(state: GameState, dictatorId: string, targetId: string) {
  const dictator = getPlayer(state, dictatorId);
  if (!dictator || dictator.role !== "dictator" || state.dictatorUsed || !dictator.alive) return;
  state.dictatorUsed = true;
  state.voteTally = null;
  state.votes = [];
  state.runoffCandidateIds = null;
  // 独裁者の強制処刑は議論・投票そのものを飛ばすのが役職の特性のため、
  // 最後の一言・生存決選投票の対象にはならない(即座に処刑を実行する)
  executeTarget(state, targetId);
}

// 投票で追放先が決定した後、「最後の一言」フェーズへ進める(タイマーなし。
// ホストまたは対象者自身が次に進めるボタンを押すまで待機する)
export function startLastWords(state: GameState, targetId: string) {
  state.pendingExecution = { targetId };
  state.appealVotes = [];
  state.appealVoteResult = null;
  state.phase = "last_words";
  state.phaseEndsAt = null;
}

// 「最後の一言」の後、生かすか殺すかの決選投票フェーズへ進める
export function proceedToAppealVote(state: GameState) {
  if (!state.pendingExecution) return;
  state.appealVotes = [];
  state.phase = "appeal_vote";
  state.phaseEndsAt = null;
}

// 生存決選投票。対象者本人は投票できない(生存中の対象者以外の全員が対象)
export function submitAppealVote(state: GameState, voterId: string, choice: AppealChoice) {
  if (!state.pendingExecution) return;
  if (voterId === state.pendingExecution.targetId) return;
  state.appealVotes = state.appealVotes.filter((v) => v.voterId !== voterId);
  state.appealVotes.push({ voterId, choice });
}

// 生存決選投票の集計。生かす(spare)には過半数(執行票より多い)が必要。
// 同数の場合は最初の投票結果通り処刑される(タイは処刑側のデフォルト)。
export function resolveAppealVote(state: GameState) {
  if (!state.pendingExecution) return;
  const targetId = state.pendingExecution.targetId;
  const executeCount = state.appealVotes.filter((v) => v.choice === "execute").length;
  const spareCount = state.appealVotes.filter((v) => v.choice === "spare").length;
  const spared = spareCount > executeCount;

  const result: AppealVoteResult = { targetId, executeCount, spareCount, spared };
  state.appealVoteResult = result;

  executeTarget(state, targetId, spared, "appeal_vote");
}

function executeTarget(
  state: GameState,
  targetId: string | null,
  spared: boolean = false,
  sparedReason: "appeal_vote" | "first_vote_rule" | null = null
) {
  state.roundDeaths = [];
  state.resolution = { kind: "execution", queue: [] };
  state.pendingExecution = null;
  state.appealVotes = [];
  if (targetId) {
    const target = getPlayer(state, targetId);
    state.lastExecuted = {
      playerId: targetId,
      revealedRole: state.settings.revealRoleOnDeath ? (target?.role ?? undefined) : undefined,
      spared,
      sparedReason: spared ? sparedReason : null,
    };
    if (!spared) {
      pushDeath(state, targetId, "execution");
    }
  } else {
    state.lastExecuted = null;
  }
  pumpDeathQueue(state);
  if (state.lastExecuted && !spared) {
    recordMediumReading(state);
  }
}

// 仲間内だけで見える短いメモを更新する(周りに悟られず意思疎通するための簡易な手段)。
// グループは「人狼+内通者」「共有者」「恋人」の3種類。該当しないプレイヤーは何もしない。
export function setGroupNote(state: GameState, playerId: string, text: string) {
  const trimmed = text.slice(0, 200);
  if (state.wolfIds.includes(playerId) || state.insiderIds.includes(playerId)) {
    state.groupNotes.wolf = trimmed;
    return;
  }
  if (state.masonIds.includes(playerId)) {
    state.groupNotes.mason = trimmed;
    return;
  }
  if (state.loverIds && state.loverIds.includes(playerId)) {
    state.groupNotes.lover = trimmed;
    return;
  }
}

export function checkWinConditions(state: GameState) {
  const alive = alivePlayers(state);
  // 勝敗判定の頭数ルール(公式ルールに準拠):
  // ・「人狼」としてカウントされるのは人狼カードそのものだけ(裏切り者・内通者は含まない)
  // ・裏切り者/内通者/神様/恋人は、勝敗の頭数計算上は「人間」としてカウントされる
  //   (裏切り者・内通者はチームとしては人狼側で勝つが、頭数には入らない)
  // ・妖狐だけは頭数計算から完全に除外される(人間にも人狼にもカウントしない)
  const aliveWolves = alive.filter((p) => p.role === "werewolf");
  const aliveHumans = alive.filter((p) => p.role !== "werewolf" && p.role !== "fox");

  let primary: WinnerInfo["primary"] | null = null;
  if (aliveWolves.length === 0) {
    primary = "village";
  } else if (aliveWolves.length >= aliveHumans.length) {
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

// ホストが「ゲームを途中で終了する」を選んだ時に呼ぶ。勝敗条件を満たしていなくても、
// その時点で強制的に game_over へ遷移させる。全員の役職は(通常の決着時と同様)
// 結果画面で開示する。hostEnded フラグにより、結果画面は「引き分け」ではなく
// 「ホストがゲームを終了しました」という専用の文言を表示する。
export function endGameEarly(state: GameState) {
  state.winner = {
    primary: "draw",
    extra: [],
    allRoles: state.players.map((p) => ({
      playerId: p.id,
      name: p.name,
      role: (p.role ?? "villager") as RoleId,
    })),
    hostEnded: true,
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
