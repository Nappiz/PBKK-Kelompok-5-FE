"use client";

import { useEffect, useRef, useState } from "react";
import { PenSquare, Trash2, FileText, CheckCircle2 } from "lucide-react";
import {
  motion,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import Link from "next/link";

type Props = {
  title: string;
  description?: string;
  href?: string;
  docId?: string;
  slug?: string;
  onDelete?: (docId: string) => void;
  onRename?: (docId: string, newTitle: string) => void;
};

const thanosSnapVariants: Variants = {
  initial: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    filter: ["blur(0px)", "blur(10px)", "blur(20px)"],
    maskImage: [
      "linear-gradient(to right, black 100%, transparent 0%)",
      "linear-gradient(to right, black 50%, transparent 50%)",
      "linear-gradient(to right, black 0%, transparent 100%)",
    ],
    transition: {
      duration: 1.2,
      ease: "easeInOut" as const,
      times: [0, 0.5, 1],
    },
  },
  hover: { y: -4 },
} as const;

export default function NoteCard({
  title,
  description,
  href,
  docId,
  slug,
  onDelete,
  onRename,
}: Props) {
  const builtHref = href || (slug ? `/LearnWai/dashboard/${encodeURIComponent(slug)}` : "#");

  const [showRename, setShowRename] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const [isRenamingSuccess, setIsRenamingSuccess] = useState(false);

  const renameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (showRename) {
      setTimeout(() => {
        renameInputRef.current?.focus();
        renameInputRef.current?.select();
      }, 50);
    } else {
      setNewTitle(title);
    }
  }, [showRename, title]);

  const submitRename = () => {
    if (!docId || !onRename) return;
    const trimmed = newTitle.trim();
    if (!trimmed) return;

    onRename(docId, trimmed);
    setShowRename(false);

    setIsRenamingSuccess(true);
    setTimeout(() => setIsRenamingSuccess(false), 2000);
  };

  const submitDelete = () => {
    if (!docId || !onDelete) return;
    onDelete(docId); 
    setShowDelete(false);
  };

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  return (
    <>
      <motion.div
        layout
        variants={thanosSnapVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        whileHover="hover"
        className="relative h-full group"
        style={{ willChange: "transform, opacity, filter" }}
      >
        <Link
          href={builtHref}
          className={`
            flex flex-col h-full bg-white rounded-2xl border shadow-sm transition-all duration-300 p-5 cursor-pointer overflow-hidden relative
            ${
              isRenamingSuccess
                ? "border-green-400 ring-2 ring-green-100"
                : "border-neutral-200/80 hover:shadow-lg hover:border-orange-200"
            }
          `}
        >
          <AnimatePresence>
            {isRenamingSuccess && (
              <motion.div
                key="success-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-green-50/30 pointer-events-none z-0"
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isRenamingSuccess && (
              <motion.div
                key="success-icon"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute top-3 right-3 z-20 text-green-500 bg-white rounded-full p-1 shadow-sm"
              >
                <CheckCircle2 size={20} fill="#dcfce7" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 group-hover:scale-110 transition-transform duration-300">
              <FileText size={20} />
            </div>

            <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-neutral-100 text-neutral-500 uppercase tracking-wide group-hover:bg-orange-100 group-hover:text-orange-700 transition-colors">
              PDF
            </span>
          </div>

          <div className="flex-1 relative z-10 min-w-0">
            <h4
              className={`font-krona text-sm leading-snug line-clamp-2 transition-colors ${
                isRenamingSuccess
                  ? "text-green-700"
                  : "text-neutral-900 group-hover:text-orange-600"
              }`}
            >
              {title}
            </h4>
            <p className="mt-2 text-xs text-neutral-500 line-clamp-1">
              {description || "No date info"}
            </p>
          </div>
        </Link>

        {(onRename || onDelete) && !isRenamingSuccess && (
          <div
            className="absolute top-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <div className="flex items-center gap-1 bg-white shadow-sm border border-neutral-200 rounded-lg p-1">
              {onRename && (
                <button
                  onClick={(e) =>
                    handleActionClick(e, () => setShowRename(true))
                  }
                  className="cursor-pointer p-1.5 text-neutral-500 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                  title="Rename"
                >
                  <PenSquare size={14} />
                </button>
              )}
              {onRename && onDelete && (
                <div className="w-px h-3 bg-neutral-200" />
              )}
              {onDelete && (
                <button
                  onClick={(e) =>
                    handleActionClick(e, () => setShowDelete(true))
                  }
                  className="cursor-pointer p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        )}
      </motion.div>

      <Modal open={showRename} onClose={() => setShowRename(false)}>
        <div className="p-6">
          <h3 className="font-krona text-lg mb-4">Rename Document</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">
                Title
              </label>
              <input
                ref={renameInputRef}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitRename()}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowRename(false)}
                className="cursor-pointer px-4 py-2 rounded-lg text-sm text-neutral-600 hover:bg-neutral-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitRename}
                className="cursor-pointer px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-[#FFE970] to-[#FF8B0C] text-neutral-900 shadow-sm hover:brightness-95 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal open={showDelete} onClose={() => setShowDelete(false)}>
        <div className="p-6">
          <h3 className="font-krona text-lg mb-2 text-red-600">
            Delete Document?
          </h3>
          <p className="text-sm text-neutral-600 mb-6">
            Are you sure you want to delete{" "}
            <strong className="text-neutral-900">{title}</strong>? This action
            cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDelete(false)}
              className="cursor-pointer px-4 py-2 rounded-lg text-sm text-neutral-600 hover:bg-neutral-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={submitDelete}
              className="cursor-pointer px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white shadow-sm hover:bg-red-700 transition-colors"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-black/40 backdrop-blur-sm p-4"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
