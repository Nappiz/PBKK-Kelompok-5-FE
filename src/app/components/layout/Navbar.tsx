"use client";

import { useEffect, useState } from "react";
import { getSession, clearSession } from "../../../lib/session";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import Link from "next/link";

type User = { id: string; name: string; email: string } | null;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    setUser(getSession());
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function onLogout() {
    clearSession();
    setUser(null);
    window.location.href = "/LearnWai/";
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 transition-all duration-300`}
      >
        <nav
          className={`
            flex w-full max-w-5xl items-center justify-between rounded-full px-6 py-3 transition-all duration-300
            ${scrolled || mobileMenuOpen 
              ? "bg-white/80 backdrop-blur-xl border border-white/40 shadow-lg shadow-black/5" 
              : "bg-transparent border border-transparent"}
          `}
        >
          <Link href="/LearnWai/" className="flex items-center gap-2 group">
            <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                <img src="/LearnWai/images/Logo.png" alt="Logo" className="h-full w-full object-cover" />
            </div>
            <span className="font-krona text-lg text-neutral-900 tracking-tight group-hover:text-orange-600 transition-colors">
              LearnWAI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/LearnWai/#features" className="text-sm font-medium text-neutral-600 hover:text-black transition-colors">
              Features
            </Link>
            <Link href="/LearnWai/#how-it-works" className="text-sm font-medium text-neutral-600 hover:text-black transition-colors">
              How it works
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link 
                  href="/LearnWai/dashboard" 
                  className="px-5 py-2 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-all flex items-center gap-2"
                >
                  Dashboard <ArrowRight size={14} />
                </Link>
                <button 
                  onClick={onLogout} 
                  className="cursor-pointer px-4 py-2 text-sm font-medium text-neutral-500 hover:text-red-600 transition-colors"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/LearnWai/login" className="text-sm font-medium text-neutral-900 hover:text-orange-600 transition-colors">
                  Log in
                </Link>
                <Link 
                  href="/LearnWai/register" 
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-[#FFE970] to-[#FF8B0C] text-black text-sm font-bold shadow-sm hover:shadow-md hover:scale-105 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 text-neutral-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden flex flex-col gap-6"
          >
            <div className="flex flex-col gap-4 text-lg font-medium text-neutral-900">
                <Link href="/LearnWai/#features" onClick={() => setMobileMenuOpen(false)}>Features</Link>
                <Link href="/LearnWai/#how-it-works" onClick={() => setMobileMenuOpen(false)}>How it works</Link>
            </div>
            <hr className="border-neutral-100" />
            <div className="flex flex-col gap-4">
              {user ? (
                <>
                  <Link href="/LearnWai/dashboard" className="btn-primary w-full text-center py-3 rounded-xl bg-neutral-900 text-white font-bold">Go to Dashboard</Link>
                  <button onClick={onLogout} className="text-neutral-500 py-2 cursor-pointer">Log out</button>
                </>
              ) : (
                <>
                  <Link href="/LearnWai/login" className="w-full text-center py-3 rounded-xl border border-neutral-200 font-bold">Log in</Link>
                  <Link href="/LearnWai/register" className="w-full text-center py-3 rounded-xl bg-[#FF8B0C] text-white font-bold">Sign up</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}