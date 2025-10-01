// Selalu tanpa trailing slash
const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
export const BASE = RAW_BASE.replace(/\/+$/, "");

// Helper join aman (path tanpa leading slash)
function u(path: string) {
  const p = path.replace(/^\/+/, "");
  return `${BASE}/${p}`;
}

export async function uploadPdf(file: File, userId?: string) {
  const fd = new FormData();
  fd.append("file", file);
  const q = userId ? `?user_id=${encodeURIComponent(userId)}` : "";
  const resp = await fetch(u(`upload${q}`), { method: "POST", body: fd });
  if (!resp.ok) {
    let msg = "Upload failed";
    try { const j = await resp.json(); msg = j?.detail || msg; } catch {}
    throw new Error(msg);
  }
  return resp.json();
}

type RegisterBody = { name: string; email: string; password: string };
export async function apiRegister(body: RegisterBody) {
  const r = await fetch(u("auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    let msg = "Register failed";
    try { const j = await r.json(); msg = j?.detail || msg; } catch {}
    throw new Error(msg);
  }
  return r.json() as Promise<{ user: { id: string; name: string; email: string } }>;
}

type LoginBody = { email: string; password: string };
export async function apiLogin(body: LoginBody) {
  const r = await fetch(u("auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    let msg = "Login failed";
    try { const j = await r.json(); msg = j?.detail || msg; } catch {}
    throw new Error(msg);
  }
  return r.json() as Promise<{ user: { id: string; name: string; email: string } }>;
}
