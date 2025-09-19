type Step = { icon: string; title: string; desc: string };

export default function HowSteps({ steps }: { steps: Step[] }) {
  return (
    <div className="grid grid-cols-1 gap-10 text-center md:grid-cols-3">
      {steps.map((s, i) => (
        <div key={i} className="flex flex-col items-center">
          <img
            src={s.icon}
            alt=""
            className="mb-4 h-12 w-12 md:h-14 md:w-14 object-contain select-none"
            draggable={false}
          />
          <div className="font-inter text-lg md:text-xl font-semibold text-black">
            {s.title}
          </div>
          <div className="mt-1 font-inter text-sm md:text-base text-neutral-500">
            {s.desc}
          </div>
        </div>
      ))}
    </div>
  );
}
