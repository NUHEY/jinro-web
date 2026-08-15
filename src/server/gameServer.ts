import type { Server, Socket } from "socket.io";
import { nanoid } from "nanoid";
import type { ClientToServerEvents, ServerToClientEvents } from "@/lib/socket/events";
import {
  type GameState,
  DEFAULT_SETTINGS,
  createLobbyState,
  assignRolesAndStart,
  resetToLobby,
  startFirstDiscussion,
  startNight,
  submitAttack,
  submitGuard,
  submitDivine,
  submitEarlyDivine,
  resolveNight,
  submitHunterRevenge,
  startDiscussion,
  startVote,
  submitVote,
  resolveVote,
  proceedToAppealVote,
  submitAppealVote,
  resolveAppealVote,
  setGroupNote,
  dictatorExecute,
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
  manualComposition: boolean;
  lastActivity: number;
}

type IOServer = Server<ClientToServerEvents, ServerToClientEvents>;
type IOSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

const rooms = new Map<string, RoomRuntime>();

const MAX_NAME_LENGTH = 16;
const CUSTOM_CODE_PATTERN = /^[A-Z0-9]{5,8}$/;

function sanitizeName(raw: string): string {
  const trimmed = (raw || "").trim().slice(0, MAX_NAME_LENGTH);
  return trimmed.length > 0 ? trimmed : "Player";
}

// 進行(司会)は完全に「自分たちのペース」: サーバー側は強制タイマーを一切持たない。
// 各フェーズは (a) 必要な全員の行動が揃ったら自動的に次へ進む(=待たされる側は自分の速さで
// 操作すればよい)か、(b) ホストが手動で「進める」ボタンを押した時だけ進む。
// 一定時間で勝手にページが切り替わる、ということは起こらない。
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

  function afterResolution(room: RoomRuntime) {
    // resolveNight / resolveVote / dictatorExecute の後に呼ぶ。
    // ハンターの道連れ待ちがあれば、そのままハンターの選択を待つ(タイムアウトなし)。
    broadcast(room);
  }

  // resolveVote() の後に呼ぶ。同数タイで決選投票前の話し合いへ戻った場合は
  // 単にブロードキャストするだけでよい(タイマーの再設定は不要)。
  function afterVoteResolution(room: RoomRuntime) {
    broadcast(room);
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

  // 生存決選投票: 対象者本人を除く生存者全員が投票し終えたら自動的に集計する
  function maybeAutoResolveAppealVote(room: RoomRuntime) {
    if (room.state.phase !== "appeal_vote" || !room.state.pendingExecution) return;
    const alive = alivePlayers(room.state);
    const eligible = alive.filter((p) => p.id !== room.state.pendingExecution?.targetId);
    if (eligible.length > 0 && room.state.appealVotes.length >= eligible.length) {
      resolveAppealVote(room.state);
      afterResolution(room);
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
      touch(room);
      cb?.({ ok: true });
      broadcast(room);
    });

    // ホストの「進める」操作。タイマーは存在しないため、これと各フェーズの完了条件
    // (全員の行動が揃う)だけが唯一の進行トリガー。
    socket.on("host:advance", ({ to }) => {
      if (!currentCode || !currentPlayerId) return;
      const room = findRoom(currentCode);
      if (!room || !ensureHost(room, currentPlayerId)) return;
      const phase = room.state.phase;
      const day = room.state.day;

      if (to === "discussion" && phase === "role_reveal") {
        // 役職確認 → 最初の昼(議論のみ、まだ誰も襲撃されない)。
        // 全員が役職確認ボタンを押すまでは、ホストでも進めることはできない。
        if (!allAliveAcked(room.state)) return;
        startFirstDiscussion(room.state);
        broadcast(room);
      } else if (to === "discussion" && phase === "day_result") {
        startDiscussion(room.state);
        broadcast(room);
      } else if (to === "night" && phase === "discussion" && day === 0) {
        // 最初の昼(議論) → 本当の「夜」(ここで初めて人狼の襲撃などが発生する)
        startNight(room.state);
        broadcast(room);
      } else if (to === "night" && phase === "execution_result") {
        startNight(room.state);
        broadcast(room);
      } else if (to === "vote" && phase === "discussion" && day > 0) {
        startVote(room.state);
        broadcast(room);
      }
      touch(room);
    });

    // ホストが「全員の行動を待たずに今の夜を締め切る」。未提出者は「何もしない」扱い。
    socket.on("host:forceResolveNight", () => {
      if (!currentCode || !currentPlayerId) return;
      const room = findRoom(currentCode);
      if (!room || !ensureHost(room, currentPlayerId)) return;
      if (room.state.phase !== "night" || room.state.awaitingHunterRevenge) return;
      resolveNight(room.state);
      touch(room);
      afterResolution(room);
    });

    // ホストが「全員の投票を待たずに今の投票を締め切る」。未投票者はカウントされない。
    socket.on("host:forceResolveVote", () => {
      if (!currentCode || !currentPlayerId) return;
      const room = findRoom(currentCode);
      if (!room || !ensureHost(room, currentPlayerId)) return;
      if (room.state.phase !== "vote") return;
      resolveVote(room.state);
      touch(room);
      afterVoteResolution(room);
    });

    // ホストが「全員の生存決選投票を待たずに締め切る」。未投票者はカウントされない。
    socket.on("host:forceResolveAppealVote", () => {
      if (!currentCode || !currentPlayerId) return;
      const room = findRoom(currentCode);
      if (!room || !ensureHost(room, currentPlayerId)) return;
      if (room.state.phase !== "appeal_vote" || !room.state.pendingExecution) return;
      resolveAppealVote(room.state);
      touch(room);
      afterResolution(room);
    });

    // 「最後の一言」フェーズから生存決選投票フェーズへ進む。
    // 対象者本人・ホストのどちらでも進められる(タイマーなし)。
    socket.on("lastWords:proceed", () => {
      if (!currentCode || !currentPlayerId) return;
      const room = findRoom(currentCode);
      if (!room || room.state.phase !== "last_words" || !room.state.pendingExecution) return;
      const isHost = ensureHost(room, currentPlayerId);
      const isTarget = room.state.pendingExecution.targetId === currentPlayerId;
      if (!isHost && !isTarget) return;
      proceedToAppealVote(room.state);
      touch(room);
      broadcast(room);
    });

    // ホストが、応答のないハンターの代わりに「道連れなし」を選ぶ。
    socket.on("host:skipHunterRevenge", () => {
      if (!currentCode || !currentPlayerId) return;
      const room = findRoom(currentCode);
      if (!room || !ensureHost(room, currentPlayerId)) return;
      const hunterId = room.state.awaitingHunterRevenge?.hunterId;
      if (!hunterId) return;
      submitHunterRevenge(room.state, hunterId, null);
      touch(room);
      afterResolution(room);
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
        // 全員が確認を終えたら、自動的に「最初の昼(議論のみ)」へ進む
        startFirstDiscussion(room.state);
      }
      broadcast(room);
    });

    // 発展ルール: 予言者が役職確認のタイミングで1人を占う(設定でON時のみ)
    socket.on("seer:earlyDivine", ({ targetId }) => {
      if (!currentCode || !currentPlayerId) return;
      const room = findRoom(currentCode);
      if (!room || room.state.phase !== "role_reveal" || !room.state.settings.seerFirstNightDivine) return;
      const player = getPlayer(room.state, currentPlayerId);
      if (!player || player.role !== "seer") return;
      const target = getPlayer(room.state, targetId);
      if (!target || target.id === currentPlayerId) return;
      submitEarlyDivine(room.state, currentPlayerId, targetId);
      touch(room);
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
        if (
          action === "guard" &&
          room.state.previousGuardTargets[currentPlayerId] === target.id
        ) {
          return; // 二夜続けて同じ人物を守ることはできない
        }
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

    // 生存決選投票: 追放対象になっている本人は投票できない
    socket.on("appeal:submit", ({ choice }) => {
      if (!currentCode || !currentPlayerId) return;
      const room = findRoom(currentCode);
      if (!room || room.state.phase !== "appeal_vote" || !room.state.pendingExecution) return;
      const player = getPlayer(room.state, currentPlayerId);
      if (!player || !player.alive) return;
      if (room.state.pendingExecution.targetId === currentPlayerId) return;
      if (choice !== "execute" && choice !== "spare") return;
      submitAppealVote(room.state, currentPlayerId, choice);
      touch(room);
      broadcast(room);
      maybeAutoResolveAppealVote(room);
    });

    // 仲間内だけで見える短いメモの更新(周りに悟られず意思疎通するための簡易な手段)。
    // チャットログではなく1本のメモを都度上書きする方式(不自然な連続タイピングを避けるため)。
    socket.on("ally:setNote", ({ text }) => {
      if (!currentCode || !currentPlayerId) return;
      const room = findRoom(currentCode);
      if (!room) return;
      const player = getPlayer(room.state, currentPlayerId);
      if (!player || !player.alive) return;
      setGroupNote(room.state, currentPlayerId, typeof text === "string" ? text : "");
      touch(room);
      broadcast(room);
    });

    socket.on("dictator:act", ({ targetId }) => {
      if (!currentCode || !currentPlayerId) return;
      const room = findRoom(currentCode);
      if (!room || room.state.phase !== "discussion" || room.state.day === 0) return;
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
        rooms.delete(code);
      }
    }
  }, 10 * 60 * 1000);
}
