"use client";

import { useRef, useState, useEffect } from "react";
import { BASE } from "../../../../lib/api";
import { useDocParams } from "../../../../lib/useDocParams";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; 

type Msg = { id: string; role: "user" | "ai"; text: string };

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

function normalizeMath(text: string): string {
  if (!text) return text;
  let t = text;
  t = t.replace(/\[(\s*\\[^\[\]]+?)\]/g, (_, inner) => `$${inner.trim()}$`);
  t = t.replace(/\\\((.+?)\\\)/g, (_, inner) => `$${inner.trim()}$`);
  t = t.replace(/\\\[((?:.|\n)+?)\\\]/g, (_, inner) => `\n\n$$${inner.trim()}$$\n\n`);
  t = t.replace(/\\\$/g, "$");
  t = t.replace(/\$\s+([^$]*?)\s+\$/g, (_, inner) => `$${inner.trim()}$`);
  return t;
}

export default function LLMView({ height = "full" }: { height?: "full" | "compact" }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const { docId, slug } = useDocParams();

  useEffect(() => {
    if (listRef.current) {
        listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [msgs, busy]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || busy) return;

    const q = draft.trim();
    setDraft("");
    setMsgs((m) => [...m, { id: genId(), role: "user", text: q }]);
    setBusy(true);

    try {
      const url = new URL(`${BASE}/api/qa`);
      if (docId) url.searchParams.set("doc_id", docId);
      if (slug) url.searchParams.set("slug", slug);

      const r = await fetch(url.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      
      const j = await r.json();
      const ans = j?.answer || "I couldn't generate an answer at the moment.";
      setMsgs((m) => [...m, { id: genId(), role: "ai", text: ans }]);
    } catch (err) {
      setMsgs((m) => [...m, { id: genId(), role: "ai", text: "Sorry, something went wrong." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`flex flex-col bg-white rounded-3xl border border-neutral-200/60 shadow-sm overflow-hidden h-full`}>
      <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-100 bg-white/80 backdrop-blur-md">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 shadow-sm">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="font-krona text-sm text-neutral-900">AI Tutor</h3>
          <p className="text-xs text-neutral-500">Ask questions about this document</p>
        </div>
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#FDFBF7]">
        {msgs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-neutral-400 space-y-3">
             <div className="h-12 w-12 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center shadow-sm">
                <Bot size={24} className="text-orange-400" />
             </div>
             <p className="text-sm max-w-[200px]">Ask me anything! I can summarize, explain, or quiz you on this document.</p>
          </div>
        )}
        
        {msgs.map((m) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={m.id}
            className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div className={`
              flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center shadow-sm
              ${m.role === "user" ? "bg-neutral-900 text-white" : "bg-white border border-neutral-100 text-orange-500"}
            `}>
              {m.role === "user" ? <User size={14} /> : <Bot size={16} />}
            </div>
            
            <div className={`
              max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm overflow-hidden
              ${m.role === "user" 
                ? "bg-neutral-900 text-white rounded-tr-sm" 
                : "bg-white border border-neutral-100 text-neutral-800 rounded-tl-sm"
              }
            `}>
              {m.role === "user" ? (
                <div className="whitespace-pre-wrap">{m.text}</div>
              ) : (
                <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-neutral-100 prose-pre:text-neutral-700">
                   <ReactMarkdown
                      remarkPlugins={[remarkMath, remarkGfm]}
                      rehypePlugins={[rehypeKatex]}
                      components={{
                        p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                        a: ({ node, ...props }) => <a className="text-orange-500 underline hover:text-orange-600" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                        li: ({ node, ...props }) => <li className="mb-0.5" {...props} />,
                        h1: ({ node, ...props }) => <h3 className="font-bold text-base mt-2 mb-1" {...props} />,
                        h2: ({ node, ...props }) => <h4 className="font-bold text-sm mt-2 mb-1" {...props} />,
                        h3: ({ node, ...props }) => <h5 className="font-bold text-sm mt-2 mb-1" {...props} />,
                        code: ({ node, className, children, ...props }: any) => {
                            const match = /language-(\w+)/.exec(className || "");
                            const isInline = !match && !String(children).includes("\n");
                            return isInline ? (
                                <code className="bg-neutral-100 text-orange-600 rounded px-1 py-0.5 font-mono text-xs" {...props}>
                                    {children}
                                </code>
                            ) : (
                                <code className="block bg-neutral-100 text-neutral-800 rounded p-2 my-2 font-mono text-xs overflow-x-auto" {...props}>
                                    {children}
                                </code>
                            );
                        },
                        blockquote: ({ node, ...props }) => (
                            <blockquote className="border-l-2 border-orange-300 pl-3 italic text-neutral-500 my-2" {...props} />
                        ),
                      }}
                   >
                      {normalizeMath(m.text)}
                   </ReactMarkdown>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        
        {busy && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-white border border-neutral-100 flex items-center justify-center text-orange-500 shadow-sm">
                 <Bot size={16} />
              </div>
              <div className="bg-white border border-neutral-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex gap-1 items-center">
                 <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}/>
                 <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}/>
                 <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}/>
              </div>
           </motion.div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-neutral-100">
        <form onSubmit={send} className="relative flex items-center gap-2">
          <input
            className="w-full bg-neutral-100 text-neutral-900 placeholder:text-neutral-500 text-sm rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all"
            placeholder="Type your question..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button
            type="submit"
            disabled={!draft.trim() || busy}
            className="absolute right-2 p-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-orange-500 transition-colors cursor-pointer"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}