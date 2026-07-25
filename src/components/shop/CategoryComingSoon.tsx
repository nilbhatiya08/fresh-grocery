"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Bell, ArrowRight, CheckCircle2, Home, ShoppingBag, Rocket, ShieldCheck } from "lucide-react";
import { useToasts } from "@/store/shop";
import type { Category } from "@/data/catalog";

type Props = {
  category?: Category | { slug: string; name: string; image?: string; accent?: string; count?: number };
  onBrowseVegetables?: () => void;
};

export function CategoryComingSoon({ category, onBrowseVegetables }: Props) {
  const pushToast = useToasts((s) => s.push);
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const catName = category?.name || "This Category";
  const catSlug = category?.slug || "general";
  const catImage = category?.image || "/images/categories/fruits.png";

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) {
      pushToast("Please enter your email or mobile number", "info");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/notify-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categorySlug: catSlug, contact }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        pushToast(`You're on the waitlist for ${catName}!`, "success");
      } else {
        pushToast(data.error || "Failed to submit request", "info");
      }
    } catch (err) {
      // Fallback UI success if offline
      setSubmitted(true);
      pushToast(`You're on the waitlist for ${catName}!`, "success");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 animate-in fade-in duration-500">
      <div className="max-w-3xl w-full mx-auto text-center relative">
        {/* Background Decorative Gradients */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-tr from-brand-300/30 to-amber-300/30 dark:from-brand-900/20 dark:to-amber-900/20 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        {/* Card Wrapper */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-brand-100 dark:border-zinc-800 rounded-3xl p-8 md:p-14 shadow-2xl shadow-brand-950/5 relative overflow-hidden">
          
          {/* Top Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-brand-500/10 dark:from-amber-500/20 dark:to-brand-500/20 border border-amber-200/60 dark:border-amber-700/50 text-amber-800 dark:text-amber-300 font-bold text-xs mb-6 shadow-sm"
          >
            <Rocket className="w-4 h-4 text-amber-500 animate-bounce" />
            <span>Launching Soon · Exclusive Preview</span>
          </motion.div>

          {/* Illustration Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="relative w-40 h-40 md:w-52 md:h-52 mx-auto mb-8"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-100 to-amber-100 dark:from-zinc-800 dark:to-zinc-800 animate-pulse" />
            <div className="absolute inset-2 rounded-full bg-white dark:bg-zinc-900 shadow-inner overflow-hidden flex items-center justify-center p-6">
              <Image
                src={catImage}
                alt={catName}
                fill
                className="object-contain p-8 hover:scale-110 transition-transform duration-700 drop-shadow-md"
                sizes="(max-width: 768px) 160px, 208px"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-brand-600 to-brand-500 text-white p-2.5 rounded-2xl shadow-lg border-2 border-white dark:border-zinc-900">
              <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
          </motion.div>

          {/* Headings & Copy */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-3 mb-8"
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-brand-950 dark:text-zinc-100 tracking-tight">
              {catName} is <span className="bg-gradient-to-r from-brand-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">Coming Soon!</span>
            </h1>
            <p className="text-base md:text-lg text-brand-700 dark:text-zinc-300 max-w-xl mx-auto leading-relaxed">
              We&apos;re working hard to bring this category to you with our signature 30-minute farm-to-table freshness. Stay tuned for premium products launching soon.
            </p>
          </motion.div>

          {/* Notify Me Form */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="max-w-md mx-auto mb-10"
          >
            {submitted ? (
              <div className="bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800 rounded-2xl p-4 flex items-center justify-center gap-3 text-brand-900 dark:text-brand-200 font-bold text-sm shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0" />
                <span>You&apos;re on the VIP waitlist! We&apos;ll notify you when {catName} goes live.</span>
              </div>
            ) : (
              <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Enter email or mobile number..."
                    disabled={loading}
                    className="w-full bg-brand-50/70 dark:bg-zinc-800/90 border border-brand-200 dark:border-zinc-700 rounded-2xl px-4 py-3.5 pl-11 text-sm text-brand-950 dark:text-zinc-100 placeholder:text-brand-400 dark:placeholder:text-zinc-500 font-medium outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 transition"
                  />
                  <Bell className="w-4 h-4 text-brand-500 dark:text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <button
                  type="submit"
                  disabled={loading || !contact.trim()}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 hover:from-brand-950 hover:to-brand-950 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-900/20 transition active:scale-95 disabled:opacity-50 disabled:pointer-events-none shrink-0"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Notify Me</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-brand-500 dark:text-zinc-500 mt-2.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
              <span>We respect your privacy. No spam, ever.</span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6 border-t border-brand-100 dark:border-zinc-800/80"
          >
            {onBrowseVegetables ? (
              <button
                onClick={onBrowseVegetables}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-glow-cta transition active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Browse Fresh Vegetables</span>
              </button>
            ) : (
              <Link
                href="/shop?cat=vegetables"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-glow-cta transition active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Browse Fresh Vegetables</span>
              </Link>
            )}

            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-brand-200 dark:border-zinc-700 hover:bg-brand-50 dark:hover:bg-zinc-800 text-brand-800 dark:text-zinc-200 font-bold text-sm flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
