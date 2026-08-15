"use client";

export interface StoredSession {
  code: string;
  playerId: string;
  token: string;
  name: string;
}

const KEY = "jinro-dx-session";

export function loadSession(): StoredSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.code || !parsed?.playerId || !parsed?.token) return null;
    return parsed as StoredSession;
  } catch {
    return null;
  }
}

export function saveSession(session: StoredSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(session));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

export function saveLastName(name: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("jinro-dx-last-name", name);
}

export function loadLastName(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("jinro-dx-last-name") ?? "";
}
