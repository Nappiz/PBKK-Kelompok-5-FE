"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="fixed inset-x-0 top-4 z-30" style={{ ["--nav-h" as any]: "70px" }}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-28" style={{ height: "var(--nav-h)" }}>
        <nav className="flex h-full items-center justify-between rounded-full bg-gradient-to-r from-[#FFFAF6] to-[#FFE7CC] px-4 sm:px-6 ring-1 ring-black/5">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="LearnWAI" className="h-10 w-10 object-contain" draggable={false}/>
            <span className="font-krona text-[18px] sm:text-[20px] text-black"> LearnWAI </span>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <a href="#register" className="font-krona text-black rounded-full border border-white bg-transparent px-5 py-1.5 text-[15px] hover:bg-white/20">
              Register
            </a>
            <a href="#login" className="font-krona text-black rounded-full border border-white bg-transparent px-5 py-1.5 text-[15px] hover:bg-white/20">
              Login
            </a>
          </div>

          <button
            aria-label="Open menu"
            aria-controls="mobile-menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-transparent"
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="black" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" stroke="black" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </nav>
      </div>

      {open && ( <div className="fixed inset-0 z-20 md:hidden" onClick={() => setOpen(false)}/>)}

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        className={`md:hidden absolute right-4 top-[calc(70px+1rem)] z-30
                    w-[min(88vw,320px)] origin-top-right rounded-2xl
                    bg-gradient-to-r from-[#FFFAF6] to-[#FFE7CC]
                    ring-1 ring-black/10 transition-all
                    ${open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"}`}
      >
        <div className="p-4">
          <a
            href="#register"
            className="block w-full rounded-full border border-white bg-transparent
                       px-5 py-3 text-center font-krona text-black text-[15px] hover:bg-white/20"
            onClick={() => setOpen(false)}
          >
            Register
          </a>
          <a
            href="#login"
            className="mt-3 block w-full rounded-full border border-white bg-transparent px-5 py-3 text-center font-krona text-black text-[15px] hover:bg-white/20"
            onClick={() => setOpen(false)}
          >
            Login
          </a>
        </div>
      </div>
    </header>
  );
}
