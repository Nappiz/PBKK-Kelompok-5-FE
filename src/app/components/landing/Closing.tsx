"use client";

import DecorLayer2 from "./DecorLayer2";

export default function Closing() {
  return (
    <section
      className="relative overflow-hidden min-h-[100svh] bg-[#FFFAF6]"
    >
      <img
        src="/images/SeperatorUpsideDown.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2 h-[160px] w-full max-w-[1920px] object-cover select-none"
        draggable={false}
      />

      <img
        src="/images/CloseBG.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover select-none"
        draggable={false}
      />

      <div className="absolute inset-0 z-10 mx-auto flex max-w-5xl flex-col items-center justify-center px-6 text-center">
        <img
          src="/images/Mascot.png"
          alt=""
          className="mb-6 h-16 w-16 md:h-20 md:w-20 select-none"
          draggable={false}
        />
        <h2 className="font-krona text-[42px] md:text-[56px] leading-tight text-black">
          LearnWAI
        </h2>
        <p className="mt-4 font-inter text-[20px] md:text-[26px] text-neutral-800">
          Your AI Study Buddy for Everyday Learning.
        </p>
      </div>
      <DecorLayer2 />
    </section>
  );
}
