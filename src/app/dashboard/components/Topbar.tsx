export default function Topbar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="font-krona text-2xl md:text-3xl tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Ubah PDF-mu jadi ringkasan dan flashcard yang siap dipelajari.
        </p>
      </div>
      <div className="flex items-center gap-2 rounded-2xl border border-white/60 bg-white/80 px-3 py-2 text-[11px] text-slate-600 shadow-[0_14px_40px_rgba(15,23,42,0.12)] backdrop-blur">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-xl bg-amber-100 text-[10px] font-semibold text-amber-800">
          BETA
        </span>
        <span className="hidden sm:inline">
          LearnWAI – Study smarter, not harder.
        </span>
      </div>
    </div>
  );
}
