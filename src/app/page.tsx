import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductSection } from "@/components/home/ProductSection";
import { DealsCountdown } from "@/components/home/DealsCountdown";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Reviews } from "@/components/home/Reviews";
import { PincodeChecker } from "@/components/home/PincodeChecker";
import { BrandMarquee } from "@/components/home/BrandMarquee";
import { MobileApp } from "@/components/home/MobileApp";
import {
  bestSellers,
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
        <PincodeChecker />
        <Hero />
        <BrandMarquee />
        <CategoryGrid />
        <ProductSection
          eyebrow="Bestsellers"
          title={<>What our customers <span className="italic text-brand-600">can&apos;t stop ordering</span>.</>}
          description="The most-loved produce on Farmora this week — hand-picked favourites from over 250,000 baskets."
          products={bestSellers.slice(0, 8)}
          cta={{ label: "Shop bestsellers", href: "/shop?filter=bestseller" }}
        />

        <DealsCountdown />

        <WhyChooseUs />

        <Reviews />
        <MobileApp />
      </main>
      <Footer />
    </div>
  );
}
