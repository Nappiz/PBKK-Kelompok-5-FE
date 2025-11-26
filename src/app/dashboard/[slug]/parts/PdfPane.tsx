"use client";

import { FileText, ExternalLink } from "lucide-react";

export default function PdfPane({ url, title }: { url?: string; title?: string }) {
  const safe = typeof url === "string" && url.length > 0;

  return (
    <section className="relative rounded-3xl bg-neutral-900 shadow-lg ring-1 ring-black/5 overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-800 border-b border-neutral-700">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
            <FileText size={16} />
          </div>
          <div className="min-w-0">
             <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Original Source</div>
             <div className="text-sm text-white truncate max-w-[200px]">{title || "Document.pdf"}</div>
          </div>
        </div>
        
        {safe && (
            <a 
                href={url} 
                target="_blank" 
                rel="noreferrer"
                className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Open in new tab"
            >
                <ExternalLink size={16} />
            </a>
        )}
      </div>

      <div className="flex-1 bg-neutral-200">
        {safe ? (
          <iframe
            src={`${url}#toolbar=0&navpanes=0&view=FitH`}
            className="h-full w-full"
            title={title || "PDF"}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-neutral-500">
            PDF source not available.
          </div>
        )}
      </div>
    </section>
  );
}