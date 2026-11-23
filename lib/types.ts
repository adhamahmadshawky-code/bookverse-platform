export type Book = {
  id: string;
  title: string;
  author: string;
  year: number;
  pages: number | null;
  genre: string;
  language: string;
  description: string;
  cover: string;
  rating: number | null;
  ratingCount: number;
  popularity: number;
  source: "curated" | "openlibrary";
  gutenbergId?: number;
  chapters?: { title: string; start: number }[];
};
export type ShelfEntry = {
  book: Book;
  favorite: boolean;
  saved: boolean;
  progress: number;
  bookmark: number | null;
  updatedAt: string;
};
export type Shelf = Record<string, ShelfEntry>;
export type CatalogFilters = {
  q?: string;
  genre?: string;
  author?: string;
  language?: string;
  year?: string;
  sort?: string;
  page?: number;
};
