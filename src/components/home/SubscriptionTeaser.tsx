"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Milk, CalendarDays, PauseCircle, CheckCircle2, ArrowRight } from "lucide-react";

export function SubscriptionTeaser() {
  const items = [
    { name: "Farm-Fresh Toned Milk", price: "₹54 / L", badge: "Daily" },
    { name: "A2 Cultured Cow Ghee", price: "₹649 / 500 ml", badge: "Weekly" },
    { name: "Malai Paneer", price: "₹78 / 200 g", badge: "Alternate days" },
    { name: "Greek Yogurt", price: "₹128 / 400 g", badge: "Alternate days" },
  ];
  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="relative rounded-[36px] overflow-hidden bg-gradient-to-br from-sky-100 via-blue-50 to-cream-50 p-8 md:p-12 border border-brand-100">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-sky-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                <Milk className="w-3.5 h-3.5" /> Dairy Subscription · Live in Ahmedabad & Gandhinagar
              </div>
              <h2 className="font-display text-3xl md:text-5xl text-brand-950 text-balance leading-tight">
                Your morning chai, <span className="italic text-sky-700">never without milk.</span>
              </h2>
              <p className="mt-4 text-brand-800 max-w-lg">
                Subscribe once. Get farm-fresh A2 milk, paneer and curd delivered every morning before 7 AM.
                Pause on vacation, skip tomorrow, or increase quantity — all from the app.
              </p>
              <div className="mt-6 grid sm:grid-cols-3 gap-3">
                {[
                  { icon: CalendarDays, label: "Pick delivery days" },
                  { icon: PauseCircle, label: "Pause anytime" },
                  { icon: CheckCircle2, label: "Auto-billing" },
                ].map((f) => (
                  <div key={f.label} className="bg-white rounded-2xl p-3 flex items-center gap-2.5 border border-brand-100">
                    <f.icon className="w-5 h-5 text-sky-700" />
                    <div className="text-sm font-medium text-brand-900">{f.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex gap-3">
                <Link href="/subscription" className="bg-sky-600 hover:bg-sky-700 text-white rounded-full px-5 py-3 font-semibold text-sm flex items-center gap-1.5">
                  Start subscription <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/subscription#how" className="bg-white border border-brand-200 rounded-full px-5 py-3 font-semibold text-sm">
                  How it works
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {items.map((it, i) => (
                <motion.div
                  key={it.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-2xl p-4 border border-brand-100"
                >
                  <div className="text-[10px] uppercase tracking-wider text-sky-700 font-semibold mb-1">{it.badge}</div>
                  <div className="font-display text-lg text-brand-950">{it.name}</div>
                  <div className="text-sm text-brand-600 mt-1">{it.price}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
