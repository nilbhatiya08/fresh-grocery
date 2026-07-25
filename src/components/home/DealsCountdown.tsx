"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Timer, Flame, Zap } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { products } from "@/data/catalog";

function useCountdown(target: Date) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return { h, m, s };
}

const Pad = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="font-display text-3xl md:text-4xl tabular-nums text-brand-950 bg-white border border-brand-100 rounded-2xl w-16 h-16 grid place-items-center shadow-soft">
      {String(value).padStart(2, "0")}
    </div>
    <div className="text-[10px] uppercase tracking-widest text-brand-600 mt-1.5">{label}</div>
  </div>
);

export function DealsCountdown() {
  // End of day target (today 23:59:59)
  const [target] = useState(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 0);
    return d;
  });
  const { h, m, s } = useCountdown(target);

  const deals = products
    .filter((p) => p.category === "vegetables" && p.weights.some((w) => w.mrp > w.price))
    .slice(0, 4);

  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="relative rounded-[36px] overflow-hidden bg-gradient-to-br from-berry via-rose-600 to-orange-500 p-6 md:p-10 text-white">
          <div
            aria-hidden
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-yellow-300/20 blur-3xl"
          />

          <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-8 mb-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                <Flame className="w-3.5 h-3.5" /> TODAY&apos;S HOT DEALS
              </div>
              <h2 className="font-display text-4xl md:text-5xl leading-[1.02]">
                Up to 40% off. <br className="hidden md:block" />
                Gone by midnight.
              </h2>
              <p className="text-white/85 mt-3 max-w-lg">
                Hand-picked flash offers on bestsellers — limited stock, refreshed every 24 hours.
              </p>
            </div>
            <div className="flex items-center gap-3 text-brand-950">
              <Pad value={h} label="Hours" />
              <div className="text-2xl font-display opacity-50 self-start mt-5">:</div>
              <Pad value={m} label="Mins" />
              <div className="text-2xl font-display opacity-50 self-start mt-5">:</div>
              <Pad value={s} label="Secs" />
            </div>
          </div>

          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-4">
            {deals.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="[&_article]:bg-white [&_article]:text-brand-950">
                  <ProductCard product={p} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
