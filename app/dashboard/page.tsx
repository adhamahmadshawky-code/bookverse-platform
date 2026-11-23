import { Dashboard } from "@/components/dashboard";
export const metadata = {
  title: "Your bookshelf",
  robots: { index: false, follow: false },
};
export default function Page() {
  return <Dashboard />;
}
