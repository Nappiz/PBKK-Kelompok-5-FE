"use client";

import DecorLayer2 from "./DecorLayer2";
import Reveal from "./Reveal";

export default function Closing() {
  return (
    <section className="relative overflow-hidden min-h-[100svh] bg-[#FFFAF6]">
      {/* top separator */}
      <img
        src="/images/SeperatorUpsideDown.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2 h-[160px] w-full max-w-[1920px] object-cover select-none"
      />

      {/* background */}
      <img
        src="/images/CloseBG.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover select-none"
      />

      {/* perfectly centered content */}
      <div className="relative z-10 mx-auto grid min-h-[100svh] w-full max-w-5xl place-items-center px-6">
        <Reveal>
          <div className="text-center">
            <img
              src="/images/Mascot.png"
              alt=""
              className="mx-auto mb-6 h-16 w-16 md:h-20 md:w-20 select-none animate-float-slow"
              draggable={false}
            />
            <h2 className="font-krona text-[42px] md:text-[56px] leading-tight text-black">
              LearnWAI
            </h2>
            <p className="mt-4 font-inter text-[20px] md:text-[26px] text-neutral-800">
              Your AI Study Buddy for Everyday Learning.
            </p>
          </div>
        </Reveal>
      </div>

      <DecorLayer2 />
    </section>
  );
}
