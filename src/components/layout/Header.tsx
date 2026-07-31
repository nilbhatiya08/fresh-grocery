"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  MapPin,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Truck,
  Tag,
  Leaf,
  Phone,
  Info,
  Zap,
  Package,
  Milk,
  Check,
  ShieldCheck,
} from "lucide-react";
import { useCart, useCity } from "@/store/shop";
import { useCustomerAuth } from "@/store/customerAuth";
import { products, categories, cities } from "@/data/catalog";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { CityModal } from "@/components/city/CityModal";
import { isCategoryComingSoon } from "@/lib/categoryHelper";

const nav = [
  { label: "Shop", href: "/shop", icon: Tag },
  { label: "Instant", href: "/shop?mode=instant", icon: Zap },
  { label: "Bulk Orders", href: "/bulk", icon: Package },
  { label: "Dairy Subscription", href: "/subscription", icon: Milk },
  { label: "Our Farmers", href: "/farmers", icon: Leaf },
  { label: "About", href: "/about", icon: Info },
  { label: "Contact", href: "/contact", icon: Phone },
];

export function Header() {
  const router = useRouter();
  const { isAuthenticated, openLoginModal, user } = useCustomerAuth();
  const isAdmin = user?.mobile === "9773271029" || user?.mobile?.includes("9773271029") || user?.email === "admin@farmora.com";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [query, setQuery] = useState("");

  const itemCount = useCart((s) => s.itemCount());
  const openCart = useCart((s) => s.open);
  const citySlug = useCity((s) => s.slug);
  const currentCity = cities.find((c) => c.slug === citySlug) ?? cities[0];
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty("--header-height", `${height}px`);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    
    const observer = new MutationObserver(handleResize);
    if (headerRef.current) {
      observer.observe(headerRef.current, { attributes: true, childList: true, subtree: true });
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const suggestions = query.trim()
    ? products
        .filter((p) =>
          (p.name + " " + p.subcategory).toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
    : [];

  return (
    <div ref={headerRef} className="fixed top-0 left-0 right-0 z-50">
      {/* Top strip */}
      <div className="hidden md:block bg-brand-900 text-brand-50 text-xs">
        <div className="mx-auto max-w-7xl px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cta-400" /> Instant · 30–40 min delivery
            </span>
            <span className="opacity-70">·</span>
            <span className="flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" /> Bulk next-day for restaurants & societies
            </span>
            <span className="opacity-70">·</span>
            <span className="flex items-center gap-1.5">
              <Milk className="w-3.5 h-3.5" /> Daily dairy subscription
            </span>
          </div>
          <div className="flex items-center gap-5 opacity-90">
            <Link href="/track" className="hover:text-white">Track Order</Link>
            <Link href="/app" className="hover:text-white">Download App</Link>
            <Link href="/careers" className="hover:text-white">Careers</Link>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "glass-strong shadow-[0_1px_0_0_rgba(12,32,13,0.06)]"
            : "bg-cream-50/80 backdrop-blur-md"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-3 flex items-center justify-between gap-4 lg:gap-6">
          {/* Mobile menu */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="md:hidden p-2 -ml-2 text-brand-950"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 grid place-items-center shadow-soft">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2c-3 3-5 6-5 10a5 5 0 0 0 10 0c0-4-2-7-5-10Z"/>
                <path d="M12 12c-1.5 0-3 .5-4 1.5"/>
              </svg>
            </div>
            <div className="leading-tight">
              <div className="font-display text-[22px] font-semibold text-brand-900">Farmora</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-brand-600 -mt-0.5 hidden sm:block">Farm · Flora · Fresh</div>
            </div>
          </Link>

          {/* City */}
          <button
            onClick={() => setCityOpen(true)}
            className="hidden lg:flex items-center gap-2 pl-4 pr-3 py-2 rounded-full hover:bg-brand-50 text-sm text-brand-800 border border-transparent hover:border-brand-100 transition"
          >
            <MapPin className="w-4 h-4 text-cta-500" />
            <div className="text-left leading-tight">
              <div className="text-[10px] uppercase tracking-wider text-brand-500">Deliver to</div>
              <div className="font-medium flex items-center gap-1.5">
                {currentCity.name}
                {currentCity.live ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 pulse-ring" />
                ) : (
                  <span className="text-[10px] text-cta-600 font-semibold">Coming soon</span>
                )}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>

          {/* Search */}
          <form onSubmit={(e) => { e.preventDefault(); if (query.trim()) { router.push(`/shop?q=${encodeURIComponent(query.trim())}`); setQuery(""); } }} className="flex-1 min-w-[120px] max-w-md xl:max-w-[280px] 2xl:max-w-xl relative hidden md:block">
            <div className="flex items-center justify-between gap-2 glass border border-brand-100 rounded-full pl-4 pr-1.5 py-1.5 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-100 transition">
              <Search className="w-4 h-4 text-brand-500 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search fresh produce..."
                className="flex-1 min-w-0 bg-transparent outline-none px-1 text-sm placeholder:text-brand-400"
              />
              <button type="submit" className="shrink-0 text-xs font-semibold text-white bg-cta-500 hover:bg-cta-600 px-4 py-2 rounded-full transition">
                Search
              </button>
            </div>
            {query && (
              <div className="absolute top-full left-0 right-0 mt-2 glass-strong border border-brand-100 rounded-2xl shadow-lift overflow-hidden z-50">
                {suggestions.length === 0 ? (
                  <div className="p-5 text-center">
                    <div className="text-sm font-semibold text-brand-800 mb-1">No direct active vegetable matches for "{query}"</div>
                    <p className="text-xs text-brand-500 mb-3">It might be out of stock today or coming soon in our next category launch!</p>
                    <Link
                      href={`/shop?q=${encodeURIComponent(query.trim())}`}
                      onClick={() => setQuery("")}
                      className="inline-block px-4 py-2 rounded-full bg-cta-500 text-white text-xs font-bold hover:bg-cta-600 transition shadow-sm"
                    >
                      View Options & Notify Me →
                    </Link>
                  </div>
                ) : (
                  <>
                    {suggestions.map((s) => (
                      <Link
                        key={s.id}
                        href={`/product/${s.slug}`}
                        onClick={() => setQuery("")}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-brand-50 transition"
                      >
                        <div className="w-10 h-10 rounded-xl bg-brand-50 overflow-hidden shrink-0">
                          <img src={s.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{s.name}</div>
                          <div className="text-xs text-brand-500">{s.subcategory}</div>
                        </div>
                        <div className="text-sm font-semibold text-brand-800">₹{s.weights[0].price}</div>
                      </Link>
                    ))}
                    <Link
                      href={`/shop?q=${encodeURIComponent(query.trim())}`}
                      onClick={() => setQuery("")}
                      className="block text-center py-2.5 bg-brand-50/80 hover:bg-brand-100/80 text-xs font-bold text-brand-900 border-t border-brand-100 transition"
                    >
                      View all results for "{query}" →
                    </Link>
                  </>
                )}
              </div>
            )}
          </form>

          {/* Nav */}
          <nav className="hidden xl:flex items-center gap-1 text-sm">
            <div className="relative">
              <button
                onMouseEnter={() => setCatsOpen(true)}
                onMouseLeave={() => setCatsOpen(false)}
                className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-brand-50 text-brand-800"
              >
                Categories
                <ChevronDown className={cn("w-3.5 h-3.5 transition", catsOpen && "rotate-180")} />
              </button>
              <AnimatePresence>
                {catsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    onMouseEnter={() => setCatsOpen(true)}
                    onMouseLeave={() => setCatsOpen(false)}
                    className="absolute top-[calc(100%+16px)] left-0 w-[520px] glass-strong rounded-2xl shadow-lift border border-brand-100 p-4 grid grid-cols-2 gap-1 z-50"
                  >
                    {categories.map((c) => {
                      const isComingSoon = isCategoryComingSoon(c.slug);
                      return (
                        <Link
                          key={c.slug}
                          href={`/shop?cat=${c.slug}`}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-brand-50"
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-brand-50 shrink-0">
                            <img src={c.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">{c.name}</div>
                            <div className="text-xs text-brand-500">
                              {isComingSoon ? "Coming Soon" : `${c.count} items`}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link href="/shop?mode=instant" className="px-3 py-2 rounded-full hover:bg-brand-50 text-brand-800 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-cta-500"/> Instant
            </Link>
            <Link href="/bulk" className="px-3 py-2 rounded-full hover:bg-brand-50 text-brand-800">Bulk</Link>
            <Link href="/subscription" className="px-3 py-2 rounded-full hover:bg-brand-50 text-brand-800">Dairy</Link>
            <Link href="/offers" className="px-3 py-2 rounded-full hover:bg-brand-50 text-brand-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cta-500"/> Offers
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5 md:gap-2 ml-auto shrink-0">
            {isAuthenticated && isAdmin && (
              <Link
                href="/admin"
                title="Go to Enterprise Admin Dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full text-xs font-bold hover:shadow-md transition shadow-sm mr-1 animate-pulse"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin Portal</span>
              </Link>
            )}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="md:hidden p-2.5 text-brand-800 hover:bg-brand-50 rounded-full"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                if (isAuthenticated) router.push("/account");
                else openLoginModal("/account");
              }}
              aria-label="Account"
              className="hidden sm:grid place-items-center p-2.5 text-brand-800 hover:bg-brand-50 rounded-full"
            >
              <User className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                if (isAuthenticated) router.push("/account?tab=wishlist");
                else openLoginModal("/account?tab=wishlist");
              }}
              aria-label="Wishlist"
              className="relative p-2.5 text-brand-800 hover:bg-brand-50 rounded-full"
            >
              <Heart className="w-5 h-5" />
            </button>
            <button
              onClick={openCart}
              aria-label="Cart"
              className="relative p-2.5 text-brand-800 hover:bg-brand-50 rounded-full"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full bg-cta-500 text-white text-[10px] font-bold"
                >
                  {itemCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden px-4 pb-3">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center gap-2 glass border border-brand-100 rounded-full px-4 py-2.5 text-sm text-brand-500"
          >
            <Search className="w-4 h-4" /> Search for fruits, vegetables, dairy...
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-brand-950/40 z-50"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed inset-y-0 left-0 w-[86%] max-w-sm bg-cream-50 z-50 flex flex-col"
            >
              <div className="p-5 flex items-center justify-between border-b border-brand-100">
                <div className="font-display text-xl text-brand-900">Farmora</div>
                <button onClick={() => setMenuOpen(false)} className="p-2">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={() => { setCityOpen(true); setMenuOpen(false); }}
                className="m-4 p-3 bg-white rounded-2xl border border-brand-100 flex items-center gap-3 text-left"
              >
                <MapPin className="w-5 h-5 text-cta-500" />
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-brand-500">Deliver to</div>
                  <div className="font-semibold text-sm">{currentCity.name}</div>
                </div>
                <ChevronDown className="w-4 h-4 opacity-60" />
              </button>
              <nav className="px-4 space-y-1 text-[15px]">
                {nav.map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white"
                  >
                    <n.icon className="w-4 h-4 text-brand-600" />
                    {n.label}
                  </Link>
                ))}
                
                <div className="my-2 border-t border-brand-100 pt-2" />
                
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    if (isAuthenticated) router.push("/account");
                    else openLoginModal("/account");
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white text-left"
                >
                  <User className="w-4 h-4 text-brand-600" />
                  My Account
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    if (isAuthenticated) router.push("/account?tab=wishlist");
                    else openLoginModal("/account?tab=wishlist");
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white text-left"
                >
                  <Heart className="w-4 h-4 text-brand-600" />
                  Wishlist
                </button>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Mobile search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-cream-50 p-4 md:hidden"
          >
            <form onSubmit={(e) => { e.preventDefault(); if (query.trim()) { router.push(`/shop?q=${encodeURIComponent(query.trim())}`); setSearchOpen(false); setQuery(""); } }} className="flex items-center gap-2">
              <div className="flex-1 flex items-center bg-white border border-brand-100 rounded-full pl-4 pr-2 py-2">
                <Search className="w-4 h-4 text-brand-500" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search vegetables, categories..."
                  className="flex-1 bg-transparent outline-none px-3 text-sm"
                />
                <button type="submit" className="text-xs font-semibold text-white bg-cta-500 px-3 py-1 rounded-full">Go</button>
              </div>
              <button type="button" onClick={() => { setSearchOpen(false); setQuery(""); }} className="text-sm text-brand-700 px-2">Cancel</button>
            </form>
            {query && (
              <div className="mt-3 bg-white rounded-2xl border border-brand-100 overflow-hidden shadow-md">
                {suggestions.length === 0 ? (
                  <div className="p-5 text-center">
                    <div className="text-sm font-semibold text-brand-800 mb-1">No direct active matches for "{query}"</div>
                    <p className="text-xs text-brand-500 mb-3">It might be out of stock today or launching soon!</p>
                    <Link
                      href={`/shop?q=${encodeURIComponent(query.trim())}`}
                      onClick={() => { setSearchOpen(false); setQuery(""); }}
                      className="inline-block px-4 py-2 rounded-full bg-cta-500 text-white text-xs font-bold"
                    >
                      View Options & Notify Me →
                    </Link>
                  </div>
                ) : (
                  <>
                    {suggestions.map((s) => (
                      <Link
                        key={s.id}
                        href={`/product/${s.slug}`}
                        onClick={() => { setSearchOpen(false); setQuery(""); }}
                        className="flex items-center gap-3 p-3 hover:bg-brand-50 border-b border-brand-50 last:border-0"
                      >
                        <Image src={s.image} alt="" width={40} height={40} className="w-10 h-10 rounded-lg object-cover" />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{s.name}</div>
                          <div className="text-xs text-brand-500">{s.subcategory}</div>
                        </div>
                        <div className="text-sm font-semibold">₹{s.weights[0].price}</div>
                      </Link>
                    ))}
                    <Link
                      href={`/shop?q=${encodeURIComponent(query.trim())}`}
                      onClick={() => { setSearchOpen(false); setQuery(""); }}
                      className="block text-center py-2.5 bg-brand-50 text-xs font-bold text-brand-900 border-t border-brand-100"
                    >
                      View all results for "{query}" →
                    </Link>
                  </>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* City selector modal */}
      <CityModal open={cityOpen} onClose={() => setCityOpen(false)} />
    </div>
  );
}
