"use client";

import FeatureCard from "./FeatureCard";
import HowSteps from "./HowSteps";
import Reveal from "./Reveal";
import GlowOrbs from "./GlowOrbs";

export default function Body() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-white py-36 min-h-[clamp(900px,120vh,1600px)] bg-dots"
    >
      <div className="hairline-x absolute left-0 right-0 top-0" />

      <div className="absolute inset-0">
        <GlowOrbs />
      </div>

      {/* marquee benefit */}
      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <div className="overflow-hidden rounded-xl border border-black/5 bg-white/70 py-2 backdrop-blur">
          <div className="marquee">
            <span className="mx-4 text-xs font-krona text-neutral-700">Fast summaries</span>
            <span className="mx-4 text-xs font-krona text-neutral-700">Ask anything</span>
            <span className="mx-4 text-xs font-krona text-neutral-700">Smart practice</span>
            <span className="mx-4 text-xs font-krona text-neutral-700">PDF ready</span>
            <span className="mx-4 text-xs font-krona text-neutral-700">Fast summaries</span>
            <span className="mx-4 text-xs font-krona text-neutral-700">Ask anything</span>
            <span className="mx-4 text-xs font-krona text-neutral-700">Smart practice</span>
            <span className="mx-4 text-xs font-krona text-neutral-700">PDF ready</span>
          </div>
        </div>
      </div>

      <img
        src="/images/SeperatorUpsideDown.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 z-0 -translate-x-1/2 h-[160px] w-full max-w-[1920px] object-cover select-none"
        draggable={false}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10">
        <Reveal>
          <div className="mb-10 text-center">
            <span className="inline-block rounded-full bg-[#FFE7CC] px-3 py-1 text-[11px] font-krona text-neutral-700">
              Feature Highlights
            </span>
            <h2 className="mt-3 font-krona text-3xl md:text-4xl text-black">Our Features</h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Reveal>
            <FeatureCard image="/images/Summarizer.png" title="Summarizer" subtitle="Summarize your notes" />
          </Reveal>
          <Reveal className="delay-75">
            <FeatureCard image="/images/Ask.png" title="AskAI" subtitle="Ask AI to further understand your notes" />
          </Reveal>
          <Reveal className="delay-150">
            <FeatureCard image="/images/Practice.png" title="PracticeAI" subtitle="Let AI make practice questions for you" />
          </Reveal>
        </div>

        <Reveal className="mt-20 block">
          <div className="text-center">
            <span className="inline-block rounded-full bg-[#FFE7CC] px-3 py-1 text-[11px] font-krona text-neutral-700">
              Get Started in 3 steps
            </span>
            <h2 className="mt-3 font-krona text-3xl md:text-4xl text-black">How it Works</h2>
          </div>
        </Reveal>

        <Reveal className="mt-10 block">
          <HowSteps
            steps={[
              { icon: "/images/Upload.png", title: "1. Upload",       desc: "Drag & Drop" },
              { icon: "/images/Ai.png",     title: "2. AI Summarize",  desc: "Get clean notes with highlights" },
              { icon: "/images/Quiz.png",   title: "3. Practice Quiz", desc: "Review with flashcards and quizzes" },
            ]}
          />
        </Reveal>
      </div>

      <img
        src="/images/Seperator.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 z-0 -translate-x-1/2 h-[180px] w-full max-w-[1920px] object-cover"
        draggable={false}
      />
    </section>
  );
}
