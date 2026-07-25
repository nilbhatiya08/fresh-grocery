"use client";
import { useMemo, useState } from "react";
import { Filter, X, SlidersHorizontal, Search, ChevronDown, Grid3x3, LayoutList, Rocket, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/product/ProductCard";
import { CategoryComingSoon } from "@/components/shop/CategoryComingSoon";
import { NotifyMeModal } from "@/components/shop/NotifyMeModal";
import { OrderTomorrowModal } from "@/components/shop/OrderTomorrowModal";
import type { Category, Product } from "@/data/catalog";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/store/adminStore";
import { isCategoryComingSoon, getCategoryStatus } from "@/lib/categoryHelper";

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
  const [notifyProduct, setNotifyProduct] = useState<string | null>(null);
  const [orderTomorrowProduct, setOrderTomorrowProduct] = useState<string | null>(null);

  const adminCategories = useAdminStore((s) => s.categories);
  const displayCategories = adminCategories && adminCategories.length > 0 ? adminCategories : categories;

  const filtered = useMemo(() => {
    let list = products;
    if (cat !== "all") list = list.filter((p) => p.category === cat);
    if (q.trim())
      list = list.filter((p) =>
        (p.name + " " + p.subcategory + " " + p.tagline + " " + p.category)
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

  const activeCategoryObj = displayCategories.find((c) => c.slug === cat);
  const isCurrentCatComingSoon = cat !== "all" && isCategoryComingSoon(cat, displayCategories);

  // Search behavior: if user searches for an unavailable category or all matching items are coming soon
  const isSearchComingSoon =
    q.trim() !== "" &&
    (isCategoryComingSoon(q, displayCategories) ||
      (filtered.length > 0 && filtered.every((p) => isCategoryComingSoon(p.category, displayCategories))) ||
      (filtered.length === 0 &&
        displayCategories.some(
          (c) => c.name.toLowerCase().includes(q.toLowerCase()) && getCategoryStatus(c) === "Coming Soon"
        )));

  // If search matches a coming soon category, suggest vegetable products
  const suggestedVegetables = useMemo(() => {
    if (!isSearchComingSoon) return [];
    return products.filter((p) => !isCategoryComingSoon(p.category, displayCategories)).slice(0, 8);
  }, [isSearchComingSoon, products, displayCategories]);

  return (
    <>
      {/* Breadcrumb / heading */}
      <div className="mb-8">
        <div className="text-xs text-brand-500 mb-2">
          <a href="/" className="hover:text-brand-700">Home</a> / Shop
        </div>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-4xl md:text-5xl text-brand-950 dark:text-zinc-100 text-balance">
              {cat === "all"
                ? "All groceries"
                : activeCategoryObj?.name ?? "Shop"}
            </h1>
            <p className="mt-2 text-brand-700 dark:text-zinc-400">
              {isCurrentCatComingSoon ? "Launching Soon" : `${filtered.length} items · Delivered same day`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 border border-brand-100 dark:border-zinc-700 rounded-full px-3 py-1.5 shadow-sm">
              <Grid3x3
                onClick={() => setGrid(4)}
                className={cn("w-4 h-4 cursor-pointer", grid === 4 ? "text-brand-900 dark:text-zinc-100" : "text-brand-400 dark:text-zinc-500")}
              />
              <LayoutList
                onClick={() => setGrid(3)}
                className={cn("w-4 h-4 cursor-pointer", grid === 3 ? "text-brand-900 dark:text-zinc-100" : "text-brand-400 dark:text-zinc-500")}
              />
            </div>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as "popular" | "low" | "high" | "new")}
                className="appearance-none bg-white dark:bg-zinc-800 border border-brand-100 dark:border-zinc-700 rounded-full pl-4 pr-9 py-2 text-sm cursor-pointer hover:border-brand-400 dark:text-zinc-100 shadow-sm"
              >
                <option value="popular">Most popular</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
                <option value="new">Newest</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-600 dark:text-zinc-400" />
            </div>
            <button
              onClick={() => setFiltersOpen(true)}
              className="lg:hidden flex items-center gap-1.5 bg-brand-900 text-white rounded-full px-4 py-2 text-sm shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-6 flex items-center bg-white dark:bg-zinc-800 border border-brand-100 dark:border-zinc-700 rounded-full pl-4 pr-2 py-1.5 max-w-xl shadow-sm">
          <Search className="w-4 h-4 text-brand-500 dark:text-zinc-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search vegetables, fruits, dairy..."
            className="flex-1 bg-transparent outline-none px-3 py-1.5 text-sm text-brand-950 dark:text-zinc-100 placeholder:text-brand-400 dark:placeholder:text-zinc-500"
          />
          {q && (
            <button onClick={() => setQ("")} className="p-1.5 text-brand-500 hover:text-brand-900 dark:hover:text-zinc-100">
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
            filtersOpen ? "block fixed inset-0 z-50 bg-cream-50 dark:bg-zinc-900 p-5 overflow-y-auto" : "hidden"
          )}
        >
          <div className="flex items-center justify-between lg:hidden mb-4">
            <div className="font-display text-2xl dark:text-zinc-100">Filters</div>
            <button onClick={() => setFiltersOpen(false)} className="p-2"><X className="w-5 h-5 dark:text-zinc-100"/></button>
          </div>
          <div>
            <div className="text-sm font-semibold text-brand-900 dark:text-zinc-200 mb-3">Category</div>
            <div className="space-y-1">
              <button
                onClick={() => setCat("all")}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm transition font-medium",
                  cat === "all" ? "bg-brand-900 text-white dark:bg-brand-600" : "hover:bg-brand-50 dark:hover:bg-zinc-800 text-brand-800 dark:text-zinc-300"
                )}
              >
                All categories
              </button>
              {displayCategories.map((c) => {
                const isCatSoon = getCategoryStatus(c) === "Coming Soon";
                return (
                  <button
                    key={c.slug}
                    onClick={() => setCat(c.slug)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition flex justify-between items-center font-medium",
                      cat === c.slug ? "bg-brand-900 text-white dark:bg-brand-600" : "hover:bg-brand-50 dark:hover:bg-zinc-800 text-brand-800 dark:text-zinc-300"
                    )}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <span className="truncate">{c.name}</span>
                      {isCatSoon && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded font-bold shrink-0">
                          🚀 Soon
                        </span>
                      )}
                    </span>
                    <span className={cat === c.slug ? "text-white/60" : "text-brand-400 dark:text-zinc-500"}>
                      {isCatSoon ? "—" : c.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-brand-900 dark:text-zinc-200 mb-3">Max Price</div>
            <input
              type="range"
              min={50}
              max={1000}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-brand-600"
            />
            <div className="flex justify-between text-xs text-brand-600 dark:text-zinc-400 mt-1 font-medium">
              <span>₹50</span>
              <span>Up to ₹{maxPrice}</span>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm cursor-pointer text-brand-800 dark:text-zinc-300 font-medium">
              <input
                type="checkbox"
                checked={organicOnly}
                onChange={(e) => setOrganicOnly(e.target.checked)}
                className="w-4 h-4 accent-brand-600 rounded"
              />
              <span>Organic only</span>
            </label>
          </div>

          <button
            onClick={() => {
              setCat("all"); setOrganicOnly(false); setMaxPrice(1000); setQ(""); setSort("popular");
            }}
            className="w-full text-sm text-brand-700 dark:text-zinc-400 hover:text-brand-900 dark:hover:text-zinc-100 underline underline-offset-4 font-medium"
          >
            Reset all filters
          </button>
        </aside>

        {/* Results Column */}
        <div>
          {/* If the user clicked on a Coming Soon category tab */}
          {isCurrentCatComingSoon ? (
            <CategoryComingSoon
              category={activeCategoryObj}
              onBrowseVegetables={() => {
                setCat("vegetables");
                setQ("");
              }}
            />
          ) : (
            <>
              {/* If user searched for an unavailable category or all results are coming soon */}
              {isSearchComingSoon && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-200 dark:border-amber-800/60 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/15 dark:bg-amber-500/20 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                      🚀
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base md:text-lg text-amber-950 dark:text-amber-200">
                        This category is launching soon.
                      </h3>
                      <p className="text-xs md:text-sm text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed">
                        We&apos;re currently preparing this selection. Explore our farm-fresh vegetables delivered in 30 minutes in the meantime!
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setQ("");
                      setCat("vegetables");
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 text-white font-bold text-xs shrink-0 shadow-glow-cta transition active:scale-95 flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Explore Fresh Vegetables</span>
                  </button>
                </motion.div>
              )}

              {/* If search resulted in 0 items (and not coming soon) */}
              {filtered.length === 0 && !isSearchComingSoon ? (
                <div className="space-y-10 animate-in fade-in duration-300">
                  <div className="bg-gradient-to-br from-emerald-950 via-brand-950 to-zinc-950 rounded-3xl border border-emerald-800/50 p-8 sm:p-12 text-center shadow-2xl text-white relative overflow-hidden">
                    <div className="absolute -right-10 -bottom-10 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner border border-emerald-500/30">
                      🌱
                    </div>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold mb-2">
                      Out of Stock Today: &quot;{q || "This item"}&quot;
                    </h3>
                    <p className="text-emerald-200/80 text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
                      We don&apos;t have this vegetable in today&apos;s morning harvest from our partner farms. Our produce is picked fresh daily!
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                      <button
                        onClick={() => setNotifyProduct(q || "This vegetable")}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm transition shadow-lg flex items-center justify-center gap-2"
                      >
                        <span>🔔 Notify Me When Available</span>
                      </button>
                      <button
                        onClick={() => setOrderTomorrowProduct(q || "This vegetable")}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm transition shadow-lg flex items-center justify-center gap-2 backdrop-blur-sm"
                      >
                        <span>📅 Order for Tomorrow (Pre-Order)</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <h4 className="font-display font-bold text-xl text-brand-950 dark:text-zinc-100">
                          Available Today from Our Farms
                        </h4>
                      </div>
                      <button
                        onClick={() => { setQ(""); setCat("vegetables"); }}
                        className="text-xs font-bold text-brand-700 hover:text-brand-950 underline underline-offset-4"
                      >
                        View All Fresh Vegetables →
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                      {suggestedVegetables.slice(0, 6).map((p) => (
                        <ProductCard key={p.id} product={p} />
                      ))}
                    </div>
                  </div>
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
                    {(isSearchComingSoon ? suggestedVegetables : filtered).map((p) => (
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
            </>
          )}
        </div>
      </div>

      <NotifyMeModal
        isOpen={!!notifyProduct}
        onClose={() => setNotifyProduct(null)}
        productName={notifyProduct || ""}
      />
      <OrderTomorrowModal
        isOpen={!!orderTomorrowProduct}
        onClose={() => setOrderTomorrowProduct(null)}
        productName={orderTomorrowProduct || ""}
      />
    </>
  );
}

