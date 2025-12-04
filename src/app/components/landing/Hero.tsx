"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[95vh] flex flex-col justify-center overflow-hidden pt-32 pb-20">      
      <div className="absolute inset-0 bg-[#FDFBF7] -z-20" />
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-orange-200/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-[-10%] right-0 w-[600px] h-[400px] bg-yellow-200/20 rounded-full blur-[100px] -z-10" />
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-orange-100 shadow-sm text-orange-700 text-xs font-bold uppercase tracking-widest mb-8"
        >
          <Sparkles size={14} className="fill-orange-500 text-orange-500" />
          <span>Your AI Study Buddy</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="font-krona text-5xl md:text-7xl lg:text-[80px] text-neutral-900 leading-[1.1] mb-8 tracking-tight"
        >
          Learn faster with <br className="hidden md:block" />
          <span className="relative inline-block">
            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">LearnWAI</span>
            <svg className="absolute w-full h-3 -bottom-1 left-0 text-orange-200 z-0" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
            </svg>
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-inter text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Stop drowning in PDFs. Upload your materials and let LearnWAI generate summaries, flashcards, and quizzes instantly.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link 
            href="/LearnWai/register" 
            className="group relative px-8 py-4 bg-neutral-900 text-white rounded-full font-bold text-lg shadow-xl shadow-orange-900/5 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all flex items-center gap-2"
          >
            Start Learning Free
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-orange-400" />
          </Link>
          <Link 
            href="/LearnWai/#features" 
            className="px-8 py-4 bg-white text-neutral-700 border border-neutral-200 rounded-full font-semibold text-lg hover:bg-neutral-50 hover:border-neutral-300 transition-all"
          >
            Explore Features
          </Link>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1, duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
      >
         <Link href="#features" className="flex flex-col items-center text-neutral-400 hover:text-orange-500 transition-colors">
            <span className="text-[10px] font-krona uppercase tracking-widest mb-1">How it works</span>
            <div className="p-2 rounded-full border border-neutral-200 bg-white/50 backdrop-blur-sm shadow-sm">
               <ChevronDown size={20} />
            </div>
         </Link>
      </motion.div>

    </section>
  );
}
