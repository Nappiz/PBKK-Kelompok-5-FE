import NoteDetailClient from "./NoteDetailClient";

type Params = { slug: string } | Promise<{ slug: string }>;

export default async function Page({ params }: { params: Params }) {
  const p = await params; 
  return <NoteDetailClient slug={p.slug} />;
}