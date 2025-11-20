"use client";

import { useEffect, useRef, useState } from "react";
import { clearSession } from "../../../../lib/session";

type Props = {
  active?: "summarize" | "ai" | "flashcards";
  onChange?: (k: "summarize" | "ai" | "flashcards") => void;
  userName: string;
};

export default function CurrentSidebar({ active = "summarize", onChange, userName }: Props) {
  const [expanded, setExpanded] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const BASE = "/learnwai";

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const apply = () => {
      const exp = mql.matches; 
      setExpanded(exp);
      document.documentElement.style.setProperty("--sbw", exp ? "256px" : "56px");
    };
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const isMd = window.matchMedia("(min-width: 768px)").matches;
    document.documentElement.style.setProperty("--sbw", isMd ? (expanded ? "256px" : "56px") : "0px");
  }, [expanded]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen]);

  function onLogout() {
    clearSession();
    window.location.href = `${BASE}/`;
  }

  return (
    <>
      <button
        aria-label="Toggle sidebar"
        onClick={() => setExpanded((v) => !v)}
        className="fixed left-3 top-3 z-40 inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-[#FFFAF6]/90 backdrop-blur md:hidden"
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="black" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <aside
        className={[
          "fixed inset-y-0 left-0 z-30",
          "bg-gradient-to-b from-[#FFE970] to-[#FF8B0C]",
          "shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]",
          "transition-all duration-300 ease-out",
          expanded ? "w-64" : "w-[56px]",
        ].join(" ")}
      >
        <div className="flex items-center gap-2 px-4 pt-4">
          <img src="/images/Logo.png" alt="LearnWAI" className="h-7 w-7" />
          {expanded && <span className="font-krona text-sm text-black">LearnWAI</span>}
          <div className="ml-auto hidden md:block">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="cursor-pointer inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/60 bg-white/10"
              aria-label="Collapse"
            >
              {expanded ? (
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path d="M15 6l-6 6 6 6" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path d="M9 6l6 6-6 6" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <nav className="mt-6 space-y-1 px-2">
          <a
            href={`${BASE}/dashboard`}
            className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-black hover:bg-white/15"
            title="Back to Dashboard"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-black/10">
              <img src="/images/home.png" alt="" className="h-5 w-5" />
            </span>
            {expanded && <span>Back to Dashboard</span>}
          </a>

          <button
            onClick={() => onChange?.("summarize")}
            className={[
              "cursor-pointer flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm hover:bg-white/15",
              active === "summarize" ? "bg-white/20 font-medium text-black" : "text-black/90",
            ].join(" ")}
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-black/10">
              <img src="/images/summarize.png" alt="" className="h-5 w-5" />
            </span>
            {expanded && <span>Summarize</span>}
          </button>

          <button
            onClick={() => onChange?.("ai")}
            className={[
              "cursor-pointer flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm hover:bg-white/15",
              active === "ai" ? "bg-white/20 font-medium text-black" : "text-black/90",
            ].join(" ")}
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-black/10">
              <img src="/images/Ai.png" alt="" className="h-5 w-5" />
            </span>
            {expanded && <span>AI LLM</span>}
          </button>

          <button
            onClick={() => onChange?.("flashcards")}
            className={[
              "cursor-pointer flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm hover:bg-white/15",
              active === "flashcards" ? "bg-white/20 font-medium text-black" : "text-black/90",
            ].join(" ")}
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-black/10">
              <img src="/images/flash.png" alt="" className="h-5 w-5" />
            </span>
            {expanded && <span>Flashcards</span>}
          </button>
        </nav>

        <div className="absolute bottom-3 left-0 right-0 px-3" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="cursor-pointer flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs text-black hover:bg-white/20"
            style={{ backgroundColor: "rgba(255,255,255,.15)" }}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/50">
              <svg width="14" height="14" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" fill="black" fillOpacity="0.5" />
                <path d="M4 20c2-4 14-4 16 0" fill="black" fillOpacity="0.3" />
              </svg>
            </span>
            {expanded && (
              <div className="min-w-0" suppressHydrationWarning>
                <div className="truncate font-krona text-[11px]">
                  {userName || "—"}
                </div>
                <div className="text-[10px] opacity-70">Logged in</div>
              </div>
            )}
            {expanded && (
              <svg className="ml-auto" width="14" height="14" viewBox="0 0 24 24">
                <path d="M6 9l6 6 6-6" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            )}
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute bottom-14 left-3 right-3 z-40 rounded-lg border border-black/10 bg-white/95 p-2 text-sm shadow-lg"
            >
              <button
                onClick={onLogout}
                className="cursor-pointer text-black flex w-full items-center gap-2 rounded-md px-3 py-2 text-left hover:bg-black/5"
                role="menuitem"
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path d="M10 17l5-5-5-5" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M4 12h11" stroke="black" strokeWidth="2" />
                </svg>
                Log out
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
