import { ROLES, type RoleId } from "./roles";
import type { GameState } from "./engine";
import { alivePlayers, getPlayer } from "./engine";
import type { PrivateViewState, PublicGameState, PublicPlayer } from "./types";
import { totalSeats } from "./composition";

function toPublicPlayer(p: GameState["players"][number]): PublicPlayer {
  return { id: p.id, name: p.name, isHost: p.isHost, connected: p.connected, alive: p.alive };
}

export function buildPublicView(state: GameState): PublicGameState {
  let progress: { submitted: number; total: number } | null = null;
  if (state.phase === "role_reveal") {
    const alive = alivePlayers(state);
    progress = { submitted: alive.filter((p) => state.roleAcked.has(p.id)).length, total: alive.length };
  } else if (state.phase === "night") {
    const alive = alivePlayers(state);
    const actorsNeeded = alive.filter(
      (p) => p.role && ROLES[p.role].nightAction !== "none"
    );
    const submittedIds = new Set([
      ...state.attackSubmissions.map((s) => s.actorId),
      ...state.guardSubmissions.map((s) => s.actorId),
      ...state.divineSubmissions.map((s) => s.actorId),
    ]);
    progress = {
      submitted: actorsNeeded.filter((p) => submittedIds.has(p.id)).length,
      total: actorsNeeded.length,
    };
  } else if (state.phase === "vote") {
    const alive = alivePlayers(state);
    progress = { submitted: state.votes.length, total: alive.length };
  }

  let awaitingHunterRevenge: PublicGameState["awaitingHunterRevenge"] = null;
  if (state.awaitingHunterRevenge) {
    const hunter = getPlayer(state, state.awaitingHunterRevenge.hunterId);
    awaitingHunterRevenge = {
      hunterId: state.awaitingHunterRevenge.hunterId,
      hunterName: hunter?.name ?? "?",
    };
  }

  return {
    code: state.code,
    phase: state.phase,
    day: state.day,
    settings: state.settings,
    players: state.players.map(toPublicPlayer),
    lastDeaths: state.lastDeaths,
    lastExecuted: state.lastExecuted,
    voteTally: state.voteTally,
    runoffCandidateIds: state.runoffCandidateIds,
    winner: state.winner,
    phaseEndsAt: state.phaseEndsAt,
    roleCounts: state.roleCounts,
    totalSeats: totalSeats(state.roleCounts),
    dictatorUsed: state.dictatorUsed,
    awaitingHunterRevenge,
    progress,
  };
}

export function buildPrivateView(state: GameState, playerId: string): PrivateViewState {
  const self = getPlayer(state, playerId);
  const role = self?.role ?? null;
  const view: PrivateViewState = {
    self: { id: playerId, role, alive: self?.alive ?? false },
  };
  if (!self || !role) return view;

  view.roleAcked = state.roleAcked.has(playerId);

  const nameOf = (id: string) => getPlayer(state, id)?.name ?? "?";
  const alive = alivePlayers(state);
  const others = alive.filter((p) => p.id !== playerId);

  // 仲間情報
  if (role === "werewolf") {
    view.knownAllies = state.wolfIds
      .filter((id) => id !== playerId)
      .map((id) => ({ id, name: nameOf(id), role: "werewolf" as RoleId }));
  }
  if (role === "insider") {
    view.knownAllies = state.wolfIds.map((id) => ({ id, name: nameOf(id), role: "werewolf" as RoleId }));
  }
  if (role === "mason") {
    view.knownAllies = state.masonIds
      .filter((id) => id !== playerId)
      .map((id) => ({ id, name: nameOf(id), role: "mason" as RoleId }));
  }
  if (role === "lover" && state.loverIds) {
    const partnerId = state.loverIds.find((id) => id !== playerId);
    if (partnerId) {
      view.knownAllies = [{ id: partnerId, name: nameOf(partnerId), role: "lover" as RoleId }];
    }
  }
  if (role === "god") {
    view.allRolesKnown = state.players.map((p) => ({
      id: p.id,
      name: p.name,
      role: (p.role ?? "villager") as RoleId,
    }));
  }

  // 予言結果・霊媒結果(自分のログのみ)
  if (role === "seer") {
    const logs = state.seerLogs.filter((l) => l.seerId === playerId);
    const latest = logs[logs.length - 1];
    if (latest) {
      view.seerResult = {
        day: latest.day,
        targetId: latest.targetId,
        targetName: nameOf(latest.targetId),
        isBlack: latest.isBlack,
      };
    }
  }
  if (role === "medium") {
    const logs = state.mediumLogs.filter((l) => l.mediumId === playerId);
    const latest = logs[logs.length - 1];
    if (latest) {
      view.mediumResult = {
        day: latest.day,
        targetId: latest.targetId,
        targetName: nameOf(latest.targetId),
        isBlack: latest.isBlack,
      };
    }
  }

  // 独裁者(最初の昼(議論のみ、day===0)では発動できない)
  if (role === "dictator") {
    view.canUseDictator =
      !!self.alive && !state.dictatorUsed && state.phase === "discussion" && state.day > 0;
  }

  // 夜アクション
  if (state.phase === "night" && self.alive && role) {
    const nightAction = ROLES[role].nightAction;
    if (nightAction !== "none") {
      let submitted = false;
      let candidates = others;
      if (nightAction === "attack") {
        submitted = state.attackSubmissions.some((s) => s.actorId === playerId);
        candidates = others.filter((p) => !state.wolfIds.includes(p.id));
      } else if (nightAction === "guard") {
        submitted = state.guardSubmissions.some((s) => s.actorId === playerId);
        const lastGuarded = state.previousGuardTargets[playerId];
        if (lastGuarded) candidates = others.filter((p) => p.id !== lastGuarded);
      } else if (nightAction === "divine") {
        submitted = state.divineSubmissions.some((s) => s.actorId === playerId);
      }
      view.pendingNightAction = {
        type: nightAction,
        candidates: candidates.map(toPublicPlayer),
        submitted,
      };
    }
  }

  // ハンターの道連れ
  if (state.awaitingHunterRevenge && state.awaitingHunterRevenge.hunterId === playerId) {
    view.pendingHunterRevenge = { candidates: others.map(toPublicPlayer) };
  } else {
    view.pendingHunterRevenge = null;
  }

  // 投票
  if (state.phase === "vote") {
    view.hasVoted = state.votes.some((v) => v.voterId === playerId);
  }

  return view;
}
