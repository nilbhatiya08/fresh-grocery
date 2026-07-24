"use client";
import { useMemo, useState } from "react";
import { Filter, X, SlidersHorizontal, Search, ChevronDown, Grid3x3, LayoutList } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/product/ProductCard";
import type { Category, Product } from "@/data/catalog";
import { cn } from "@/lib/utils";

type Sp = { cat?: string; q?: string; deals?: string; filter?: string; sort?: string };

type Props = {
  products: Product[];
  categories: Category[];
  initial: Sp;
};

export function ShopClient({ products, categories, initial }: Props) {
  const sp = initial;
  const [cat, setCat] = useState(sp?.cat ?? "all");
  const [q, setQ] = useState(sp?.q ?? "");
  const [organicOnly, setOrganicOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sort, setSort] = useState<"popular" | "low" | "high" | "new">(
    (sp?.sort as "popular" | "low" | "high" | "new") ?? "popular"
  );
  const [grid, setGrid] = useState<3 | 4>(4);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = products;
    if (cat !== "all") list = list.filter((p) => p.category === cat);
    if (q.trim())
      list = list.filter((p) =>
        (p.name + " " + p.subcategory + " " + p.tagline)
          .toLowerCase()
          .includes(q.toLowerCase())
      );
    if (organicOnly) list = list.filter((p) => p.organic);
    if (sp?.filter === "bestseller") list = list.filter((p) => p.bestSeller);
    if (sp?.filter === "new") list = list.filter((p) => p.newArrival);
    if (sp?.filter === "organic") list = list.filter((p) => p.organic);
    if (sp?.deals === "true")
      list = list.filter((p) => p.weights.some((w) => w.mrp - w.price > 20));
    list = list.filter((p) => p.weights[0].price <= maxPrice);
    list = [...list].sort((a, b) => {
      if (sort === "low") return a.weights[0].price - b.weights[0].price;
      if (sort === "high") return b.weights[0].price - a.weights[0].price;
      if (sort === "new") return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0);
      return b.reviews - a.reviews;
    });
    return list;
  }, [products, cat, q, organicOnly, maxPrice, sort, sp]);

  return (
    <>
      {/* Breadcrumb / heading */}
      <div className="mb-8">
        <div className="text-xs text-brand-500 mb-2">
          <a href="/" className="hover:text-brand-700">Home</a> / Shop
        </div>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-4xl md:text-5xl text-brand-950 text-balance">
              {cat === "all"
                ? "All groceries"
                : categories.find((c) => c.slug === cat)?.name ?? "Shop"}
            </h1>
            <p className="mt-2 text-brand-700">{filtered.length} items · Delivered same day</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white border border-brand-100 rounded-full px-3 py-1.5">
              <Grid3x3
                onClick={() => setGrid(4)}
                className={cn("w-4 h-4 cursor-pointer", grid === 4 ? "text-brand-900" : "text-brand-400")}
              />
              <LayoutList
                onClick={() => setGrid(3)}
                className={cn("w-4 h-4 cursor-pointer", grid === 3 ? "text-brand-900" : "text-brand-400")}
              />
            </div>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as "popular" | "low" | "high" | "new")}
                className="appearance-none bg-white border border-brand-100 rounded-full pl-4 pr-9 py-2 text-sm cursor-pointer hover:border-brand-400"
              >
                <option value="popular">Most popular</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
                <option value="new">Newest</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-600" />
            </div>
            <button
              onClick={() => setFiltersOpen(true)}
              className="lg:hidden flex items-center gap-1.5 bg-brand-900 text-white rounded-full px-4 py-2 text-sm"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-6 flex items-center bg-white border border-brand-100 rounded-full pl-4 pr-2 py-1.5 max-w-xl">
          <Search className="w-4 h-4 text-brand-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search this category..."
            className="flex-1 bg-transparent outline-none px-3 py-1.5 text-sm placeholder:text-brand-400"
          />
          {q && (
            <button onClick={() => setQ("")} className="p-1.5 text-brand-500">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        {/* Sidebar filters */}
        <aside
          className={cn(
            "lg:block lg:sticky lg:top-28 self-start space-y-6",
            filtersOpen ? "block fixed inset-0 z-50 bg-cream-50 p-5 overflow-y-auto" : "hidden"
          )}
        >
          <div className="flex items-center justify-between lg:hidden mb-4">
            <div className="font-display text-2xl">Filters</div>
            <button onClick={() => setFiltersOpen(false)} className="p-2"><X className="w-5 h-5"/></button>
          </div>
          <div>
            <div className="text-sm font-semibold text-brand-900 mb-3">Category</div>
            <div className="space-y-1">
              <button
                onClick={() => setCat("all")}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm transition",
                  cat === "all" ? "bg-brand-900 text-white" : "hover:bg-brand-50"
                )}
              >
                All categories
              </button>
              {categories.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => setCat(c.slug)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition flex justify-between",
                    cat === c.slug ? "bg-brand-900 text-white" : "hover:bg-brand-50"
                  )}
                >
                  <span>{c.name}</span>
                  <span className={cat === c.slug ? "text-white/60" : "text-brand-400"}>{c.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-brand-900 mb-3">Max Price</div>
            <input
              type="range"
              min={50}
              max={1000}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-brand-600"
            />
            <div className="flex justify-between text-xs text-brand-600 mt-1">
              <span>₹50</span>
              <span>Up to ₹{maxPrice}</span>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={organicOnly}
                onChange={(e) => setOrganicOnly(e.target.checked)}
                className="w-4 h-4 accent-brand-600"
              />
              <span>Organic only</span>
            </label>
          </div>

          <button
            onClick={() => {
              setCat("all"); setOrganicOnly(false); setMaxPrice(1000); setQ(""); setSort("popular");
            }}
            className="w-full text-sm text-brand-700 hover:text-brand-900 underline underline-offset-4"
          >
            Reset all filters
          </button>
        </aside>

        {/* Results */}
        <div>
          {filtered.length === 0 ? (
            <div className="bg-white rounded-3xl border border-brand-100 p-12 text-center">
              <div className="font-display text-2xl mb-2">No matches yet</div>
              <p className="text-brand-600 text-sm">Try widening your filters or searching a different keyword.</p>
            </div>
          ) : (
            <motion.div
              layout
              className={cn(
                "grid gap-4 md:gap-5",
                grid === 4
                  ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
              )}
            >
              <AnimatePresence>
                {filtered.map((p) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
