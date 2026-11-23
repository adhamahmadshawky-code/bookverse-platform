"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container section empty">
      <h1>We lost our place.</h1>
      <p>Something went wrong. Please try loading this page again.</p>
      <button className="button primary" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
