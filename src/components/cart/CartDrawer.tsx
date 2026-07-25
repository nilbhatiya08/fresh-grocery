"use client";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Minus, Trash2, Tag, Gift, Truck, ArrowRight, Zap, Package, Milk } from "lucide-react";
import { useCart } from "@/store/shop";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCustomerAuth } from "@/store/customerAuth";
import type { DeliveryMode } from "@/data/catalog";

const TABS: { id: DeliveryMode | "all"; label: string; icon: typeof Zap; desc: string }[] = [
  { id: "all", label: "All", icon: Tag, desc: "All items" },
  { id: "instant", label: "Instant", icon: Zap, desc: "30–40 min" },
  { id: "bulk", label: "Bulk", icon: Package, desc: "Next-day" },
  { id: "subscription", label: "Dairy", icon: Milk, desc: "Daily" },
];

export function CartDrawer() {
  const router = useRouter();
  const { isAuthenticated, openLoginModal } = useCustomerAuth();
  const isOpen = useCart((s) => s.isOpen);
  const items = useCart((s) => s.items);
  const close = useCart((s) => s.close);
  const updateQty = useCart((s) => s.updateQty);
  const remove = useCart((s) => s.remove);
  const subtotal = useCart((s) => s.subtotal());
  const discount = useCart((s) => s.discount());
  const [tab, setTab] = useState<DeliveryMode | "all">("all");

  const deliveryFee = subtotal > 499 || subtotal === 0 ? 0 : 39;
  const total = subtotal + deliveryFee;

  const visible = tab === "all" ? items : items.filter((i) => i.mode === tab);
  const counts = {
    all: items.length,
    instant: items.filter((i) => i.mode === "instant").length,
    bulk: items.filter((i) => i.mode === "bulk").length,
    subscription: items.filter((i) => i.mode === "subscription").length,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-brand-950/40 z-[60]"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[460px] bg-cream-50 z-[70] flex flex-col shadow-lift"
            aria-label="Cart"
          >
            {/* Header */}
            <div className="p-5 border-b border-brand-100 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-brand-500">Your Basket</div>
                <div className="font-display text-2xl text-brand-900">
                  {items.length === 0 ? "Empty for now" : `${items.length} item${items.length > 1 ? "s" : ""}`}
                </div>
              </div>
              <button onClick={close} className="p-2 rounded-full hover:bg-brand-100 transition" aria-label="Close cart">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            {items.length > 0 && (
              <div className="px-5 pt-4 flex gap-1.5 overflow-x-auto scrollbar-hide">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={cn(
                      "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition",
                      tab === t.id
                        ? "bg-brand-900 text-white border-brand-900"
                        : "bg-white text-brand-700 border-brand-200 hover:border-brand-400"
                    )}
                  >
                    <t.icon className="w-3.5 h-3.5" />
                    {t.label}
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-full",
                      tab === t.id ? "bg-white/20" : "bg-brand-100"
                    )}>{counts[t.id]}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {visible.length === 0 ? (
                <div className="h-full grid place-items-center text-center py-16">
                  <div>
                    <div className="mx-auto w-20 h-20 rounded-3xl bg-brand-50 grid place-items-center mb-4">
                      <Tag className="w-10 h-10 text-brand-400" />
                    </div>
                    <div className="font-display text-xl text-brand-900">Nothing in {tab}</div>
                    <p className="text-sm text-brand-600 mt-1 max-w-xs mx-auto">
                      {tab === "subscription" ? "Subscribe to milk, paneer or curd for daily morning delivery." : "Start with something fresh — our bestsellers are a great place to begin."}
                    </p>
                    <Link
                      href={tab === "subscription" ? "/subscription" : tab === "bulk" ? "/bulk" : "/shop"}
                      onClick={close}
                      className="mt-5 inline-flex items-center gap-2 bg-brand-900 text-white px-5 py-2.5 rounded-full text-sm font-medium"
                    >
                      Start shopping <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {visible.map((item) => (
                    <motion.div
                      key={item.productId + item.weight + item.mode}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-brand-100"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-brand-50 shrink-0 relative">
                        <Image src={item.image} alt={item.name} width={64} height={64} className="w-full h-full object-cover" />
                        <div className={cn(
                          "absolute top-0 right-0 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-bl-lg rounded-tr-xl",
                          item.mode === "instant" ? "bg-cta-500 text-white"
                            : item.mode === "bulk" ? "bg-brand-900 text-white"
                            : "bg-sky-600 text-white"
                        )}>
                          {item.mode === "instant" ? "⚡" : item.mode === "bulk" ? "Bulk" : "Daily"}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{item.name}</div>
                        <div className="text-xs text-brand-500">{item.weight}</div>
                        {item.days && (
                          <div className="text-[10px] text-brand-600 mt-0.5">Deliver: {item.days.join(", ")}</div>
                        )}
                        {item.deliveryDate && (
                          <div className="text-[10px] text-brand-600 mt-0.5">Deliver: {item.deliveryDate}</div>
                        )}
                        <div className="flex items-baseline gap-2 mt-1">
                          <div className="text-sm font-semibold text-brand-900">{formatINR(item.price)}</div>
                          {item.mrp > item.price && (
                            <div className="text-xs text-brand-400 line-through">{formatINR(item.mrp)}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <button
                          onClick={() => remove(item.productId, item.weight, item.mode)}
                          className="text-brand-400 hover:text-brand-700 p-1"
                          aria-label="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center gap-1 bg-brand-50 rounded-full p-0.5">
                          <button
                            onClick={() => updateQty(item.productId, item.weight, item.mode, item.quantity - 1)}
                            className="w-7 h-7 grid place-items-center rounded-full bg-white border border-brand-100 hover:border-brand-300"
                            aria-label="Decrease"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <div className="w-6 text-center text-sm font-semibold">{item.quantity}</div>
                          <button
                            onClick={() => updateQty(item.productId, item.weight, item.mode, item.quantity + 1)}
                            className="w-7 h-7 grid place-items-center rounded-full bg-brand-600 text-white hover:bg-brand-700"
                            aria-label="Increase"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-brand-100 bg-white p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm bg-brand-50 border border-brand-100 rounded-xl px-3 py-2.5">
                  <Tag className="w-4 h-4 text-brand-600" />
                  <input
                    placeholder="Apply coupon code"
                    className="flex-1 bg-transparent outline-none text-sm placeholder:text-brand-400"
                  />
                  <button className="text-xs font-semibold text-brand-700 uppercase tracking-wide">Apply</button>
                </div>
                <div className="flex items-center gap-2 text-sm bg-peach/10 border border-peach/30 rounded-xl px-3 py-2.5">
                  <Gift className="w-4 h-4 text-peach" />
                  <input
                    placeholder="Gift card or referral code"
                    className="flex-1 bg-transparent outline-none text-sm placeholder:text-brand-500"
                  />
                </div>

                <div className="space-y-1.5 text-sm pt-2">
                  <div className="flex justify-between text-brand-700">
                    <span>Subtotal</span><span>{formatINR(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-brand-600">
                      <span>You save</span><span className="text-brand-600">- {formatINR(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-brand-700">
                    <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Delivery</span>
                    <span>{deliveryFee === 0 ? <span className="text-brand-600">Free</span> : formatINR(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-brand-950 text-base font-semibold pt-2 border-t border-dashed border-brand-100">
                    <span>Total</span><span>{formatINR(total)}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    close();
                    if (isAuthenticated) {
                      router.push("/checkout");
                    } else {
                      openLoginModal("/checkout", { type: "checkout" });
                    }
                  }}
                  className="mt-2 w-full flex items-center justify-center gap-2 bg-cta-500 hover:bg-cta-600 text-white py-3.5 rounded-full font-semibold text-sm transition shadow-glow-cta"
                >
                  Checkout · {formatINR(total)} <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={close} className="w-full text-center text-xs text-brand-600 hover:text-brand-900 py-2">
                  Continue shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
