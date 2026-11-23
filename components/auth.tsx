"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
export function Auth() {
  const [mode, setMode] = useState<"login" | "signup" | "reset" | "update">(
    "login",
  );
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const recovery =
    typeof window !== "undefined" &&
    window.location.hash.includes("type=recovery");
  const actual = recovery ? "update" : mode;
  return (
    <div className="auth-card">
      <p className="eyebrow gold">A SHELF THAT FEELS LIKE YOU</p>
      <h1>
        {actual === "signup"
          ? "Begin your next chapter."
          : actual === "reset"
            ? "Find your way back."
            : actual === "update"
              ? "Choose a new password."
              : "Welcome back, reader."}
      </h1>
      <p className="muted">
        {actual === "signup"
          ? "Create an account to keep your reading life in sync."
          : "Your stories are right where you left them."}
      </p>
      {!supabase ? (
        <div className="alert">
          <strong>Cloud accounts are not configured.</strong>
          <p>
            Connect a Supabase project using the setup guide to enable secure
            sign-in, password recovery, and cross-device sync. You can explore
            books and save a guest shelf on this device now.
          </p>
          <Link className="button outline" href="/explore">
            Explore as a guest
          </Link>
        </div>
      ) : (
        <form
          className="stack-form"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setMessage("");
            const d = new FormData(e.currentTarget);
            const email = String(d.get("email") || "");
            const password = String(d.get("password") || "");
            try {
              if (actual === "signup") {
                const { error } = await supabase!.auth.signUp({
                  email,
                  password,
                  options: {
                    data: { display_name: String(d.get("name")) },
                    emailRedirectTo: `${window.location.origin}/dashboard`,
                  },
                });
                if (error) throw error;
                setMessage(
                  "Check your email to confirm your account, then sign in.",
                );
              } else if (actual === "reset") {
                const { error } = await supabase!.auth.resetPasswordForEmail(
                  email,
                  { redirectTo: `${window.location.origin}/auth` },
                );
                if (error) throw error;
                setMessage(
                  "If this email has an account, a recovery link will arrive shortly.",
                );
              } else if (actual === "update") {
                const { error } = await supabase!.auth.updateUser({ password });
                if (error) throw error;
                window.history.replaceState(null, "", "/auth");
                setMode("login");
                setMessage("Password updated. You can now sign in.");
              } else {
                const { error } = await supabase!.auth.signInWithPassword({
                  email,
                  password,
                });
                if (error) throw error;
                router.push("/dashboard");
              }
            } catch (e) {
              setMessage(
                e instanceof Error
                  ? e.message
                  : "Could not complete this request.",
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          {actual === "signup" && (
            <label>
              Your name
              <input name="name" required maxLength={80} autoComplete="name" />
            </label>
          )}
          {actual !== "update" && (
            <label>
              Email address
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                maxLength={254}
              />
            </label>
          )}
          {actual !== "reset" && (
            <label>
              Password
              <input
                name="password"
                type="password"
                required
                minLength={12}
                autoComplete={
                  actual === "login" ? "current-password" : "new-password"
                }
              />
              <small>At least 12 characters.</small>
            </label>
          )}
          <button className="button primary" disabled={busy}>
            {busy
              ? "Please wait…"
              : actual === "login"
                ? "Sign in"
                : actual === "signup"
                  ? "Create account"
                  : actual === "reset"
                    ? "Send recovery link"
                    : "Update password"}
          </button>
        </form>
      )}
      <p role="status" className="form-message">
        {message}
      </p>
      <div className="auth-switch">
        <button
          className="text-link"
          onClick={() => {
            setMode(mode === "signup" ? "login" : "signup");
            setMessage("");
          }}
        >
          {mode === "signup"
            ? "Already a reader? Sign in"
            : "New here? Create an account"}
        </button>
        <button
          className="text-link"
          onClick={() => {
            setMode("reset");
            setMessage("");
          }}
        >
          Forgot password?
        </button>
      </div>
    </div>
  );
}
