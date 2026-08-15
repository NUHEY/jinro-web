import type { Server, Socket } from "socket.io";
import { nanoid } from "nanoid";
import type { ClientToServerEvents, ServerToClientEvents } from "@/lib/socket/events";
import {
  type GameState,
  DEFAULT_SETTINGS,
  createLobbyState,
  assignRolesAndStart,
  resetToLobby,
  startNight,
  submitAttack,
  submitGuard,
  submitDivine,
  resolveNight,
  submitHunterRevenge,
  startDiscussion,
  startVote,
  submitVote,
  resolveVote,
  dictatorExecute,
  extendDiscussion,
  ackRole,
  allAliveAcked,
  alivePlayers,
  getPlayer,
  newRoomCode,
  newPlayerId,
  ROLES,
} from "@/lib/game/engine";
import { buildPublicView, buildPrivateView } from "@/lib/game/views";
import { validateComposition, suggestComposition, MIN_PLAYERS, MAX_PLAYERS } from "@/lib/game/composition";
import type { RoleCounts } from "@/lib/game/types";

interface RoomRuntime {
  state: GameState;
  tokens: Map<string, string>; // playerId -> token
  socketOf: Map<string, string>; // playerId -> socketId
  playerOf: Map<string, string>; // socketId -> playerId
  timer: NodeJS.Timeout | null;
  hunterTimer: NodeJS.Timeout | null;
  manualComposition: boolean;
  lastActivity: number;
}

type IOServer = Server<ClientToServerEvents, ServerToClientEvents>;
type IOSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

const rooms = new Map<string, RoomRuntime>();

const HUNTER_REVENGE_TIMEOUT_MS = 45_000;
const MAX_NAME_LENGTH = 16;
const DISCUSSION_EXTEND_SECONDS = 60; // ホストの「話し合いを延長する」1回あたりの追加秒数(回数無制限)
const CUSTOM_CODE_PATTERN = /^[A-Z0-9]{5,8}$/;

function sanitizeName(raw: string): string {
  const trimmed = (raw || "").trim().slice(0, MAX_NAME_LENGTH);
  return trimmed.length > 0 ? trimmed : "Player";
}

export function attachGameServer(io: IOServer) {
  function touch(room: RoomRuntime) {
    room.lastActivity = Date.now();
  }

  function broadcast(room: RoomRuntime) {
    const publicView = buildPublicView(room.state);
    io.to(room.state.code).emit("state:public", publicView);
    for (const player of room.state.players) {
      const socketId = room.socketOf.get(player.id);
      if (!socketId) continue;
      const privateView = buildPrivateView(room.state, player.id);
      io.to(socketId).emit("state:private", privateView);
    }
  }

  function clearTimer(room: RoomRuntime) {
    if (room.timer) {
      clearTimeout(room.timer);
      room.timer = null;
    }
  }

  function clearHunterTimer(room: RoomRuntime) {
    if (room.hunterTimer) {
      clearTimeout(room.hunterTimer);
      room.hunterTimer = null;
    }
  }

  // 進行(司会)は完全自動: 各フェーズの終了条件(タイマー満了 or 全員の行動完了)を
  // サーバー側で監視し、次のフェーズへ自動的に進める。ホストのボタンは「今すぐ進める」
  // というショートカット操作としてのみ機能する(必須ではない)。

  function scheduleRoleRevealTimeout(room: RoomRuntime) {
    clearTimer(room);
    room.timer = setTimeout(() => {
      if (room.state.phase === "role_reveal") {
        startNight(room.state);
        scheduleNightTimeout(room);
        broadcast(room);
      }
    }, room.state.settings.roleRevealSeconds * 1000);
  }

  function scheduleNightTimeout(room: RoomRuntime) {
    clearTimer(room);
    room.timer = setTimeout(() => {
      if (room.state.phase === "night" && !room.state.awaitingHunterRevenge) {
        resolveNight(room.state);
        afterResolution(room);
      }
    }, room.state.settings.nightSeconds * 1000);
  }

  function scheduleDayResultTimeout(room: RoomRuntime) {
    clearTimer(room);
    room.timer = setTimeout(() => {
      if (room.state.phase === "day_result") {
        startDiscussion(room.state);
        scheduleDiscussionTimeout(room);
        broadcast(room);
      }
    }, room.state.settings.resultPauseSeconds * 1000);
  }

  function scheduleDiscussionTimeout(room: RoomRuntime) {
    clearTimer(room);
    // phaseEndsAt基準で遅延を計算する(延長ボタンで押し戻された終了時刻にも追従できるように)
    const fallback = Date.now() + room.state.settings.discussionSeconds * 1000;
    const delay = Math.max(0, (room.state.phaseEndsAt ?? fallback) - Date.now());
    room.timer = setTimeout(() => {
      if (room.state.phase === "discussion") {
        startVote(room.state);
        scheduleVoteTimeout(room);
        broadcast(room);
      }
    }, delay);
  }

  function scheduleVoteTimeout(room: RoomRuntime) {
    clearTimer(room);
    room.timer = setTimeout(() => {
      if (room.state.phase === "vote") {
        resolveVote(room.state);
        afterVoteResolution(room);
      }
    }, room.state.settings.voteSeconds * 1000);
  }

  function scheduleExecutionResultTimeout(room: RoomRuntime) {
    clearTimer(room);
    room.timer = setTimeout(() => {
      if (room.state.phase === "execution_result") {
        startNight(room.state);
        scheduleNightTimeout(room);
        broadcast(room);
      }
    }, room.state.settings.resultPauseSeconds * 1000);
  }

  function afterResolution(room: RoomRuntime) {
    // resolveNight / resolveVote / dictatorExecute の後に呼ぶ。
    clearTimer(room);
    clearHunterTimer(room);
    if (room.state.awaitingHunterRevenge) {
      room.hunterTimer = setTimeout(() => {
        const hunterId = room.state.awaitingHunterRevenge?.hunterId;
        if (!hunterId) return;
        submitHunterRevenge(room.state, hunterId, null);
        afterResolution(room);
        broadcast(room);
      }, HUNTER_REVENGE_TIMEOUT_MS);
    } else if (room.state.phase === "day_result") {
      scheduleDayResultTimeout(room);
    } else if (room.state.phase === "execution_result") {
      scheduleExecutionResultTimeout(room);
    }
    broadcast(room);
  }

  // resolveVote() の後に呼ぶ。同数タイで決選投票前の話し合いへ戻った場合(phaseが
  // "discussion"に変わっている)は、その話し合いフェーズのタイマーを仕掛け直す。
  // それ以外(執行 or ハンター道連れ待ち)は通常のafterResolutionに委ねる。
  function afterVoteResolution(room: RoomRuntime) {
    if (room.state.phase === "discussion") {
      clearTimer(room);
      clearHunterTimer(room);
      scheduleDiscussionTimeout(room);
      broadcast(room);
      return;
    }
    afterResolution(room);
  }

  function maybeAutoResolveNight(room: RoomRuntime) {
    const alive = alivePlayers(room.state);
    const actors = alive.filter((p) => p.role && ROLES[p.role].nightAction !== "none");
    const submittedIds = new Set([
      ...room.state.attackSubmissions.map((s) => s.actorId),
      ...room.state.guardSubmissions.map((s) => s.actorId),
      ...room.state.divineSubmissions.map((s) => s.actorId),
    ]);
    if (actors.length > 0 && actors.every((p) => submittedIds.has(p.id))) {
      resolveNight(room.state);
      afterResolution(room);
    }
  }

  function maybeAutoResolveVote(room: RoomRuntime) {
    const alive = alivePlayers(room.state);
    if (alive.length > 0 && room.state.votes.length >= alive.length) {
      resolveVote(room.state);
      afterVoteResolution(room);
    }
  }

  function refreshSuggestedComposition(room: RoomRuntime) {
    if (room.manualComposition) return;
    if (room.state.phase !== "lobby") return;
    room.state.roleCounts = suggestComposition(room.state.players.length);
  }

  function findRoom(code: string): RoomRuntime | undefined {
    return rooms.get((code || "").toUpperCase().trim());
  }

  function ensureHost(room: RoomRuntime, playerId: string): boolean {
    const player = getPlayer(room.state, playerId);
    return !!player && player.isHost;
  }

  function reassignHostIfNeeded(room: RoomRuntime) {
    const hasHost = room.state.players.some((p) => p.isHost);
    if (hasHost) return;
    const nextHost = room.state.players.find((p) => p.connected) ?? room.state.players[0];
    if (nextHost) nextHost.isHost = true;
  }

  io.on("connection", (socket: IOSocket) => {
    let currentCode: string | null = null;
    let currentPlayerId: string | null = null;

    socket.on("room:create", ({ playerName, code: requestedCode }, cb) => {
      let code: string;
      const trimmedRequested = (requestedCode || "").trim().toUpperCase();
      if (trimmedRequested.length > 0) {
        if (!CUSTOM_CODE_PATTERN.test(trimmedRequested)) {
          return cb({ ok: false, errorCode: "INVALID_ROOM_CODE" });
        }
        if (rooms.has(trimmedRequested)) {
          return cb({ ok: false, errorCode: "ROOM_CODE_TAKEN" });
        }
        code = trimmedRequested;
      } else {
        code = newRoomCode();
        while (rooms.has(code)) code = newRoomCode();
      }

      const state = createLobbyState(code, { ...DEFAULT_SETTINGS });
      const playerId = newPlayerId();
      const token = nanoid(24);
      state.players.push({
        id: playerId,
        name: sanitizeName(playerName),
        isHost: true,
        connected: true,
        alive: true,
        role: null,
        joinedAt: Date.now(),
      });

      const room: RoomRuntime = {
        state,
        tokens: new Map([[playerId, token]]),
        socketOf: new Map([[playerId, socket.id]]),
        playerOf: new Map([[socket.id, playerId]]),
        timer: null,
        hunterTimer: null,
        manualComposition: false,
        lastActivity: Date.now(),
      };
      refreshSuggestedComposition(room);
      rooms.set(code, room);

      currentCode = code;
      currentPlayerId = playerId;
      socket.join(code);
      cb({ ok: true, code, playerId, token });
      broadcast(room);
    });

    socket.on("room:join", ({ code, playerName }, cb) => {
      const room = findRoom(code);
      if (!room) return cb({ ok: false, errorCode: "ROOM_NOT_FOUND" });
      if (room.state.phase !== "lobby") {
        return cb({ ok: false, errorCode: "GAME_ALREADY_STARTED" });
      }
      if (room.state.players.length >= MAX_PLAYERS) {
        return cb({ ok: false, errorCode: "ROOM_FULL" });
      }

      const playerId = newPlayerId();
      const token = nanoid(24);
      room.state.players.push({
        id: playerId,
        name: sanitizeName(playerName),
        isHost: false,
        connected: true,
        alive: true,
        role: null,
        joinedAt: Date.now(),
      });
      room.tokens.set(playerId, token);
      room.socketOf.set(playerId, socket.id);
      room.playerOf.set(socket.id, playerId);
      refreshSuggestedComposition(room);
      touch(room);

      currentCode = room.state.code;
      currentPlayerId = playerId;
      socket.join(room.state.code);
      cb({ ok: true, code: room.state.code, playerId, token });
      broadcast(room);
    });

    socket.on("room:rejoin", ({ code, playerId, token }, cb) => {
      const room = findRoom(code);
      if (!room) return cb({ ok: false, errorCode: "ROOM_NOT_FOUND" });
      const expectedToken = room.tokens.get(playerId);
      if (!expectedToken || expectedToken !== token) {
        return cb({ ok: false, errorCode: "REJOIN_FAILED" });
      }
      const player = getPlayer(room.state, playerId);
      if (!player) return cb({ ok: false, errorCode: "PLAYER_NOT_FOUND" });

      const oldSocketId = room.socketOf.get(playerId);
      if (oldSocketId) room.playerOf.delete(oldSocketId);
      room.socketOf.set(playerId, socket.id);
      room.playerOf.set(socket.id, playerId);
      player.connected = true;
      reassignHostIfNeeded(room);
      touch(room);

      currentCode = room.state.code;
      currentPlayerId = playerId;
      socket.join(room.state.code);
      cb({ ok: true });
      broadcast(room);
    });

    socket.on("room:leave", (_payload, cb) => {
      if (currentCode && currentPlayerId) {
        const room = findRoom(currentCode);
        if (room) {
          if (room.state.phase === "lobby") {
            room.state.players = room.state.players.filter((p) => p.id !== currentPlayerId);
            room.tokens.delete(currentPlayerId);
            room.socketOf.delete(currentPlayerId);
            room.playerOf.delete(socket.id);
            reassignHostIfNeeded(room);
            refreshSuggestedComposition(room);
          } else {
            const player = getPlayer(room.state, currentPlayerId);
            if (player) player.connected = false;
            reassignHostIfNeeded(room);
          }
          touch(room);
          broadcast(room);
        }
      }
      socket.leave(currentCode ?? "");
      currentCode = null;
      currentPlayerId = null;
      cb?.({ ok: true });
    });

    socket.on("room:kick", ({ targetId }) => {
      if (!currentCode || !currentPlayerId) return;
      const room = findRoom(currentCode);
      if (!room || !ensureHost(room, currentPlayerId)) return;
      if (room.state.phase !== "lobby") return; // ゲーム中の追い出しは配役が壊れるため不可
      room.state.players = room.state.players.filter((p) => p.id !== targetId);
      const targetSocket = room.socketOf.get(targetId);
      if (targetSocket) {
        io.to(targetSocket).emit("room:kicked");
        room.playerOf.delete(targetSocket);
      }
      room.tokens.delete(targetId);
      room.socketOf.delete(targetId);
      refreshSuggestedComposition(room);
      touch(room);
      broadcast(room);
    });

    // ホスト権限を他の参加者に譲渡する(ロビー中に限らずいつでも可能)
    socket.on("room:transferHost", ({ targetId }) => {
      if (!currentCode || !currentPlayerId) return;
      const room = findRoom(currentCode);
      if (!room || !ensureHost(room, currentPlayerId)) return;
      if (targetId === currentPlayerId) return;
      const target = getPlayer(room.state, targetId);
      if (!target || !target.connected) return;
      const current = getPlayer(room.state, currentPlayerId);
      if (current) current.isHost = false;
      target.isHost = true;
      touch(room);
      broadcast(room);
    });

    socket.on("room:updateSettings", ({ settings }) => {
      if (!currentCode || !currentPlayerId) return;
      const room = findRoom(currentCode);
      if (!room || !ensureHost(room, currentPlayerId) || room.state.phase !== "lobby") return;
      room.state.settings = { ...room.state.settings, ...settings };
      touch(room);
      broadcast(room);
    });

    socket.on("room:updateComposition", ({ roleCounts }) => {
      if (!currentCode || !currentPlayerId) return;
      const room = findRoom(currentCode);
      if (!room || !ensureHost(room, currentPlayerId) || room.state.phase !== "lobby") return;
      const cleaned: RoleCounts = {};
      for (const [role, count] of Object.entries(roleCounts)) {
        if (typeof count === "number" && count >= 0) cleaned[role] = Math.floor(count);
      }
      room.manualComposition = true;
      room.state.roleCounts = cleaned;
      touch(room);
      broadcast(room);
    });

    socket.on("room:start", (_payload, cb) => {
      if (!currentCode || !currentPlayerId) return cb?.({ ok: false, errorCode: "NOT_IN_ROOM" });
      const room = findRoom(currentCode);
      if (!room || !ensureHost(room, currentPlayerId)) return cb?.({ ok: false, errorCode: "NOT_HOST" });
      if (room.state.phase !== "lobby") return cb?.({ ok: false, errorCode: "ALREADY_STARTED" });
      const n = room.state.players.length;
      if (n < MIN_PLAYERS) return cb?.({ ok: false, errorCode: "MIN_PLAYERS" });
      const { valid, issues } = validateComposition(room.state.roleCounts, n);
      if (!valid) return cb?.({ ok: false, errorCode: "INVALID_COMPOSITION", issues });

      assignRolesAndStart(room.state, room.state.roleCounts);
      scheduleRoleRevealTimeout(room);
      touch(room);
      cb?.({ ok: true });
      broadcast(room);
    });

    // ホストの「今すぐ進める」ショートカット。進行は自動なので必須ではない。
    socket.on("host:advance", ({ to }) => {
      if (!currentCode || !currentPlayerId) return;
      const room = findRoom(currentCode);
      if (!room || !ensureHost(room, currentPlayerId)) return;
      const phase = room.state.phase;

      if (to === "night" && (phase === "role_reveal" || phase === "day_result" || phase === "execution_result")) {
        startNight(room.state);
        scheduleNightTimeout(room);
        broadcast(room);
      } else if (to === "discussion" && phase === "day_result") {
        startDiscussion(room.state);
        scheduleDiscussionTimeout(room);
        broadcast(room);
      } else if (to === "vote" && phase === "discussion") {
        startVote(room.state);
        scheduleVoteTimeout(room);
        broadcast(room);
      }
      touch(room);
    });

    // ホストが議論タイムを+60秒延長する。回数の上限はなく、何度でも押せる。
    socket.on("discussion:extend", () => {
      if (!currentCode || !currentPlayerId) return;
      const room = findRoom(currentCode);
      if (!room || !ensureHost(room, currentPlayerId) || room.state.phase !== "discussion") return;
      extendDiscussion(room.state, DISCUSSION_EXTEND_SECONDS);
      scheduleDiscussionTimeout(room);
      touch(room);
      broadcast(room);
    });

    socket.on("role:ack", () => {
      if (!currentCode || !currentPlayerId) return;
      const room = findRoom(currentCode);
      if (!room || room.state.phase !== "role_reveal") return;
      const player = getPlayer(room.state, currentPlayerId);
      if (!player) return;
      ackRole(room.state, currentPlayerId);
      touch(room);
      if (allAliveAcked(room.state)) {
        startNight(room.state);
        scheduleNightTimeout(room);
      }
      broadcast(room);
    });

    socket.on("night:submit", ({ targetId }) => {
      if (!currentCode || !currentPlayerId) return;
      const room = findRoom(currentCode);
      if (!room || room.state.phase !== "night") return;
      const player = getPlayer(room.state, currentPlayerId);
      if (!player || !player.alive || !player.role) return;
      const action = ROLES[player.role].nightAction;
      if (action === "none") return;
      if (targetId) {
        const target = getPlayer(room.state, targetId);
        if (!target || !target.alive || target.id === currentPlayerId) return;
        if (action === "attack" && room.state.wolfIds.includes(target.id)) return;
      }
      if (action === "attack") submitAttack(room.state, currentPlayerId, targetId);
      else if (action === "guard") submitGuard(room.state, currentPlayerId, targetId);
      else if (action === "divine") submitDivine(room.state, currentPlayerId, targetId);
      touch(room);
      broadcast(room);
      maybeAutoResolveNight(room);
    });

    socket.on("hunter:revenge", ({ targetId }) => {
      if (!currentCode || !currentPlayerId) return;
      const room = findRoom(currentCode);
      if (!room || !room.state.awaitingHunterRevenge) return;
      if (room.state.awaitingHunterRevenge.hunterId !== currentPlayerId) return;
      submitHunterRevenge(room.state, currentPlayerId, targetId);
      touch(room);
      afterResolution(room);
    });

    socket.on("vote:submit", ({ targetId }) => {
      if (!currentCode || !currentPlayerId) return;
      const room = findRoom(currentCode);
      if (!room || room.state.phase !== "vote") return;
      const player = getPlayer(room.state, currentPlayerId);
      const target = getPlayer(room.state, targetId);
      if (!player || !player.alive || !target || !target.alive) return;
      if (room.state.runoffCandidateIds && !room.state.runoffCandidateIds.includes(targetId)) return;
      submitVote(room.state, currentPlayerId, targetId);
      touch(room);
      broadcast(room);
      maybeAutoResolveVote(room);
    });

    socket.on("dictator:act", ({ targetId }) => {
      if (!currentCode || !currentPlayerId) return;
      const room = findRoom(currentCode);
      if (!room || room.state.phase !== "discussion") return;
      const player = getPlayer(room.state, currentPlayerId);
      if (!player || player.role !== "dictator" || room.state.dictatorUsed) return;
      const target = getPlayer(room.state, targetId);
      if (!target || !target.alive) return;
      dictatorExecute(room.state, currentPlayerId, targetId);
      touch(room);
      afterResolution(room);
    });

    socket.on("host:newGame", () => {
      if (!currentCode || !currentPlayerId) return;
      const room = findRoom(currentCode);
      if (!room || !ensureHost(room, currentPlayerId)) return;
      if (room.state.phase !== "game_over") return;
      clearTimer(room);
      clearHunterTimer(room);
      resetToLobby(room.state);
      room.manualComposition = false;
      refreshSuggestedComposition(room);
      touch(room);
      broadcast(room);
    });

    socket.on("disconnect", () => {
      if (!currentCode || !currentPlayerId) return;
      const room = findRoom(currentCode);
      if (!room) return;
      const player = getPlayer(room.state, currentPlayerId);
      if (player) player.connected = false;
      room.playerOf.delete(socket.id);
      reassignHostIfNeeded(room);
      touch(room);
      broadcast(room);
    });
  });

  // 長時間放置された空部屋を定期的に掃除する
  setInterval(() => {
    const now = Date.now();
    for (const [code, room] of rooms.entries()) {
      const anyConnected = room.state.players.some((p) => p.connected);
      if (!anyConnected && now - room.lastActivity > 2 * 60 * 60 * 1000) {
        clearTimer(room);
        clearHunterTimer(room);
        rooms.delete(code);
      }
    }
  }, 10 * 60 * 1000);
}
