import { Settings } from "@/components/settings";
export const metadata = {
  title: "Account settings",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <div className="container section">
      <Settings />
    </div>
  );
}
