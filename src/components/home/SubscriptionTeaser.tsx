"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Leaf, CalendarDays, PauseCircle, CheckCircle2, ArrowRight } from "lucide-react";

export function SubscriptionTeaser() {
  const items = [
    { name: "Daily Sabzi Combo (500g)", price: "₹45 / day", badge: "Daily" },
    { name: "Baby Spinach & Leafy Greens", price: "₹28 / bunch", badge: "Alternate days" },
    { name: "English Cucumber & Salad", price: "₹16 / 500g", badge: "Daily" },
    { name: "Desi Red Carrots & Beetroot", price: "₹20 / 500g", badge: "Alternate days" },
  ];
  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="relative rounded-[36px] overflow-hidden bg-gradient-to-br from-emerald-100 via-teal-50 to-cream-50 p-8 md:p-12 border border-emerald-200/60 shadow-soft">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5 shadow-sm">
                <Leaf className="w-3.5 h-3.5" /> Sabzi Subscription · Live in Ahmedabad & Gandhinagar
              </div>
              <h2 className="font-display text-3xl md:text-5xl text-brand-950 text-balance leading-tight">
                Your daily kitchen sabzi, <span className="italic text-emerald-700">always farm-fresh.</span>
              </h2>
              <p className="mt-4 text-brand-800 max-w-lg leading-relaxed">
                Subscribe once. Get farm-fresh daily vegetables, salad cucumbers, and leafy greens delivered automatically every morning before 7 AM.
                Pause on vacation, skip tomorrow, or modify quantity — all from the app.
              </p>
              <div className="mt-6 grid sm:grid-cols-3 gap-3">
                {[
                  { icon: CalendarDays, label: "Pick delivery days" },
                  { icon: PauseCircle, label: "Pause anytime" },
                  { icon: CheckCircle2, label: "Auto-billing" },
                ].map((f) => (
                  <div key={f.label} className="bg-white/80 backdrop-blur rounded-2xl p-3 flex items-center gap-2.5 border border-emerald-100 shadow-sm">
                    <f.icon className="w-5 h-5 text-emerald-600" />
                    <div className="text-sm font-medium text-brand-900">{f.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex gap-3">
                <Link href="/subscription" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-full px-6 py-3.5 font-semibold text-sm flex items-center gap-2 shadow-md transition">
                  Start sabzi plan <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/subscription#how" className="bg-white/80 hover:bg-white border border-brand-200 rounded-full px-6 py-3.5 font-semibold text-sm transition">
                  How it works
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {items.map((it, i) => (
                <motion.div
                  key={it.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white/90 backdrop-blur rounded-3xl p-5 border border-emerald-100/80 shadow-sm hover:shadow-md transition"
                >
                  <div className="text-[10px] uppercase tracking-wider text-emerald-700 font-bold mb-1">{it.badge}</div>
                  <div className="font-display text-lg font-bold text-brand-950 leading-snug">{it.name}</div>
                  <div className="text-sm font-semibold text-emerald-800 mt-2 bg-emerald-50 inline-block px-2.5 py-1 rounded-lg">{it.price}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
