"use client";
import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Heart,
  TrendingUp,
  Settings,
  ArrowRight,
} from "lucide-react";
import { useLibrary } from "./provider";
import { BookCard } from "./book-card";
import { books } from "@/lib/catalog";
export function Dashboard() {
  const { user, ready, shelf, logout } = useLibrary();
  const [tab, setTab] = useState("bookshelf");
  if (!ready)
    return (
      <div className="container section">
        <div className="skeleton" />
      </div>
    );
  if (!user)
    return (
      <div className="container section narrow">
        <p className="eyebrow gold">YOUR PERSONAL READING SPACE</p>
        <h1 className="page-title">Make yourself at home.</h1>
        <p className="muted">
          Sign in to access your profile, reading history, and cloud bookshelf.
          Guest saves stay on this device and are separate from your account.
        </p>
        <Link href="/auth" className="button primary">
          Sign in <ArrowRight size={17} />
        </Link>
        <GuestShelf />
      </div>
    );
  const entries = Object.values(shelf);
  const filtered = entries.filter((e) =>
    tab === "favorites"
      ? e.favorite
      : tab === "history"
        ? e.progress > 0
        : e.saved,
  );
  const name = user.user_metadata.display_name || "reader";
  const preferred = entries.find((e) => e.favorite)?.book.genre;
  const recommended = books.filter(
    (b) => !shelf[b.id]?.saved && (!preferred || b.genre === preferred),
  );
  return (
    <div className="container section">
      <div className="section-heading">
        <div>
          <p className="eyebrow gold">YOUR READING LIFE, ALL IN ONE PLACE</p>
          <h1 className="page-title">
            Welcome back, {name}
            <span>.</span>
          </h1>
          <p className="muted">{user.email}</p>
        </div>
        <div className="book-actions">
          <Link className="button outline" href="/settings">
            <Settings size={16} />
            Settings
          </Link>
          <button className="text-link" onClick={() => void logout()}>
            Sign out
          </button>
        </div>
      </div>
      <div className="stats-grid">
        <div>
          <BookOpen />
          <strong>{entries.filter((e) => e.saved).length}</strong>
          <span>Books on your shelf</span>
        </div>
        <div>
          <Heart />
          <strong>{entries.filter((e) => e.favorite).length}</strong>
          <span>Favorites</span>
        </div>
        <div>
          <TrendingUp />
          <strong>{entries.filter((e) => e.progress >= 100).length}</strong>
          <span>Books completed</span>
        </div>
      </div>
      <div className="tabs">
        {["bookshelf", "favorites", "history"].map((t) => (
          <button
            key={t}
            className={tab === t ? "active" : ""}
            onClick={() => setTab(t)}
          >
            {t === "bookshelf"
              ? "My bookshelf"
              : t === "history"
                ? "Reading history"
                : "Favorites"}
          </button>
        ))}
      </div>
      {filtered.length ? (
        <div className="catalog-grid">
          {filtered.map((e) => (
            <div key={e.book.id}>
              <BookCard book={e.book} />
              {e.progress > 0 && (
                <div className="shelf-progress">
                  <progress value={e.progress} max={100} />
                  <span>
                    {Math.round(e.progress)}% read ·{" "}
                    {new Date(e.updatedAt).toLocaleDateString("en")}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty">
          <BookOpen size={35} />
          <h2>A little room for a great story.</h2>
          <p>Books you save will appear here.</p>
          <Link className="button primary" href="/explore">
            Find a book
          </Link>
        </div>
      )}
      <section className="section">
        <h2>Picked for your next chapter.</h2>
        <p className="muted">
          {preferred
            ? `More from ${preferred}, based on your favorites.`
            : "Start with an enduring classic."}
        </p>
        <div className="catalog-grid">
          {(recommended.length ? recommended : books).slice(0, 3).map((b) => (
            <BookCard book={b} key={b.id} />
          ))}
        </div>
      </section>
    </div>
  );
}
function GuestShelf() {
  const { shelf } = useLibrary();
  const entries = Object.values(shelf).filter((e) => e.saved || e.favorite);
  return (
    <section className="section">
      <h2>Your device shelf</h2>
      {entries.length ? (
        <div className="catalog-grid">
          {entries.map((e) => (
            <div key={e.book.id}>
              <BookCard book={e.book} />
              <p className="muted">{Math.round(e.progress)}% read</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="muted">
          No guest saves yet. Add a book from the library.
        </p>
      )}
    </section>
  );
}
