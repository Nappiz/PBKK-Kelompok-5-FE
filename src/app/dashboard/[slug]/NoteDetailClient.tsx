"use client";

import { useEffect, useMemo, useState } from "react";
import CurrentSidebar from "./parts/CurrentSidebar";
import SummarizeView from "./parts/SummarizeView";
import LLMView from "./parts/LLMView";
import LLMFullView from "./LLMFullView";
import FlashcardsView from "./parts/FlashcardsView";

export type SectionKey = "summarize" | "ai" | "flashcards";

export default function NoteDetailClient({ slug }: { slug: string }) {
  const title = useMemo(() => {
    const s = decodeURIComponent(slug || "");
    return s ? s.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()) : "Dummy Title";
  }, [slug]);

  const [section, setSection] = useState<SectionKey>("summarize");

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

  return (
    <div className="min-h-screen bg-[#FFFAF6]">
      <CurrentSidebar active={section} onChange={setAndHash} />

      <div
        className="w-full py-6 px-4 sm:px-6 lg:px-8"
        style={{ paddingLeft: "calc(var(--sbw, 56px) + 16px)" }}
      >
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="mb-4">
            <div className="font-krona text-[22px] md:text-[24px] text-black leading-tight">{title}</div>
            <div className="font-inter text-[12px] text-neutral-600">Review notes and ask the AI</div>
          </div>

          {section === "summarize" && (
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_560px]">
              <SummarizeView />
              <LLMView />
            </div>
          )}

          {section === "ai" && <LLMFullView />}

          {section === "flashcards" && <FlashcardsView />}
        </div>
      </div>
    </div>
  );
}
