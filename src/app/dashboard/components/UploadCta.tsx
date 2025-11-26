"use client";

import { useRef, useState } from "react";
import { useUpload } from "../../../features/upload/useUpload";
import { motion } from "framer-motion";
import { UploadCloud, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

type Props = {
  onFile?: (file: File) => void | Promise<void>;
};

export default function UploadCta({ onFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { state, onFile: onFileInternal } = useUpload();
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (f: File) => {
    if (onFile) void onFile(f);
    else onFileInternal(f);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
    e.currentTarget.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]?.type === "application/pdf") {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleChange}
      />
      
      <motion.div
        whileHover={{ scale: 1.005, borderColor: "#FF8B0C" }}
        whileTap={{ scale: 0.995 }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300
          ${isDragging 
            ? "border-orange-500 bg-orange-50/50 scale-[1.01]" 
            : "border-neutral-200 bg-white hover:border-orange-300 hover:bg-orange-50/10"
          }
        `}
      >
        <div className="flex flex-col md:flex-row items-center gap-6 p-8 md:p-10">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-400 blur-2xl opacity-0 group-hover:opacity-20 rounded-full transition-opacity duration-500" />
            <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-[#FFE970] to-[#FF8B0C] flex items-center justify-center text-white shadow-lg group-hover:shadow-orange-200/50 group-hover:-translate-y-1 transition-all duration-300">
              <UploadCloud size={32} />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-1">
            <h3 className="font-krona text-lg md:text-xl text-neutral-900 group-hover:text-orange-700 transition-colors">
              Upload New Document
            </h3>
            <p className="text-sm text-neutral-500 max-w-md mx-auto md:mx-0">
              Drag & drop your PDF here, or click to browse. We'll automatically summarize and generate flashcards.
            </p>
          </div>

          <div className="hidden md:block">
             <div className="h-10 w-10 rounded-full bg-white border border-neutral-100 flex items-center justify-center text-neutral-300 group-hover:border-orange-200 group-hover:text-orange-400 transition-colors">
                <FileText size={20} />
             </div>
          </div>
        </div>

        {state.status !== "idle" && (
           <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white shadow-xl border border-neutral-100">
                 {state.status === "uploading" && <Loader2 className="animate-spin text-orange-500" size={20} />}
                 {state.status === "success" && <CheckCircle2 className="text-emerald-500" size={20} />}
                 {state.status === "error" && <AlertCircle className="text-red-500" size={20} />}
                 
                 <span className="text-sm font-medium text-neutral-700">
                    {state.status === "uploading" && `Uploading... ${state.progress ?? 0}%`}
                    {state.status === "success" && "Done!"}
                    {state.status === "error" && (state.message || "Failed")}
                 </span>
              </div>
           </div>
        )}
      </motion.div>
    </div>
  );
}