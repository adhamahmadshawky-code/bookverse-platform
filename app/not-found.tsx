import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container section empty">
      <p className="eyebrow gold">404 · A MISSING PAGE</p>
      <h1>This story isn’t on the shelf.</h1>
      <p>The book or page could not be found.</p>
      <Link href="/explore" className="button primary">
        Back to the library
      </Link>
    </div>
  );
}
