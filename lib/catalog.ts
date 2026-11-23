import data from "./books.json";
import type { Book, CatalogFilters } from "./types";
import { filterBooks, validWorkId } from "./utils";
export const books = data as Book[];
export const genres = [
  "Fiction",
  "Adventure",
  "Romance",
  "Gothic",
  "Philosophy",
  "Science fiction",
];
type OLDoc = {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  ratings_average?: number;
  ratings_count?: number;
  edition_count?: number;
  number_of_pages_median?: number;
  language?: string[];
  subject?: string[];
};
function mapDoc(d: OLDoc): Book {
  return {
    id: d.key.split("/").pop()!,
    title: d.title,
    author: d.author_name?.join(", ") || "Unknown author",
    year: d.first_publish_year || 0,
    pages: d.number_of_pages_median || null,
    genre: d.subject?.[0] || "Literature",
    language: d.language?.[0] || "Unknown",
    description:
      "Explore publication details and availability through Open Library. A catalog listing does not grant permission to download a book.",
    cover: d.cover_i
      ? `https://covers.openlibrary.org/b/id/${d.cover_i}-L.jpg`
      : "",
    rating: d.ratings_average || null,
    ratingCount: d.ratings_count || 0,
    popularity: d.edition_count || 0,
    source: "openlibrary",
  };
}
export async function searchCatalog(f: CatalogFilters) {
  const page = Math.max(1, Math.min(100, f.page || 1));
  const local = filterBooks(books, f);
  if (!f.q && !f.author && !f.year && !f.language) {
    return {
      books: local.slice((page - 1) * 12, page * 12),
      total: local.length,
      page,
      source: "curated",
      warning: null,
    };
  }
  const p = new URLSearchParams({
    q: f.q || "*",
    page: String(page),
    limit: "12",
    fields:
      "key,title,author_name,first_publish_year,cover_i,ratings_average,ratings_count,edition_count,number_of_pages_median,language,subject",
  });
  if (f.genre) p.set("subject", f.genre);
  if (f.author) p.set("author", f.author);
  if (f.year) p.set("first_publish_year", f.year);
  if (f.language) p.set("language", f.language);
  if (f.sort === "newest") p.set("sort", "new");
  if (f.sort === "rating") p.set("sort", "rating");
  try {
    const response = await fetch(`https://openlibrary.org/search.json?${p}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(12000),
      headers: { "User-Agent": "Bookverse/1.0 (digital library catalog)" },
    });
    if (!response.ok) throw Error("Catalog unavailable");
    const data = await response.json();
    return {
      books: data.docs.map(mapDoc) as Book[],
      total: data.numFound as number,
      page,
      source: "openlibrary",
      warning: null,
    };
  } catch {
    return {
      books: local.slice((page - 1) * 12, page * 12),
      total: local.length,
      page,
      source: "curated",
      warning:
        "Open Library is temporarily unavailable. Showing matching books from our reading collection.",
    };
  }
}
export async function getBook(id: string): Promise<Book | null> {
  const local = books.find((b) => b.id === id);
  if (local) return local;
  if (!validWorkId(id)) return null;
  try {
    const r = await fetch(`https://openlibrary.org/works/${id}.json`, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) return null;
    const d = await r.json();
    return {
      id,
      title: d.title,
      author: "See Open Library for author details",
      year: 0,
      pages: null,
      genre: d.subjects?.[0] || "Literature",
      language: "See editions",
      description:
        typeof d.description === "string"
          ? d.description
          : d.description?.value || "No description available.",
      cover: d.covers?.[0]
        ? `https://covers.openlibrary.org/b/id/${d.covers[0]}-L.jpg`
        : "",
      rating: null,
      ratingCount: 0,
      popularity: 0,
      source: "openlibrary",
    };
  } catch {
    return null;
  }
}
