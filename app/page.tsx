import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Globe2,
  BookOpen,
  Bookmark,
} from "lucide-react";
import { books, genres } from "@/lib/catalog";
import { BookCard, Cover } from "@/components/book-card";
import { Newsletter } from "@/components/newsletter";
export default function Home() {
  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <p className="eyebrow gold">
            <span className="tiny-line" /> A HOME FOR CURIOUS MINDS
          </p>
          <h1>
            A world
            <br />
            between <br />
            the <em>pages.</em>
          </h1>
          <p className="hero-description">
            Find the stories that stay with you.
            <br />
            Discover timeless classics, unexpected favorites,
            <br className="desktop-break" /> and your next great read.
          </p>
          <div className="hero-cta">
            <Link className="button primary" href="/explore">
              Explore the library <ArrowRight size={18} />
            </Link>
            <a className="text-link" href="#editors">
              Find your next read <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="hero-footnote">
            <span className="reader-dots">
              <i>A</i>
              <i>M</i>
              <i>J</i>
              <i>S</i>
            </span>
            <div>
              <strong>For the endlessly curious</strong>
              <span>One good book can change everything.</span>
            </div>
          </div>
        </div>
        <div className="hero-gallery">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <span className="gallery-label">THE CLASSICS, REDISCOVERED</span>
          <Link href="/book/frankenstein" className="hero-book hero-book-left">
            <Cover book={books[1]} large />
          </Link>
          <Link
            href="/book/pride-and-prejudice"
            className="hero-book hero-book-center"
          >
            <Cover book={books[0]} large />
          </Link>
          <Link
            href="/book/the-time-machine"
            className="hero-book hero-book-right"
          >
            <Cover book={books[4]} large />
          </Link>
          <div className="floating-note">
            <Sparkles size={18} />
            <div>
              <strong>Your next favorite awaits</strong>
              <span>A little wonder on every shelf.</span>
            </div>
          </div>
          <span className="gallery-number">01 / 06</span>
        </div>
      </section>
      <section className="value-strip">
        <div className="container">
          <span>
            <Globe2 size={18} /> An open catalog of stories
          </span>
          <span>
            <BookOpen size={18} /> Classics you can read here
          </span>
          <span>
            <Bookmark size={18} /> A bookshelf of your own
          </span>
          <span className="value-end">READ. DISCOVER. REPEAT.</span>
        </div>
      </section>
      <section className="section container" id="editors">
        <div className="section-heading">
          <div>
            <p className="eyebrow gold">A GOOD PLACE TO BEGIN</p>
            <h2>
              The editor’s shelf<span>.</span>
            </h2>
          </div>
          <Link href="/explore" className="text-link">
            View all books <ArrowRight size={17} />
          </Link>
        </div>
        <p className="section-description">
          Extraordinary stories. Handpicked for your next chapter.
        </p>
        <div className="books-grid">
          {books.map((b, i) => (
            <BookCard key={b.id} book={b} index={i} />
          ))}
        </div>
      </section>
      <section className="quote-section container">
        <span className="quote-mark">“</span>
        <blockquote>
          I declare after all there is no enjoyment like reading!
        </blockquote>
        <p>
          JANE AUSTEN <span>·</span> PRIDE AND PREJUDICE
        </p>
        <Link href="/book/pride-and-prejudice" className="text-link">
          Rediscover a classic <ArrowUpRight size={15} />
        </Link>
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow gold">FOLLOW YOUR CURIOSITY</p>
            <h2>Every mood has a story.</h2>
          </div>
        </div>
        <div className="category-grid">
          {genres.map((g, i) => (
            <Link
              key={g}
              href={`/explore?genre=${encodeURIComponent(g)}`}
              className="category"
            >
              <span>0{i + 1}</span>
              <h3>{g}</h3>
              <ArrowUpRight size={20} />
            </Link>
          ))}
        </div>
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow gold">TIMELESS FOR A REASON</p>
            <h2>Reader favorites</h2>
            <p className="muted">
              A selection of enduring classics, not a live popularity ranking.
            </p>
          </div>
        </div>
        <div className="feature-grid">
          {books.slice(0, 2).map((b) => (
            <Link className="wide-feature" href={`/book/${b.id}`} key={b.id}>
              <Cover book={b} />
              <div>
                <p className="eyebrow gold">{b.genre}</p>
                <h3>{b.title}</h3>
                <p>{b.description}</p>
                <span className="text-link">
                  Meet your next read <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow gold">FRESH ON THE SHELF</p>
            <h2>Recently added to our collection</h2>
          </div>
        </div>
        <div className="books-grid">
          {books
            .slice()
            .reverse()
            .slice(0, 3)
            .map((b) => (
              <BookCard book={b} key={b.id} />
            ))}
        </div>
      </section>
      <Newsletter />
    </>
  );
}
