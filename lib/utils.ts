import type { Book, CatalogFilters } from "./types";
export function filterBooks(books: Book[], f: CatalogFilters) {
  const q = (f.q || "").toLowerCase();
  const result = books.filter(
    (b) =>
      (!q ||
        `${b.title} ${b.author} ${b.genre} ${b.description}`
          .toLowerCase()
          .includes(q)) &&
      (!f.genre || b.genre.toLowerCase() === f.genre.toLowerCase()) &&
      (!f.author || b.author.toLowerCase().includes(f.author.toLowerCase())) &&
      (!f.language || b.language === f.language) &&
      (!f.year || b.year === Number(f.year)),
  );
  return result.sort((a, b) =>
    f.sort === "newest"
      ? b.year - a.year
      : f.sort === "rating"
        ? (b.rating ?? 0) - (a.rating ?? 0)
        : b.popularity - a.popularity,
  );
}
export function clampProgress(value: number) {
  return Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
}
export function validWorkId(id: string) {
  return /^OL\d+W$/.test(id);
}
export function canRead(book: Book) {
  return book.source === "curated" && Number.isInteger(book.gutenbergId);
}
