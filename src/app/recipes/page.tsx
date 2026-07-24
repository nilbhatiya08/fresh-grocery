import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { recipes } from "@/data/catalog";
import Image from "next/image";
import Link from "next/link";
import { Clock, Flame, Users, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Recipes · Wholesome Ideas from Farmora",
  description:
    "Seasonal, quick and nutrient-dense recipes built around the produce on Farmora today.",
};

export default function RecipesPage() {
  const all = [
    ...recipes,
    ...recipes.map((r, i) => ({ ...r, slug: `${r.slug}-${i}`, title: r.title + " · Remix" })),
  ];
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl px-5 md:px-8 py-10 md:py-14">
        <div className="mb-10">
          <div className="text-xs uppercase tracking-[0.24em] text-brand-600 mb-2">Recipes</div>
          <h1 className="font-display text-4xl md:text-6xl text-brand-950 text-balance">
            Cook something <span className="italic text-brand-600">bright</span> tonight.
          </h1>
          <p className="mt-3 text-brand-700 max-w-xl">
            Seasonal, quick and nutrient-dense — built around what&apos;s freshest on Farmora this week.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {all.map((r) => (
            <Link
              key={r.slug}
              href={`/recipes/${r.slug}`}
              className="group bg-white rounded-3xl border border-brand-100 overflow-hidden hover:shadow-lift transition"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={r.image} alt={r.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {r.tags.map((t) => (
                    <span key={t} className="text-[10px] font-semibold uppercase tracking-wide bg-white/90 text-brand-900 px-2 py-1 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl mb-2 text-brand-950 flex items-center justify-between">
                  {r.title} <ArrowUpRight className="w-4 h-4 text-brand-500 group-hover:text-brand-700" />
                </h3>
                <p className="text-sm text-brand-700 line-clamp-2 mb-4">{r.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-brand-600">
                  <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{r.time}</span>
                  <span className="inline-flex items-center gap-1"><Flame className="w-3.5 h-3.5" />{r.difficulty}</span>
                  <span className="inline-flex items-center gap-1"><Users className="w-3.5 h-3.5" />{r.serves}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
