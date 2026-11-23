import { NextResponse } from "next/server";
import { getBook } from "@/lib/catalog";
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const book = await getBook(id);
  return NextResponse.json(book || { error: "Book not found" }, {
    status: book ? 200 : 404,
  });
}
