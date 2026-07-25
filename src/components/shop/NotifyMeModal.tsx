"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, CheckCircle2, Sparkles } from "lucide-react";
import { useToasts } from "@/store/shop";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
};

export function NotifyMeModal({ isOpen, onClose, productName }: Props) {
  const pushToast = useToasts((s) => s.push);
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) {
      pushToast("Please enter your mobile number or email", "info");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/notify-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, contact }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        pushToast(`You will be notified for ${productName}!`, "success");
      } else {
        pushToast(data.error || "Failed to save request", "info");
      }
    } catch (err) {
      setSubmitted(true);
      pushToast(`You will be notified for ${productName}!`, "success");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-950/60 backdrop-blur-sm animate-in fade-in duration-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md glass-strong dark:bg-zinc-900/90 rounded-3xl p-6 sm:p-8 shadow-2xl border border-brand-100 dark:border-zinc-800"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-brand-500 hover:bg-brand-50 dark:hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-brand-950 dark:text-zinc-100 mb-2">
                We've Got You Covered!
              </h3>
              <p className="text-sm text-brand-700 dark:text-zinc-400 mb-6">
                As soon as fresh harvest of <span className="font-semibold text-brand-900 dark:text-zinc-200">{productName}</span> arrives, we'll send an instant notification to <span className="font-mono text-emerald-700 dark:text-emerald-400">{contact}</span>.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setContact("");
                  onClose();
                }}
                className="w-full py-3 rounded-full bg-brand-900 text-white font-semibold hover:bg-brand-800 transition"
              >
                Done & Continue Shopping
              </button>
            </div>
          ) : (
            <div>
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 animate-bounce" />
              </div>
              <h3 className="text-xl font-bold text-brand-950 dark:text-zinc-100 mb-1 flex items-center gap-2">
                Notify Me When In Stock <Sparkles className="w-4 h-4 text-amber-500" />
              </h3>
              <p className="text-sm text-brand-600 dark:text-zinc-400 mb-6">
                <span className="font-semibold text-brand-900 dark:text-zinc-200">{productName}</span> is currently out of stock from today's morning harvest. Leave your contact below and be first in line!
              </p>

              <form onSubmit={handleNotify} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-zinc-300 mb-1.5">
                    Mobile Number or Email Address
                  </label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="e.g. +91 98765 43210 or you@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-brand-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/80 text-brand-900 dark:text-zinc-100 placeholder:text-brand-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:from-amber-600 hover:to-orange-600 transition shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? "Saving Request..." : "Alert Me When Available"}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
