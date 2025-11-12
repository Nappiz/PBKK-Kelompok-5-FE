"use client";

import { useRef } from "react";
import { useUpload } from "../../../features/upload/useUpload";

export default function UploadCard() {

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      className="group relative flex h-64 w-full max-w-[480px] flex-col items-center justify-center
                 rounded-2xl border border-dashed border-orange-200 bg-[#FFF1E6]
                 shadow-sm ring-1 ring-black/5 transition hover:bg-[#FFE8D6]/80 hover:shadow-md"
      role="button"
      tabIndex={0}
      aria-label="Drop or select your PDF"
    >
      <span className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-dashed border-orange-300/40 opacity-0 transition group-hover:opacity-100" />


      <img src="/images/pdf.png" alt="" className="mb-4 h-10 w-10 object-contain" />

      <div className="flex items-center gap-2 text-neutral-600">
        <img src="/images/Drop.png" alt="" className="h-4 w-4 opacity-80" />
        <span className="font-inter">Drop your PDF here (contoh)</span>
      </div>

    </div>
  );
}
