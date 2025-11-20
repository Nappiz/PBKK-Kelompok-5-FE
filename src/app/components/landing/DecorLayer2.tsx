"use client";
import { useEffect, useRef } from "react";

type P = { className: string; src: string; };

export default function DecorLayer2() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const onScroll = () => {
      const y = window.scrollY;
      el.style.setProperty("--par2", String(Math.min(1, y / 800)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const clouds: P[] = [
    { src: "/images/Cloud.png",          className: "left-[15%] top-[80%] md:w-32 w-20 animate-float-slow" },
    { src: "/images/Cloud.png",          className: "right-[8%] top-[90%] md:w-40 w-28 animate-float-slower" },
  ];
  const cloudsFlip: P[] = [
    { src: "/images/CloudUpsideDown.png", className: "right-[22%] top-[30%] md:w-28 w-20 animate-float-slower" },
    { src: "/images/CloudUpsideDown.png", className: "left-[1%] top-[40%] md:w-36 w-28 animate-float-slow" },
    { src: "/images/CloudUpsideDown.png", className: "right-[1%] top-[50%] md:w-32 w-24 animate-float-slower" },
  ];

  return (
    <div ref={root} className="pointer-events-none absolute inset-0 z-0 hidden md:block">
      {clouds.map((p, i) => (
        <img key={`c${i}`} src={p.src} alt="" className={`absolute opacity-80 ${p.className}`}
             style={{ transform: "translateY(calc(var(--par2,0) * -10px))" }} />
      ))}
      {cloudsFlip.map((p, i) => (
        <img key={`cf${i}`} src={p.src} alt="" className={`absolute opacity-80 ${p.className}`}
             style={{ transform: "translateY(calc(var(--par2,0) * 10px))" }} />
      ))}
    </div>
  );
}
