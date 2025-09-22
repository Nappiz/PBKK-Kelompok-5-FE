"use client";

import Button from "../ui/Button";
import UploadCard from "./UploadCard";
import DecorLayer from "./DecorLayer";

export default function Hero() {
  return (
    <section aria-label="Hero" className="relative min-h-[100svh] overflow-hidden pt-20">
      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 pt-24 pb-40 md:grid-cols-2 md:gap-12">
        <div className="space-y-8">
          <h1 className="font-krona text-[50px] leading-[1.1] text-black">
            Meet LearnWAI
          </h1>

          <p className="font-inter text-[40px] leading-tight text-neutral-800">
            Your AI Study Buddy for Everyday Learning.
          </p>

          <Button className="cursor-pointer font-inter font-medium text-[20px] text-black bg-gradient-to-r from-[#FFB468] to-[#FFD270] px-7 py-3">
            Get Started
          </Button>
        </div>

        <div className="flex justify-center md:justify-end">
          <UploadCard />
        </div>
      </div>
      <DecorLayer />
    </section>
  );
}
