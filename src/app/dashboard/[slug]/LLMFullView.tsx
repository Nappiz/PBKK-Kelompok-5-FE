"use client";

import { useRef, useState } from "react";

type Msg = { id: string; role: "user" | "ai"; text: string };

export default function LLMFullView() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: "m1", role: "user", text: "Explain the main conflict in episode 1." },
    {
      id: "m2",
      role: "ai",
      text:
        "Tony struggles with panic attacks from balancing family life and mob duties. He begins therapy with Dr. Melfi to unpack stressors and identity.",
    },
  ]);
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  function send(e: React.FormEvent) {
    e.preventDefault();
    const t = draft.trim();
    if (!t) return;
    setMsgs((m) => [...m, { id: crypto.randomUUID(), role: "user", text: t }, { id: crypto.randomUUID(), role: "ai", text: "Dummy answer… (connect to backend later)." }]);
    setDraft("");
    queueMicrotask(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }));
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

      <div ref={listRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3 text-black">
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
            className="rounded-lg px-4 py-2 font-inter text-sm text-black bg-gradient-to-r from-[#FFE970] to-[#FF8B0C] hover:brightness-105"
            type="submit"
          >
            Send
          </button>
        </div>
      </form>
    </section>
  );
}
