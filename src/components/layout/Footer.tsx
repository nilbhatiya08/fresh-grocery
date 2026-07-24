import Link from "next/link";
import {
  ShieldCheck,
  Leaf,
  Truck,
  RotateCcw,
  CreditCard,
  Smartphone,
  AtSign,
  Hash,
  MessageCircle,
  Play,
} from "lucide-react";
import { NewsletterForm } from "./NewsletterForm";

const columns = [
  {
    title: "Shop",
    items: [
      ["Fresh Vegetables", "/shop?cat=vegetables"],
      ["Fruits", "/shop?cat=fruits"],
      ["Dairy & Milk", "/shop?cat=dairy"],
      ["Bakery", "/shop?cat=bakery"],
      ["Dry Fruits", "/shop?cat=dry-fruits"],
      ["Cold-Pressed Juices", "/shop?cat=juices"],
    ],
  },
  {
    title: "Company",
    items: [
      ["About Farmora", "/about"],
      ["Our Farms", "/farms"],
      ["Sustainability", "/sustainability"],
      ["Careers", "/careers"],
      ["Press", "/press"],
      ["Blog", "/blog"],
    ],
  },
  {
    title: "Support",
    items: [
      ["Help Centre", "/help"],
      ["Contact Us", "/contact"],
      ["Shipping Info", "/shipping"],
      ["Returns & Refunds", "/returns"],
      ["Track Order", "/track"],
      ["FAQs", "/faq"],
    ],
  },
  {
    title: "Policies",
    items: [
      ["Privacy Policy", "/privacy"],
      ["Terms of Service", "/terms"],
      ["Refund Policy", "/refund"],
      ["Cookie Policy", "/cookies"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative bg-brand-950 text-brand-100 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, #fff 0, transparent 40%), radial-gradient(circle at 80% 90%, #fff 0, transparent 45%)",
        }}
      />

      {/* CTA band */}
      <div className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="font-display text-3xl md:text-4xl text-white">
              Get ₹200 off your first basket
            </h3>
            <p className="text-brand-200 mt-2 max-w-md">
              Join 250,000+ households who start their week with Farmora. Free delivery on your first order.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-14 grid lg:grid-cols-5 gap-10">
        {/* Brand */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 grid place-items-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2c-3 3-5 6-5 10a5 5 0 0 0 10 0c0-4-2-7-5-10Z"/>
                <path d="M12 12c-1.5 0-3 .5-4 1.5"/>
              </svg>
            </div>
            <div>
              <div className="font-display text-2xl text-white">Farmora</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-brand-300">Farm · Flora · Fresh</div>
            </div>
          </div>
          <p className="text-brand-200 max-w-sm text-sm leading-relaxed">
            Farmora is a new kind of grocer — partnering directly with 140+ small farms to bring
            hand-picked, residue-tested produce to your door, same day.
          </p>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full"><ShieldCheck className="w-3.5 h-3.5 text-brand-300"/>Residue Tested</span>
            <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full"><Leaf className="w-3.5 h-3.5 text-brand-300"/>No Adulterants</span>
            <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full"><Truck className="w-3.5 h-3.5 text-brand-300"/>Same-Day Delivery</span>
            <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full"><RotateCcw className="w-3.5 h-3.5 text-brand-300"/>Easy Returns</span>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-brand-300 mb-3">Download the app</div>
            <div className="flex flex-wrap gap-3">
              <a className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2.5" href="#">
                <Smartphone className="w-5 h-5" />
                <div className="leading-tight">
                  <div className="text-[10px] text-brand-300">Get it on</div>
                  <div className="text-sm font-medium">Google Play</div>
                </div>
              </a>
              <a className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2.5" href="#">
                <Smartphone className="w-5 h-5" />
                <div className="leading-tight">
                  <div className="text-[10px] text-brand-300">Download on</div>
                  <div className="text-sm font-medium">App Store</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Columns */}
        {columns.map((c) => (
          <div key={c.title}>
            <div className="text-sm font-semibold text-white mb-4">{c.title}</div>
            <ul className="space-y-2.5 text-sm">
              {c.items.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-brand-200 hover:text-white transition">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm text-brand-300">
          <div>© {new Date().getFullYear()} Farmora Foods Pvt. Ltd. All rights reserved.</div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-brand-400">We accept</span>
            {[CreditCard, ShieldCheck].map((Icon, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-lg w-10 h-7 grid place-items-center">
                <Icon className="w-4 h-4 text-brand-200" />
              </div>
            ))}
            {["VISA", "MC", "UPI", "AMEX", "RuPay"].map((p) => (
              <div key={p} className="bg-white/5 border border-white/10 rounded-lg px-2 h-7 grid place-items-center text-[10px] font-bold tracking-wide">
                {p}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4">
            {[AtSign, Hash, MessageCircle, Play].map((Icon, i) => (
              <a key={i} href="#" aria-label="social" className="text-brand-300 hover:text-white transition">
                <Icon className="w-4.5 h-4.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
