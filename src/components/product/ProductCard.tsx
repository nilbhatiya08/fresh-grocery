"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Plus, Minus, Star, Leaf as LeafIcon, Timer, Zap, Package, Milk } from "lucide-react";
import type { DeliveryMode, Product } from "@/data/catalog";
import { cn, formatINR, percentOff } from "@/lib/utils";
import { useCart, useWishlist, useToasts } from "@/store/shop";
import { useCustomerAuth } from "@/store/customerAuth";
import { useAdminStore } from "@/store/adminStore";
import { isCategoryComingSoon } from "@/lib/categoryHelper";

const MODE_ICON: Record<DeliveryMode, typeof Zap> = {
  instant: Zap,
  bulk: Package,
  subscription: Milk,
};

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [weightIdx, setWeightIdx] = useState(0);
  const [mode, setMode] = useState<DeliveryMode>(product.modes[0] ?? "instant");
  const weight = product.weights[weightIdx];
  const add = useCart((s) => s.add);
  const items = useCart((s) => s.items);
  const updateQty = useCart((s) => s.updateQty);
  const wishlist = useWishlist((s) => s.ids);
  const toggleWish = useWishlist((s) => s.toggle);
  const push = useToasts((s) => s.push);
  const { isAuthenticated, openLoginModal } = useCustomerAuth();
  const adminCategories = useAdminStore((s) => s.categories);
  const isComingSoon = isCategoryComingSoon(product.category, adminCategories);

  // price depends on mode
  let price = weight.price;
  let mrp = weight.mrp;
  if (mode === "bulk" && weight.bulk) {
    price = weight.bulk.unit;
    mrp = Math.round(weight.bulk.unit / (1 - weight.bulk.discount / 100));
  } else if (mode === "subscription" && weight.subscription) {
    price = weight.subscription;
  }

  const inCart = items.find(
    (i) => i.productId === product.id && i.weight === weight.label && i.mode === mode
  );
  const isWished = wishlist.includes(product.id);
  const off = percentOff(mrp, price);
  const lowStock = product.stock < 15;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4 }}
      className="group relative bg-white rounded-3xl border border-brand-100/70 hover:border-brand-200 hover:shadow-lift transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Image Container */}
      <div className="relative block aspect-[5/4] overflow-hidden bg-gradient-to-br from-brand-50 to-cream-100">
        <Link href={`/product/${product.slug}`} className="absolute inset-0 z-0">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 240px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none z-10">
          {off > 0 && (
            <span className="inline-flex items-center gap-1 bg-cta-500 text-white text-[11px] font-semibold px-2 py-1 rounded-full shadow-glow-cta">
              {off}% OFF
            </span>
          )}
          {product.organic && (
            <span className="inline-flex items-center gap-1 bg-white/90 text-brand-800 text-[11px] font-semibold px-2 py-1 rounded-full border border-brand-100">
              <LeafIcon className="w-3 h-3" /> Organic
            </span>
          )}
          {product.newArrival && (
            <span className="inline-flex items-center gap-1 bg-brand-900 text-white text-[11px] font-semibold px-2 py-1 rounded-full">
              New
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.preventDefault();
            if (isAuthenticated) {
              toggleWish(product.id);
              push(isWished ? "Removed from wishlist" : "Added to wishlist", "info");
            } else {
              openLoginModal(null, { type: "wishlist", payload: { productId: product.id } });
            }
          }}
          aria-label="Wishlist"
          className={cn(
            "absolute top-3 right-3 w-9 h-9 grid place-items-center rounded-full backdrop-blur transition z-10",
            isWished ? "bg-rose-500 text-white" : "bg-white/80 hover:bg-white text-brand-700"
          )}
        >
          <Heart className="w-4 h-4" fill={isWished ? "currentColor" : "none"} />
        </button>


      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* Mode pills */}
        <div className="flex flex-wrap gap-1">
          {product.modes.map((m) => {
            const Icon = MODE_ICON[m];
            return (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full border flex items-center gap-1 transition",
                  m === mode
                    ? m === "instant" ? "bg-cta-500 text-white border-cta-500"
                      : m === "bulk" ? "bg-brand-900 text-white border-brand-900"
                      : "bg-sky-600 text-white border-sky-600"
                    : "bg-white text-brand-700 border-brand-200 hover:border-brand-400"
                )}
              >
                <Icon className="w-3 h-3" />
                {m === "instant" ? "30 min" : m === "bulk" ? "Bulk" : "Subscribe"}
              </button>
            );
          })}
        </div>

        <div className="text-[11px] uppercase tracking-widest text-brand-500">{product.subcategory}</div>
        <Link href={`/product/${product.slug}`} className="font-display text-[17px] leading-snug text-brand-950 hover:text-brand-700 line-clamp-2">
          {product.name}
        </Link>

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-0.5 text-amber-500">
            <Star className="w-3.5 h-3.5" fill="currentColor" />
            <span className="font-semibold text-brand-800">{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-brand-400">·</span>
          <span className="text-brand-500">{product.reviews} reviews</span>
        </div>

        {/* Weight selector */}
        {product.weights.length > 1 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {product.weights.map((w, i) => (
              <button
                key={w.label}
                onClick={() => setWeightIdx(i)}
                className={cn(
                  "text-[11px] font-medium px-2.5 py-1 rounded-full border transition",
                  i === weightIdx
                    ? "bg-brand-900 text-white border-brand-900"
                    : "bg-white text-brand-700 border-brand-200 hover:border-brand-400"
                )}
              >
                {w.label}
              </button>
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div className="mt-auto pt-3 flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <div className="font-display text-xl text-brand-950">{formatINR(price)}</div>
              {mrp > price && (
                <div className="text-xs text-brand-400 line-through">{formatINR(mrp)}</div>
              )}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-brand-500 mt-0.5">
              {mode === "instant" && <><Zap className="w-3 h-3 text-cta-500" /> Delivers in 30–40 min</>}
              {mode === "bulk" && <><Package className="w-3 h-3" /> MOQ {weight.bulk?.moq} · next day</>}
              {mode === "subscription" && <><Milk className="w-3 h-3 text-sky-600" /> Every morning</>}
            </div>
          </div>

          {isComingSoon ? (
            <button
              disabled
              className="inline-flex items-center gap-1 text-xs font-bold px-3.5 py-2.5 rounded-full bg-amber-500/10 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/50 cursor-not-allowed opacity-90 shadow-sm"
              title="This category is launching soon"
            >
              <span>🚀</span>
              <span>Coming Soon</span>
            </button>
          ) : !inCart ? (
            <button
              onClick={() => {
                add(product, weightIdx, mode);
                push(`${product.name} added`);
              }}
              className={cn(
                "inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2.5 rounded-full transition-all",
                mode === "instant"
                  ? "bg-cta-500 hover:bg-cta-600 text-white shadow-glow-cta"
                  : mode === "bulk"
                  ? "bg-brand-900 hover:bg-brand-800 text-white"
                  : "bg-sky-600 hover:bg-sky-700 text-white"
              )}
            >
              <Plus className="w-3.5 h-3.5" />
              {mode === "subscription" ? "Subscribe" : "Add"}
            </button>
          ) : (
            <div className="flex items-center gap-1 bg-brand-900 text-white rounded-full p-0.5">
              <button
                onClick={() => updateQty(product.id, weight.label, mode, inCart.quantity - 1)}
                className="w-7 h-7 grid place-items-center rounded-full hover:bg-brand-700"
                aria-label="Decrease"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-5 text-center text-xs font-semibold">{inCart.quantity}</span>
              <button
                onClick={() => updateQty(product.id, weight.label, mode, inCart.quantity + 1)}
                className="w-7 h-7 grid place-items-center rounded-full hover:bg-brand-700"
                aria-label="Increase"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
