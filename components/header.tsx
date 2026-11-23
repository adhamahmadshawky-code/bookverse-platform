"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Search, Menu, X, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { useLibrary } from "./provider";
export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { user } = useLibrary();
  return (
    <header className="site-header">
      <div className="container nav">
        <Link href="/" className="brand" aria-label="Bookverse home">
          <BookOpen size={25} />
          <span>
            BOOKVERSE<span className="brand-dot">.</span>
          </span>
        </Link>
        <nav
          className={open ? "nav-links open" : "nav-links"}
          aria-label="Main navigation"
        >
          {[
            ["/", "Discover"],
            ["/explore", "Explore library"],
            ["/dashboard", "My bookshelf"],
          ].map(([url, label]) => (
            <Link
              key={url}
              href={url}
              className={path === url ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <Link
            href="/explore"
            className="icon-button"
            aria-label="Search books"
          >
            <Search size={19} />
          </Link>
          <Link
            href={user ? "/dashboard" : "/auth"}
            className="button small outline"
          >
            {user ? "My account" : "Sign in"}
            <ArrowUpRight size={15} />
          </Link>
          <button
            className="icon-button mobile-menu"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="footer container">
      <div>
        <Link className="brand" href="/">
          <BookOpen size={20} />
          BOOKVERSE.
        </Link>
        <p>A little curiosity. A whole new world.</p>
      </div>
      <nav aria-label="Footer navigation">
        <Link href="/explore">Explore library</Link>
        <Link href="/dashboard">Your bookshelf</Link>
        <Link href="/legal">Sources & rights</Link>
      </nav>
      <p className="muted">
        Made for the love of reading.
        <br />© {new Date().getFullYear()} Bookverse
      </p>
    </footer>
  );
}
