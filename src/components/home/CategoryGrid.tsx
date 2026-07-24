"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/data/catalog";

export function CategoryGrid() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex items-end justify-between mb-10 gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-brand-600 mb-2">Shop by Category</div>
            <h2 className="font-display text-3xl md:text-5xl text-brand-950 text-balance">
              Twelve aisles of <span className="italic text-brand-600">farm-fresh</span> goodness.
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-brand-800 hover:text-brand-600"
          >
            Browse all categories <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {categories.map((c, i) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: Math.min(i * 0.05, 0.4), duration: 0.5 }}
            >
              <Link
                href={`/shop?cat=${c.slug}`}
                className={`group relative block overflow-hidden rounded-3xl bg-gradient-to-br ${c.accent} aspect-[4/5]`}
              >
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110 mix-blend-multiply opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent" />
                <div className="absolute inset-x-5 bottom-5 text-white">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="font-display text-xl md:text-2xl leading-tight">{c.name}</div>
                      <div className="text-xs text-white/80 mt-1">{c.count} items</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur grid place-items-center group-hover:bg-white group-hover:text-brand-900 transition">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
