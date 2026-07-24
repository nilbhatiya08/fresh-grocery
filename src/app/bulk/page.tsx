import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BulkPage } from "@/components/bulk/BulkPage";

export const metadata: Metadata = {
  title: "Bulk Orders · Wholesale grocery for restaurants & societies",
  description:
    "Wholesale pricing with next-day scheduled delivery, GST invoices, and corporate plans for restaurants, hotels, societies and offices.",
};

export default function Page() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl px-5 md:px-8 py-10 md:py-14">
        <BulkPage />
      </main>
      <Footer />
    </div>
  );
}
