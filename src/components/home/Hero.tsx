"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Zap, Package, Milk, MapPin, Leaf } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCity } from "@/store/shop";
import { cities } from "@/data/catalog";

type Slide = {
  eyebrow: string;
  title: string;
  subtitle: string;
  mode: "instant" | "bulk" | "subscription";
  cta: { label: string; href: string };
  secondary?: { label: string; href: string };
  image: string;
  gradient: string;
};

const slides: Slide[] = [
  {
    eyebrow: "Instant Delivery · 30-40 Minutes",
    title: "Farm-picked,\nat your door in a flash.",
    subtitle:
      "Every tomato, potato, onion and spinach bunch travels from our partner farms to your kitchen in under 14 hours — delivered in 30-40 minutes inside Ahmedabad & Gandhinagar.",
    mode: "instant",
    cta: { label: "⚡ Order instant", href: "/shop?mode=instant" },
    secondary: { label: "Check pincode", href: "#pincode" },
    image: "/images/products/tomato.jpg",
    gradient: "from-cta-700 via-cta-600 to-cta-500",
  },
  {
    eyebrow: "Bulk Orders · Next-Day Delivery",
    title: "For restaurants, caterers\nand big societies.",
    subtitle:
      "Wholesale pricing on farm-fresh vegetables. Scheduled next-day morning delivery, GST invoices, and a dedicated account manager for orders above ₹5,000.",
    mode: "bulk",
    cta: { label: "📦 Plan bulk order", href: "/bulk" },
    secondary: { label: "Corporate enquiry", href: "/bulk#corporate" },
    image: "/images/products/potato.jpg",
    gradient: "from-brand-900 via-brand-800 to-emerald-700",
  },
  {
    eyebrow: "Daily Sabzi Subscription",
    title: "Your daily salad & sabzi,\nfresh every morning.",
    subtitle:
      "Fresh cucumbers, carrots, beetroot, and leafy greens delivered automatically every morning before 7 AM. Pause on vacations, skip tomorrow, or modify anytime from the app.",
    mode: "subscription",
    cta: { label: "🥗 Start sabzi plan", href: "/subscription" },
    secondary: { label: "How it works", href: "/subscription#how" },
    image: "/images/products/cucumber.jpg",
    gradient: "from-emerald-900 via-emerald-800 to-teal-700",
  },
];

const modeColor: Record<Slide["mode"], string> = {
  instant: "bg-cta-500 text-white shadow-glow-cta",
  bulk: "bg-white text-brand-900",
  subscription: "bg-emerald-500 text-white",
};

export function Hero() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const citySlug = useCity((s) => s.slug);
  const currentCity = cities.find((c) => c.slug === citySlug) ?? cities[0];

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 6500);
    return () => clearInterval(t);
  }, [paused]);

  const next = () => setIdx((i) => (i + 1) % slides.length);
  const prev = () => setIdx((i) => (i - 1 + slides.length) % slides.length);
  const slide = slides[idx];

  return (
    <section
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[560px] md:h-[680px] overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image src={slide.image} alt="" fill priority={idx === 0} sizes="100vw" className="object-cover" />
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-[0.55]`} />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Content */}
        <div className="relative mx-auto max-w-7xl h-full px-5 md:px-8 flex items-center">
          <div className="max-w-2xl text-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-2 flex-wrap mb-5">
                  <span className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full ${modeColor[slide.mode]}`}>
                    {slide.mode === "instant" && <Zap className="w-3.5 h-3.5"/>}
                    {slide.mode === "bulk" && <Package className="w-3.5 h-3.5"/>}
                    {slide.mode === "subscription" && <Leaf className="w-3.5 h-3.5"/>}
                    {slide.eyebrow}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs bg-white/15 backdrop-blur text-white px-3 py-1.5 rounded-full border border-white/20">
                    <MapPin className="w-3 h-3" /> {currentCity.name}
                    {currentCity.live ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-lime-300 pulse-ring" />
                    ) : (
                      <span className="text-amber-300">· coming soon</span>
                    )}
                  </span>
                </div>
                <h1 className="font-display text-[40px] md:text-[68px] leading-[0.98] whitespace-pre-line text-balance">
                  {slide.title}
                </h1>
                <p className="mt-5 text-base md:text-lg text-white/90 max-w-lg leading-relaxed">
                  {slide.subtitle}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={slide.cta.href}
                    className="inline-flex items-center gap-2 bg-white text-brand-900 px-6 py-3.5 rounded-full font-semibold text-sm hover:bg-brand-50 transition"
                  >
                    {slide.cta.label} <ArrowRight className="w-4 h-4" />
                  </Link>
                  {slide.secondary && (
                    <Link
                      href={slide.secondary.href}
                      className="inline-flex items-center gap-2 border border-white/30 hover:border-white/60 text-white px-6 py-3.5 rounded-full font-medium text-sm backdrop-blur"
                    >
                      {slide.secondary.label}
                    </Link>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-6 left-0 right-0 mx-auto max-w-7xl px-5 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === idx ? "w-10 bg-white" : "w-5 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={prev} aria-label="Previous slide" className="w-10 h-10 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur border border-white/10">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={next} aria-label="Next slide" className="w-10 h-10 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur border border-white/10">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mode cards overlapping hero */}
      <div className="relative mx-auto max-w-7xl px-5 md:px-8 -mt-16 md:-mt-20 z-10">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Zap, mode: "instant", title: "Instant Delivery", desc: "Fresh vegetables in 30–40 mins", bg: "from-cta-500 to-orange-500", cta: "Shop now", href: "/shop?mode=instant", live: "Live in Ahmedabad · Gandhinagar" },
            { icon: Package, mode: "bulk", title: "Bulk Orders", desc: "Next-day for restaurants & caterers", bg: "from-brand-800 to-brand-600", cta: "Plan bulk", href: "/bulk", live: "GST invoices · from ₹5,000" },
            { icon: Leaf, mode: "subscription", title: "Sabzi Subscription", desc: "Daily sabzi & salad every morning", bg: "from-emerald-600 to-teal-600", cta: "Subscribe", href: "/subscription", live: "Pause · Skip · Resume anytime" },
          ].map((c) => (
            <Link
              key={c.mode}
              href={c.href}
              className={`group relative overflow-hidden rounded-3xl p-5 text-white bg-gradient-to-br ${c.bg} shadow-lift hover:-translate-y-1 transition-transform`}
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur grid place-items-center">
                  <c.icon className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </div>
              <div className="font-display text-2xl leading-tight">{c.title}</div>
              <div className="text-sm text-white/85 mt-1">{c.desc}</div>
              <div className="text-[11px] mt-3 text-white/70 uppercase tracking-wider">{c.live}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
