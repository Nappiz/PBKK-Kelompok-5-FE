import NoteDetailClient from "./NoteDetailClient";

type Params = { slug: string } | Promise<{ slug: string }>;

export default async function Page({ params }: { params: Params }) {
  const p =
    typeof (params as any)?.then === "function"
      ? await (params as Promise<{ slug: string }>)
      : (params as { slug: string });

  return <NoteDetailClient slug={p.slug} />;
}
