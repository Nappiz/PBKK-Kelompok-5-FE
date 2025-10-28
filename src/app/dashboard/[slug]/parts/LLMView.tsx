// /app/dashboard/[slug]/parts/LLMView.tsx
"use client";

import { useRef, useState } from "react";
import { BASE } from "../../../../lib/api";
import { useDocParams } from "../../../../lib/useDocParams";

type Msg = { id: string; role: "user" | "ai"; text: string };
type HeightMode = "full" | "compact";

export default function LLMView({ height = "full" }: { height?: HeightMode }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const { docId, slug } = useDocParams();

  async function ask(question: string) {
    setBusy(true);
    try {
      const url = new URL(`${BASE}/api/qa`);
      if (docId) url.searchParams.set("doc_id", docId);
      if (slug) url.searchParams.set("slug", slug);

      const r = await fetch(url.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!r.ok) throw new Error((await r.text()) || "QA failed");
      const j = await r.json();
      return String(j?.answer ?? "");
    } finally {
      setBusy(false);
    }
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!docId && !slug) {
      setMsgs((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "ai",
          text:
            "Belum terhubung ke dokumen. Buka dari halaman detail dokumen atau tambahkan ?doc_id=… / ?slug=… di URL.",
        },
      ]);
      return;
    }

    const q = draft.trim();
    if (!q || busy) return;
    setMsgs((m) => [...m, { id: crypto.randomUUID(), role: "user", text: q }]);
    setDraft("");

    const answer = await ask(q).catch((e) => `Error: ${e.message}`);
    setMsgs((m) => [...m, { id: crypto.randomUUID(), role: "ai", text: answer }]);
    queueMicrotask(() =>
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
    );
  }

  const heightClass =
    height === "compact"
      ? "min-h-[280px] h-auto"
      : "min-h-[420px] h-[calc(100svh-160px)]";

  return (
    <aside
      className={[
        "rounded-xl bg-white shadow-sm ring-1 ring-black/10 p-5 flex flex-col",
        heightClass,
      ].join(" ")}
    >
      <div className="mb-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <img src="/images/Mascot.png" alt="" className="h-6 w-6" />
          <h3 className="font-krona text-[18px] text-black">Ask AI and Learn More!</h3>
          <img src="/images/Mascot.png" alt="" className="h-6 w-6" />
        </div>
        <p className="mt-1 text-[12px] text-neutral-600">
          Review your material with AI and ask away to clear any confusion!
        </p>
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto space-y-3">
        {msgs.length === 0 && (
          <div className="text-sm text-neutral-500">
            {docId || slug
              ? "Tanya sesuatu tentang dokumenmu…"
              : "Dokumen belum terpilih — upload atau buka halaman detail dokumen."}
          </div>
        )}
        {msgs.map((m) => (
          <div
            key={m.id}
            className={[
              "max-w-[80%] rounded-xl px-3 py-2 text-sm text-neutral-800 shadow",
              m.role === "user" ? "ml-auto bg-[#FFF1E6]" : "bg-[#F7F7F7]",
            ].join(" ")}
          >
            {m.text}
          </div>
        ))}
      </div>

      <form onSubmit={send} className="mt-4 rounded-xl border-2 border-[#FFBD71] bg-white p-2">
        <div className="flex items-center gap-2">
          <input
            className="text-black flex-1 rounded-lg border-0 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-neutral-400"
            placeholder="Ask any question about your notes…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button
            disabled={busy}
            className="cursor-pointer rounded-lg px-3 py-2 font-inter text-sm text-black bg-gradient-to-r from-[#FFE970] to-[#FF8B0C] hover:brightness-105 disabled:opacity-60"
          >
            {busy ? "Sending…" : "Send"}
          </button>
        </div>
      </form>
    </aside>
  );
}
