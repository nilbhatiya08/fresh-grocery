import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ShopClient } from "@/components/shop/ShopClient";
import { categories, products } from "@/data/catalog";
import { getCategoryStatus } from "@/lib/categoryHelper";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string; deals?: string; filter?: string; sort?: string }>;
}): Promise<Metadata> {
  const sp = await searchParams;
  if (sp.cat && sp.cat !== "all") {
    const cat = categories.find((c) => c.slug.toLowerCase() === sp.cat?.toLowerCase());
    if (cat) {
      const status = getCategoryStatus(cat);
      if (status === "Coming Soon") {
        return {
          title: `${cat.name} – Coming Soon | Farmora`,
          description: `${cat.name} are coming soon to Farmora. Currently delivering premium fresh vegetables with more categories launching soon.`,
          openGraph: {
            title: `${cat.name} – Coming Soon | Farmora`,
            description: `${cat.name} are coming soon to Farmora. Currently delivering premium fresh vegetables with more categories launching soon.`,
            images: [cat.image],
          },
        };
      }
      return {
        title: `${cat.name} · Shop Fresh | Farmora`,
        description: `Order farm-fresh ${cat.name.toLowerCase()} online. Delivered in 30–40 minutes direct from local farms.`,
        openGraph: {
          title: `${cat.name} · Shop Fresh | Farmora`,
          description: `Order farm-fresh ${cat.name.toLowerCase()} online. Delivered in 30–40 minutes direct from local farms.`,
          images: [cat.image],
        },
      };
    }
  }

  return {
    title: "Shop Fresh Groceries · Farmora",
    description: "Browse Farmora's catalog — currently delivering farm-fresh vegetables with more premium categories launching soon.",
  };
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string; deals?: string; filter?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  return (
    <div className="min-h-screen bg-cream-50 dark:bg-zinc-950 flex flex-col">
      <Header />
      <main className="flex-1 mx-auto max-w-7xl w-full px-5 md:px-8 py-10 md:py-14">
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
