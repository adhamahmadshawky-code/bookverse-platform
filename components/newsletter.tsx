"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowRight } from "lucide-react";
export function Newsletter() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <section className="newsletter container">
      <div>
        <p className="eyebrow gold">LET YOUR NEXT CHAPTER FIND YOU</p>
        <h2>Good books. In your inbox.</h2>
        <p className="muted">
          Join the reading list for new arrivals and thoughtful recommendations.
        </p>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          try {
            const session = await supabase?.auth.getSession();
            const token = session?.data.session?.access_token;
            const r = await fetch("/api/newsletter", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify({
                email: new FormData(e.currentTarget).get("email"),
              }),
            });
            const d = await r.json();
            setMessage(
              r.ok ? "You’re on the list. Thank you for subscribing." : d.error,
            );
          } catch {
            setMessage("Could not connect. Please try again.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <label className="sr-only" htmlFor="newsletter-email">
          Email address
        </label>
        <div className="newsletter-input">
          <input
            id="newsletter-email"
            type="email"
            name="email"
            placeholder="Your email address"
            required
            maxLength={254}
          />
          <button aria-label="Subscribe to newsletter" disabled={busy}>
            {busy ? "…" : <ArrowRight size={21} />}
          </button>
        </div>
        <p className="form-message" role="status">
          {message || "Only bookish things. Unsubscribe in account settings."}
        </p>
      </form>
    </section>
  );
}
