type P = { className: string; src: string; z?: string };

export default function DecorLayer2() {
  const clouds: P[] = [
    { src: "/images/Cloud.png", className: "left-[15%] top-[80%] md:w-32 w-20" },
    { src: "/images/Cloud.png", className: "right-[8%] top-[90%] md:w-40 w-28" },
  ];

  const cloudsFlip: P[] = [
    { src: "/images/CloudUpsideDown.png", className: "right-[22%] top-[30%] md:w-28 w-20" },
    { src: "/images/CloudUpsideDown.png", className: "left-[1%] top-[40%] md:w-36 w-28" },
    { src: "/images/CloudUpsideDown.png", className: "right-[1%] top-[50%] md:w-32 w-24" },
  ];

  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-0 hidden md:block">
        {clouds.map((p, i) => (
          <img key={`c${i}`} src={p.src} alt="" className={`absolute opacity-80 ${p.className}`} />
        ))}
        {cloudsFlip.map((p, i) => (
          <img key={`cf${i}`} src={p.src} alt="" className={`absolute opacity-80 ${p.className}`} />
        ))}
      </div>
    </>
  );
}
