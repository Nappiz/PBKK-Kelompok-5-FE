export default function NoteCard({
  title,
  description,
  href,
  docId,
  slug,
}: {
  title: string;
  description?: string;
  href?: string;
  docId?: string;
  slug?: string;
}) {
  const builtHref =
    href ||
    (docId && slug ? `/notes/${slug}?doc_id=${docId}&slug=${slug}` : "#");

  return (
    <a
      href={builtHref}
      className="flex items-start gap-3 rounded-xl bg-gradient-to-r from-[#FFE970] to-[#FF8B0C] p-[2px] transition-transform hover:translate-y-[-1px]"
    >
      <div className="flex w-full items-center gap-3 rounded-[10px] px-3 py-3">
        <img src="/images/pdf2.png" alt="" className="h-8 w-8" />
        <div className="min-w-0">
          <div className="truncate font-krona text-[13px] text-black">{title}</div>
          {description && (
            <div className="truncate text-xs text-neutral-700">{description}</div>
          )}
        </div>
      </div>
    </a>
  );
}
