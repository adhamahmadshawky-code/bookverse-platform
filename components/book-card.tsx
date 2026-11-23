"use client";
import Link from "next/link";
import { Heart, ArrowUpRight, BookOpen } from "lucide-react";
import type { Book } from "@/lib/types";
import { useLibrary } from "./provider";
export function Cover({
  book,
  large = false,
}: {
  book: Book;
  large?: boolean;
}) {
  return (
    <div className={`book-cover cover-${book.id} ${large ? "large" : ""}`}>
      {book.cover ? (
        <img
          src={book.cover}
          alt={`${book.title} cover`}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : null}
      <div className="cover-art">
        <span className="cover-author">{book.author}</span>
        <span className="cover-title">{book.title}</span>
        <span className="cover-ornament">✦</span>
        <span className="cover-edition">THE BOOKVERSE CLASSICS</span>
      </div>
    </div>
  );
}
export function BookCard({
  book,
  index = 0,
  list = false,
}: {
  book: Book;
  index?: number;
  list?: boolean;
}) {
  const { shelf, update } = useLibrary();
  return (
    <article
      className={`book-card ${list ? "list-card" : ""}`}
      style={{ animationDelay: `${index * 45}ms` }}
    >
      <div className="cover-wrap">
        <Link href={`/book/${book.id}`} aria-label={`View ${book.title}`}>
          <Cover book={book} />
        </Link>
        <button
          className={`favorite ${shelf[book.id]?.favorite ? "selected" : ""}`}
          aria-label={`${shelf[book.id]?.favorite ? "Unfavorite" : "Favorite"} ${book.title}`}
          onClick={() =>
            void update(book, { favorite: !shelf[book.id]?.favorite })
          }
        >
          <Heart
            size={17}
            fill={shelf[book.id]?.favorite ? "currentColor" : "none"}
          />
        </button>
        <span className="book-badge">
          {book.source === "curated" ? (
            <>
              <BookOpen size={11} /> Read free
            </>
          ) : (
            "Catalog"
          )}
        </span>
      </div>
      <div className="book-meta">
        <p className="eyebrow">{book.genre}</p>
        <Link href={`/book/${book.id}`} className="book-title">
          {book.title}
          <ArrowUpRight size={15} />
        </Link>
        <p className="author">{book.author}</p>
        {list && <p className="muted">{book.description}</p>}
        <div className="book-bottom">
          <span>{book.year > 0 ? book.year : "Classic"}</span>
          <span>
            {book.rating
              ? `★ ${book.rating.toFixed(1)} (${book.ratingCount})`
              : book.source === "curated"
                ? "Original cover art"
                : "Open Library"}
          </span>
        </div>
      </div>
    </article>
  );
}
