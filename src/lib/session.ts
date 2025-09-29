export type Sess = { id: string; name?: string; email?: string };

const LS_KEY = "learnwai_session";
const CK_NAME = "lw_session";

// base64 universal (browser & node)
function b64e(str: string) {
  if (typeof window === "undefined") {
    // @ts-ignore
    return Buffer.from(str, "utf-8").toString("base64");
  }
  return btoa(unescape(encodeURIComponent(str)));
}
function b64d(b64: string) {
  if (typeof window === "undefined") {
    // @ts-ignore
    return Buffer.from(b64, "base64").toString("utf-8");
  }
  return decodeURIComponent(escape(atob(b64)));
}

function encodeSess(s: Sess) {
  return b64e(JSON.stringify(s));
}
function decodeSess(b64: string): Sess | null {
  try {
    return JSON.parse(b64d(b64));
  } catch {
    return null;
  }
}

export function setSession(s: Sess) {
  if (typeof document !== "undefined") {
    const v = encodeSess(s);
    // 7 hari
    document.cookie = `${CK_NAME}=${v}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(s));
    } catch {}
  }
}

export function clearSession() {
  if (typeof document !== "undefined") {
    document.cookie = `${CK_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
    try {
      localStorage.removeItem(LS_KEY);
    } catch {}
  }
}

export function getSession(): Sess | null {
  if (typeof document === "undefined") return null;

  const m = document.cookie.match(/(?:^|; )lw_session=([^;]+)/);
  if (m?.[1]) {
    const s = decodeSess(m[1]);
    if (s) return s;
  }

  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Sess) : null;
  } catch {
    return null;
  }
}

export function getUserId(): string | undefined {
  return getSession()?.id;
}
