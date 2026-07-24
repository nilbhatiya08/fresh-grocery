import Image from "next/image";
import Link from "next/link";
import { Clock, Flame, Users, ArrowUpRight } from "lucide-react";
import { recipes } from "@/data/catalog";

export function Recipes() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-brand-600 mb-2">
              From Our Kitchen
            </div>
            <h2 className="font-display text-3xl md:text-5xl text-brand-950 text-balance">
              Cook something <span className="italic text-brand-600">wholesome</span> tonight.
            </h2>
          </div>
          <Link
            href="/recipes"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-brand-800 hover:text-brand-600"
          >
            All recipes <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {recipes.map((r, i) => (
            <Link
              key={r.slug}
              href={`/recipes/${r.slug}`}
              className={`group relative overflow-hidden rounded-3xl ${
                i === 0 ? "md:col-span-2 lg:row-span-2 aspect-square md:aspect-auto" : "aspect-[4/5]"
              }`}
            >
              <Image
                src={r.image}
                alt={r.title}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                {r.tags.map((t) => (
                  <span key={t} className="text-[10px] font-semibold uppercase tracking-wide bg-white/90 text-brand-900 px-2 py-1 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
              <div className="absolute inset-x-5 bottom-5 text-white">
                <h3 className="font-display text-xl md:text-2xl leading-tight mb-2">
                  {r.title}
                </h3>
                {i === 0 && <p className="text-sm text-white/80 mb-3 max-w-md">{r.excerpt}</p>}
                <div className="flex items-center gap-4 text-xs text-white/80">
                  <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{r.time}</span>
                  <span className="inline-flex items-center gap-1"><Flame className="w-3.5 h-3.5" />{r.difficulty}</span>
                  <span className="inline-flex items-center gap-1"><Users className="w-3.5 h-3.5" />{r.serves}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
