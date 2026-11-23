"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLibrary } from "./provider";
export function Reviews({ id }: { id: string }) {
  const { user } = useLibrary();
  const [reviews, setReviews] = useState<
    { id: string; rating: number; body: string; created_at: string }[]
  >([]);
  const [message, setMessage] = useState("");
  const [version, setVersion] = useState(0);
  useEffect(() => {
    if (supabase)
      supabase
        .from("reviews")
        .select("id,rating,body,created_at")
        .eq("book_id", id)
        .order("created_at", { ascending: false })
        .limit(20)
        .then(({ data, error }) => {
          if (error) setMessage("Reviews are unavailable.");
          else setReviews(data || []);
        });
  }, [id, version]);
  return (
    <section className="section">
      <p className="eyebrow gold">THE READING ROOM</p>
      <h2>Reader notes</h2>
      {!supabase ? (
        <p className="muted">
          Community reviews become available after the database is connected.
        </p>
      ) : (
        <>
          {reviews.length === 0 && (
            <p className="muted">
              No reviews yet. Be the first to share a thoughtful note.
            </p>
          )}
          {reviews.map((r) => (
            <article className="review" key={r.id}>
              <span className="gold">{"★".repeat(r.rating)}</span>
              <p>{r.body}</p>
              <small>{new Date(r.created_at).toLocaleDateString("en")}</small>
            </article>
          ))}
          {user ? (
            <form
              className="stack-form"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = new FormData(e.currentTarget);
                const { error } = await supabase!
                  .from("reviews")
                  .upsert(
                    {
                      user_id: user.id,
                      book_id: id,
                      rating: Number(form.get("rating")),
                      body: String(form.get("body")),
                    },
                    { onConflict: "user_id,book_id" },
                  );
                setMessage(
                  error
                    ? "Could not save your review."
                    : "Your review has been saved.",
                );
                setVersion(version + 1);
              }}
            >
              <label>
                Your rating
                <select name="rating">
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} stars
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Your review
                <textarea
                  name="body"
                  required
                  minLength={10}
                  maxLength={2000}
                />
              </label>
              <button className="button outline">Publish review</button>
            </form>
          ) : (
            <p className="muted">Sign in to write a review.</p>
          )}
        </>
      )}
      <p role="status">{message}</p>
    </section>
  );
}
