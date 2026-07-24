import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, products } from "@/data/catalog";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductSection } from "@/components/home/ProductSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { formatINR } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  if (!p) return { title: "Product not found" };
  return {
    title: `${p.name} — ${formatINR(p.weights[0].price)}`,
    description: p.tagline + " " + p.description.slice(0, 120),
    openGraph: {
      title: p.name,
      description: p.tagline,
      images: [p.image],
    },
  };
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  const similar = products
    .filter((p) => p.id !== product.id && p.subcategory === product.subcategory)
    .slice(0, 8);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.gallery,
    description: product.description,
    brand: { "@type": "Brand", name: "Farmora" },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.weights[0].price,
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
  };

  return (
    <div className="min-h-screen">
      <Header />
      <JsonLd data={schema} />
      <main className="mx-auto max-w-7xl px-5 md:px-8 py-10 md:py-14">
        <ProductDetail product={product} />

        {related.length > 0 && (
          <div className="mt-20">
            <ProductSection
              eyebrow="Related"
              title={<>More in <span className="italic text-brand-600">{product.subcategory}</span></>}
              products={related}
              columns={4}
            />
          </div>
        )}

        <div className="mt-10">
          <ProductSection
            eyebrow="You may also like"
            title={<>Similar products</>}
            products={similar.slice(0, 4)}
            columns={4}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
