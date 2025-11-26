"use client";

import { motion } from "framer-motion";
import { BookOpen, MessageSquare, BrainCircuit, FileText } from "lucide-react";

export default function Body() {
  const features = [
    {
      title: "Instant Summaries",
      desc: "Turn 100 pages into a 5-minute read. Our AI extracts the key points so you don't have to.",
      icon: <BookOpen className="w-6 h-6 text-orange-600" />,
      bg: "bg-orange-50",
      border: "border-orange-100",
      span: "col-span-1 md:col-span-2",
    },
    {
      title: "Chat with PDF",
      desc: "Have a question? Just ask. It's like having a professor available 24/7.",
      icon: <MessageSquare className="w-6 h-6 text-amber-600" />,
      bg: "bg-amber-50",
      border: "border-amber-100",
      span: "col-span-1",
    },
    {
      title: "Smart Flashcards",
      desc: "Memorize faster with auto-generated flashcards based on your material.",
      icon: <BrainCircuit className="w-6 h-6 text-stone-700" />,
      bg: "bg-stone-100",
      border: "border-stone-200",
      span: "col-span-1",
    },
    {
      title: "Deep Analysis",
      desc: "Deep dive into complex documents with advanced context awareness.",
      icon: <FileText className="w-6 h-6 text-orange-500" />,
      bg: "bg-[#FFF4E5]",
      border: "border-orange-100",
      span: "col-span-1 md:col-span-2",
    },
  ];

  return (
    <section id="features" className="relative py-24 overflow-hidden scroll-mt-28">
      <div className="absolute inset-0 bg-[#FDFBF7] -z-20" />
      <div className="absolute top-[-10%] right-0 w-[600px] h-[400px] bg-yellow-200/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute top-1/3 right-[-10%] w-[600px] h-[600px] bg-orange-100/30 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-yellow-100/30 rounded-full blur-[100px] -z-10" />
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-20">
          <h2 className="font-krona text-3xl md:text-4xl text-neutral-900 mb-4">
            Everything you need to ace it
          </h2>
          <p className="text-neutral-500 max-w-2xl mx-auto text-lg">
            One platform, multiple AI tools. Designed to streamline your entire study workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1 }}
              className={`${f.span} group relative overflow-hidden rounded-[32px] border ${f.border} bg-white/60 backdrop-blur-md p-8 hover:shadow-xl hover:shadow-orange-900/5 transition-all duration-500`}
            >
              <div className={`inline-flex p-3.5 rounded-2xl ${f.bg} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {f.icon}
              </div>
              <h3 className="font-krona text-xl text-neutral-900 mb-3">{f.title}</h3>
              <p className="text-neutral-500 leading-relaxed">{f.desc}</p>
              
              <div className={`absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-br from-transparent to-${f.bg.replace('bg-', '')} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            </motion.div>
          ))}
        </div>

        <div id="how-it-works" className="mt-40 scroll-mt-28">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">                
                <div className="w-full md:w-1/3">
                    <h3 className="font-krona text-2xl text-neutral-900 mb-4">How it works</h3>
                    <p className="text-neutral-500 leading-relaxed">
                        From upload to mastery in three simple steps. Our AI handles the heavy lifting so you can focus on learning.
                    </p>
                </div>

                <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: "1. Upload", desc: "Drop your PDF file" },
                        { title: "2. Process", desc: "AI analyzes content" },
                        { title: "3. Master", desc: "Quiz & Flashcards" }
                    ].map((step, i) => (
                        <div key={i} className="relative p-6 rounded-2xl bg-white/50 border border-orange-100/60 backdrop-blur-sm shadow-sm hover:bg-white transition-colors">
                            <div className="text-4xl font-krona text-orange-100 absolute right-4 top-2 select-none pointer-events-none">0{i+1}</div>
                            <div className="relative z-10">
                                <h4 className="font-bold text-neutral-900 mb-1">{step.title}</h4>
                                <p className="text-sm text-neutral-500">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
      </div>
    </section>
  );
}