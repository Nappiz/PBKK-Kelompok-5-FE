"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Closing() {
  return (
    <section className="relative py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-[#FDFBF7] -z-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-orange-200/20 to-yellow-200/20 rounded-full blur-[120px] -z-10" />      
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-200/50 to-transparent" />      
      <div className="container mx-auto max-w-4xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
            <img src="/images/Mascot.png" alt="Mascot" className="w-24 h-24 mx-auto mb-8 animate-bounce-slow" />
            
            <h2 className="font-krona text-4xl md:text-6xl text-neutral-900 mb-6 leading-tight">
              Ready to upgrade your learning?
            </h2>
            <p className="text-xl text-neutral-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of students who are saving hours of study time every week with LearnWAI.
            </p>
            
            <Link 
              href="/register" 
              className="inline-block px-10 py-4 rounded-full bg-neutral-900 text-white font-bold text-lg shadow-xl shadow-orange-900/10 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all"
            >
              Get Started for Free
            </Link>
        </motion.div>
      </div>
    </section>
  );
}