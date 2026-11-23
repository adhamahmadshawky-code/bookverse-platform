import { notFound } from "next/navigation";
import { books } from "@/lib/catalog";
import { Reader } from "@/components/reader";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = books.find((x) => x.id === id);
  if (!book) notFound();
  return <Reader book={book} />;
}
