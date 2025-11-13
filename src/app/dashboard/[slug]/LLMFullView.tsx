"use client";

import { useRef, useState } from "react";
import { BASE } from "../../../lib/api";
import { useDocParams } from "../../../lib/useDocParams";

type Msg = { id: string; role: "user" | "ai"; text: string };

const genId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export default function LLMFullView() {
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
          id: genId(),
          role: "ai",
          text:
            "Belum terhubung ke dokumen. Buka dari halaman detail dokumen atau tambahkan ?doc_id=… / ?slug=… di URL.",
        },
      ]);
      return;
    }

    const q = draft.trim();
    if (!q || busy) return;

    setMsgs((m) => [...m, { id: genId(), role: "user", text: q }]);
    setDraft("");

    const answer = await ask(q).catch((e) => `Error: ${e.message}`);
    setMsgs((m) => [...m, { id: genId(), role: "ai", text: answer }]);

    queueMicrotask(() =>
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      }),
    );
  }

  return (
    <section className="rounded-xl bg-white ring-1 ring-black/10 shadow-sm p-0 overflow-hidden min-h-[560px] h-[calc(100svh-160px)] flex flex-col">
      <div className="sticky top-0 z-10 border-b bg-white/95 px-5 py-4 backdrop-blur">
        <div className="flex items-center justify-center gap-2">
          <img src="/images/Mascot.png" className="h-6 w-6" alt="" />
          <h3 className="font-krona text-[20px] text-black">Ask AI</h3>
          <img src="/images/Mascot.png" className="h-6 w-6" alt="" />
        </div>
        <p className="mt-1 text-center text-[12px] text-neutral-600">
          Focused chat bot perfect for Q&amp;A.
        </p>
      </div>

      <div
        ref={listRef}
        className="flex-1 overflow-y-auto px-5 py-4 space-y-3 text-black"
      >
        {msgs.length === 0 && (
          <div className="text-sm text-neutral-500">
            {docId || slug
              ? "Mulai obrolan dengan bertanya apa saja…"
              : "Dokumen belum terpilih — upload atau buka halaman detail dokumen."}
          </div>
        )}
        {msgs.map((m) => (
          <div
            key={m.id}
            className={[
              "max-w-[80%] rounded-xl px-3 py-2 text-sm shadow",
              m.role === "user" ? "ml-auto bg-[#FFF1E6]" : "bg-[#F6F6F6]",
            ].join(" ")}
          >
            {m.text}
          </div>
        ))}
      </div>

      <form onSubmit={send} className="border-t bg-white p-3">
        <div className="flex items-center gap-2 rounded-xl border-2 border-[#FFBD71] p-2">
          <input
            className="flex-1 rounded-lg border-0 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-neutral-400 text-black"
            placeholder="Ask any question about your notes…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button
            disabled={busy}
            className="cursor-pointer rounded-lg px-4 py-2 font-inter text-sm text-black bg-gradient-to-r from-[#FFE970] to-[#FF8B0C] hover:brightness-105 disabled:opacity-60"
            type="submit"
          >
            {busy ? "Sending…" : "Send"}
          </button>
        </div>
      </form>
    </section>
  );
}
