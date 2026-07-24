"use client";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star, BadgeCheck } from "lucide-react";
import { testimonials } from "@/data/catalog";
import { cn } from "@/lib/utils";

export function Reviews() {
  const [idx, setIdx] = useState(0);
  const next = () => setIdx((i) => (i + 1) % testimonials.length);
  const prev = () => setIdx((i) => (i - 1 + testimonials.length) % testimonials.length);
  const t = testimonials[idx];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-cream-50">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid lg:grid-cols-5 gap-10 items-center">
          <div className="lg:col-span-2">
            <div className="text-xs uppercase tracking-[0.24em] text-brand-600 mb-2">
              Happy Households
            </div>
            <h2 className="font-display text-3xl md:text-5xl text-brand-950 text-balance">
              Loved by over <span className="italic text-brand-600">250,000</span> families.
            </h2>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400" fill="currentColor" />
                ))}
              </div>
              <div className="text-sm text-brand-800">
                <span className="font-semibold">4.8</span> average · 48,000+ reviews
              </div>
            </div>

            <div className="mt-10 flex items-center gap-3">
              <button
                onClick={prev}
                aria-label="Previous review"
                className="w-12 h-12 grid place-items-center rounded-full bg-white border border-brand-100 hover:border-brand-400 text-brand-800"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                aria-label="Next review"
                className="w-12 h-12 grid place-items-center rounded-full bg-brand-900 hover:bg-brand-800 text-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="ml-2 text-sm text-brand-600">
                <span className="font-semibold text-brand-900">{idx + 1}</span> / {testimonials.length}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 relative min-h-[320px]">
            <Quote className="absolute -top-2 -left-2 w-14 h-14 text-brand-100" />
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-3xl border border-brand-100 shadow-soft p-8 md:p-10"
              >
                <div className="flex items-center gap-0.5 text-amber-400 mb-4">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      className={cn("w-4 h-4", i < t.rating ? "" : "text-brand-200")}
                      fill={i < t.rating ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <p className="font-display text-xl md:text-2xl leading-snug text-brand-950 text-balance">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-8 flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-brand-100">
                    <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="font-semibold text-brand-900 flex items-center gap-1.5">
                      {t.name}
                      {t.verified && (
                        <BadgeCheck className="w-4 h-4 text-brand-600" fill="currentColor" />
                      )}
                    </div>
                    <div className="text-xs text-brand-600">{t.location} · Verified Buyer</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
