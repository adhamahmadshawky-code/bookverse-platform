"use client";
import { useEffect, useState } from "react";
import {
  Search,
  Grid2X2,
  List,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import type { Book } from "@/lib/types";
import { BookCard } from "./book-card";
export function Explore() {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [query, setQuery] = useState(q);
  const [genre, setGenre] = useState(params.get("genre") || "");
  const [author, setAuthor] = useState("");
  const [language, setLanguage] = useState("");
  const [year, setYear] = useState("");
  const [sort, setSort] = useState("popularity");
  const [page, setPage] = useState(1);
  const [list, setList] = useState(false);
  const [result, setResult] = useState<{
    books: Book[];
    total: number;
    warning?: string;
    source?: string;
  }>({ books: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    const p = new URLSearchParams({
      q: query,
      genre,
      author,
      language,
      year,
      sort,
      page: String(page),
    });
    const timer = setTimeout(() => {
      fetch(`/api/catalog?${p}`, { signal: controller.signal })
        .then((r) => {
          if (!r.ok) throw Error("Could not load books.");
          return r.json();
        })
        .then(setResult)
        .catch((e) => {
          if (e.name !== "AbortError")
            setError("Could not load the library. Please try again.");
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, genre, author, language, year, sort, page, retry]);
  const reset = () => {
    setQ("");
    setQuery("");
    setGenre("");
    setAuthor("");
    setLanguage("");
    setYear("");
    setPage(1);
  };
  return (
    <div className="container section">
      <p className="eyebrow gold">YOUR NEXT CHAPTER STARTS HERE</p>
      <h1 className="page-title">
        Explore the library<span>.</span>
      </h1>
      <p className="muted">
        Read our classics collection, or search the wider Open Library catalog.
      </p>
      <form
        className="catalog-search"
        onSubmit={(e) => {
          e.preventDefault();
          setQuery(q);
          setPage(1);
        }}
      >
        <Search />
        <input
          aria-label="Search books"
          placeholder="Search by title, author, or keyword…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          maxLength={200}
        />
        <button className="button primary">Search</button>
      </form>
      <div className="catalog-layout">
        <aside className="filters">
          <h3>
            <SlidersHorizontal size={17} /> Refine your shelf
          </h3>
          <label>
            Genre
            <select
              aria-label="Genre"
              value={genre}
              onChange={(e) => {
                setGenre(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All genres</option>
              {[
                "Fiction",
                "Adventure",
                "Romance",
                "Gothic",
                "Philosophy",
                "Science fiction",
              ].map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </label>
          <label>
            Author
            <input
              placeholder="e.g. Jane Austen"
              value={author}
              onChange={(e) => {
                setAuthor(e.target.value);
                setPage(1);
              }}
              maxLength={100}
            />
          </label>
          <label>
            Language
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All languages</option>
              <option value="eng">English</option>
              <option value="ara">Arabic</option>
              <option value="fra">French</option>
              <option value="spa">Spanish</option>
            </select>
          </label>
          <label>
            First published
            <input
              type="number"
              min="-1000"
              max={new Date().getFullYear()}
              placeholder="Year"
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                setPage(1);
              }}
            />
          </label>
          <button className="text-link" onClick={reset}>
            Clear filters
          </button>
          <div className="filter-note">
            <p className="eyebrow gold">A NOTE ON AVAILABILITY</p>
            <p>
              Catalog books are metadata only unless reading rights are
              verified. Our classics include full text.
            </p>
          </div>
        </aside>
        <section className="catalog-results" aria-label="Book results">
          <div className="results-toolbar">
            <span aria-live="polite">
              {loading
                ? "Finding your next read…"
                : `${result.total.toLocaleString()} books`}
            </span>
            <div>
              <label className="sr-only" htmlFor="sort">
                Sort books
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
              >
                <option value="popularity">Popularity / selection</option>
                <option value="rating">Rating</option>
                <option value="newest">Newest published</option>
              </select>
              <button
                className={`icon-button ${!list ? "selected" : ""}`}
                aria-label="Grid view"
                aria-pressed={!list}
                onClick={() => setList(false)}
              >
                <Grid2X2 size={18} />
              </button>
              <button
                className={`icon-button ${list ? "selected" : ""}`}
                aria-label="List view"
                aria-pressed={list}
                onClick={() => setList(true)}
              >
                <List size={20} />
              </button>
            </div>
          </div>
          {result.warning && <p className="alert">{result.warning}</p>}
          {error ? (
            <div className="empty">
              <h2>We lost our place.</h2>
              <p>{error}</p>
              <button
                className="button outline"
                onClick={() => setRetry(retry + 1)}
              >
                Try again
              </button>
            </div>
          ) : loading ? (
            <div className="catalog-grid" aria-label="Loading books">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="skeleton" />
              ))}
            </div>
          ) : result.books.length ? (
            <div className={list ? "book-list" : "catalog-grid"}>
              {result.books.map((b, i) => (
                <BookCard key={b.id} book={b} index={i} list={list} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <Search size={32} />
              <h2>No books found.</h2>
              <p>Try a different title or fewer filters.</p>
              <button className="button outline" onClick={reset}>
                Reset search
              </button>
            </div>
          )}
          {!loading && result.total > 12 && (
            <nav className="pagination" aria-label="Pagination">
              <button
                disabled={page === 1}
                className="button outline"
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft size={17} /> Previous
              </button>
              <span>
                Page {page} of {Math.min(100, Math.ceil(result.total / 12))}
              </span>
              <button
                disabled={page * 12 >= result.total || page >= 100}
                className="button outline"
                onClick={() => setPage(page + 1)}
              >
                Next <ChevronRight size={17} />
              </button>
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}
