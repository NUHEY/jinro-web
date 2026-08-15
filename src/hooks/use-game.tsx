"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getSocket } from "@/lib/socket/client";
import { clearSession, loadSession, saveLastName, saveSession, type StoredSession } from "@/lib/session";
import type {
  AppealChoice,
  PrivateViewState,
  PublicGameState,
  RoleCounts,
  RoomSettings,
} from "@/lib/game/types";
import type { StartResult } from "@/lib/socket/events";
import { useLocale } from "@/lib/i18n/locale-context";
import type { ErrorCode } from "@/lib/i18n/strings";

interface GameContextValue {
  status: "connecting" | "entry" | "in_room";
  connected: boolean;
  session: StoredSession | null;
  publicState: PublicGameState | null;
  privateState: PrivateViewState | null;
  error: string | null;
  clearError: () => void;
  createRoom: (name: string, code?: string) => Promise<void>;
  joinRoom: (code: string, name: string) => Promise<void>;
  leaveRoom: () => void;
  kick: (targetId: string) => void;
  transferHost: (targetId: string) => void;
  updateSettings: (settings: Partial<RoomSettings>) => void;
  updateComposition: (roleCounts: RoleCounts) => void;
  startGame: () => Promise<StartResult>;
  advance: (to: "night" | "discussion" | "vote") => void;
  forceResolveNight: () => void;
  forceResolveVote: () => void;
  forceResolveAppealVote: () => void;
  skipHunterRevenge: () => void;
  ackRole: () => void;
  earlyDivine: (targetId: string) => void;
  submitNight: (targetId: string | null) => void;
  hunterRevenge: (targetId: string | null) => void;
  vote: (targetId: string) => void;
  dictatorAct: (targetId: string) => void;
  proceedFromLastWords: () => void;
  submitAppeal: (choice: AppealChoice) => void;
  setAllyNote: (text: string) => void;
  newGame: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const { t } = useLocale();
  const [status, setStatus] = useState<GameContextValue["status"]>("connecting");
  const [connected, setConnected] = useState(false);
  const [session, setSession] = useState<StoredSession | null>(null);
  const [publicState, setPublicState] = useState<PublicGameState | null>(null);
  const [privateState, setPrivateState] = useState<PrivateViewState | null>(null);
  const [errorCode, setErrorCode] = useState<ErrorCode | null>(null);
  const attemptedRejoin = useRef(false);

  useEffect(() => {
    const socket = getSocket();

    function onConnect() {
      setConnected(true);
      const saved = loadSession();
      if (saved && !attemptedRejoin.current) {
        attemptedRejoin.current = true;
        socket.emit("room:rejoin", saved, (res) => {
          if (res.ok) {
            setSession(saved);
            setStatus("in_room");
          } else {
            clearSession();
            setStatus("entry");
          }
        });
      } else if (!saved) {
        setStatus("entry");
      }
    }
    function onDisconnect() {
      setConnected(false);
    }
    function onPublic(state: PublicGameState) {
      setPublicState(state);
    }
    function onPrivate(state: PrivateViewState) {
      setPrivateState(state);
    }
    function onError(payload: { errorCode: ErrorCode }) {
      setErrorCode(payload.errorCode);
    }
    function onKicked() {
      clearSession();
      setSession(null);
      setPublicState(null);
      setPrivateState(null);
      setStatus("entry");
      setErrorCode("KICKED");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("state:public", onPublic);
    socket.on("state:private", onPrivate);
    socket.on("room:error", onError);
    socket.on("room:kicked", onKicked);

    if (socket.connected) onConnect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("state:public", onPublic);
      socket.off("state:private", onPrivate);
      socket.off("room:error", onError);
      socket.off("room:kicked", onKicked);
    };
  }, []);

  const clearError = useCallback(() => setErrorCode(null), []);

  const createRoom = useCallback(
    async (name: string, code?: string) => {
      saveLastName(name);
      const socket = getSocket();
      await new Promise<void>((resolve) => {
        socket.emit("room:create", { playerName: name, code }, (res) => {
          if (res.ok) {
            const s = { code: res.code, playerId: res.playerId, token: res.token, name };
            saveSession(s);
            setSession(s);
            setStatus("in_room");
          } else {
            setErrorCode(res.errorCode);
          }
          resolve();
        });
      });
    },
    []
  );

  const joinRoom = useCallback(async (code: string, name: string) => {
    saveLastName(name);
    const socket = getSocket();
    await new Promise<void>((resolve) => {
      socket.emit("room:join", { code, playerName: name }, (res) => {
        if (res.ok) {
          const s = { code: res.code, playerId: res.playerId, token: res.token, name };
          saveSession(s);
          setSession(s);
          setStatus("in_room");
        } else {
          setErrorCode(res.errorCode);
        }
        resolve();
      });
    });
  }, []);

  const leaveRoom = useCallback(() => {
    const socket = getSocket();
    socket.emit("room:leave", {});
    clearSession();
    setSession(null);
    setPublicState(null);
    setPrivateState(null);
    setStatus("entry");
  }, []);

  const kick = useCallback((targetId: string) => {
    getSocket().emit("room:kick", { targetId });
  }, []);

  const transferHost = useCallback((targetId: string) => {
    getSocket().emit("room:transferHost", { targetId });
  }, []);

  const updateSettings = useCallback((settings: Partial<RoomSettings>) => {
    getSocket().emit("room:updateSettings", { settings });
  }, []);

  const updateComposition = useCallback((roleCounts: RoleCounts) => {
    getSocket().emit("room:updateComposition", { roleCounts });
  }, []);

  const startGame = useCallback(() => {
    return new Promise<StartResult>((resolve) => {
      getSocket().emit("room:start", {}, (res) => resolve(res ?? { ok: false, errorCode: "NOT_IN_ROOM" }));
    });
  }, []);

  const advance = useCallback((to: "night" | "discussion" | "vote") => {
    getSocket().emit("host:advance", { to });
  }, []);

  const forceResolveNight = useCallback(() => {
    getSocket().emit("host:forceResolveNight", {});
  }, []);

  const forceResolveVote = useCallback(() => {
    getSocket().emit("host:forceResolveVote", {});
  }, []);

  const forceResolveAppealVote = useCallback(() => {
    getSocket().emit("host:forceResolveAppealVote", {});
  }, []);

  const skipHunterRevenge = useCallback(() => {
    getSocket().emit("host:skipHunterRevenge", {});
  }, []);

  const ackRole = useCallback(() => {
    getSocket().emit("role:ack", {});
  }, []);

  const earlyDivine = useCallback((targetId: string) => {
    getSocket().emit("seer:earlyDivine", { targetId });
  }, []);

  const submitNight = useCallback((targetId: string | null) => {
    getSocket().emit("night:submit", { targetId });
  }, []);

  const hunterRevenge = useCallback((targetId: string | null) => {
    getSocket().emit("hunter:revenge", { targetId });
  }, []);

  const vote = useCallback((targetId: string) => {
    getSocket().emit("vote:submit", { targetId });
  }, []);

  const dictatorAct = useCallback((targetId: string) => {
    getSocket().emit("dictator:act", { targetId });
  }, []);

  const proceedFromLastWords = useCallback(() => {
    getSocket().emit("lastWords:proceed", {});
  }, []);

  const submitAppeal = useCallback((choice: AppealChoice) => {
    getSocket().emit("appeal:submit", { choice });
  }, []);

  const setAllyNote = useCallback((text: string) => {
    getSocket().emit("ally:setNote", { text });
  }, []);

  const newGame = useCallback(() => {
    getSocket().emit("host:newGame", {});
  }, []);

  const value: GameContextValue = {
    status,
    connected,
    session,
    publicState,
    privateState,
    error: errorCode ? t.errors[errorCode] : null,
    clearError,
    createRoom,
    joinRoom,
    leaveRoom,
    kick,
    transferHost,
    updateSettings,
    updateComposition,
    startGame,
    advance,
    forceResolveNight,
    forceResolveVote,
    forceResolveAppealVote,
    skipHunterRevenge,
    ackRole,
    earlyDivine,
    submitNight,
    hunterRevenge,
    vote,
    dictatorAct,
    proceedFromLastWords,
    submitAppeal,
    setAllyNote,
    newGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
