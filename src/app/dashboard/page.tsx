"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import UploadCta from "./components/UploadCta";
import SearchBar from "./components/SearchBar";
import NoteCard from "./components/NoteCard";
import { getSession } from "../../lib/session";
import {
  apiListDocuments,
  apiUploadDocument,
  apiJobStatus,
  apiSummarize,
  apiFlashcards,
} from "../../lib/api";

type Doc = {
  id: string;
  title: string;
  url?: string;
  created_at?: string;
};

export default function DashboardPage() {
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
        id: String(r.id ?? r.slug ?? r.title ?? ""),
        title: String(r.title ?? r.name ?? "Untitled"),
        url:
          typeof r.id === "string"
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

  useEffect(() => {
    if (!userId) return;
    fetchDocs();
  }, [userId, fetchDocs]);

  const startUpload = useCallback(
    async (file: File) => {
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
            try {
              const st = await apiJobStatus(jobId);
              setStage(`${st.stage}: ${st.message}`);
              setProgress(Math.max(15, Math.min(99, st.progress)));
              if (st.stage === "done" && st.ok) {
                clearIntervalIfAny();
                resolve();
              }
              if (st.stage === "error" || st.ok === false) {
                clearIntervalIfAny();
                reject(new Error(st.message || "Processing failed"));
              }
            } catch (err) {
              clearIntervalIfAny();
              reject(err);
            }
          };
          const clearIntervalIfAny = () => {
            if (pollRef.current) {
              clearInterval(pollRef.current);
              pollRef.current = null;
            }
          };
          tick();
          pollRef.current = setInterval(tick, 1000);
        });

        setStage("Generating summary…");
        setProgress(98);
        try {
          await apiSummarize(); 
        } catch (e) {
          console.warn("summarize warmup failed:", e);
        }

        setStage("Preparing flashcards…");
        setProgress(99);
        try {
          await apiFlashcards();
        } catch (e) {
          console.warn("flashcards warmup failed:", e);
        }

        setStage("Done!");
        setProgress(100);
        await fetchDocs();
      } catch (e: any) {
        console.error(e);
        alert(e?.message || "Upload failed");
      } finally {
        setTimeout(() => setModalOpen(false), 600); 
      }
    },
    [userId, fetchDocs]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return docs;
    return docs.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        (d.url ?? "").toLowerCase().includes(q)
    );
  }, [docs, query]);

  return (
    <div className="min-h-screen bg-[#FFFAF6] text-neutral-900">
      <Sidebar userName={userName} />

      <main className="pl-[72px] md:pl-[260px] transition-[padding]">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Topbar />

          <div className="mt-4">
            <UploadCta onFile={startUpload} />
          </div>

          <div className="mt-6">
            <div className="mb-2">
              <span className="inline-block rounded-md bg-gradient-to-r from-[#FFE970] to-[#FF8B0C] px-3 py-1 text-xs font-krona text-black">
                My Notes
              </span>
            </div>

            <SearchBar value={query} onChange={(v) => setQuery(v ?? "")} />

            <div className="mt-4 space-y-3">
              {loadingList && (
                <div className="rounded-xl border border-neutral-200 bg-white/60 p-6 text-sm text-neutral-500">
                  Loading documents…
                </div>
              )}

              {!loadingList &&
                filtered.map((d) => (
                  <NoteCard
                    key={d.id}
                    title={d.title}
                    description={new Date(d.created_at ?? Date.now()).toLocaleString()}
                    href={d.url}
                  />
                ))}

              {!loadingList && filtered.length === 0 && (
                <div className="rounded-xl border border-neutral-200 bg-white/60 p-6 text-sm text-neutral-500">
                  No notes found.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {modalOpen && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl ring-1 ring-black/10">
            <div className="font-krona text-lg">Processing document…</div>
            <div className="mt-2 text-sm text-neutral-600">{stage}</div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full bg-gradient-to-r from-[#FFE970] to-[#FF8B0C] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-3 text-right text-xs text-neutral-500">
              {progress}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
