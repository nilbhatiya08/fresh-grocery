"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Minus,
  PauseCircle,
  CalendarDays,
  SkipForward,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { subscriptionProducts } from "@/data/catalog";
import { useCart, useToasts } from "@/store/shop";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";

const DAY_OPTIONS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function SubscriptionPage() {
  const add = useCart((s) => s.add);
  const push = useToasts((s) => s.push);
  return (
    <div>
      <div className="mb-10">
        <div className="text-xs text-brand-500 mb-2"><a href="/" className="hover:text-brand-700">Home</a> / Dairy Subscription</div>
        <h1 className="font-display text-4xl md:text-6xl text-brand-950 text-balance">
          Daily dairy, delivered <span className="italic text-brand-600">before your chai</span>.
        </h1>
        <p className="mt-3 text-brand-700 max-w-2xl">
          Farm-fresh A2 milk, paneer, curd and more — delivered every morning before 7 AM.
          Pause on vacation, skip tomorrow, increase quantity anytime.
        </p>
      </div>

      {/* How it works */}
      <div className="grid md:grid-cols-5 gap-3 mb-14">
        {[
          { step: "01", title: "Subscribe", desc: "Pick your products" },
          { step: "02", title: "Choose quantity", desc: "250 ml to 2 L" },
          { step: "03", title: "Pick days", desc: "Daily or alternate" },
          { step: "04", title: "Auto billing", desc: "Monthly cycle" },
          { step: "05", title: "Morning delivery", desc: "Before 7 AM" },
        ].map((s) => (
          <div key={s.step} className="bg-white rounded-2xl border border-brand-100 p-4">
            <div className="text-xs font-mono text-cta-500 mb-1">{s.step}</div>
            <div className="font-display text-lg">{s.title}</div>
            <div className="text-xs text-brand-600 mt-0.5">{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Products */}
      <h2 className="font-display text-2xl md:text-3xl mb-5">Choose your daily products</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {subscriptionProducts.map((p) => (
          <SubscriptionProductCard key={p.id} product={p} onAdd={(days) => {
            add(p, 0, "subscription", { days });
            push(`${p.name} added to subscription`);
          }} />
        ))}
      </div>
    </div>
  );
}

function SubscriptionProductCard({
  product,
  onAdd,
}: {
  product: (typeof subscriptionProducts)[number];
  onAdd: (days: string[]) => void;
}) {
  const [qty, setQty] = useState(1);
  const [days, setDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
  const w = product.weights[0];
  const price = w.subscription ?? w.price;

  const toggleDay = (d: string) =>
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const monthly = price * qty * Math.max(1, days.length) * 4;

  return (
    <div className="bg-white rounded-3xl border border-brand-100 overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-50">
        <Image src={product.image} alt={product.name} fill className="object-cover" />
        <div className="absolute top-3 left-3 bg-sky-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
          DAILY · {formatINR(price)}/{w.label}
        </div>
      </div>
      <div className="p-5">
        <div className="font-display text-xl">{product.name}</div>
        <div className="text-sm text-brand-600 mt-1">{product.tagline}</div>

        <div className="mt-4">
          <div className="text-xs font-semibold text-brand-800 mb-2">Quantity per delivery</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 rounded-full bg-brand-50 grid place-items-center hover:bg-brand-100">
              <Minus className="w-4 h-4" />
            </button>
            <div className="flex-1 text-center font-semibold">{qty} × {w.label}</div>
            <button onClick={() => setQty(qty + 1)} className="w-9 h-9 rounded-full bg-brand-600 text-white grid place-items-center">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-xs font-semibold text-brand-800 mb-2">Delivery days</div>
          <div className="flex flex-wrap gap-1.5">
            {DAY_OPTIONS.map((d) => (
              <button
                key={d}
                onClick={() => toggleDay(d)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold border transition",
                  days.includes(d)
                    ? "bg-sky-600 text-white border-sky-600"
                    : "bg-white text-brand-700 border-brand-200 hover:border-brand-400"
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-dashed border-brand-100 flex items-center justify-between">
          <div>
            <div className="text-xs text-brand-500">Est. monthly</div>
            <div className="font-display text-xl">{formatINR(monthly)}</div>
          </div>
          <button
            disabled={days.length === 0}
            onClick={() => onAdd(days)}
            className="bg-sky-600 hover:bg-sky-700 disabled:bg-brand-300 text-white rounded-full px-5 py-2.5 text-sm font-semibold flex items-center gap-1.5"
          >
            <CalendarDays className="w-4 h-4" /> Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}
