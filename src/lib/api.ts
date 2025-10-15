const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
export const BASE = RAW_BASE.replace(/\/+$/, "");

function u(path: string) {
  const p = path.replace(/^\/+/, "");
  return `${BASE}/${p}`;
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

export async function uploadPdf(file: File, userId?: string) {
  return apiUploadDocument(file, userId);
}

export async function apiUploadDocument(file: File, userId?: string) {
  const fd = new FormData();
  fd.append("file", file);
  const q = userId ? `?user_id=${encodeURIComponent(userId)}` : "";
  const resp = await fetch(u(`documents/upload${q}`), { method: "POST", body: fd });
  if (!resp.ok) {
    let msg = "Upload failed";
    try { const j = await resp.json(); msg = j?.detail || msg; } catch {}
    throw new Error(msg);
  }
  return resp.json() as Promise<{ job_id: string; document: any }>;
}

export async function apiJobStatus(jobId: string) {
  const r = await fetch(u(`api/status/${encodeURIComponent(jobId)}`));
  if (!r.ok) {
    let msg = "Failed to get status";
    try { const j = await r.json(); msg = j?.detail || msg; } catch {}
    throw new Error(msg);
  }
  return r.json() as Promise<{
    job_id: string;
    stage: string;
    progress: number;
    message: string;
    ok: boolean;
  }>;
}

export async function apiListDocuments(userId?: string) {
  const q = userId ? `?user_id=${encodeURIComponent(userId)}` : "";
  const r = await fetch(u(`documents${q}`));
  if (!r.ok) {
    let msg = "Failed to list documents";
    try { const j = await r.json(); msg = j?.detail || msg; } catch {}
    throw new Error(msg);
  }
  return r.json() as Promise<{ data: Array<any> }>;
}

export async function apiSummarize(query?: string) {
  const r = await fetch(u("api/summarize"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!r.ok) {
    let msg = "Summarize failed";
    try { const j = await r.json(); msg = j?.detail || msg; } catch {}
    throw new Error(msg);
  }
  return r.json() as Promise<{
    text: string;
    contexts: string[];
    ragas: {
      context_relevancy?: number | null;
      context_recall?: number | null;
      answer_correctness?: number | null;
      faithfulness?: number | null;
    };
  }>;
}

export async function apiQA(question: string) {
  const r = await fetch(u("api/qa"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!r.ok) {
    let msg = "QA failed";
    try { const j = await r.json(); msg = j?.detail || msg; } catch {}
    throw new Error(msg);
  }
  return r.json() as Promise<{
    answer: string;
    contexts: string[];
    ragas: {
      context_relevancy?: number | null;
      context_recall?: number | null;
      answer_correctness?: number | null;
      faithfulness?: number | null;
    };
  }>;
}

export async function apiFlashcards(question_hint?: string) {
  const r = await fetch(u("api/flashcards"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question_hint }),
  });
  if (!r.ok) {
    let msg = "Flashcards failed";
    try { const j = await r.json(); msg = j?.detail || msg; } catch {}
    throw new Error(msg);
  }
  return r.json() as Promise<{
    cards: Array<{ question: string; answer: string }>;
    contexts: string[];
    ragas: {
      context_relevancy?: number | null;
      context_recall?: number | null;
      answer_correctness?: number | null;
      faithfulness?: number | null;
    };
  }>;
}
