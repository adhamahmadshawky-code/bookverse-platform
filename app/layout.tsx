import type { Metadata } from "next";
import "./globals.css";
import { LibraryProvider } from "@/components/provider";
import { Header, Footer } from "@/components/header";
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "BOOKVERSE | A world between the pages",
    template: "%s | BOOKVERSE",
  },
  description:
    "Discover your next great read. Explore the Open Library catalog, read classic books, and build a bookshelf that feels like you.",
  openGraph: {
    title: "BOOKVERSE",
    description: "A world between the pages",
    type: "website",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <LibraryProvider>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </LibraryProvider>
      </body>
    </html>
  );
}
