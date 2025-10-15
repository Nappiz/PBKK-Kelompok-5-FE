"use client";

export default function LoadingModal({
  open,
  title = "Processing document…",
  progress,
  message,
}: {
  open: boolean;
  title?: string;
  progress?: number;
  message?: string;
}) {
  if (!open) return null;
  const pct = Math.max(0, Math.min(100, progress ?? 5));
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/20 backdrop-blur">
      <div className="w-[min(92vw,520px)] rounded-2xl bg-white p-5 shadow-lg ring-1 ring-black/10">
        <div className="font-krona text-lg text-black">{title}</div>
        <p className="mt-1 text-sm text-neutral-600">{message ?? "Please wait…"}</p>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-black/10">
          <div
            className="h-full transition-[width] duration-300"
            style={{ width: `${pct}%`, background: "linear-gradient(90deg,#FFE970,#FF8B0C)" }}
          />
        </div>
      </div>
    </div>
  );
}
