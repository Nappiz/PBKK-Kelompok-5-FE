"use client";

import { useEffect, useMemo, useState } from "react";
import CurrentSidebar from "./parts/CurrentSidebar";
import SummarizeView from "./parts/SummarizeView";
import LLMFullView from "./LLMFullView";
import FlashcardsView from "./parts/FlashcardsView";
import PdfPane from "./parts/PdfPane";
import LLMView from "./parts/LLMView";
import { BASE } from "../../../lib/api";
import { getSession } from "../../../lib/session";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";

export type SectionKey = "summarize" | "ai" | "flashcards";

type DocRow = {
  id: string;
  title: string;
  url?: string;
  status?: string;
  summary?: string | null;
  flashcards?: { question: string; answer: string }[] | null;
  slug?: string | null;
  image_urls?: string[] | null;
};

export default function NoteDetailClient({ slug }: { slug: string }) {
  const fetchUrl = `${BASE}/documents/${encodeURIComponent(slug)}`;
  const [userName, setUserName] = useState<string>("");
  const [doc, setDoc] = useState<DocRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [section, setSection] = useState<SectionKey>("summarize");

  useEffect(() => {
    const s = getSession();
    const name = (s?.name ?? s?.email ?? "").toString();
    setUserName(name);
  }, []);

  const title = useMemo(() => doc?.title ?? "Document", [doc]);

  useEffect(() => {
    const map = (h: string): SectionKey | null =>
      h === "#ai" ? "ai" : h === "#flashcards" ? "flashcards" : h === "#summarize" ? "summarize" : null;

    const init = map(window.location.hash);
    if (init) setSection(init);

    const onHash = () => {
      const k = map(window.location.hash);
      if (k) setSection(k);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const setAndHash = (k: SectionKey) => {
    setSection(k);
    history.replaceState(null, "", k === "ai" ? "#ai" : k === "flashcards" ? "#flashcards" : "#summarize");
  };

  useEffect(() => {
    let stop = false;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const r = await fetch(fetchUrl);
        if (!r.ok) throw new Error((await r.text()) || "Failed to load document");
        const j = await r.json();
        if (!stop) setDoc(j.data as DocRow);
      } catch (e: any) {
        if (!stop) setErr(e?.message || "Failed");
      } finally {
        if (!stop) setLoading(false);
      }
    })();
    return () => { stop = true; };
  }, [fetchUrl]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-neutral-900 font-sans selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden">
      
      <CurrentSidebar 
        active={section} 
        userName={userName} 
        onChange={setAndHash}
        expanded={sidebarOpen}
        setExpanded={setSidebarOpen}
      />

      <main 
        className={`
          min-h-screen transition-[padding] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
          /* FIX: Remove padding left on mobile since sidebar is overlay */
          md:pl-[88px] ${sidebarOpen ? "lg:pl-[280px]" : ""} 
          pl-0 pt-16 md:pt-0
        `}
      >
        <div className="mx-auto w-full max-w-[1600px] p-4 md:p-6 lg:p-8">
          
          <div className="mb-6 flex flex-col gap-1">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-krona text-xl md:text-2xl lg:text-3xl text-neutral-900 leading-tight break-words"
            >
              {title}
            </motion.h1>
          </div>

          {loading && (
            <div className="flex h-64 w-full flex-col items-center justify-center gap-3 text-neutral-400">
              <Loader2 className="animate-spin text-orange-500" size={32} />
              <p>Loading your study material...</p>
            </div>
          )}
          
          {err && (
            <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle size={20} />
              {err}
            </div>
          )}

          {!loading && !err && doc && (
            <AnimatePresence mode="wait">
              {section === "summarize" && (
                <motion.div
                  key="summarize"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto lg:h-[65vh] lg:min-h-[500px]">
                    
                    <div className="h-[500px] lg:h-full lg:min-h-0">
                      <SummarizeView
                        summary={doc.summary ?? ""}
                        images={(doc.image_urls ?? []).map((url, index) => ({
                          url,
                          page: index + 1,
                          label: `Figure ${index + 1}`,
                        }))}
                      />
                    </div>

                    <div className="h-[500px] lg:h-full lg:min-h-0">
                      <PdfPane url={doc.url} title={doc.title} />
                    </div>
                  </div>

                  <div className="w-full h-[600px] lg:h-[500px]">
                    <LLMView height="full" />
                  </div>
                </motion.div>
              )}

              {section === "ai" && (
                <motion.div
                  key="ai"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="h-[calc(100dvh-140px)]"
                >
                  <LLMFullView />
                </motion.div>
              )}

              {section === "flashcards" && (
                <motion.div
                  key="flashcards"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <FlashcardsView
                    cards={(doc.flashcards ?? []).map((c, i) => ({ id: String(i + 1), ...c }))}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}