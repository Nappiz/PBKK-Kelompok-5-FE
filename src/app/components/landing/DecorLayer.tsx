type P = { className: string; src: string; z?: string };

export default function DecorLayer() {
  const clouds: P[] = [
    { src: "/images/Cloud.png", className: "left-[5%] top-[64%] md:w-32 w-20" },
    { src: "/images/Cloud.png", className: "right-[8%] top-[70%] md:w-40 w-28" },
    { src: "/images/Cloud.png", className: "left-[25%] top-[80%] md:w-32 w-24" },
  ];

  const cloudsFlip: P[] = [
    { src: "/images/CloudUpsideDown.png", className: "right-[5%] top-[35%] md:w-28 w-20" },
    { src: "/images/CloudUpsideDown.png", className: "left-[1%] top-[20%] md:w-36 w-28" },
    { src: "/images/CloudUpsideDown.png", className: "right-[50%] top-[50%] md:w-32 w-24" },
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

      <img src="/images/Mascot.png" alt="" className=" pointer-events-none absolute z-20
          right-[14%] top-[17%] w-15
          md:left-[33%] md:top-[13%] md:w-20
          lg:left-[42%] lg:top-[15%] lg:w-20
        "
      />

      <img src="/images/Seperator.png" alt="" className="pointer-events-none absolute bottom-0 left-1/2 z-10 -translate-x-1/2 w-screen md:w-screen lg:w-screen"/>
    </>
  );
}
