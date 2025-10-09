"use client";

export default function SummarizeView() {
  return (
    <section
      className="relative rounded-xl bg-white shadow-sm ring-1 ring-black/10 overflow-hidden
                 min-h-[560px] h-[calc(100svh-160px)]"
    >
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-[#FFBD71]/60 bg-gradient-to-r from-[#FFE970] to-[#FF8B0C] px-3 py-2 text-[18px] font-semibold text-black">
        <div className="my-2 items-center justify-center">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-md mx-4 ">
            <img src="/images/edit.png" alt="" className="h-5 w-5" />
          </span>
          Edit AI summary notes
        </div>
      </div>

      <div className="h-[calc(100%-40px)] overflow-y-auto px-5 py-4">
        <article className="prose prose-neutral max-w-none text-black">
          <h2 className="font-krona !mt-0 text-[24px] text-black">The Sopranos</h2>
          <p>
            <strong className="font-semibold">The Sopranos</strong> is an American crime drama
            television series created by David Chase. The series follows Tony Soprano (James
            Gandolfini), a New Jersey Mafia boss who suffers from panic attacks…
          </p>
          <p>
            Primarily filmed at Silvercup Studios in New York City, with some on-location filming in
            New Jersey. Other important characters include Tony’s family, Mafia colleagues, and
            rivals…
          </p>
          <p>
            Having been greenlit in 1997, the series was broadcast on HBO from January 10, 1999, to
            June 10, 2007, spanning six seasons and 86 episodes…
          </p>

          <h3 className="font-krona text-[20px] text-black">Premise</h3>
          <p>
            The series follows Tony Soprano… (dummy content). Compact line-height & subtle shadow to
            mimic the screenshot density. Add as much text as you like here to see the middle area
            scroll independently from the header.
          </p>

          <h3 className="font-krona text-[20px] text-black">Production</h3>
          <p>
            On March 2018, New Line Cinema announced… (dummy). This body is purely placeholder to
            demonstrate the long content scroll behaviour in the left panel.
          </p>

          <h3 className="font-krona text-[20px] text-black">Cast</h3>
          <ul>
            <li>James Gandolfini as Tony Soprano</li>
            <li>Edie Falco as Carmela Soprano</li>
            <li>Michael Imperioli as Christopher Moltisanti</li>
          </ul>
        </article>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-[#FFBD71]/70" />
    </section>
  );
}
