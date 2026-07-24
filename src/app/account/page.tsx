import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AccountShell } from "@/components/account/AccountShell";

export const metadata: Metadata = {
  title: "My Account · Farmora",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl px-5 md:px-8 py-10 md:py-14">
        <AccountShell />
      </main>
      <Footer />
    </div>
  );
}
