import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductSection } from "@/components/home/ProductSection";
import { BestSellersCarousel } from "@/components/home/BestSellersCarousel";
import { DealsCountdown } from "@/components/home/DealsCountdown";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Recipes } from "@/components/home/Recipes";
import { Reviews } from "@/components/home/Reviews";
import { PincodeChecker } from "@/components/home/PincodeChecker";
import { BrandMarquee } from "@/components/home/BrandMarquee";
import { FarmerSpotlight } from "@/components/home/FarmerSpotlight";
import { MobileApp } from "@/components/home/MobileApp";
import { SubscriptionTeaser } from "@/components/home/SubscriptionTeaser";
import {
  bestSellers,
  newArrivals,
  organic,
  products,
} from "@/data/catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Farmora — Instant, Bulk & Dairy Subscription",
  description:
    "Premium fresh vegetables, fruits and dairy delivered in 30-40 minutes, bulk next-day for restaurants, or daily dairy subscription — all from trusted partner farms.",
  alternates: { canonical: "https://farmora.vercel.app" },
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <BrandMarquee />
        <CategoryGrid />
        <SubscriptionTeaser />
        <ProductSection
          eyebrow="Bestsellers"
          title={<>What our customers <span className="italic text-brand-600">can&apos;t stop ordering</span>.</>}
          description="The most-loved produce on Farmora this week — hand-picked favourites from over 250,000 baskets."
          products={bestSellers.slice(0, 8)}
          cta={{ label: "Shop bestsellers", href: "/shop?filter=bestseller" }}
        />

        <section className="py-14 md:py-20 bg-white">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-brand-600 mb-2">Trending</div>
                <h2 className="font-display text-3xl md:text-5xl text-brand-950 text-balance">
                  On everyone&apos;s list <span className="italic text-brand-600">this week</span>.
                </h2>
              </div>
            </div>
            <BestSellersCarousel products={products.slice(0, 10)} />
          </div>
        </section>

        <DealsCountdown />

        <ProductSection
          eyebrow="New on Farmora"
          title={<>Fresh arrivals, <span className="italic text-brand-600">just in</span>.</>}
          description="Seasonal specials and small-batch finds from partner farms — grab them before they're gone."
          products={newArrivals.slice(0, 4)}
          cta={{ label: "See all arrivals", href: "/shop?filter=new" }}
          columns={4}
        />

        <WhyChooseUs />
        <FarmerSpotlight />

        <ProductSection
          eyebrow="Certified Organic"
          title={<>Produce that&apos;s <span className="italic text-brand-600">truly clean</span>.</>}
          description="Residue-tested, India Organic-certified, and grown without synthetic pesticides."
          products={organic.slice(0, 4)}
          cta={{ label: "Shop organic", href: "/shop?filter=organic" }}
          columns={4}
        />

        <Recipes />
        <Reviews />
        <PincodeChecker />
        <MobileApp />
      </main>
      <Footer />
    </div>
  );
}
