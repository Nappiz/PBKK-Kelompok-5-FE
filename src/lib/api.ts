// Helper fetcher untuk FastAPI (HTTPOnly cookie). 
// Set di .env.local: NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type LoginBody = { email: string; password: string };
type RegisterBody = { name: string; email: string; password: string };

export async function apiLogin(body: LoginBody) {
  const r = await fetch(`${BASE}/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // ← penting: cookie HttpOnly dari FastAPI
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const msg = await safeMsg(r);
    throw new Error(msg || "Login failed");
  }
  return r.json().catch(() => ({}));
}

export async function apiRegister(body: RegisterBody) {
  const r = await fetch(`${BASE}/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const msg = await safeMsg(r);
    throw new Error(msg || "Register failed");
  }
  return r.json().catch(() => ({}));
}

async function safeMsg(r: Response) {
  try {
    const j = await r.json();
    return j?.error?.message || j?.message;
  } catch {
    return r.statusText;
  }
}

/* --- Kontrak FastAPI
POST /v1/auth/register
  req: { name: str, email: EmailStr, password: str }
  res: 201, set-cookie: session=<jwt>; HttpOnly; Secure
      { "user": { "id": "...", "name": "...", "email": "..." } }

POST /v1/auth/login
  req: { email: EmailStr, password: str }
  res: 200, set-cookie: session=<jwt>; HttpOnly; Secure
      { "user": { "id": "...", "name": "...", "email": "..." } }
*/
