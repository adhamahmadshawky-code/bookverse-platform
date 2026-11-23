"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Book, Shelf, ShelfEntry } from "@/lib/types";
import { clampProgress } from "@/lib/utils";
type Context = {
  user: User | null;
  ready: boolean;
  shelf: Shelf;
  notice: string;
  setNotice: (s: string) => void;
  update: (
    b: Book,
    patch: Partial<Omit<ShelfEntry, "book" | "updatedAt">>,
  ) => Promise<void>;
  logout: () => Promise<void>;
};
const C = createContext<Context | null>(null);
export function LibraryProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [shelfReady, setShelfReady] = useState(false);
  const [shelf, setShelf] = useState<Shelf>({});
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (!supabase) {
      try {
        setShelf(JSON.parse(localStorage.getItem("bookverse-guest") || "{}"));
      } catch {
        setNotice("Your local shelf could not be loaded.");
      }
      setReady(true);
      return;
    }
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => {
      setUser(s?.user ?? null);
      setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    setShelfReady(false);
    setShelf({});
    if (!user) {
      try {
        setShelf(JSON.parse(localStorage.getItem("bookverse-guest") || "{}"));
      } catch {
        setShelf({});
      }
      setShelfReady(true);
      return;
    }
    supabase!
      .from("bookshelf")
      .select("*")
      .then(({ data, error }) => {
        if (cancelled) return;
        setShelfReady(true);
        if (error) {
          setNotice("Your cloud shelf could not be loaded.");
          return;
        }
        const result: Shelf = {};
        for (const row of data || [])
          result[row.book_id] = {
            book: row.book,
            favorite: row.favorite,
            saved: row.saved,
            progress: row.progress,
            bookmark: row.bookmark,
            updatedAt: row.updated_at,
          };
        setShelf(result);
      });
    return () => {
      cancelled = true;
    };
  }, [user, ready]);
  const update = useCallback(
    async (
      book: Book,
      patch: Partial<Omit<ShelfEntry, "book" | "updatedAt">>,
    ) => {
      const old = shelf[book.id] || {
        book,
        favorite: false,
        saved: false,
        progress: 0,
        bookmark: null,
        updatedAt: "",
      };
      const entry = {
        ...old,
        ...patch,
        progress: clampProgress(patch.progress ?? old.progress),
        updatedAt: new Date().toISOString(),
      };
      const next = { ...shelf, [book.id]: entry };
      setShelf(next);
      if (!user) {
        try {
          localStorage.setItem("bookverse-guest", JSON.stringify(next));
          setNotice("Saved on this device. Sign in to sync across devices.");
        } catch {
          setShelf(shelf);
          setNotice("Storage is full. Your change could not be saved.");
        }
        return;
      }
      const { error } = await supabase!.from("bookshelf").upsert({
        user_id: user.id,
        book_id: book.id,
        book,
        favorite: entry.favorite,
        saved: entry.saved,
        progress: entry.progress,
        bookmark: entry.bookmark,
        updated_at: entry.updatedAt,
      });
      if (error) {
        setShelf(shelf);
        setNotice("Could not save this change. Please try again.");
      }
    },
    [shelf, user],
  );
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 5000);
    return () => clearTimeout(timer);
  }, [notice]);
  return (
    <C.Provider
      value={{
        user,
        ready: ready && shelfReady,
        shelf,
        notice,
        setNotice,
        update,
        logout: async () => {
          const result = await supabase?.auth.signOut();
          if (result?.error) {
            setNotice("Could not sign out. Please try again.");
            return;
          }
          setShelf({});
          setUser(null);
          setNotice("Signed out.");
        },
      }}
    >
      {children}
      {notice && (
        <div className="toast" role="status">
          {notice}
          <button
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            ×
          </button>
        </div>
      )}
    </C.Provider>
  );
}
export function useLibrary() {
  const v = useContext(C);
  if (!v) throw Error("Missing library provider");
  return v;
}
