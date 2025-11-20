"use client";

import { useRef } from "react";

type Props = { image: string; title: string; subtitle: string };

export default function FeatureCard({ image, title, subtitle }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${py * -6}deg`);
    el.style.setProperty("--ry", `${px * 6}deg`);
  };
  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className="tilt relative overflow-hidden rounded-2xl ring-1 ring-black/10 outline-none
                 transition will-change-transform hover:shadow-xl focus:shadow-xl"
      tabIndex={0}
    >
      <img src={image} alt={title} className="h-56 w-full object-cover md:h-64" draggable={false} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="font-inter text-white/95 text-lg font-semibold drop-shadow">{title}</h3>
        <p className="font-inter text-white/85 text-sm">{subtitle}</p>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/20" />
    </div>
  );
}
