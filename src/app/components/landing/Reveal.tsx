"use client";

import { useEffect, useRef } from "react";

export default function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && el.classList.add("in")),
      { threshold: 0.14 }
    );
    el && io.observe(el);
    return () => el && io.unobserve(el);
  }, []);

  return <div ref={ref} className={`reveal ${className || ""}`}>{children}</div>;
}
