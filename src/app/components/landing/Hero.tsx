"use client";

import Button from "../ui/Button";
import UploadCard from "./UploadCard";
import DecorLayer from "./DecorLayer";
import GlowOrbs from "./GlowOrbs";
import Reveal from "./Reveal";

export default function Hero() {
  const onCta = () => document.querySelector("#features")?.scrollIntoView({ behavior:"smooth", block:"start" });

  return (
    <section aria-label="Hero" className="relative min-h-[100svh] overflow-hidden pt-20">
      <div className="noise absolute inset-0" aria-hidden />
      <GlowOrbs />

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 pt-24 pb-40 md:grid-cols-2 md:gap-12">
        <Reveal>
          <div className="space-y-8">
            <h1 className="font-krona text-[52px] md:text-[60px] leading-[1.06] text-black drop-shadow-[0_1px_0_rgba(0,0,0,.04)]">
              Meet LearnWAI
            </h1>
            <p className="font-inter text-[34px] md:text-[40px] leading-tight text-neutral-800">
              Your AI Study Buddy for Everyday Learning.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={onCta}
                className="btn-shine cursor-pointer font-inter font-semibold text-[18px] text-black
                           bg-gradient-to-r from-[#FFB468] to-[#FFD270] px-6 py-3 rounded-xl shadow-sm
                           hover:shadow-md active:translate-y-px focus:outline-none focus:ring-2 focus:ring-black/10"
              >
                Get Started
              </Button>
              <a href="#features"
                 className="font-inter rounded-xl border border-black/10 bg-white/70 px-5 py-3 text-[14px] text-neutral-800 backdrop-blur
                            hover:bg-white transition">
                See Features
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal className="delay-100">
          <div className="flex justify-center md:justify-end">
            <UploadCard />
          </div>
        </Reveal>
      </div>

      <DecorLayer />
    </section>
  );
}
