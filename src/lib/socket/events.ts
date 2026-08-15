import type { RoleCounts, RoomSettings, PublicGameState, PrivateViewState } from "@/lib/game/types";
import type { ErrorCode, ValidationIssue } from "@/lib/i18n/strings";

export type JoinResult =
  | { ok: true; code: string; playerId: string; token: string }
  | { ok: false; errorCode: ErrorCode };

export type StartResult =
  | { ok: true }
  | { ok: false; errorCode: "NOT_HOST" | "ALREADY_STARTED" | "MIN_PLAYERS" | "NOT_IN_ROOM" }
  | { ok: false; errorCode: "INVALID_COMPOSITION"; issues: ValidationIssue[] };

// クライアント -> サーバー
export interface ClientToServerEvents {
  "room:create": (payload: { playerName: string; code?: string }, cb: (res: JoinResult) => void) => void;
  "room:join": (payload: { code: string; playerName: string }, cb: (res: JoinResult) => void) => void;
  "room:rejoin": (
    payload: { code: string; playerId: string; token: string },
    cb: (res: { ok: true } | { ok: false; errorCode: ErrorCode }) => void
  ) => void;
  "room:leave": (payload: Record<string, never>, cb?: (res: { ok: boolean }) => void) => void;
  "room:kick": (payload: { targetId: string }) => void;
  "room:transferHost": (payload: { targetId: string }) => void;
  "room:updateSettings": (payload: { settings: Partial<RoomSettings> }) => void;
  "room:updateComposition": (payload: { roleCounts: RoleCounts }) => void;
  "room:start": (payload: Record<string, never>, cb?: (res: StartResult) => void) => void;
  "host:advance": (payload: { to: "night" | "discussion" | "vote" }) => void;
  "discussion:extend": (payload: Record<string, never>) => void;
  "role:ack": (payload: Record<string, never>) => void;
  "night:submit": (payload: { targetId: string | null }) => void;
  "hunter:revenge": (payload: { targetId: string | null }) => void;
  "vote:submit": (payload: { targetId: string }) => void;
  "dictator:act": (payload: { targetId: string }) => void;
  "host:newGame": (payload: Record<string, never>) => void;
}

// サーバー -> クライアント
export interface ServerToClientEvents {
  "state:public": (state: PublicGameState) => void;
  "state:private": (state: PrivateViewState) => void;
  "room:error": (payload: { errorCode: ErrorCode }) => void;
  "room:kicked": () => void;
}
