"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Edit3, Image as ImageIcon } from "lucide-react";

type FigureImage = {
  url: string;
  label?: string;
  page?: number;
};

interface SummarizeViewProps {
  summary: string;
  images?: FigureImage[];
}

function normalizeSummaryMath(text: string): string {
  if (!text) return text;
  let t = text;

  t = t.replace(/\[(\s*\\[^\[\]]+?)\]/g, (_m, inner) => {
    return `$${inner.trim()}$`;
  });

  t = t.replace(/\\\((.+?)\\\)/g, (_m, inner) => {
    return `$${inner.trim()}$`;
  });

  t = t.replace(/\\\[((?:.|\n)+?)\\\]/g, (_m, inner) => {
    return `\n\n$$${inner.trim()}$$\n\n`;
  });

  t = t.replace(/\\\$/g, "$");

  t = t.replace(/\$\s+([^$]*?)\s+\$/g, (_m, inner) => {
    return `$${inner.trim()}$`;
  });

  return t;
}

export default function SummarizeView({ summary, images = [] }: SummarizeViewProps) {
  const hasSummary = summary && summary.trim().length > 0;
  const hasImages = images.length > 0;

  const normalizedSummary = React.useMemo(
    () => (hasSummary ? normalizeSummaryMath(summary) : summary),
    [summary, hasSummary]
  );

  return (
    <section className="relative rounded-3xl bg-white shadow-sm border border-neutral-200/60 overflow-hidden flex flex-col h-full">
      
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-neutral-100 bg-white/90 backdrop-blur-md px-6 py-4">
        <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
          <Edit3 size={16} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-neutral-900 font-krona">AI Summary</h2>
          <p className="text-xs text-neutral-500">Auto-generated from PDF</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar scroll-smooth">
        <article className="prose prose-neutral max-w-none text-black">
          {!hasSummary ? (
            <div className="flex flex-col items-center justify-center py-10 text-neutral-400">
              <p>No summary generated yet.</p>
            </div>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkMath, remarkGfm]}
              rehypePlugins={[rehypeKatex]}
              components={{
                h1: ({ node, ...props }) => (
                  <h3 className="mt-4 mb-2 text-[20px] font-semibold text-black" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h3 className="mt-4 mb-2 text-[20px] font-semibold text-black" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="mt-4 mb-2 text-[18px] font-semibold text-black" {...props} />
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
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-orange-200 pl-4 italic text-neutral-600 my-4" {...props} />
                ),
                code: ({ node, ...props }) => (
                  <code className="bg-neutral-100 rounded px-1 py-0.5 text-sm text-orange-600 font-mono" {...props} />
                ),
              }}
            >
              {normalizedSummary}
            </ReactMarkdown>
          )}

          {hasImages && (
            <section className="mt-10 pt-6 border-t border-neutral-100">
              <div className="flex items-center gap-2 mb-4 text-neutral-900 font-semibold">
                <ImageIcon size={18} className="text-orange-500" />
                <h3>Figures & Diagrams</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, idx) => (
                  <figure
                    key={img.url + idx}
                    className="group overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50/50 hover:shadow-md transition-all cursor-zoom-in"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-white p-2">
                      <img
                        src={img.url}
                        alt={img.label || `Page ${img.page ?? idx + 1}`}
                        className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <figcaption className="px-3 py-2 text-[10px] uppercase tracking-wide font-medium text-neutral-500 border-t border-neutral-100 bg-white">
                      {img.label ? img.label : `Page ${img.page ?? idx + 1}`}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}
        </article>
      </div>
    </section>
  );
}