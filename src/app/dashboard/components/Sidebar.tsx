"use client";

import { useEffect, useRef, useState } from "react";
import { clearSession } from "../../../lib/session";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { 
  Home, 
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  MoreVertical, 
  LayoutDashboard 
} from "lucide-react";

type SidebarProps = {
  userName: string;
  expanded: boolean;
  setExpanded: (v: boolean) => void;
};

export default function Sidebar({ userName, expanded, setExpanded }: SidebarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.matchMedia("(max-width: 768px)").matches;
      setIsMobile(mobile);
      if (!mobile) setExpanded(true);
      if (mobile) setExpanded(false);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [setExpanded]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen]);

  function onLogout() {
    clearSession();
    window.location.href = "/LearnWai/";
  }

  const sidebarVariants: Variants = {
    mobileClosed: { 
      x: "-100%", 
      width: 280, 
      opacity: 0, 
      transition: { type: "spring", bounce: 0, duration: 0.3 } 
    },
    mobileOpen: { 
      x: 0, 
      width: 280, 
      opacity: 1, 
      transition: { type: "spring", bounce: 0, duration: 0.3 } 
    },
    desktopClosed: { 
      x: 0, 
      width: 88, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 300, damping: 30 } 
    },
    desktopOpen: { 
      x: 0, 
      width: 280, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 300, damping: 30 } 
    },
  };

  const currentVariant = isMobile 
    ? (expanded ? "mobileOpen" : "mobileClosed") 
    : (expanded ? "desktopOpen" : "desktopClosed");

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setExpanded(!expanded)}
        className="fixed left-4 top-4 z-50 p-2.5 rounded-xl bg-white/90 backdrop-blur-md border border-neutral-200 shadow-md md:hidden text-neutral-800 cursor-pointer"
      >
        <LayoutDashboard size={20} />
      </motion.button>

      <AnimatePresence>
        {isMobile && expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpanded(false)}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={currentVariant}
        variants={sidebarVariants}
        className="fixed inset-y-0 left-0 z-50 flex flex-col bg-[#FFFAF6] border-r border-neutral-200/80 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] overflow-hidden"
      >
        <div className="flex items-center justify-between h-20 px-5 mb-2 transition-all duration-300 min-w-[280px] md:min-w-0">
          
          {(expanded || isMobile) && (
            <div className="flex items-center gap-3 overflow-hidden">
              <img 
                src="/LearnWai/images/Logo.png" 
                alt="Logo" 
                className="h-8 w-8 object-contain drop-shadow-sm" 
              />
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-krona text-lg tracking-tight text-neutral-900 whitespace-nowrap"
              >
                LearnWAI
              </motion.span>
            </div>
          )}
          
          {!isMobile && (
            <button
              onClick={() => setExpanded(!expanded)}
              className={`
                cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg 
                text-neutral-500 hover:bg-white hover:shadow-sm hover:text-orange-600 border border-transparent hover:border-neutral-100 transition-all
                ${!expanded ? "mx-auto w-full" : "ml-auto"}
              `}
              title={expanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          )}
        </div>

        <nav className="flex-1 px-4 py-2 space-y-2 min-w-[280px] md:min-w-0">
          <SidebarItem 
            icon={<Home size={22} />} 
            label="Dashboard" 
            href="/LearnWai/dashboard" 
            active 
            expanded={expanded || isMobile} 
          />
        </nav>

        <div className="p-4 border-t border-neutral-100 bg-[#FFFAF6] min-w-[280px] md:min-w-0" ref={menuRef}>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`
                cursor-pointer group flex items-center gap-3 w-full p-2 rounded-xl transition-all duration-200
                hover:bg-white hover:shadow-md hover:ring-1 hover:ring-neutral-100
                ${menuOpen ? 'bg-white shadow-md ring-1 ring-neutral-100' : ''}
                ${(!expanded && !isMobile) ? 'justify-center' : ''}
              `}
            >
              <div className="h-10 w-10 min-w-[40px] rounded-full bg-gradient-to-br from-[#FFE970] to-[#FF8B0C] flex items-center justify-center text-white font-bold border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                {userName.charAt(0).toUpperCase()}
              </div>
              
              {(expanded || isMobile) && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="flex-1 text-left min-w-0"
                >
                  <p className="text-sm font-semibold text-neutral-900 truncate font-krona">
                    {userName}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">Free Plan</p>
                </motion.div>
              )}
              
              {(expanded || isMobile) && <MoreVertical size={16} className="text-neutral-400 group-hover:text-neutral-600" />}
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className={`
                    absolute bottom-full mb-3 p-1.5 bg-white rounded-xl border border-neutral-200 shadow-xl origin-bottom z-50
                    ${(expanded || isMobile) ? 'left-0 w-full' : 'left-0 w-[200px]'}
                  `}
                >
                  <div className="px-2 py-1.5 text-xs text-neutral-400 font-medium border-b border-neutral-100 mb-1">
                    My Account
                  </div>
                  <button
                    onClick={onLogout}
                    className="cursor-pointer flex w-full items-center gap-2.5 px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Log out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

function SidebarItem({ icon, label, href, active, expanded }: any) {
  return (
    <a
      href={href}
      className={`
        cursor-pointer group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 relative overflow-hidden
        ${active 
          ? "bg-white text-orange-600 shadow-sm ring-1 ring-neutral-100" 
          : "text-neutral-500 hover:bg-white/60 hover:text-neutral-900 hover:shadow-sm"
        }
        ${!expanded ? 'justify-center' : ''}
      `}
      title={!expanded ? label : ""}
    >
      {active && (
        <motion.div 
          layoutId="active-pill"
          className="absolute left-0 top-3 bottom-3 w-1 bg-orange-500 rounded-r-full" 
        />
      )}
      
      <span className={`relative z-10 transition-transform duration-300 ${!expanded ? 'group-hover:scale-110' : ''}`}>
        {icon}
      </span>

      {expanded && (
        <motion.span 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
          className="relative z-10 whitespace-nowrap font-medium text-sm"
        >
          {label}
        </motion.span>
      )}
      
      {!expanded && (
        <span className="absolute left-full ml-4 px-2 py-1 bg-neutral-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          {label}
        </span>
      )}
    </a>
  );
}