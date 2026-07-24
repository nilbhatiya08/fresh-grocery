"use client";
import Image from "next/image";
import { useState } from "react";
import { Package, CalendarClock, FileText, Repeat, Building2, CheckCircle2, Truck } from "lucide-react";
import { bulkProducts } from "@/data/catalog";
import { useCart, useToasts } from "@/store/shop";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function BulkPage() {
  const add = useCart((s) => s.add);
  const push = useToasts((s) => s.push);
  const [date, setDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [slot, setSlot] = useState("6am-10am");
  const slots = ["6 AM – 10 AM", "10 AM – 2 PM", "2 PM – 6 PM", "6 PM – 9 PM"];

  return (
    <div>
      <div className="mb-10">
        <div className="text-xs text-brand-500 mb-2"><a href="/" className="hover:text-brand-700">Home</a> / Bulk Orders</div>
        <h1 className="font-display text-4xl md:text-6xl text-brand-950 text-balance">
          Bulk orders for <span className="italic text-brand-600">serious kitchens</span>.
        </h1>
        <p className="mt-3 text-brand-700 max-w-2xl">
          Wholesale pricing for restaurants, hotels, societies and corporate offices.
          Scheduled next-day delivery, GST invoices, and dedicated account management.
        </p>
      </div>

      {/* Feature pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {[
          { icon: Truck, label: "Next-day delivery", sub: "Scheduled slots" },
          { icon: FileText, label: "GST invoices", sub: "Auto-generated" },
          { icon: Repeat, label: "Repeat orders", sub: "One-tap reorder" },
          { icon: Building2, label: "Corporate plans", sub: "Net-30 billing" },
        ].map((f) => (
          <div key={f.label} className="bg-white rounded-2xl border border-brand-100 p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 grid place-items-center text-brand-700">
              <f.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-sm">{f.label}</div>
              <div className="text-xs text-brand-600">{f.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule + Products */}
      <div className="grid lg:grid-cols-[1fr_340px] gap-8">
        <div>
          <h2 className="font-display text-2xl mb-5">Pick your bulk items</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {bulkProducts.map((p) => {
              const w = p.weights.find((w) => w.bulk) ?? p.weights[0];
              const bulk = w.bulk;
              if (!bulk) return null;
              return (
                <BulkCard
                  key={p.id}
                  product={p}
                  onAdd={(q) => {
                    add(p, p.weights.indexOf(w), "bulk", { deliveryDate: date, quantity: q } as any);
                    // Since add always increments by 1, we patch by repeating.
                    for (let i = 1; i < q; i++) {
                      add(p, p.weights.indexOf(w), "bulk", { deliveryDate: date });
                    }
                    push(`${q} × ${p.name} added to bulk order`);
                  }}
                  moq={bulk.moq}
                  unitPrice={bulk.unit}
                  discount={bulk.discount}
                />
              );
            })}
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 self-start space-y-4">
          <div className="bg-white rounded-3xl border border-brand-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <CalendarClock className="w-4 h-4 text-brand-600" />
              <h3 className="font-display text-xl">Schedule delivery</h3>
            </div>
            <label className="block">
              <div className="text-xs font-semibold text-brand-700 mb-1.5">Delivery date</div>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" />
            </label>
            <div className="mt-3">
              <div className="text-xs font-semibold text-brand-700 mb-1.5">Time slot</div>
              <div className="grid grid-cols-2 gap-2">
                {slots.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSlot(s)}
                    className={cn(
                      "p-2.5 rounded-xl border text-xs font-semibold transition",
                      slot === s ? "bg-brand-900 text-white border-brand-900" : "border-brand-200 hover:border-brand-400"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div id="corporate" className="bg-gradient-to-br from-brand-900 to-emerald-800 rounded-3xl p-6 text-white">
            <Building2 className="w-6 h-6 text-cta-300 mb-3" />
            <div className="font-display text-2xl mb-2">Corporate account?</div>
            <p className="text-white/80 text-sm mb-4">
              Net-30 billing, consolidated monthly invoices, dedicated account manager for
              orders above ₹50,000/month.
            </p>
            <button className="bg-white text-brand-900 rounded-full px-4 py-2.5 text-sm font-semibold">
              Talk to sales
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function BulkCard({
  product,
  onAdd,
  moq,
  unitPrice,
  discount,
}: {
  product: (typeof bulkProducts)[number];
  onAdd: (qty: number) => void;
  moq: number;
  unitPrice: number;
  discount: number;
}) {
  const [qty, setQty] = useState(moq);
  return (
    <div className="bg-white rounded-3xl border border-brand-100 overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-50">
        <Image src={product.image} alt={product.name} fill className="object-cover" />
        <div className="absolute top-3 left-3 inline-flex items-center gap-1 bg-brand-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
          <Package className="w-3 h-3" /> BULK · {discount}% OFF
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="font-display text-xl">{product.name}</div>
        <div className="text-sm text-brand-600 mt-1">{product.tagline}</div>
        <div className="mt-4 flex items-baseline gap-2">
          <div className="font-display text-2xl">{formatINR(unitPrice)}</div>
          <div className="text-xs text-brand-500">per unit · MOQ {moq}</div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button onClick={() => setQty(Math.max(moq, qty - 1))} className="w-9 h-9 rounded-full bg-brand-50 grid place-items-center">
            -
          </button>
          <div className="flex-1 text-center font-semibold">{qty} units</div>
          <button onClick={() => setQty(qty + 1)} className="w-9 h-9 rounded-full bg-brand-600 text-white grid place-items-center">+</button>
        </div>
        <button
          onClick={() => onAdd(qty)}
          className="mt-4 bg-brand-900 hover:bg-brand-800 text-white rounded-full py-2.5 text-sm font-semibold"
        >
          Add to bulk · {formatINR(unitPrice * qty)}
        </button>
      </div>
    </div>
  );
}
