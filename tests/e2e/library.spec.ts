import { test, expect } from "@playwright/test";
test("desktop discovery, filters and detail", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("world");
  await page.screenshot({
    path: "/downloads/bookverse-desktop.png",
    fullPage: true,
    animations: "disabled",
  });
  await page
    .getByRole("link", { name: "Explore the library", exact: true })
    .click();
  await expect(page.getByText("6 books", { exact: true })).toBeVisible();
  await page.getByLabel("Genre", { exact: true }).selectOption("Gothic");
  await expect(page.getByText("1 books", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "List view" }).click();
  await page.getByRole("link", { name: "View Frankenstein" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Frankenstein",
  );
  await expect(
    page.getByRole("link", { name: "Download TXT" }),
  ).toHaveAttribute("href", "/books/frankenstein.txt");
  await page.screenshot({
    path: "/downloads/bookverse-detail.png",
    fullPage: true,
    animations: "disabled",
  });
  expect(errors).toEqual([]);
});
test("guest bookshelf, favorite, reader progress and bookmark survive reload", async ({
  page,
}) => {
  await page.goto("/book/pride-and-prejudice");
  await page
    .getByRole("button", { name: "Add to bookshelf", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "On your bookshelf" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Add to favorites", exact: true })
    .click();
  await page.getByRole("link", { name: "Start reading" }).click();
  await page
    .getByRole("button", {
      name: "I have checked my local rights. Open reader.",
    })
    .click();
  await expect(page.getByText("Page 1 /")).toBeVisible();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("button", { name: "Bookmark this page" }).click();
  await page.getByRole("button", { name: "Increase font size" }).click();
  await page.getByRole("button", { name: "Use light reading mode" }).click();
  await page.screenshot({
    path: "/downloads/bookverse-reader.png",
    fullPage: true,
    animations: "disabled",
  });
  await page.reload();
  await expect(page.getByText("Page 3 /")).toBeVisible();
  await page.getByRole("button", { name: "Table of contents" }).click();
  await expect(
    page.getByRole("button", { name: "Your bookmark" }),
  ).toBeVisible();
  await page.goto("/dashboard");
  await expect(
    page.getByRole("heading", { name: "Your device shelf" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Pride and Prejudice", exact: true }),
  ).toBeVisible();
});
test("mobile navigation, protected pages and no horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("link", { name: "My bookshelf", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Make yourself at home." }),
  ).toBeVisible();
  await page.goto("/settings");
  await expect(
    page.getByRole("heading", { name: "Sign in to manage your account." }),
  ).toBeVisible();
  await page.goto("/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "/downloads/bookverse-mobile.png",
    fullPage: true,
    animations: "disabled",
  });
});
test("backend validation, source text and unconfigured auth are explicit", async ({
  page,
  request,
}) => {
  await page.goto("/auth");
  await expect(
    page.getByText("Cloud accounts are not configured."),
  ).toBeVisible();
  const bad = await request.get("/api/books/not-a-real-book");
  expect(bad.status()).toBe(404);
  const txt = await request.get("/books/frankenstein.txt");
  expect(txt.status()).toBe(200);
  expect(await txt.text()).toContain("GUTENBERG");
  const res = await request.post("/api/newsletter", {
    headers: { origin: "http://localhost:3000" },
    data: { email: "not-an-email" },
  });
  expect(res.status()).toBe(400);
  const unauth = await request.post("/api/newsletter", {
    data: { email: "test@example.com" },
  });
  expect(unauth.status()).toBe(403);
});
test("search empty state and clear filters", async ({ page }) => {
  await page.route("**/api/catalog?**", (route) => {
    const u = new URL(route.request().url());
    return u.searchParams.get("q") === "xyz-unfindable"
      ? route.fulfill({
          json: { books: [], total: 0, page: 1, source: "openlibrary" },
        })
      : route.continue();
  });
  await page.goto("/explore");
  await page
    .getByRole("textbox", { name: "Search books" })
    .fill("xyz-unfindable");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "No books found." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset search" }).click();
  await expect(page.getByText("6 books", { exact: true })).toBeVisible();
});

test("live remote catalog search returns source metadata and lawful detail links", async ({
  page,
}) => {
  test.setTimeout(60000);
  await page.goto("/explore");
  await page.getByRole("textbox", { name: "Search books" }).fill("tolkien");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.locator(".catalog-grid .book-card").first()).toBeVisible({
    timeout: 25000,
  });
  await expect(
    page.getByText("Open Library is temporarily unavailable.", {
      exact: false,
    }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "View The Hobbit", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "View The Hobbit", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "The Hobbit", exact: true }),
  ).toBeVisible({ timeout: 25000 });
  await expect(
    page.getByRole("link", { name: "Check preview availability" }),
  ).toHaveAttribute("href", /openlibrary.org\/works\/OL\d+W/);
  await expect(page.getByRole("link", { name: "Download TXT" })).toHaveCount(0);
  await page.screenshot({
    path: "/downloads/bookverse-remote-detail.png",
    fullPage: true,
    animations: "disabled",
  });
});
