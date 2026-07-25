import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ShopClient } from "@/components/shop/ShopClient";
import { categories, products } from "@/data/catalog";
import { getCategoryStatus } from "@/lib/categoryHelper";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
  if (!cat) {
    return {
      title: "Category Not Found · Farmora",
      description: "Browse Farmora's full catalog of fresh groceries.",
    };
  }

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

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string; deals?: string; filter?: string; sort?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 dark:bg-zinc-950">
      <Header />
      <main className="flex-1 mx-auto max-w-7xl w-full px-5 md:px-8 py-10 md:py-14">
        <ShopClient
          products={products}
          categories={categories}
          initial={{ ...sp, cat: slug }}
        />
      </main>
      <Footer />
    </div>
  );
}
