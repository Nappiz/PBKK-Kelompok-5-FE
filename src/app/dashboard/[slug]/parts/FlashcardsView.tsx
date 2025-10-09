"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Card = { id: string; question: string; answer: string };
const DECK: Card[] = [
  { id: "1", question: "Who is the main protagonist?", answer: "Tony Soprano." },
  { id: "2", question: "Therapist name?", answer: "Dr. Jennifer Melfi." },
  { id: "3", question: "Where is it set?", answer: "New Jersey & New York." },
  { id: "4", question: "Why does Tony see a therapist?", answer: "Recurring panic attacks & stress." },
  { id: "5", question: "Family business?", answer: "He’s a mob boss balancing family & work." },
];

function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FlashcardsView() {
  const [order, setOrder] = useState<number[]>(() => DECK.map((_, i) => i));
  const [index, setIndex] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [dir, setDir] = useState<"next" | "prev">("next");

  const card = useMemo(() => DECK[order[index]], [order, index]);
  const pct = ((index + 1) / order.length) * 100;

  // autoplay
  const timerRef = useRef<number | null>(null);
  useEffect(() => {
    if (!autoplay) { if (timerRef.current) window.clearInterval(timerRef.current); timerRef.current = null; return; }
    timerRef.current = window.setInterval(() => goNext(), 4000);
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); timerRef.current = null; };
  }, [autoplay, index, order]);

  function goNext() { setDir("next"); setReveal(false); setIndex((i) => (i + 1) % order.length); }
  function goPrev() { setDir("prev"); setReveal(false); setIndex((i) => (i - 1 + order.length) % order.length); }
  function toggleShuffle() {
    setShuffled((s) => {
      const next = !s;
      const base = DECK.map((_, i) => i);
      setOrder(next ? shuffle(base) : base);
      setIndex(0);
      setReveal(false);
      return next;
    });
  }

  // keyboard + swipe
  const startX = useRef<number | null>(null);
  function onTouchStart(e: React.TouchEvent) { startX.current = e.touches[0].clientX; }
  function onTouchEnd(e: React.TouchEvent) {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 40) dx < 0 ? goNext() : goPrev();
    startX.current = null;
  }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "ArrowRight") goNext(); if (e.key === "ArrowLeft") goPrev(); if (e.key === " ") setReveal((v) => !v); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="relative min-h-[calc(100svh-140px)]">
      <div className="mb-4 text-center px-4">
        <h2 className="font-krona text-[20px] sm:text-[24px] md:text-[28px] text-black leading-tight">
          Dummy Title
        </h2>
      </div>

      <img
        src="/images/Mascot.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-310 bottom-[50px] hidden h-14 w-14 select-none md:block lg:right-6 lg:h-16 lg:w-16"
        draggable={false}
      />

      <div className="mx-auto w-full max-w-[1100px] px-3 sm:px-4 md:px-6">
        <div className="mb-3 flex items-center gap-3">
          <div
            className="relative h-2 w-full overflow-hidden rounded-full bg-black/10"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pct)}
            aria-label="Flashcards progress"
          >
            <div
              className="h-full transition-[width] duration-300 ease-out"
              style={{
                width: `${pct}%`,
                background: "linear-gradient(90deg,#FFE970,#FF8B0C)",
              }}
            />
          </div>
          <span className="whitespace-nowrap font-inter text-xs sm:text-sm text-neutral-700">
            {index + 1} / {order.length}
          </span>
        </div>

        <CardStage
          key={card.id + "-" + index + "-" + dir}
          direction={dir}
          onTap={() => setReveal((v) => !v)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="cursor-pointer relative grid w-full place-items-center rounded-2xl border border-[#FFBD71] bg-[#FFE6C9] px-4 sm:px-6 text-center shadow-sm"
            style={{ height: "clamp(240px,56vh,440px)" }}
            role="button"
            tabIndex={0}
            aria-label={reveal ? "Show question" : "Reveal answer"}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setReveal((v) => !v); }}
          >
            <div className="max-w-[820px]">
              {!reveal ? (
                <>
                  <div className="mb-4 sm:mb-6 font-krona text-[18px] sm:text-[20px] md:text-[22px] text-black">
                    Question Section
                  </div>
                  <p className="font-inter text-base sm:text-lg md:text-xl text-neutral-800 px-1">
                    {card.question}
                  </p>
                  <div className="pointer-events-none absolute bottom-3 sm:bottom-4 left-0 right-0 text-center font-inter text-xs sm:text-sm text-neutral-700/80">
                    Tap to Reveal Answer
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4 sm:mb-6 font-krona text-[18px] sm:text-[20px] md:text-[22px] text-black">
                    Answer
                  </div>
                  <p className="font-inter text-base sm:text-lg md:text-xl text-neutral-900 px-1">
                    {card.answer}
                  </p>
                </>
              )}
            </div>
          </div>
        </CardStage>
      </div>

      <div className="mx-auto mt-5 grid w-full max-w-[980px] grid-cols-1 gap-3 px-3 sm:px-4 md:grid-cols-3 md:items-center">
        <button
          onClick={goPrev}
          className="cursor-pointer group inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-black ring-1 ring-black/10 bg-[#F6D2C9] md:justify-start"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#D86C5A] text-white group-active:translate-y-[1px]">←</span>
          <span className="font-inter text-sm sm:text-base">Previous</span>
        </button>

        <div className="flex items-center justify-center gap-3 sm:gap-5 md:justify-center">
          <Toggle
            on={autoplay}
            onToggle={() => setAutoplay((v) => !v)}
            label="Auto"
            icon={<svg viewBox="0 0 24 24" width="18" height="18"><path d="M8 5v14l11-7-11-7z" fill="currentColor"/></svg>}
          />
          <Toggle
            on={shuffled}
            onToggle={toggleShuffle}
            label="Shuffle"
            icon={<svg viewBox="0 0 24 24" width="18" height="18"><path d="M4 4h4l12 12M20 4h-4l-2 2M4 20h4l2-2M20 20h-4l-2-2" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>}
          />
        </div>

        <button
          onClick={goNext}
          className="cursor-pointer group inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-black ring-1 ring-black/10 md:justify-end"
          style={{ background: "linear-gradient(90deg,#A6E6C6,#7AD39E)" }}
        >
          <span className="font-inter text-sm sm:text-base">Next</span>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-black/80 text-white group-active:translate-y-[1px]">→</span>
        </button>
      </div>
    </section>
  );
}

function Toggle({ on, onToggle, label, icon }: { on: boolean; onToggle: () => void; label: string; icon: React.ReactNode; }) {
  return (
    <button
      onClick={onToggle}
      className={["cursor-pointer flex items-center gap-2 rounded-full px-4 py-2 text-sm ring-1 ring-black/10", on ? "text-black bg-gradient-to-r from-[#FFE970] to-[#FF8B0C]" : "bg-white text-neutral-800"].join(" ")}
      aria-pressed={on}
    >
      <span className="opacity-90">{icon}</span>
      <span className="font-inter">{label}</span>
    </button>
  );
}

function CardStage({ children, direction, onTap, onTouchStart, onTouchEnd }: { children: React.ReactNode; direction: "next" | "prev"; onTap: () => void; onTouchStart?: (e: React.TouchEvent) => void; onTouchEnd?: (e: React.TouchEvent) => void; }) {
  return (
    <div
      onClick={onTap}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className={["relative w-full select-none", "animate-[enter_320ms_ease]", direction === "next" ? "" : "animate-[enterBack_320ms_ease]"].join(" ")}
      style={{ padding: "1px", borderRadius: "18px", background: "linear-gradient(90deg,#FFE970,#FF8B0C)" }}
    >
      <div className="rounded-[16px] bg-[#FFFAF6] p-1">{children}</div>
      <style jsx>{`
        @keyframes enter { 0% { opacity: 0; transform: translateX(18px);} 100% { opacity: 1; transform: translateX(0);} }
        @keyframes enterBack { 0% { opacity: 0; transform: translateX(-18px);} 100% { opacity: 1; transform: translateX(0);} }
      `}</style>
    </div>
  );
}
