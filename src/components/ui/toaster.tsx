"use client";
import { useToasts } from "@/store/shop";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, X } from "lucide-react";

export function Toaster() {
  const toasts = useToasts((s) => s.toasts);
  const dismiss = useToasts((s) => s.dismiss);
  return (
    <div className="fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 space-y-2 pointer-events-none">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="pointer-events-auto glass rounded-full border border-brand-200/60 shadow-soft px-4 py-2.5 flex items-center gap-2.5 text-sm text-brand-950"
          >
            {t.tone === "info" ? (
              <Info className="w-4 h-4 text-brand-600" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
            )}
            <span className="font-medium">{t.message}</span>
            <button
              aria-label="Dismiss"
              onClick={() => dismiss(t.id)}
              className="ml-2 text-brand-700 hover:text-brand-950"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
