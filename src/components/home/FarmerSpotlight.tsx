import Link from "next/link";
import Image from "next/image";
import { farmers } from "@/data/catalog";
import { Leaf, MapPin, Award, ArrowUpRight } from "lucide-react";

export function FarmerSpotlight() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex items-end justify-between mb-10 gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-brand-600 mb-2">Meet our farmers</div>
            <h2 className="font-display text-3xl md:text-5xl text-brand-950 text-balance">
              Every basket has a <span className="italic text-brand-600">name behind it</span>.
            </h2>
            <p className="mt-3 text-brand-700 max-w-xl">
              We partner directly with 140+ small farms across Gujarat — no middlemen, no cold-storage shortcuts, no compromise.
            </p>
          </div>
          <Link href="/farmers" className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-brand-800 hover:text-brand-600">
            All farmer stories <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {farmers.map((f, i) => (
            <article key={f.name} className="group relative bg-cream-50 rounded-3xl overflow-hidden border border-brand-100">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={f.image} alt={f.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-white/90 text-brand-800 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                  <Award className="w-3 h-3 text-cta-500"/> {f.certification}
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="font-display text-2xl">{f.name}</div>
                  <div className="text-sm text-white/85 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3 h-3" /> {f.location} · Since {f.since}
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="text-xs uppercase tracking-wider text-brand-600 mb-2">{f.farm}</div>
                <p className="text-sm text-brand-800 italic leading-relaxed">"{f.quote}"</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {f.produce.map((p) => (
                    <span key={p} className="text-[11px] bg-brand-100 text-brand-800 px-2 py-1 rounded-full flex items-center gap-1">
                      <Leaf className="w-3 h-3" /> {p}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
