"use client";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/data/catalog";

export function BestSellersCarousel({ products }: { products: Product[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir * 340, behavior: "smooth" });
  };
  return (
    <div className="relative">
      <div className="flex items-center gap-2 justify-end mb-4">
        <button
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
          className="w-10 h-10 grid place-items-center rounded-full bg-white border border-brand-100 hover:border-brand-400 text-brand-800"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => scroll(1)}
          aria-label="Scroll right"
          className="w-10 h-10 grid place-items-center rounded-full bg-brand-900 hover:bg-brand-800 text-white"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 -mx-1 px-1"
      >
        {products.map((p) => (
          <div key={p.id} className="snap-start shrink-0 w-[280px] md:w-[300px]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
