import { describe, it, expect } from "vitest";
import { filterBooks, clampProgress, validWorkId, canRead } from "../lib/utils";
import data from "../lib/books.json";
import type { Book } from "../lib/types";
const books = data as Book[];
describe("catalog filters", () => {
  it("searches title, author, category, keyword", () => {
    expect(filterBooks(books, { q: "Austen" })[0].id).toBe(
      "pride-and-prejudice",
    );
    expect(filterBooks(books, { q: "responsibility" })[0].id).toBe(
      "frankenstein",
    );
    expect(filterBooks(books, { q: "Philosophy" })).toHaveLength(1);
  });
  it("combines filters", () => {
    expect(
      filterBooks(books, {
        genre: "Adventure",
        language: "eng",
        year: "1865",
        author: "Carroll",
      }),
    ).toHaveLength(1);
  });
  it("empty results are honest", () => {
    expect(filterBooks(books, { q: "unfindablexyz" })).toEqual([]);
  });
  it("sorts publication dates", () => {
    const result = filterBooks(books, { sort: "newest" });
    expect(result[0].year).toBe(1895);
  });
});
describe("rights and input boundaries", () => {
  it("allows only curated texts in reader", () => {
    expect(canRead(books[0])).toBe(true);
    expect(canRead({ ...books[0], source: "openlibrary" })).toBe(false);
  });
  it("rejects traversal and arbitrary work IDs", () => {
    expect(validWorkId("OL123W")).toBe(true);
    expect(validWorkId("../secret")).toBe(false);
    expect(validWorkId("https://evil.example")).toBe(false);
  });
  it("clamps persisted progress", () => {
    expect(clampProgress(-10)).toBe(0);
    expect(clampProgress(120)).toBe(100);
    expect(clampProgress(NaN)).toBe(0);
    expect(clampProgress(42.5)).toBe(42.5);
  });
});
