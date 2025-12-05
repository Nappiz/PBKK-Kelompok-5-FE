"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import UploadCta from "./components/UploadCta";
import SearchBar from "./components/SearchBar";
import NoteCard from "./components/NoteCard";
import { getSession } from "../../lib/session";
import { motion, AnimatePresence } from "framer-motion"; 
import { Search, Loader2, AlertCircle, FileText, Sparkles, Check, Zap, BrainCircuit, XCircle, ShieldAlert } from "lucide-react";

import {
  apiListDocuments,
  apiUploadDocument,
  apiJobStatus,
  apiSummarize,
  apiFlashcards,
  apiDeleteDocument,
  apiRenameDocument,
} from "../../lib/api";

type Doc = {
  id: string;
  title: string;
  url?: string;
  slug?: string;
  created_at?: string;
};

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    setSidebarOpen(mql.matches);
    const handleResize = (e: MediaQueryListEvent) => setSidebarOpen(e.matches);
    mql.addEventListener("change", handleResize);
    return () => mql.removeEventListener("change", handleResize);
  }, []);

  const [userName, setUserName] = useState<string>("Username");
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [query, setQuery] = useState<string>("");
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loadingList, setLoadingList] = useState<boolean>(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [stage, setStage] = useState<string>("Starting…");
  const [progress, setProgress] = useState<number>(0);
  const [isError, setIsError] = useState<boolean>(false);
  
  const isSanitizing = useMemo(() => {
    const s = stage.toLowerCase();
    return s.includes("terdeteksi") || s.includes("script") || s.includes("membersihkan") || s.includes("neutralizing");
  }, [stage]);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const s = getSession();
    const name = (s?.name ?? s?.email ?? "Username") as string;
    setUserName(name);
    setUserId(s?.id);
  }, []);

  const fetchDocs = useCallback(async () => {
    try {
      setLoadingList(true);
      const res = await apiListDocuments(userId);
      const rows = (res?.data ?? []) as any[];      
      const mapped: Doc[] = rows.map((r) => ({
        id: String(r.id ?? ""),
        title: String(r.title ?? r.name ?? "Untitled"),
        slug: r.slug ? String(r.slug) : undefined,
        url: typeof r.id === "string" && r.id
          ? `/LearnWai/dashboard/${r.id}`
          : `/LearnWai/dashboard/${encodeURIComponent(String(r.title ?? "untitled").toLowerCase().replace(/\s+/g, "-"))}`,
        created_at: r.created_at,
      }));
      setDocs(mapped);
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoadingList(false); 
    }
  }, [userId]);

  useEffect(() => { if (userId) fetchDocs(); }, [userId, fetchDocs]);

  const startUpload = useCallback(async (file: File) => {
      if (!file) return;
      
      setModalOpen(true);
      setIsError(false);
      setStage("Uploading document...");
      setProgress(0);
      
      try {
        const fakeProgress = setInterval(() => {
            setProgress(old => (old < 5 ? old + 1 : old));
        }, 200);

        const up = await apiUploadDocument(file, userId);
        clearInterval(fakeProgress);
        
        const jobId = up.job_id;

        await new Promise<void>((resolve, reject) => {
          const tick = async () => {
             try {
              const st = await apiJobStatus(jobId);
              let msg = st.message || st.stage;
              
              if(msg.includes("embedding")) msg = "Reading content...";
              if(msg.includes("summary")) msg = "AI thinking...";
              
              if (st.stage !== "error") {
                  setStage(msg);
              }
              
              setProgress(Math.max(5, Math.min(95, st.progress)));
              
              if (st.stage === "done" && st.ok) { clearIntervalIfAny(); resolve(); }
              if (st.stage === "error" || st.ok === false) { 
                  clearIntervalIfAny(); 
                  reject(new Error(st.message || "Unknown error")); 
              }
             } catch (err) { clearIntervalIfAny(); reject(err); }
          };
          const clearIntervalIfAny = () => { if(pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }};
          tick();
          pollRef.current = setInterval(tick, 500); 
        });
        
        setStage("Crafting Summary...");
        await apiSummarize().catch(() => {});
        
        setStage("Building Flashcards...");
        setProgress(98);
        await apiFlashcards().catch(() => {});
        
        setStage("Complete!");
        setProgress(100); 
        await fetchDocs();
        
        setTimeout(() => setModalOpen(false), 1500);

      } catch (e: any) { 
        setIsError(true);
        setStage(e?.message || "Upload failed due to an error.");
        if(pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
      } 
  }, [userId, fetchDocs]);

  const handleCloseModal = () => {
    setModalOpen(false);
    setIsError(false);
  };

  const handleDelete = useCallback(async (docId: string) => {
      try { setDocs(prev => prev.filter(d => d.id !== docId)); await apiDeleteDocument(docId); } catch(e) { fetchDocs(); }
  }, [fetchDocs]);

  const handleRename = useCallback(async (docId: string, newTitle: string) => {
      try { setDocs(prev => prev.map(d => d.id === docId ? {...d, title: newTitle} : d)); await apiRenameDocument(docId, newTitle); fetchDocs(); } catch(e) { fetchDocs(); }
  }, [fetchDocs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return docs;
    return docs.filter(d => d.title.toLowerCase().includes(q));
  }, [docs, query]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-neutral-900 font-sans selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden">
      <Sidebar 
        userName={userName} 
        expanded={sidebarOpen} 
        setExpanded={setSidebarOpen} 
      />
      <main className={`min-h-screen transition-[padding] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] ${sidebarOpen ? "md:pl-[280px]" : "md:pl-[88px]"} pl-0 pt-16 md:pt-0`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-krona text-3xl md:text-4xl text-neutral-900 tracking-tight"
              >
                Dashboard
              </motion.h1>
              <p className="mt-2 text-neutral-500">Manage your learning materials.</p>
            </div>
            <div className="w-full md:w-auto md:min-w-[320px]">
              <SearchBar value={query} onChange={setQuery} />
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <UploadCta onFile={startUpload} />
          </motion.div>

          <div className="flex items-center gap-3 mb-6">
             <div className="h-6 w-1 bg-orange-500 rounded-full" />
             <h2 className="font-krona text-lg text-neutral-900">Your Library</h2>
          </div>

          <div className="min-h-[200px]">
             {loadingList ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[1,2,3,4].map(i => <div key={i} className="h-48 rounded-2xl bg-white border border-neutral-100 animate-pulse" />)}
                </div>
             ) : (
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <AnimatePresence mode="popLayout">
                    {filtered.map((d) => (
                      <NoteCard
                        key={d.id}
                        {...d}
                        description={d.created_at ? new Date(d.created_at).toLocaleDateString("id-ID") : undefined}
                        onDelete={handleDelete}
                        onRename={handleRename}
                        href={d.url}
                        docId={d.id}
                        slug={d.slug}
                      />
                    ))}
                  </AnimatePresence>
                  {filtered.length === 0 && (
                     <div className="col-span-full py-20 text-center text-neutral-500 bg-white/50 rounded-3xl border border-dashed border-neutral-200">
                        No documents found.
                     </div>
                  )}
                </motion.div>
             )}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {modalOpen && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/60 backdrop-blur-md p-4">
              
             <motion.div 
                initial={{ scale: 0.8, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: -30 }}
                className={`w-full max-w-sm backdrop-blur-2xl rounded-[32px] p-1 shadow-2xl relative overflow-hidden border transition-colors duration-500
                    ${isError 
                        ? "bg-red-50/90 shadow-red-500/20 border-red-200" 
                        : isSanitizing 
                            ? "bg-amber-50/90 shadow-amber-500/20 border-amber-200"
                            : "bg-white/80 shadow-orange-500/20 border-white/60"
                    }
                `}
             >
                <div className="rounded-[28px] p-8 relative overflow-hidden h-full flex flex-col items-center">
                    
                    <div className={`absolute top-[-50%] left-[-50%] w-full h-full blur-[80px] rounded-full pointer-events-none transition-colors duration-500 
                        ${isError ? "bg-red-300/40" : isSanitizing ? "bg-amber-300/40" : "bg-orange-300/40"}`} 
                    />
                    <div className={`absolute bottom-[-50%] right-[-50%] w-full h-full blur-[80px] rounded-full pointer-events-none transition-colors duration-500
                        ${isError ? "bg-rose-300/40" : isSanitizing ? "bg-yellow-300/40" : "bg-yellow-300/40"}`} 
                    />

                    <div className="flex flex-col items-center text-center relative z-10 w-full">
                        
                        <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                            
                            <motion.div 
                                className={`absolute inset-0 border-[3px] rounded-full transition-colors duration-500
                                    ${isError ? "border-red-400/40" : isSanitizing ? "border-amber-400/50" : "border-orange-400/40"}
                                `}
                                style={{ 
                                    borderTopColor: isError ? '#EF4444' : isSanitizing ? '#F59E0B' : '#FF8B0C', 
                                    borderRightColor: 'transparent' 
                                }}
                                animate={isError ? { rotate: 0 } : { rotate: 360 }}
                                transition={{ duration: 2, repeat: isError ? 0 : Infinity, ease: "linear" }}
                            />
                            
                            <motion.div 
                                className={`absolute inset-2 border-[3px] rounded-full transition-colors duration-500
                                    ${isError ? "border-rose-400/30" : isSanitizing ? "border-yellow-400/50" : "border-yellow-400/30"}
                                `}
                                style={{ 
                                    borderBottomColor: isError ? '#F43F5E' : isSanitizing ? '#FCD34D' : '#FFD270', 
                                    borderLeftColor: 'transparent' 
                                }}
                                animate={isError ? { rotate: 0 } : { rotate: -360 }}
                                transition={{ duration: 3, repeat: isError ? 0 : Infinity, ease: "linear" }}
                            />

                            <AnimatePresence mode="wait">
                                {isError ? (
                                    <motion.div
                                        key="error"
                                        initial={{ scale: 0, rotate: 45 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30"
                                    >
                                        <XCircle className="text-white w-8 h-8 stroke-[3]" />
                                    </motion.div>
                                ) : isSanitizing ? (
                                    <motion.div
                                        key="sanitizing"
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.9, opacity: 0 }}
                                        className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30"
                                    >
                                        <ShieldAlert className="text-white w-8 h-8 stroke-[3] animate-pulse" />
                                    </motion.div>
                                ) : progress === 100 ? (
                                    <motion.div
                                        key="success"
                                        initial={{ scale: 0, rotate: -90 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                        className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30"
                                    >
                                        <Check className="text-white w-8 h-8 stroke-[3]" />
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        key="scanning"
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.9, opacity: 0 }}
                                        className="relative w-14 h-16 bg-white/60 rounded-xl border border-white/80 flex items-center justify-center shadow-sm overflow-hidden backdrop-blur-sm"
                                    >
                                        {progress > 70 ? (
                                            <BrainCircuit className="text-orange-500 w-8 h-8 animate-pulse" />
                                        ) : progress > 30 ? (
                                            <Sparkles className="text-orange-400 w-8 h-8" />
                                        ) : (
                                            <FileText className="text-neutral-400 w-8 h-8" />
                                        )}
                                        <motion.div 
                                            className="absolute left-[-10%] w-[120%] h-1.5 bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400 shadow-[0_0_10px_#FF8B0C]"
                                            animate={{ top: ["-10%", "110%"] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="space-y-3 w-full">
                            <motion.div 
                                key={isError ? "err" : isSanitizing ? "warn" : "norm"}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`font-krona text-lg tracking-wide leading-tight
                                    ${isError ? "text-red-600" 
                                    : isSanitizing ? "text-amber-600"
                                    : "text-neutral-900"}
                                `}
                            >
                                {isError ? "PROCESS FAILED" 
                                : isSanitizing ? "SECURITY ALERT"
                                : (progress === 100 ? "Ready to Learn!" : "Processing...")}
                            </motion.div>

                            <motion.p 
                                className={`text-xs font-mono uppercase tracking-[0.1em] font-semibold break-words
                                    ${isError ? "text-red-500" 
                                    : isSanitizing ? "text-amber-600 font-bold"
                                    : "text-neutral-500"}
                                `}
                                animate={isError || isSanitizing ? {} : { opacity: [0.7, 1, 0.7] }}
                                transition={isError || isSanitizing ? {} : { duration: 2, repeat: Infinity }}
                            >
                                {stage}
                            </motion.p>
                        </div>

                        <div className={`w-full h-2 rounded-full mt-8 overflow-hidden relative border transition-colors duration-300
                            ${isError ? "bg-red-100 border-red-200" 
                            : isSanitizing ? "bg-amber-100 border-amber-200"
                            : "bg-neutral-100 border-neutral-200"}
                        `}>
                            <motion.div 
                                className={`absolute left-0 top-0 h-full transition-colors duration-300
                                    ${isError ? "bg-red-500" 
                                    : isSanitizing ? "bg-amber-500"
                                    : "bg-gradient-to-r from-[#FFE970] to-[#FF8B0C]"}
                                `}
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ type: "spring", stiffness: 20 }}
                            />
                            {!isError && (
                                <motion.div 
                                    className="absolute top-0 bottom-0 right-0 w-20 bg-white/60 blur-md"
                                    animate={{ x: ["-300px", "300px"] }}
                                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                                />
                            )}
                        </div>
                        
                        <div className="mt-3 w-full flex justify-between text-[10px] font-mono font-medium">
                            <span className={isError ? "text-red-400" : isSanitizing ? "text-amber-600" : "text-neutral-400"}>START</span>
                            <span className={isError ? "text-red-600 font-bold" : isSanitizing ? "text-amber-600 font-bold" : "text-orange-500"}>{Math.round(progress)}%</span>
                            <span className={isError ? "text-red-400" : isSanitizing ? "text-amber-600" : "text-neutral-400"}>FINISH</span>
                        </div>

                        {isError && (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={handleCloseModal}
                                className="mt-6 px-6 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-full text-sm font-semibold transition-colors"
                            >
                                Close & Try Again
                            </motion.button>
                        )}

                    </div>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
