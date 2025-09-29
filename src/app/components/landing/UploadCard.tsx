"use client";

import { useRef } from "react";
import { useUpload } from "../../../features/upload/useUpload";

export default function UploadCard() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { state, onFile, setState } = useUpload();

  const handleSelect = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFile(f);
    e.currentTarget.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) onFile(f);
  };

  return (
    <div
      onClick={handleSelect}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="group relative flex h-64 w-full max-w-[480px] cursor-pointer flex-col items-center justify-center
                 rounded-2xl border border-dashed border-orange-200 bg-[#FFF1E6]
                 shadow-sm ring-1 ring-black/5 transition hover:bg-[#FFE8D6]/80 hover:shadow-md"
      role="button"
      tabIndex={0}
      aria-label="Drop or select your PDF"
    >
      {/* garis dashed animasi halus */}
      <span className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-dashed border-orange-300/40 opacity-0 transition group-hover:opacity-100" />

      <input ref={inputRef} type="file" accept="application/pdf" hidden onChange={handleChange} />

      <img src="/images/pdf.png" alt="" className="mb-4 h-10 w-10 object-contain" />

      <div className="flex items-center gap-2 text-neutral-600">
        <img src="/images/Drop.png" alt="" className="h-4 w-4 opacity-80" />
        <span className="font-inter">Drop your PDF here</span>
      </div>

      <div className="mt-3 text-center text-sm">
        {state.status === "uploading" && (
          <div className="flex w-3/4 flex-col items-center gap-2">
            <div className="h-2 w-full overflow-hidden rounded-full bg-orange-100">
              <div
                className="h-full bg-gradient-to-r from-[#FFB468] to-[#FFD270] transition-all"
                style={{ width: `${state.progress ?? 20}%` }}
              />
            </div>
            <span className="text-neutral-500">Uploading {state.filename}…</span>
          </div>
        )}
        {state.status === "success" && (
          <div className="text-green-700">
            Uploaded <span className="font-semibold">{state.filename}</span>
            {state.docUrl ? (
              <>
                {" "}
                – <a href={state.docUrl} target="_blank" className="underline">view</a>
              </>
            ) : null}
          </div>
        )}
        {state.status === "error" && (
          <div className="text-red-600">
            Failed: {state.message} {state.filename ? `(${state.filename})` : ""}
            <button
              className="ml-2 rounded-md border border-red-200 px-2 py-0.5 text-xs hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation();
                setState({ status: "idle" });
              }}
            >
              try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
