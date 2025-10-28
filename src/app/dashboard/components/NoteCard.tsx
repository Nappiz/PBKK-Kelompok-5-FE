"use client";

import { useEffect, useRef, useState } from "react";
import { FaPen, FaTrash } from "react-icons/fa";

type Props = {
  title: string;
  description?: string;
  href?: string;
  docId?: string;
  slug?: string;
  onDelete?: (docId: string) => void;
  onRename?: (docId: string, newTitle: string) => void;
};

export default function NoteCard({
  title,
  description,
  href,
  docId,
  slug,
  onDelete,
  onRename,
}: Props) {
  const builtHref =
    href || (docId && slug ? `/notes/${slug}?doc_id=${docId}&slug=${slug}` : "#");

  const canAct = Boolean(docId && (onDelete || onRename));

  // modal states
  const [showRename, setShowRename] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  // focus refs
  const renameInputRef = useRef<HTMLInputElement | null>(null);
  const renameOpenOnce = useRef(false);

  useEffect(() => {
    if (showRename && !renameOpenOnce.current) {
      const id = setTimeout(() => {
        renameInputRef.current?.focus();
        renameInputRef.current?.select();
      }, 10);
      renameOpenOnce.current = true;
      return () => clearTimeout(id);
    }
    if (!showRename) {
      renameOpenOnce.current = false;
      setNewTitle(title);
    }
  }, [showRename, title]);

  // handlers
  const openRename: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!docId || !onRename) return;
    setNewTitle(title);
    setShowRename(true);
  };

  const openDelete: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!docId || !onDelete) return;
    setShowDelete(true);
  };

  const submitRename = () => {
    if (!docId || !onRename) return;
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    onRename(docId, trimmed);
    setShowRename(false);
  };

  const submitDelete = () => {
    if (!docId || !onDelete) return;
    onDelete(docId);
    setShowDelete(false);
  };

  return (
    <div className="relative group">
      {/* Card */}
      <a
        href={builtHref}
        className="
          flex items-start gap-3 rounded-xl
          bg-gradient-to-r from-[#FFE970] to-[#FF8B0C]
          p-[2px]
          transition-transform
          group-hover:translate-y-[-1px]
          will-change-transform
        "
      >
        <div className="flex w-full items-center gap-3 rounded-[10px] px-3 py-3">
          <img src="/images/pdf2.png" alt="" className="h-8 w-8" />
          <div className="min-w-0">
            <div className="truncate font-krona text-[13px] text-black">
              {title}
            </div>
            {description && (
              <div className="truncate text-xs text-neutral-700">
                {description}
              </div>
            )}
          </div>
        </div>
      </a>

      {/* Action bar (ikut naik bareng) */}
      {canAct && (
        <div
          className="
            absolute right-2 top-2
            pointer-events-none group-hover:pointer-events-auto
            rounded-full bg-white/90 backdrop-blur
            shadow-sm ring-1 ring-black/10
            transition-all opacity-95 group-hover:opacity-100
            translate-y-0 group-hover:translate-y-[-1px]
            will-change-transform
          "
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div className="flex items-center">
            {onRename && (
              <button
                onClick={openRename}
                title="Rename"
                aria-label="Rename document"
                className="
                  cursor-pointer pointer-events-auto p-2
                  text-amber-800 hover:text-amber-900
                  hover:bg-amber-100/70 rounded-l-full
                  transition flex items-center justify-center
                "
              >
                <FaPen className="h-3.5 w-3.5" />
              </button>
            )}

            {onRename && onDelete && (
              <div className="h-5 w-px bg-neutral-200" aria-hidden="true" />
            )}

            {onDelete && (
              <button
                onClick={openDelete}
                title="Delete"
                aria-label="Delete document"
                className="
                  cursor-pointer pointer-events-auto p-2
                  text-amber-700 hover:text-amber-800
                  hover:bg-red-50 rounded-r-full
                  transition flex items-center justify-center
                "
              >
                <FaTrash className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ===== Rename Modal ===== */}
      {showRename && (
        <Modal onClose={() => setShowRename(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl ring-1 ring-black/10">
            <div className="font-krona text-sm">Rename document</div>
            <div className="mt-3">
              <label className="text-xs text-neutral-600">New title</label>
              <input
                ref={renameInputRef}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitRename();
                }}
                className="mt-1 w-full rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#FF8B0C]/50"
                placeholder="Document title"
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowRename(false)}
                className="cursor-pointer rounded-md px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                onClick={submitRename}
                className="cursor-pointer rounded-md bg-gradient-to-r from-[#FFE970] to-[#FF8B0C] px-3 py-1.5 text-sm font-medium text-black hover:brightness-95"
              >
                Save
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showDelete && (
        <Modal onClose={() => setShowDelete(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl ring-1 ring-black/10">
            <div className="font-krona text-sm">Delete document</div>
            <p className="mt-2 text-sm text-neutral-700">
              Are you sure you want to permanently delete
              <span className="font-semibold"> “{title}”</span>?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowDelete(false)}
                className="cursor-pointer rounded-md px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                onClick={submitDelete}
                className="cursor-pointer rounded-md bg-amber-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-800"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/** Lightweight Modal (click backdrop to close, esc support) */
function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
