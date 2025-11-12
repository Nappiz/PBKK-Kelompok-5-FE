"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type FigureImage = {
  url: string;
  label?: string; 
  page?: number;  
};

interface SummarizeViewProps {
  summary: string;
  images?: FigureImage[];
}

export default function SummarizeView({ summary, images = [] }: SummarizeViewProps) {
  const hasSummary = summary && summary.trim().length > 0;
  const hasImages = images.length > 0;

  return (
    <section className="relative rounded-xl bg-white shadow-sm ring-1 ring-black/10 overflow-hidden min-h-[560px] h-[calc(100svh-160px)] pb-7">
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-[#FFBD71]/60 bg-gradient-to-r from-[#FFE970] to-[#FF8B0C] px-3 py-2 text-[18px] font-semibold text-black">
        <div className="my-2 flex items-center justify-center">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-md mx-4">
            <img src="/images/edit.png" alt="" className="h-5 w-5" />
          </span>
          AI summary notes
        </div>
      </div>

      <div className="h-[calc(100%-40px)] overflow-y-auto px-5 py-4">
        <article className="prose prose-neutral max-w-none text-black">
          <h2 className="font-krona !mt-0 text-[24px] text-black">
            Summary
          </h2>

          {!hasSummary ? (
            <p className="leading-relaxed text-neutral-500">
              No summary yet.
            </p>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => (
                  <h3
                    className="mt-4 mb-2 text-[20px] font-semibold text-black"
                    {...props}
                  />
                ),
                h2: ({ node, ...props }) => (
                  <h3
                    className="mt-4 mb-2 text-[20px] font-semibold text-black"
                    {...props}
                  />
                ),
                h3: ({ node, ...props }) => (
                  <h3
                    className="mt-4 mb-2 text-[18px] font-semibold text-black"
                    {...props}
                  />
                ),
                p: ({ node, ...props }) => (
                  <p className="mb-2 leading-relaxed" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-semibold" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc ml-5 mb-2" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal ml-5 mb-2" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="mb-1" {...props} />
                ),
              }}
            >
              {summary}
            </ReactMarkdown>
          )}

          {hasImages && (
            <section className="mt-6">
              <h3 className="text-sm font-semibold text-neutral-700 mb-2">
                Related figures & pages
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {images.map((img, idx) => (
                  <figure
                    key={img.url + idx}
                    className="group overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={img.url}
                        alt={img.label || `Page ${img.page ?? idx + 1}`}
                        className="h-full w-full object-contain group-hover:scale-[1.02] transition-transform"
                      />
                    </div>
                    <figcaption className="px-2 py-1 text-[11px] text-neutral-600">
                      {img.label ? img.label : `Page ${img.page ?? idx + 1}`}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}
        </article>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-[#FFBD71]/70" />
    </section>
  );
}
