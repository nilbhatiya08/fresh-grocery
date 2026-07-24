import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ShopClient } from "@/components/shop/ShopClient";
import { categories, products } from "@/data/catalog";

export const metadata: Metadata = {
  title: "Shop Fresh · Farmora",
  description:
    "Browse Farmora's full catalog — vegetables, fruits, dairy, bakery, cold-pressed juices and pantry essentials.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string; deals?: string; filter?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl px-5 md:px-8 py-10 md:py-14">
        <ShopClient
          products={products}
          categories={categories}
          initial={sp}
        />
      </main>
      <Footer />
    </div>
  );
}
