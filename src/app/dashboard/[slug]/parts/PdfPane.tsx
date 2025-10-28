// /app/dashboard/[slug]/parts/PdfPane.tsx
"use client";

export default function PdfPane({ url, title }: { url?: string; title?: string }) {
  const safe = typeof url === "string" && url.length > 0;

  return (
    <section
      className="
        relative rounded-xl bg-white shadow-sm ring-1 ring-black/10 overflow-hidden
        min-h-[560px] h-[calc(100svh-160px)]
      "
    >
      {/* header */}
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-[#FFBD71]/60 bg-gradient-to-r from-[#FFE970] to-[#FF8B0C] px-3 py-2 text-[16px] font-semibold text-black">
        <img src="/images/pdf2.png" alt="" className="h-5 w-5 mx-1" />
        Original PDF
        {title ? <span className="ml-2 truncate text-xs text-black/70">— {title}</span> : null}
      </div>

      {/* body */}
      <div className="h-[calc(100%-40px)]">
        {safe ? (
          <iframe
            src={`${url}#toolbar=1&navpanes=0&view=fitH`}
            className="h-full w-full"
            title={title || "PDF"}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-neutral-600 p-6">
            PDF URL not available.
          </div>
        )}
      </div>
    </section>
  );
}
