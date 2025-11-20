export default function GlowOrbs() {
  return (
    <>
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full blur-3xl opacity-40"
           style={{ background: "radial-gradient(closest-side, #FFD270, transparent)" }} />
      <div className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full blur-[72px] opacity-35"
           style={{ background: "radial-gradient(closest-side, #FFB468, transparent)" }} />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-64 w-64 rounded-full blur-[64px] opacity-30"
           style={{ background: "radial-gradient(closest-side, #FFE6C4, transparent)" }} />
    </>
  );
}
