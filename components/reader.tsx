"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Minus,
  Plus,
  Sun,
  Moon,
  Bookmark,
  ArrowLeft,
  List,
} from "lucide-react";
import type { Book } from "@/lib/types";
import { useLibrary } from "./provider";
export function Reader({ book }: { book: Book }) {
  const { shelf, update, ready } = useLibrary();
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [size, setSize] = useState(20);
  const [light, setLight] = useState(false);
  const [toc, setToc] = useState(false);
  const [position, setPosition] = useState(0);
  const [consent, setConsent] = useState(false);
  const restored = useRef(false);
  const perPage = 65;
  const lines = text.split("\n");
  const max = Math.max(0, Math.ceil(lines.length / perPage) - 1);
  useEffect(() => {
    fetch(`/books/${book.id}.txt`)
      .then((r) => {
        if (!r.ok) throw Error();
        return r.text();
      })
      .then(setText)
      .catch(() =>
        setError(
          "The text could not be loaded. Return to the book page to download it directly.",
        ),
      );
    try {
      setConsent(localStorage.getItem("bookverse-rights") === "accepted");
    } catch {}
  }, [book.id]);
  useEffect(() => {
    if (ready && text && !restored.current) {
      setPosition(
        Math.min(
          max,
          Math.round(((shelf[book.id]?.progress || 0) / 100) * max),
        ),
      );
      restored.current = true;
    }
  }, [ready, text, shelf, book.id, max]);
  function go(page: number) {
    const next = Math.max(0, Math.min(max, page));
    setPosition(next);
    void update(book, { progress: max ? (next / max) * 100 : 0, saved: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  const chapterEntries = (book.chapters || []).filter(
    (x, i, a) => a.findIndex((v) => v.title === x.title) === i,
  );
  if (!consent)
    return (
      <div className="container section narrow">
        <p className="eyebrow gold">BEFORE YOU READ</p>
        <h1>Know your reading rights.</h1>
        <p>
          This text is public domain in the United States. If you are elsewhere,
          check your local copyright law before accessing it. The full Project
          Gutenberg license is included with the text.
        </p>
        <p>
          <a
            href="https://www.gutenberg.org/policy/license.html"
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            Read the source license
          </a>
        </p>
        <button
          className="button primary"
          onClick={() => {
            setConsent(true);
            try {
              localStorage.setItem("bookverse-rights", "accepted");
            } catch {}
          }}
        >
          I have checked my local rights. Open reader.
        </button>
      </div>
    );
  return (
    <div className={`reader ${light ? "reader-light" : ""}`}>
      <div className="reader-toolbar">
        <Link
          href={`/book/${book.id}`}
          className="icon-button"
          aria-label="Back to book"
        >
          <ArrowLeft />
        </Link>
        <span className="reader-title">{book.title}</span>
        <button
          className="icon-button"
          onClick={() => setToc(!toc)}
          aria-expanded={toc}
          aria-label="Table of contents"
        >
          <List size={19} />
        </button>
        <button
          className="icon-button"
          aria-label="Decrease font size"
          disabled={size <= 14}
          onClick={() => setSize(size - 2)}
        >
          <Minus size={18} />
        </button>
        <span>{size}</span>
        <button
          className="icon-button"
          aria-label="Increase font size"
          disabled={size >= 32}
          onClick={() => setSize(size + 2)}
        >
          <Plus size={18} />
        </button>
        <button
          className="icon-button"
          aria-label={
            light ? "Use dark reading mode" : "Use light reading mode"
          }
          onClick={() => setLight(!light)}
        >
          {light ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <button
          className="icon-button"
          aria-label="Bookmark this page"
          onClick={() => void update(book, { bookmark: position, saved: true })}
        >
          <Bookmark
            size={19}
            fill={
              shelf[book.id]?.bookmark === position ? "currentColor" : "none"
            }
          />
        </button>
      </div>
      {toc && (
        <aside className="reader-toc">
          <h3>Table of contents</h3>
          <button
            onClick={() => {
              go(0);
              setToc(false);
            }}
          >
            Beginning & license
          </button>
          {shelf[book.id]?.bookmark != null && (
            <button
              onClick={() => {
                go(shelf[book.id].bookmark!);
                setToc(false);
              }}
            >
              Your bookmark
            </button>
          )}
          {chapterEntries.length
            ? chapterEntries.map((c) => (
                <button
                  key={c.title}
                  onClick={() => {
                    go(Math.floor(c.start / perPage));
                    setToc(false);
                  }}
                >
                  {c.title}
                </button>
              ))
            : Array.from({ length: Math.ceil((max + 1) / 20) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    go(i * 20);
                    setToc(false);
                  }}
                >
                  Section {i + 1}
                </button>
              ))}
        </aside>
      )}
      <div className="reader-body">
        <div className="reader-progress">
          <span>YOUR READING JOURNEY</span>
          <span>{max ? Math.round((position / max) * 100) : 0}%</span>
        </div>
        <progress max={100} value={max ? (position / max) * 100 : 0} />
        <div className="reader-license">
          Source: Project Gutenberg. Public domain in the USA; check local law
          elsewhere. <a href="/legal">License & rights</a>.
        </div>
        {error ? (
          <p role="alert">{error}</p>
        ) : !text ? (
          <div className="skeleton" />
        ) : (
          <pre style={{ fontSize: size }} className="reader-text">
            {lines
              .slice(position * perPage, (position + 1) * perPage)
              .join("\n")}
          </pre>
        )}
        <nav className="pagination" aria-label="Reader pages">
          <button
            className="button outline"
            disabled={position === 0}
            onClick={() => go(position - 1)}
          >
            Previous
          </button>
          <span>
            Page {position + 1} / {max + 1}
          </span>
          <button
            className="button outline"
            disabled={position === max}
            onClick={() => go(position + 1)}
          >
            Next
          </button>
        </nav>
        <label className="reader-slider">
          Jump to reading position
          <input
            type="range"
            min="0"
            max={max}
            value={position}
            onChange={(e) => go(Number(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
}
