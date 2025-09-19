"use client";

export default function UploadCard() {
  return (
    <div
      className="group flex h-64 w-full max-w-[480px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-[#FFE6C4] bg-[#FFF6EF] shadow-sm ring-1 ring-black/5 transition hover:bg-[#FFE8D6]/80"
      role="button"
      tabIndex={0}
      aria-label="Drop your PDF here"
    >
      <img
        src="/images/pdf.png"
        alt="PDF"
        className="mb-4 h-10 w-10 object-contain"
        draggable={false}
      />

      <div className="flex items-center gap-2 text-neutral-500">
        <img
          src="/images/Drop.png"
          alt=""
          className="h-4 w-4 object-contain opacity-80"
          draggable={false}
        />
        <span>Drop your PDF here</span>
      </div>
    </div>
  );
}
