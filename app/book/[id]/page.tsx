import Link from "next/link";
import { notFound } from "next/navigation";
import { getBook, books } from "@/lib/catalog";
import { Cover, BookCard } from "@/components/book-card";
import { BookActions } from "@/components/book-actions";
import { Reviews } from "@/components/reviews";
import { canRead } from "@/lib/utils";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const b = await getBook((await params).id);
  return {
    title: b?.title || "Book not found",
    description: b?.description.slice(0, 160),
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const b = await getBook(id);
  if (!b) notFound();
  return (
    <div className="container section">
      <nav className="breadcrumb">
        <Link href="/explore">Library</Link>
        <span>/</span>
        {b.title}
      </nav>
      <section className="book-detail">
        <div className="detail-cover">
          <Cover book={b} large />
        </div>
        <div>
          <p className="eyebrow gold">
            {b.genre} · {canRead(b) ? "FULL TEXT AVAILABLE" : "CATALOG ENTRY"}
          </p>
          <h1 className="page-title">{b.title}</h1>
          <p className="detail-author">by {b.author}</p>
          <p className="book-description">{b.description}</p>
          <div className="book-facts">
            <div>
              <span>Published</span>
              <strong>{b.year || "Not provided"}</strong>
            </div>
            <div>
              <span>Pages*</span>
              <strong>{b.pages || "Not provided"}</strong>
            </div>
            <div>
              <span>Language</span>
              <strong>{b.language === "eng" ? "English" : b.language}</strong>
            </div>
            <div>
              <span>Rating</span>
              <strong>
                {b.rating ? `${b.rating.toFixed(1)} / 5` : "Not rated"}
              </strong>
            </div>
          </div>
          <BookActions book={b} />
          <p className="legal-note">
            {canRead(b)
              ? "Public-domain text in the United States. Copyright laws differ elsewhere. Check your local law before reading or downloading."
              : "No unauthorized downloads. This listing does not imply that a digital copy or preview is available."}{" "}
            <Link href="/legal">Sources & rights</Link>
          </p>
          <p className="muted small-text">
            *Page counts vary by edition. Covers in the classics collection are
            original Bookverse designs.
          </p>
        </div>
      </section>
      <Reviews id={id} />
      <section className="section">
        <div className="section-heading">
          <h2>Keep your curiosity going.</h2>
        </div>
        <div className="books-grid">
          {books
            .filter((x) => x.id !== id)
            .slice(0, 3)
            .map((x) => (
              <BookCard book={x} key={x.id} />
            ))}
        </div>
      </section>
    </div>
  );
}
