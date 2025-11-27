"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import UploadCta from "./components/UploadCta";
import SearchBar from "./components/SearchBar";
import NoteCard from "./components/NoteCard";
import { getSession } from "../../lib/session";
import { motion, AnimatePresence } from "framer-motion"; 
import { Search, Loader2, AlertCircle, FileText, Sparkles, Check, Zap, BrainCircuit } from "lucide-react";

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
          ? `/dashboard/${r.id}`
          : `/dashboard/${encodeURIComponent(String(r.title ?? "untitled").toLowerCase().replace(/\s+/g, "-"))}`,
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
      try {
        setModalOpen(true);
        setStage("Uploading document...");
        setProgress(0);
        
        const fakeProgress = setInterval(() => {
            setProgress(old => (old < 10 ? old + 1 : old));
        }, 200);

        const up = await apiUploadDocument(file, userId);
        clearInterval(fakeProgress);
        
        const jobId = up.job_id;
        setStage("Indexing document...");
        setProgress(15);

        await new Promise<void>((resolve, reject) => {
          const tick = async () => {
             try {
              const st = await apiJobStatus(jobId);
              let msg = st.message || st.stage;
              if(msg.includes("embedding")) msg = "Reading content...";
              if(msg.includes("summary")) msg = "AI thinking...";
              
              setStage(msg);
              setProgress(Math.max(15, Math.min(95, st.progress)));
              
              if (st.stage === "done" && st.ok) { clearIntervalIfAny(); resolve(); }
              if (st.stage === "error" || st.ok === false) { clearIntervalIfAny(); reject(new Error(st.message)); }
             } catch (err) { clearIntervalIfAny(); reject(err); }
          };
          const clearIntervalIfAny = () => { if(pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }};
          tick();
          pollRef.current = setInterval(tick, 1000);
        });
        
        setStage("Crafting Summary...");
        await apiSummarize().catch(() => {});
        
        setStage("Building Flashcards...");
        setProgress(98);
        await apiFlashcards().catch(() => {});
        
        setStage("Complete!");
        setProgress(100); 
        await fetchDocs();
      } catch (e: any) { 
        setStage("Error occurred");
        alert(e?.message || "Error"); 
      } finally { 
        setTimeout(() => setModalOpen(false), 1500); 
      }
  }, [userId, fetchDocs]);

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

      <main 
        className={`
          min-h-screen transition-[padding] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
          ${sidebarOpen ? "md:pl-[280px]" : "md:pl-[88px]"} 
          pl-0 pt-16 md:pt-0
        `}
      >
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
                className="w-full max-w-sm bg-white/80 backdrop-blur-2xl rounded-[32px] p-1 shadow-2xl shadow-orange-500/20 relative overflow-hidden border border-white/60"
             >
                <div className="rounded-[28px] p-8 relative overflow-hidden h-full">
                    
                    <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-orange-300/40 blur-[80px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-[-50%] right-[-50%] w-full h-full bg-yellow-300/40 blur-[80px] rounded-full pointer-events-none" />

                    <div className="flex flex-col items-center text-center relative z-10">
                        
                        <div className="relative w-32 h-32 mb-10 flex items-center justify-center">
                            
                            <motion.div 
                                className="absolute inset-0 border-[3px] border-orange-400/40 rounded-full"
                                style={{ borderTopColor: '#FF8B0C', borderRightColor: 'transparent' }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.div 
                                className="absolute inset-2 border-[3px] border-yellow-400/30 rounded-full"
                                style={{ borderBottomColor: '#FFD270', borderLeftColor: 'transparent' }}
                                animate={{ rotate: -360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />

                            <AnimatePresence mode="wait">
                                {progress === 100 ? (
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
                                        className="relative w-14 h-16 bg-orange-50/80 rounded-xl border border-orange-100 flex items-center justify-center shadow-sm overflow-hidden"
                                    >
                                        {progress > 70 ? (
                                            <BrainCircuit className="text-orange-500 w-8 h-8 animate-pulse" />
                                        ) : progress > 30 ? (
                                            <Sparkles className="text-orange-400 w-8 h-8" />
                                        ) : (
                                            <FileText className="text-neutral-400 w-8 h-8" />
                                        )}

                                        {progress < 100 && (
                                            <motion.div 
                                                className="absolute left-[-10%] w-[120%] h-1.5 bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400 shadow-[0_0_10px_#FF8B0C]"
                                                animate={{ top: ["-10%", "110%"] }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                            />
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {progress < 100 && (
                                <>
                                    {[...Array(6)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute w-1.5 h-1.5 bg-orange-400 rounded-full shadow-sm"
                                            initial={{ opacity: 0, y: 10, x: 0 }}
                                            animate={{ 
                                                opacity: [0, 1, 0], 
                                                y: -40 - Math.random() * 30, 
                                                x: (Math.random() - 0.5) * 50,
                                                scale: [1, 0.5]
                                            }}
                                            transition={{ 
                                                duration: 1.5, 
                                                repeat: Infinity, 
                                                delay: i * 0.2, 
                                                ease: "easeOut" 
                                            }}
                                        />
                                    ))}
                                </>
                            )}
                        </div>

                        <div className="space-y-2 w-full">
                            <motion.div 
                                key={stage}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="font-krona text-neutral-900 text-lg tracking-wide"
                            >
                                {progress === 100 ? "Ready to Learn!" : "Processing..."}
                            </motion.div>

                            <motion.p 
                                className="text-xs font-mono text-neutral-500 uppercase tracking-[0.2em] font-semibold"
                                animate={{ opacity: [0.7, 1, 0.7] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                {stage}
                            </motion.p>
                        </div>

                        <div className="w-full bg-neutral-100 h-2 rounded-full mt-8 overflow-hidden relative border border-neutral-200">
                            <motion.div 
                                className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#FFE970] to-[#FF8B0C]"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ type: "spring", stiffness: 20 }}
                            />
                            <motion.div 
                                className="absolute top-0 bottom-0 right-0 w-20 bg-white/60 blur-md"
                                animate={{ x: ["-300px", "300px"] }}
                                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                            />
                        </div>
                        
                        <div className="mt-3 w-full flex justify-between text-[10px] text-neutral-400 font-mono font-medium">
                            <span>START</span>
                            <span className="text-orange-500">{Math.round(progress)}%</span>
                            <span>FINISH</span>
                        </div>

                    </div>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}