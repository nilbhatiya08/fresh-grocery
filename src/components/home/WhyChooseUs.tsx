import {
  Leaf,
  Truck,
  ShieldCheck,
  FlaskConical,
  RotateCcw,
  Lock,
  Sparkles,
} from "lucide-react";

const reasons = [
  {
    icon: Leaf,
    title: "Farm Fresh",
    text: "Harvested at peak ripeness from 140+ partner farms within 120 km.",
    accent: "from-emerald-100 to-green-50",
  },
  {
    icon: Truck,
    title: "Same-Day Delivery",
    text: "Order by 2 pm and receive before dinner. Cold-chained end-to-end.",
    accent: "from-sky-100 to-blue-50",
  },
  {
    icon: ShieldCheck,
    title: "Quality Checked",
    text: "Every batch hand-graded by our in-house quality team before packing.",
    accent: "from-amber-100 to-orange-50",
  },
  {
    icon: Sparkles,
    title: "100% Fresh",
    text: "No cold-storage shortcuts. What reaches you was in the field this morning.",
    accent: "from-lime-100 to-emerald-50",
  },
  {
    icon: FlaskConical,
    title: "Residue Tested",
    text: "Lab-tested for pesticides and adulterants — reports shared with every order.",
    accent: "from-rose-100 to-pink-50",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    text: "Not happy? Tap 'return' in the app — no questions asked, instant refund.",
    accent: "from-violet-100 to-purple-50",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    text: "PCI-DSS compliant checkout. UPI, cards, wallets, COD — you pick.",
    accent: "from-cyan-100 to-sky-50",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="max-w-2xl mb-12">
          <div className="text-xs uppercase tracking-[0.24em] text-brand-600 mb-2">
            Why Farmora
          </div>
          <h2 className="font-display text-3xl md:text-5xl text-brand-950 text-balance">
            Seven small promises that make us <span className="italic text-brand-600">different</span>.
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {reasons.map((r, i) => (
            <div
              key={r.title}
              className="group relative rounded-3xl border border-brand-100 p-6 hover:shadow-lift hover:-translate-y-0.5 transition-all duration-300 bg-cream-50"
            >
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${r.accent} grid place-items-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <r.icon className="w-6 h-6 text-brand-800" strokeWidth={1.8} />
              </div>
              <div className="font-display text-lg text-brand-950 mb-1.5">{r.title}</div>
              <p className="text-sm text-brand-700 leading-relaxed">{r.text}</p>
              <div className="absolute top-4 right-4 text-[10px] font-mono text-brand-400">
                0{i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
