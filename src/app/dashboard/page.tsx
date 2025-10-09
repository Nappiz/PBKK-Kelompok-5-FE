"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import UploadCta from "./components/UploadCta";
import SearchBar from "./components/SearchBar";
import NoteCard from "./components/NoteCard";
import { getSession } from "../../lib/session";

type Doc = {
  id: string;
  title: string;
  description?: string;
  url?: string;
  created_at?: string;
};

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>("Username");
  const [query, setQuery] = useState<string>("");
  const [docs, setDocs] = useState<Doc[]>([]);

  useEffect(() => {
    const s = getSession();
    // ⚠️ pastikan selalu string
    const name = (s?.name ?? s?.email ?? "Username") as string;
    setUserName(name);
  }, []);

  useEffect(() => {
    // TODO: ganti dengan fetch dokumen dari BE
    setDocs([
      { id: "1", title: "Dummy Title", description: "Dummy Description", url: "/dashboard/slug" },
    ]);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return docs;
    return docs.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        (d.description ?? "").toLowerCase().includes(q)
    );
  }, [docs, query]);

  return (
    <div className="min-h-screen bg-[#FFFAF6] text-neutral-900">
      <Sidebar userName={userName} />

      <main className="pl-[72px] md:pl-[260px] transition-[padding]">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Topbar />

          <div className="mt-4">
            <UploadCta />
          </div>

          <div className="mt-6">
            <div className="mb-2">
              <span className="inline-block rounded-md bg-gradient-to-r from-[#FFE970] to-[#FF8B0C] px-3 py-1 text-xs font-krona text-black">
                My Notes
              </span>
            </div>

            <SearchBar value={query} onChange={(v) => setQuery(v ?? "")} />

            <div className="mt-4 space-y-3">
              {filtered.map((d) => (
                <NoteCard key={d.id} title={d.title} description={d.description} href={d.url} />
              ))}
              {filtered.length === 0 && (
                <div className="rounded-xl border border-neutral-200 bg-white/60 p-6 text-sm text-neutral-500">
                  No notes found.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
