// /app/dashboard/[slug]/NoteDetailClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import CurrentSidebar from "./parts/CurrentSidebar";
import SummarizeView from "./parts/SummarizeView";
import LLMView from "./parts/LLMView";
import LLMFullView from "./LLMFullView";
import FlashcardsView from "./parts/FlashcardsView";
import PdfPane from "./parts/PdfPane"; // ⬅️ NEW
import { BASE } from "../../../lib/api";
import { getSession } from "../../../lib/session";

export type SectionKey = "summarize" | "ai" | "flashcards";

type DocRow = {
  id: string;
  title: string;
  url?: string;
  status?: string;
  summary?: string | null;
  flashcards?: { question: string; answer: string }[] | null;
  slug?: string | null;
};

export default function NoteDetailClient({ slug }: { slug: string }) {
  const fetchUrl = `${BASE}/documents/${encodeURIComponent(slug)}`;
  const [userName, setUserName] = useState<string>("");
  const [doc, setDoc] = useState<DocRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [section, setSection] = useState<SectionKey>("summarize");

  useEffect(() => {
    const s = getSession();
    const name = (s?.name ?? s?.email ?? "").toString();
    setUserName(name);
  }, []);

  const title = useMemo(() => doc?.title ?? "Document", [doc]);

  useEffect(() => {
    const map = (h: string): SectionKey | null =>
      h === "#ai"
        ? "ai"
        : h === "#flashcards"
        ? "flashcards"
        : h === "#summarize"
        ? "summarize"
        : null;

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
    return () => {
      stop = true;
    };
  }, [fetchUrl]);

  return (
    <div className="min-h-screen bg-[#FFFAF6]">
      <CurrentSidebar active={section} userName={userName} onChange={setAndHash} />

      <div
        className="w-full py-6 px-4 sm:px-6 lg:px-8"
        style={{ paddingLeft: "calc(var(--sbw, 56px) + 16px)" }}
      >
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="mb-4">
            <div className="font-krona text-[22px] md:text-[24px] text-black leading-tight">
              {title}
            </div>
            <div className="font-inter text-[12px] text-neutral-600">Review notes and ask the AI</div>
          </div>

          {loading && <div className="text-sm text-neutral-600">Loading document…</div>}
          {err && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{err}</div>
          )}

          {!loading && !err && doc && (
            <>
              {section === "summarize" && (
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                  {/* kiri: Summary */}
                  <SummarizeView summary={doc.summary ?? ""} />

                  {/* kanan: PDF asli */}
                  <PdfPane url={doc.url} title={doc.title} />

                  {/* bawah full: LLM (compact height) */}
                  <div className="xl:col-span-2">
                    <LLMView height="compact" />
                  </div>
                </div>
              )}

              {section === "ai" && <LLMFullView />}

              {section === "flashcards" && (
                <FlashcardsView
                  cards={(doc.flashcards ?? []).map((c, i) => ({ id: String(i + 1), ...c }))}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
