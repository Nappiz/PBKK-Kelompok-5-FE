"use client";
import { useEffect, useRef } from "react";

type P = { className: string; src: string; };

export default function DecorLayer() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const onScroll = () => {
      const y = window.scrollY;
      el.style.setProperty("--par", String(Math.min(1, y / 600)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const clouds: P[] = [
    { src: "/images/Cloud.png",          className: "left-[5%] top-[64%] md:w-32 w-20 animate-float-slow" },
    { src: "/images/Cloud.png",          className: "right-[8%] top-[70%] md:w-40 w-28 animate-float-slower" },
    { src: "/images/Cloud.png",          className: "left-[25%] top-[80%] md:w-32 w-24 animate-float-slow" },
  ];
  const cloudsFlip: P[] = [
    { src: "/images/CloudUpsideDown.png", className: "right-[5%] top-[35%] md:w-28 w-20 animate-float-slower" },
    { src: "/images/CloudUpsideDown.png", className: "left-[1%] top-[20%] md:w-36 w-28 animate-float-slow" },
    { src: "/images/CloudUpsideDown.png", className: "right-[50%] top-[50%] md:w-32 w-24 animate-float-slower" },
  ];

  return (
    <div ref={root} className="pointer-events-none absolute inset-0 z-0">
      <div className="hidden md:block">
        {clouds.map((p, i) => (
          <img key={`c${i}`} src={p.src} alt="" className={`absolute opacity-80 ${p.className}`}
               style={{ transform: "translateY(calc(var(--par,0) * -8px))" }} />
        ))}
        {cloudsFlip.map((p, i) => (
          <img key={`cf${i}`} src={p.src} alt="" className={`absolute opacity-80 ${p.className}`}
               style={{ transform: "translateY(calc(var(--par,0) * 8px))" }} />
        ))}
      </div>

      <img
        src="/images/Mascot.png"
        alt=""
        className="absolute z-20
                   right-[14%] top-[17%]
                   md:left-[39%] md:top-[13%]
                   lg:left-[35%] lg:top-[22%]
                   w-16 md:w-20 lg:w-20 animate-float-slow"
        style={{ transform: "translateY(calc(var(--par,0) * -10px))" }}
      />

      <img
        src="/images/Seperator.png"
        alt=""
        className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2 w-screen"
      />
    </div>
  );
}
