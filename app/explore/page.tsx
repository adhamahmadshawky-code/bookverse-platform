import { Suspense } from "react";
import { Explore } from "@/components/explore";
export const metadata = { title: "Explore the library" };
export default function Page() {
  return (
    <Suspense
      fallback={<div className="container section">Loading library…</div>}
    >
      <Explore />
    </Suspense>
  );
}
