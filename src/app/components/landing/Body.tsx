"use client";

import FeatureCard from "./FeatureCard";
import HowSteps from "./HowSteps";

export default function Body() {
  return (
    <section className="relative overflow-hidden bg-white py-44 min-h-[clamp(900px,120vh,1600px)]">
      <img
        src="/images/SeperatorUpsideDown.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 z-0 -translate-x-1/2 h-[160px] w-full max-w-[1920px] object-cover select-none"
        draggable={false}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8">
        <h2 className="mb-8 text-center font-krona text-3xl md:text-4xl text-black">
          Our Features
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <FeatureCard
            image="/images/Summarizer.png"
            title="Summarizer"
            subtitle="Summarize your notes"
          />
          <FeatureCard
            image="/images/Ask.png"
            title="AskAI"
            subtitle="Ask AI to further understand your notes"
          />
          <FeatureCard
            image="/images/Practice.png"
            title="PracticeAI"
            subtitle="Let AI make practice questions for you"
          />
        </div>

        <h2 className="mt-16 mb-8 text-center font-krona text-3xl md:text-4xl text-black">
          How it Works
        </h2>

        <HowSteps
          steps={[
            { icon: "/images/Upload.png", title: "1. Upload", desc: "Drag & Drop" },
            { icon: "/images/Ai.png", title: "2. AI Summarize", desc: "Get clean notes with highlights" },
            { icon: "/images/Quiz.png", title: "3. Practice Quiz", desc: "Review with flashcards and quizzes" },
          ]}
        />
      </div>

      <img
        src="/images/Seperator.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 z-0 -translate-x-1/2 h-[180px] w-full max-w-[1920px] object-cover select-"
        draggable={false}
      />
    </section>
  );
}
