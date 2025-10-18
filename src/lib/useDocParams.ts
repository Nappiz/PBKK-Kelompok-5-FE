"use client";

import { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";

function looksLikeUuid(s: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);
}

export function useDocParams() {
  const sp = useSearchParams();
  const params = useParams();

  let docId = sp?.get("doc_id") ?? "";

  let slug = sp?.get("slug") ?? "";
  const seg = (params as Record<string, string | string[] | undefined>)?.slug;
  const segSlug =
    typeof seg === "string" ? seg : Array.isArray(seg) ? seg[0] : undefined;
  if (!slug && segSlug) slug = segSlug;

  if (!docId && slug && looksLikeUuid(slug)) {
    docId = slug;
  }

  return useMemo(() => ({ docId, slug }), [docId, slug]);
}
