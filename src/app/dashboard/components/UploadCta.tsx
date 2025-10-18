"use client";

import { useRef } from "react";
import { useUpload } from "../../../features/upload/useUpload";

type Props = {
  onFile?: (file: File) => void | Promise<void>;
};

export default function UploadCta({ onFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { state, onFile: onFileInternal } = useUpload();

  const handlePick = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      if (onFile) {
        void onFile(f);
      } else {
        onFileInternal(f); 
      }
    }
    e.currentTarget.value = "";
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handlePick}
        className="cursor-pointer group inline-flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-black bg-gradient-to-r from-[#FFE970] to-[#FF8B0C] shadow-sm hover:shadow-md"
      >
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/30">
          <img src="/images/pdf2.png" alt="" className="h-5 w-5" />
        </span>

        <span className="flex min-w-0 flex-col items-start">
          <span className="truncate font-krona font-bold">Document Upload</span>
          <span className="mt-0.5 rounded-full bg-white/30 px-2 py-0.5 text-[10px] leading-none">
            PDF file
          </span>
        </span>

        <span className="ml-1">
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 6l6 6-6 6" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleChange}
      />

      {!onFile && (
        <>
          {state.status === "uploading" && (
            <div className="text-xs text-neutral-600">
              {state.filename} — uploading… {state.progress ?? 0}%
            </div>
          )}
          {state.status === "success" && (
            <div className="text-xs text-emerald-600">Uploaded ✓</div>
          )}
          {state.status === "error" && (
            <div className="text-xs text-red-600">{state.message}</div>
          )}
        </>
      )}
    </div>
  );
}
