"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Shuffle, Play, Pause, Sparkles, Zap } from "lucide-react";

type Card = { id: string; question: string; answer: string };

function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FlashcardsView({ cards }: { cards: Card[] }) {
  const deck = useMemo(() => cards ?? [], [cards]);
  const [order, setOrder] = useState<number[]>([]);
  const [index, setIndex] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    setOrder(deck.map((_, i) => i));
    setIndex(0);
    setReveal(false);
    setShuffled(false);
  }, [deck]);

  const currentCard = useMemo(() => (deck.length && order.length ? deck[order[index]] : null), [deck, order, index]);
  const progress = deck.length ? ((index + 1) / deck.length) * 100 : 0;

  useEffect(() => {
    let interval: any;
    if (autoplay && deck.length) {
      interval = setInterval(() => {
        handleNext();
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [autoplay, deck.length]);

  const handleNext = () => {
    setDirection(1);
    setReveal(false);
    setIndex((i) => (i + 1) % deck.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setReveal(false);
    setIndex((i) => (i - 1 + deck.length) % deck.length);
  };

  const toggleShuffle = () => {
    if (!deck.length) return;
    setShuffled((prev) => {
      const next = !prev;
      const base = deck.map((_, i) => i);
      setOrder(next ? shuffle(base) : base);
      setIndex(0);
      setReveal(false);
      return next;
    });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setReveal((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deck.length]);

  const startX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 50) dx < 0 ? handleNext() : handlePrev();
    startX.current = null;
  };

  if (!currentCard) return (
    <div className="flex flex-col items-center justify-center h-[400px] text-neutral-400">
        <div className="bg-neutral-100 p-3 rounded-full mb-3"><Sparkles size={20} /></div>
        <p className="text-sm">Generating flashcards...</p>
    </div>
  );

  return (
    <section className="relative flex flex-col justify-start md:justify-center py-4 select-none w-full max-w-4xl mx-auto min-h-[calc(100dvh-100px)] md:min-h-0">
      
      <div className="mb-4 md:mb-6 px-2 flex items-end justify-between">
        <div>
            <h2 className="font-krona text-lg md:text-xl text-neutral-900">Flashcards</h2>
            <p className="text-[10px] md:text-xs text-neutral-500 mt-0.5">Tap card to flip • Swipe to navigate</p>
        </div>
        <div className="flex flex-col items-end gap-1">
            <span className="font-mono text-xs font-medium text-neutral-400 bg-white px-2 py-1 rounded-lg border border-neutral-100 shadow-sm">
                <span className="text-neutral-900">{index + 1}</span> / {deck.length}
            </span>
        </div>
      </div>

      <div className="px-2 mb-4 md:mb-6">
        <div className="h-1 w-full bg-neutral-200 rounded-full overflow-hidden">
            <motion.div 
                className="h-full bg-gradient-to-r from-orange-400 to-orange-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
            />
        </div>
      </div>

      <div className="w-full px-1 md:px-2 flex-1 flex flex-col">
        <motion.div 
            className="relative flex-1 overflow-hidden rounded-[24px] bg-white shadow-lg shadow-orange-900/5 ring-1 ring-black/5"
            whileTap={{ scale: 0.995 }}
        >
             <div className="absolute top-0 right-0 w-32 md:w-48 h-32 md:h-48 bg-gradient-to-br from-orange-50/50 to-transparent rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-32 md:w-48 h-32 md:h-48 bg-gradient-to-tr from-yellow-50/40 to-transparent rounded-full blur-2xl -ml-12 -mb-12 pointer-events-none" />

            <div 
                className="relative h-full min-h-[50vh] md:min-h-[360px] flex flex-col cursor-pointer"
                onClick={() => setReveal(!reveal)}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                <AnimatePresence initial={false} mode="popLayout" custom={direction}>
                    <motion.div
                        key={index}
                        custom={direction}
                        initial={{ opacity: 0, x: direction * 30, filter: "blur(4px)" }}
                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, x: direction * -30, filter: "blur(4px)" }}
                        transition={{ type: "spring", stiffness: 350, damping: 35 }}
                        className="flex-1 flex flex-col items-center justify-center text-center p-6 md:p-12"
                    >
                        <div className="w-full max-w-2xl mx-auto overflow-y-auto max-h-[60vh] custom-scrollbar">
                            <AnimatePresence mode="wait">
                                {!reveal ? (
                                    <motion.div
                                        key="question"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="py-2"
                                    >
                                        <span className="inline-block px-2.5 py-0.5 mb-4 md:mb-6 rounded-full bg-orange-50 text-orange-600 text-[10px] font-bold tracking-widest uppercase border border-orange-100">
                                            Question
                                        </span>
                                        <h3 className="font-sans font-medium text-lg sm:text-xl md:text-2xl lg:text-3xl text-neutral-900 leading-snug text-balance">
                                            {currentCard.question}
                                        </h3>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="answer"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="py-2"
                                    >
                                        <span className="inline-block px-2.5 py-0.5 mb-4 md:mb-6 rounded-full bg-green-50 text-green-600 text-[10px] font-bold tracking-widest uppercase border border-green-100">
                                            Answer
                                        </span>
                                        <p className="font-sans text-base sm:text-lg md:text-xl lg:text-2xl text-neutral-800 leading-relaxed text-balance">
                                            {currentCard.answer}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
                     <motion.div 
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-400 bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full"
                     >
                        {!reveal ? (
                            <><Zap size={12} className="text-orange-400 fill-orange-400" /> Tap to Reveal</>
                        ) : (
                            <><ArrowRight size={12} className="text-neutral-400" /> Tap for Question</>
                        )}
                     </motion.div>
                </div>
            </div>
        </motion.div>
      </div>

      <div className="mt-4 md:mt-6 w-full px-1 md:px-2 pb-6 md:pb-0">
        <div className="grid grid-cols-4 md:flex md:items-center md:justify-between gap-3 md:gap-4">
            <button 
                onClick={handlePrev}
                disabled={!deck.length}
                className="col-span-1 md:w-auto group px-3 md:px-4 py-3 md:py-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer text-sm font-medium shadow-sm active:scale-95"
            >
                <ArrowLeft size={18} className="md:group-hover:-translate-x-0.5 transition-transform" />
                <span className="hidden md:inline">Prev</span>
            </button>

            <div className="col-span-2 md:w-auto flex items-center justify-center gap-1 bg-white p-1.5 rounded-xl border border-neutral-200 shadow-sm">
                <ToggleBtn 
                    active={autoplay} 
                    onClick={() => setAutoplay(!autoplay)} 
                    icon={autoplay ? <Pause size={16} /> : <Play size={16} />} 
                    label="Auto"
                />
                <div className="w-px h-4 bg-neutral-200 mx-1" />
                <ToggleBtn 
                    active={shuffled} 
                    onClick={toggleShuffle} 
                    icon={<Shuffle size={16} />} 
                    label="Shuffle"
                />
            </div>

            <button 
                onClick={handleNext}
                disabled={!deck.length}
                className="col-span-1 md:w-auto group px-3 md:px-6 py-3 md:py-2.5 rounded-xl bg-neutral-900 text-white shadow-md shadow-neutral-900/20 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer text-sm font-medium active:scale-95"
            >
                <span className="hidden md:inline">Next</span>
                <ArrowRight size={18} className="md:group-hover:translate-x-0.5 transition-transform" />
            </button>
        </div>
      </div>
    </section>
  );
}

function ToggleBtn({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <button 
            onClick={onClick}
            className={`
                flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer select-none
                ${active 
                    ? "bg-orange-50 text-orange-700 ring-1 ring-orange-200" 
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                }
            `}
            title={label}
        >
            {icon}
            <span className="hidden sm:inline">{label}</span>
        </button>
    )
}