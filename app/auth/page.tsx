import { Auth } from "@/components/auth";
export const metadata = { title: "Your account" };
export default function Page() {
  return (
    <div className="container section">
      <Auth />
    </div>
  );
}
