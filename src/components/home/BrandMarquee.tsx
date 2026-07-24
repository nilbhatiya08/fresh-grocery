import { Leaf, ShieldCheck, Truck, Star } from "lucide-react";

const words = [
  "Farm Fresh · Residue Tested · Same-Day Delivery",
  "140+ Partner Farms · No Cold Storage · Pesticide Reports Shared",
  "Rated 4.8/5 by 48,000+ Customers · Loved in 6 Cities",
  "Subscribe & Save 15% · First Delivery Free",
];

export function BrandMarquee() {
  const line = [...words, ...words];
  return (
    <div className="relative border-y border-brand-100 bg-brand-50/40 overflow-hidden py-4">
      <div className="flex marquee whitespace-nowrap">
        {line.map((w, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-6 px-8 text-sm text-brand-800 font-medium"
          >
            <span className="inline-flex items-center gap-2">
              <Leaf className="w-4 h-4 text-brand-600" /> {w.split(" · ")[0]}
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-600" /> {w.split(" · ")[1]}
            </span>
            <span className="inline-flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-600" /> {w.split(" · ")[2]}
            </span>
            <span className="inline-flex items-center gap-2">
              <Star className="w-4 h-4 text-brand-600" /> {w.split(" · ")[3] ?? words[0].split(" · ")[3]}
            </span>
            <span className="text-brand-300">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
