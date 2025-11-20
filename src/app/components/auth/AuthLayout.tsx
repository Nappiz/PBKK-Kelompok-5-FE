"use client";

type Props = { title: string; subtitle?: string; children: React.ReactNode };

export default function AuthLayout({ title, subtitle, children }: Props) {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#FFFAF3]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 600px at 80% -10%, #FFD9A6 0%, transparent 60%), radial-gradient(900px 500px at -10% 20%, #FFF0DA 0%, transparent 60%)",
        }}
      />
      <div className="pointer-events-none absolute -left-24 top-1/3 h-64 w-64 rounded-full bg-[#FFD270] opacity-30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-1/4 h-72 w-72 rounded-full bg-[#FFB468] opacity-30 blur-3xl" />

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-6xl grid-cols-1 items-center gap-12 px-6 py-10 md:grid-cols-2">
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl bg-white/70 p-7 shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-black/10 backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-3">
              <img src="/images/Logo.png" alt="" className="h-8 w-8" />
              <span className="font-krona text-xl text-black">LearnWAI</span>
            </div>
            <h1 className="font-krona text-3xl text-black">{title}</h1>
            {subtitle ? (
              <p className="mt-2 font-inter text-sm text-neutral-700">{subtitle}</p>
            ) : null}

            <div className="mt-6">{children}</div>

            <p className="mt-6 text-center font-inter text-xs text-neutral-500">
              By continuing, you agree to our Terms & Privacy Policy.
            </p>
          </div>
        </div>

        <div className="relative hidden md:flex items-center justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute -left-6 -top-6 h-24 w-24 rounded-3xl bg-white/40 blur-xl" />
            <div className="absolute -right-6 -bottom-8 h-28 w-28 rounded-full bg-[#FFD270]/40 blur-2xl" />
            <div className="relative rounded-3xl border border-white/50 bg-white/40 p-10 text-center backdrop-blur-xl">
              <img src="/images/Mascot.png" alt="" className="mx-auto mb-6 h-20 w-20" />
              <div className="font-krona text-4xl text-black">Study smarter.</div>
              <p className="mt-3 font-inter text-neutral-700">
                Upload PDFs, get clean summaries, and practice with quizzes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
