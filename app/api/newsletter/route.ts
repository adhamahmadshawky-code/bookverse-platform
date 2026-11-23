import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
export async function POST(req: NextRequest) {
  if (
    !req.headers.get("origin") ||
    new URL(req.headers.get("origin")!).host !== req.headers.get("host")
  )
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  if (Number(req.headers.get("content-length") || 0) > 2048)
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  try {
    const { email } = z
      .object({ email: z.email().max(254) })
      .parse(await req.json());
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key)
      return NextResponse.json(
        {
          error:
            "Newsletter is not configured yet. Please try again after setup.",
        },
        { status: 503 },
      );
    const token = req.headers.get("authorization") || "";
    if (!token.startsWith("Bearer "))
      return NextResponse.json(
        { error: "Sign in before subscribing to the reading list." },
        { status: 401 },
      );
    const db = createClient(url, key, {
      global: { headers: { Authorization: token } },
    });
    const {
      data: { user },
    } = await db.auth.getUser();
    if (!user || user.email?.toLowerCase() !== email.toLowerCase())
      return NextResponse.json(
        { error: "Use your signed-in account’s email address." },
        { status: 403 },
      );
    const { error } = await db
      .from("newsletter_subscriptions")
      .insert({ email: email.toLowerCase() });
    if (error && error.code !== "23505")
      return NextResponse.json(
        { error: "Could not subscribe. Please try again." },
        { status: 500 },
      );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }
}
