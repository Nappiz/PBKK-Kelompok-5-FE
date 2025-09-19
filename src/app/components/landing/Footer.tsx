"use client";

export default function Footer() {
  return (
    <footer className="bg-[#FF9540] text-black">
      <div className="mx-auto flex max-w-6xl flex-col items-stretch justify-between gap-10 px-6 py-10 md:flex-row md:items-start">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <img
              src="/images/Logo.png"
              alt="LearnWAI"
              className="h-10 w-10 md:h-12 md:w-12 select-none"
              draggable={false}
            />
            <span className="font-krona text-[22px] md:text-[24px]">LearnWAI</span>
          </div>
          <span className="mt-3 font-inter text-base md:text-lg">
            ©2025 LearnWAI, Inc.
          </span>
        </div>

        <div className="flex w-full flex-col items-start gap-6 md:w-auto md:flex-row md:items-start md:justify-end md:text-right">
          <div>
            <div className="font-inter font-semibold">Features</div>
            <ul className="mt-2 space-y-1 font-inter text-sm">
              <li>Summarizer</li>
              <li>AskAI</li>
              <li>PracticeAI</li>
            </ul>
          </div>

          <div>
            <div className="font-inter font-semibold">Social Media</div>
            <ul className="mt-2 space-y-2 font-inter text-sm">
              <li className="flex items-center gap-2 md:justify-start">
                <img src="/images/IG.png" alt="" className="h-4 w-4 select-none" />
                <span>Instagram</span>
              </li>
              <li className="flex items-center gap-2 md:justify-start">
                <img src="/images/YT.png" alt="" className="h-4 w-4 select-none" />
                <span>Youtube</span>
              </li>
              <li className="flex items-center gap-2 md:justify-start">
                <img src="/images/Linkedin.png" alt="" className="h-4 w-4 select-none" />
                <span>LinkedIn</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
