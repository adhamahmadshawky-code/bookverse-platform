"use client";
import { useState } from "react";
import Link from "next/link";
import { useLibrary } from "./provider";
import { supabase } from "@/lib/supabase";
export function Settings() {
  const { user, ready } = useLibrary();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  if (!ready) return <p>Loading account…</p>;
  if (!user)
    return (
      <div className="empty">
        <h1>Sign in to manage your account.</h1>
        <Link className="button primary" href="/auth">
          Sign in
        </Link>
      </div>
    );
  return (
    <div className="narrow">
      <p className="eyebrow gold">MAKE IT YOURS</p>
      <h1 className="page-title">Account settings</h1>
      <form
        className="stack-form"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          const d = new FormData(e.currentTarget);
          const { error } = await supabase!.auth.updateUser({
            data: { display_name: String(d.get("name")) },
          });
          setMessage(error ? error.message : "Profile updated.");
          setBusy(false);
        }}
      >
        <label>
          Display name
          <input
            name="name"
            required
            minLength={1}
            maxLength={80}
            defaultValue={user.user_metadata.display_name || ""}
          />
        </label>
        <label>
          Email address
          <input type="email" value={user.email} readOnly />
        </label>
        <button className="button primary" disabled={busy}>
          Save profile
        </button>
      </form>
      <section className="section">
        <h2>Newsletter preferences</h2>
        <p className="muted">
          Remove this account’s email from the reading list.
        </p>
        <button
          className="button outline"
          onClick={async () => {
            const { error } = await supabase!.rpc("unsubscribe_newsletter");
            setMessage(
              error
                ? "Could not unsubscribe. Try again."
                : "You are unsubscribed.",
            );
          }}
        >
          Unsubscribe
        </button>
      </section>
      <p role="status">{message}</p>
    </div>
  );
}
