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
  const off = percentOff(weight.mrp, weight.price);

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="text-xs text-brand-500 mb-6">
        <a href="/" className="hover:text-brand-700">Home</a> / <a href="/shop" className="hover:text-brand-700">Shop</a> /{" "}
        <a href={`/shop?cat=${product.category}`} className="hover:text-brand-700">{product.subcategory}</a> /{" "}
        <span className="text-brand-800">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery */}
        <div>
          <motion.div
            key={activeImg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative aspect-square rounded-[32px] overflow-hidden bg-gradient-to-br from-brand-50 to-cream-100 border border-brand-100"
          >
            <Image
              src={product.gallery[activeImg] ?? product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover hover:scale-110 transition-transform duration-700"
            />
            {product.organic && (
              <div className="absolute top-5 left-5 inline-flex items-center gap-1.5 bg-white/90 text-brand-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                <Leaf className="w-3.5 h-3.5" /> Certified Organic
              </div>
            )}
          </motion.div>
          {product.gallery.length > 1 && (
            <div className="flex gap-3 mt-4">
              {product.gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={cn(
                    "relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition",
                    i === activeImg ? "border-brand-600" : "border-transparent hover:border-brand-200"
                  )}
                >
                  <Image src={g} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="text-xs uppercase tracking-widest text-brand-600 mb-2">{product.subcategory}</div>
          <h1 className="font-display text-3xl md:text-5xl leading-tight text-brand-950">{product.name}</h1>
          <p className="mt-2 text-brand-700 text-base md:text-lg">{product.tagline}</p>

          <div className="mt-4 flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="w-4 h-4 text-amber-400" fill={i < Math.round(product.rating) ? "currentColor" : "none"} />
              ))}
            </div>
            <span className="font-semibold">{product.rating.toFixed(1)}</span>
            <span className="text-brand-500">· {product.reviews} reviews</span>
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
              className="flex-1 min-w-[220px] bg-brand-900 hover:bg-brand-800 text-white rounded-full py-4 font-semibold text-sm flex items-center justify-center gap-2"
            >
              Add to basket · {formatINR(weight.price * qty)}
            </button>
            <button
              onClick={() => {
                toggle(product.id);
                push(isWished ? "Removed from wishlist" : "Added to wishlist", "info");
              }}
              className="w-12 h-12 grid place-items-center rounded-full border border-brand-200 hover:border-brand-400"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" fill={isWished ? "currentColor" : "none"} stroke="currentColor" />
            </button>
            <button
              className="w-12 h-12 grid place-items-center rounded-full border border-brand-200 hover:border-brand-400"
              aria-label="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
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
