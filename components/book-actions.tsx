"use client";
import Link from "next/link";
import {
  Heart,
  Bookmark,
  BookOpen,
  Download,
  ExternalLink,
} from "lucide-react";
import type { Book } from "@/lib/types";
import { useLibrary } from "./provider";
import { canRead } from "@/lib/utils";
export function BookActions({ book }: { book: Book }) {
  const { shelf, update } = useLibrary();
  const entry = shelf[book.id];
  return (
    <>
      <div className="book-actions">
        {canRead(book) ? (
          <Link href={`/read/${book.id}`} className="button primary">
            <BookOpen size={18} />
            {entry?.progress ? "Continue reading" : "Start reading"}
          </Link>
        ) : (
          <a
            href={`https://openlibrary.org/works/${book.id}`}
            target="_blank"
            rel="noreferrer"
            className="button primary"
          >
            Check preview availability <ExternalLink size={17} />
          </a>
        )}
        <button
          className="button outline"
          onClick={() => void update(book, { saved: !entry?.saved })}
        >
          <Bookmark size={17} fill={entry?.saved ? "currentColor" : "none"} />
          {entry?.saved ? "On your bookshelf" : "Add to bookshelf"}
        </button>
        <button
          className="icon-button outline"
          aria-label={
            entry?.favorite ? "Remove from favorites" : "Add to favorites"
          }
          onClick={() => void update(book, { favorite: !entry?.favorite })}
        >
          <Heart fill={entry?.favorite ? "currentColor" : "none"} size={20} />
        </button>
      </div>
      {canRead(book) && (
        <div className="downloads">
          <a href={`/books/${book.id}.txt`} download>
            <Download size={15} /> Download TXT
          </a>
          <a
            href={`https://www.gutenberg.org/ebooks/${book.gutenbergId}`}
            target="_blank"
            rel="noreferrer"
          >
            EPUB & other formats at source <ExternalLink size={13} />
          </a>
        </div>
      )}
      {entry?.progress > 0 && (
        <p className="gold">{Math.round(entry.progress)}% read</p>
      )}
    </>
  );
}
