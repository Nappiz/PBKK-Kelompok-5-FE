"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import UploadCta from "./components/UploadCta";
import SearchBar from "./components/SearchBar";
import NoteCard from "./components/NoteCard";
import { getSession } from "../../lib/session";
import { motion, AnimatePresence } from "framer-motion"; 
import { Search, Loader2 } from "lucide-react";

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
        url: typeof r.id === "string" ? `/LearnWai/dashboard/${r.id}` : `/LearnWai/dashboard/${encodeURIComponent(String(r.title ?? "untitled").toLowerCase().replace(/\s+/g, "-"))}`,
        created_at: r.created_at,
      }));
      setDocs(mapped);
    } catch (e) { console.error(e); } finally { setLoadingList(false); }
  }, [userId]);

  useEffect(() => { if (userId) fetchDocs(); }, [userId, fetchDocs]);

  const startUpload = useCallback(async (file: File) => {
      if (!file) return;
      try {
        setModalOpen(true);
        setStage("Uploading file…");
        setProgress(5);
        const up = await apiUploadDocument(file, userId);
        const jobId = up.job_id;
        setStage("Indexing document…");
        setProgress(15);
        await new Promise<void>((resolve, reject) => {
          const tick = async () => {
             // ... polling logic
             try {
              const st = await apiJobStatus(jobId);
              setStage(`${st.stage}: ${st.message}`);
              setProgress(Math.max(15, Math.min(99, st.progress)));
              if (st.stage === "done" && st.ok) { clearIntervalIfAny(); resolve(); }
              if (st.stage === "error" || st.ok === false) { clearIntervalIfAny(); reject(new Error(st.message)); }
             } catch (err) { clearIntervalIfAny(); reject(err); }
          };
          const clearIntervalIfAny = () => { if(pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }};
          tick();
          pollRef.current = setInterval(tick, 1000);
        });
        await apiSummarize().catch(() => {});
        await apiFlashcards().catch(() => {});
        setStage("Done!"); setProgress(100); await fetchDocs();
      } catch (e: any) { alert(e?.message || "Error"); } finally { setTimeout(() => setModalOpen(false), 800); }
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
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
             <motion.div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
                <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6 h-20 w-20">
                        <svg className="h-full w-full -rotate-90 text-neutral-100" viewBox="0 0 36 36">
                            <path className="fill-none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" strokeWidth="3" stroke="currentColor"/>
                            <motion.path className="fill-none text-orange-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" strokeWidth="3" strokeDasharray={`${progress}, 100`} stroke="currentColor"/>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center font-krona">{Math.round(progress)}%</div>
                    </div>
                    <h3 className="font-krona text-lg mb-2">Processing</h3>
                    <p className="text-sm text-neutral-500">{stage}</p>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}