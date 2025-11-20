// app/math-test/page.tsx
"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const md = `
Ini inline: $\\frac{a}{b}$

Ini blok:

$$
y = \\tan\\left(\\frac{\\pi}{180} \\times \\frac{a}{60}\\right) \\times w + x
$$
`;

export default function MathTestPage() {
  return (
    <main className="p-8">
      <h1 className="text-xl font-bold mb-4">Math Test</h1>
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
      >
        {md}
      </ReactMarkdown>
    </main>
  );
}
