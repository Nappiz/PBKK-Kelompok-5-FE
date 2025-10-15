"use client";

export default function SummarizeView({ summary }: { summary: string }) {
  return (
    <section
      className="relative rounded-xl bg-white shadow-sm ring-1 ring-black/10 overflow-hidden
                 min-h-[560px] h-[calc(100svh-160px)]"
    >
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-[#FFBD71]/60 bg-gradient-to-r from-[#FFE970] to-[#FF8B0C] px-3 py-2 text-[18px] font-semibold text-black">
        <div className="my-2 items-center justify-center">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-md mx-4 ">
            <img src="/images/edit.png" alt="" className="h-5 w-5" />
          </span>
          Edit AI summary notes
        </div>
      </div>

      <div className="h-[calc(100%-40px)] overflow-y-auto px-5 py-4">
        <article className="prose prose-neutral max-w-none text-black">
          <h2 className="font-krona !mt-0 text-[24px] text-black">Summary</h2>
          <p className="whitespace-pre-wrap leading-relaxed">
            {summary || "No summary yet."}
          </p>
        </article>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-[#FFBD71]/70" />
    </section>
  );
}
