const KEY = "learnwai_session";

export type SessionUser = { id: string; name: string; email: string };

export function getSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as SessionUser; } catch { return null; }
}

export function setSession(user: SessionUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

export function getUserId(): string | undefined {
  return getSession()?.id ?? undefined;
}
