"use client";

export default function LLMView() {
  return (
    <aside className="rounded-xl bg-white shadow-sm ring-1 ring-black/10 p-5 flex flex-col min-h-[420px] h-[calc(100svh-160px)]">
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

      <div className="flex-1 overflow-y-auto space-y-3">
        <div className="ml-auto max-w-[80%] rounded-xl bg-[#FFF1E6] px-3 py-2 text-sm text-neutral-800 shadow">
          Hi, can you explain the main conflict in the first episode?
        </div>
        <div className="max-w-[80%] rounded-xl bg-[#F7F7F7] px-3 py-2 text-sm text-neutral-800 shadow">
          Sure! Tony struggles with panic attacks triggered by stress from balancing family life and
          mob duties. He seeks therapy with Dr. Melfi… (dummy).
        </div>
      </div>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="mt-4 rounded-xl border-2 border-[#FFBD71] bg-white p-2"
      >
        <div className="flex items-center gap-2">
          <input
            className="text-black flex-1 rounded-lg border-0 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-neutral-400"
            placeholder="Ask any question about your notes…"
          />
          <button className="cursor-pointer rounded-lg px-3 py-2 font-inter text-sm text-black bg-gradient-to-r from-[#FFE970] to-[#FF8B0C] hover:brightness-105">
            Send
          </button>
        </div>
      </form>
    </aside>
  );
}
