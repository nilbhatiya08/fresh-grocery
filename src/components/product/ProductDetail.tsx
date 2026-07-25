"use client";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Leaf,
  Share2,
  CheckCircle2,
} from "lucide-react";
import type { Product } from "@/data/catalog";
import { formatINR, percentOff, cn } from "@/lib/utils";
import { useCart, useWishlist, useToasts } from "@/store/shop";
import { useAdminStore } from "@/store/adminStore";
import { isCategoryComingSoon } from "@/lib/categoryHelper";

export function ProductDetail({ product }: { product: Product }) {
  const [weightIdx, setWeightIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState<"desc" | "nutrition" | "storage" | "reviews">("desc");

  const weight = product.weights[weightIdx];
  const add = useCart((s) => s.add);
  const push = useToasts((s) => s.push);
  const wishlist = useWishlist((s) => s.ids);
  const toggle = useWishlist((s) => s.toggle);
  const isWished = wishlist.includes(product.id);
  const adminCategories = useAdminStore((s) => s.categories);
  const isComingSoon = isCategoryComingSoon(product.category, adminCategories);
  const off = percentOff(weight.mrp, weight.price);

  return (
    <div className="bg-white rounded-3xl border border-brand-100 p-6 md:p-10 shadow-soft">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Gallery */}
        <div className="lg:col-span-6 flex flex-col-reverse md:flex-row gap-4">
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible">
            {product.gallery.map((g, i) => (
              <button
                key={g}
                onClick={() => setActiveImg(i)}
                className={cn(
                  "relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition",
                  i === activeImg ? "border-brand-600 ring-2 ring-brand-200" : "border-brand-100 hover:border-brand-300"
                )}
              >
                <Image src={g} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
          <div className="relative flex-1 aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-brand-50 to-cream-100 border border-brand-100">
            <Image
              src={product.gallery[activeImg] ?? product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover"
            />
            {product.organic && (
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-brand-900 text-xs font-semibold px-3 py-1.5 rounded-full border border-brand-100 flex items-center gap-1.5 shadow-sm">
                <Leaf className="w-3.5 h-3.5 text-brand-600" /> Organic Certified
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-brand-500 font-semibold">
              <span>{product.category}</span> · <span>{product.subcategory}</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-brand-950 mt-2 text-balance">
              {product.name}
            </h1>
            <p className="text-sm text-brand-600 mt-1 italic">{product.tagline}</p>

            <div className="flex items-center gap-3 mt-4 text-sm">
              <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2.5 py-1 rounded-full border border-amber-200 font-semibold">
                <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
                {product.rating.toFixed(1)}
              </div>
              <span className="text-brand-700">based on {product.reviews} customer reviews</span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <div className="font-display text-4xl text-brand-950">{formatINR(weight.price)}</div>
              {weight.mrp > weight.price && (
                <>
                  <div className="text-lg text-brand-400 line-through">{formatINR(weight.mrp)}</div>
                  <div className="text-sm font-semibold text-brand-600 bg-brand-50 px-2 py-1 rounded-full">{off}% OFF</div>
                </>
              )}
            </div>
            <div className="text-xs text-brand-500 mt-1">Inclusive of all taxes</div>

            {/* Weights */}
            <div className="mt-6">
              <div className="text-sm font-semibold text-brand-900 mb-3">Choose pack size</div>
              <div className="flex flex-wrap gap-2">
                {product.weights.map((w, i) => (
                  <button
                    key={w.label}
                    onClick={() => setWeightIdx(i)}
                    className={cn(
                      "relative px-4 py-3 rounded-2xl border text-left transition min-w-[110px]",
                      i === weightIdx
                        ? "border-brand-600 bg-brand-50 ring-2 ring-brand-100"
                        : "border-brand-200 bg-white hover:border-brand-400"
                    )}
                  >
                    <div className="text-sm font-semibold">{w.label}</div>
                    <div className="text-xs text-brand-600 mt-0.5">{formatINR(w.price)}</div>
                    {i === weightIdx && (
                      <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-brand-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty + CTA */}
            <div className="mt-8 flex items-center gap-3 flex-wrap">
              {isComingSoon ? (
                <div className="flex-1 min-w-[220px] bg-amber-500/10 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/50 rounded-full py-4 font-bold text-base flex items-center justify-center gap-2 cursor-not-allowed shadow-sm">
                  <span>🚀</span>
                  <span>Coming Soon · Launching Soon</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-1 bg-white border border-brand-200 rounded-full p-1">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-10 h-10 grid place-items-center rounded-full hover:bg-brand-50"
                      aria-label="Decrease"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="w-10 text-center font-semibold">{qty}</div>
                    <button
                      onClick={() => setQty(qty + 1)}
                      className="w-10 h-10 grid place-items-center rounded-full hover:bg-brand-50"
                      aria-label="Increase"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      for (let i = 0; i < qty; i++) add(product, weightIdx);
                      push(`${qty} × ${product.name} added`);
                    }}
                    className="flex-1 min-w-[220px] bg-brand-900 hover:bg-brand-800 text-white rounded-full py-4 font-semibold text-sm flex items-center justify-center gap-2 shadow-glow-cta transition active:scale-95"
                  >
                    Add to basket · {formatINR(weight.price * qty)}
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  toggle(product.id);
                  push(isWished ? "Removed from wishlist" : "Added to wishlist", "info");
                }}
                className="w-12 h-12 grid place-items-center rounded-full border border-brand-200 hover:border-brand-400 transition"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" fill={isWished ? "currentColor" : "none"} stroke="currentColor" />
              </button>
              <button
                className="w-12 h-12 grid place-items-center rounded-full border border-brand-200 hover:border-brand-400 transition"
                aria-label="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Delivery / stock */}
          <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
            <div className="bg-brand-50 rounded-2xl p-3 flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand-700" />
              <div>
                <div className="font-semibold text-brand-900">Delivers in 2 hrs</div>
                <div className="text-brand-600">Free above ₹499</div>
              </div>
            </div>
            <div className="bg-brand-50 rounded-2xl p-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-700" />
              <div>
                <div className="font-semibold text-brand-900">Quality promise</div>
                <div className="text-brand-600">100% refund if not fresh</div>
              </div>
            </div>
            <div className="bg-brand-50 rounded-2xl p-3 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-brand-700" />
              <div>
                <div className="font-semibold text-brand-900">Easy returns</div>
                <div className="text-brand-600">In-app, 24 hrs</div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs text-brand-600">
            {product.stock < 15 ? (
              <span className="text-berry font-medium">Only {product.stock} left — order soon</span>
            ) : (
              <span>In stock · ships today</span>
            )}
          </div>

          {/* Tabs */}
          <div className="mt-10 border-b border-brand-100">
            <div className="flex gap-6">
              {([
                ["desc", "Description"],
                ["nutrition", "Nutrition"],
                ["storage", "Storage"],
                ["reviews", `Reviews (${product.reviews})`],
              ] as const).map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  className={cn(
                    "py-3 text-sm font-medium border-b-2 -mb-[1px] transition",
                    tab === k ? "border-brand-900 text-brand-950" : "border-transparent text-brand-600 hover:text-brand-900"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="py-6 text-sm text-brand-800 leading-relaxed">
            {tab === "desc" && (
              <div className="space-y-4">
                <p>{product.description}</p>
                <div>
                  <div className="font-semibold text-brand-900 mb-2">Key benefits</div>
                  <ul className="space-y-1.5">
                    {product.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" /> {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="font-semibold text-brand-900 mb-1">Origin</div>
                  <div>{product.origin}</div>
                </div>
              </div>
            )}
            {tab === "nutrition" && (
              <table className="w-full text-sm">
                <tbody>
                  {product.nutrition.map((n) => (
                    <tr key={n.label} className="border-b border-brand-100">
                      <td className="py-2 text-brand-600">{n.label}</td>
                      <td className="py-2 text-right font-medium">{n.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {tab === "storage" && (
              <p>{product.storage}</p>
            )}
            {tab === "reviews" && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="font-display text-5xl text-brand-950">{product.rating.toFixed(1)}</div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400" fill="currentColor" />
                      ))}
                    </div>
                    <div className="text-xs text-brand-600 mt-1">Based on {product.reviews} verified reviews</div>
                  </div>
                </div>
                <p className="text-brand-600 text-sm">
                  Detailed review breakdown coming soon. For now, trust the crowd — this is one of our most loved items.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
