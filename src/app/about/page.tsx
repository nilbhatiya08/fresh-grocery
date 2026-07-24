import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Leaf,
  Sprout,
  Users,
  Award,
  TrendingUp,
  MapPin,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Farmora — Our Story & Our Farms",
  description:
    "Farmora partners with 140+ small farms to deliver hand-picked, residue-tested produce to your doorstep the same day.",
};

const milestones = [
  { year: "2021", title: "First basket delivered", text: "From three partner farms in Hoskote to 12 households in Indiranagar." },
  { year: "2022", title: "In-house lab launched", text: "We began residue-testing every batch before dispatch." },
  { year: "2023", title: "Expanded to 4 cities", text: "Mumbai, Delhi-NCR, Hyderabad joined Bengaluru." },
  { year: "2024", title: "140+ farm partners", text: "Covering 23 districts and 60+ heirloom varieties." },
  { year: "2025", title: "Subscription launched", text: "Weekly curated baskets, now serving 250,000+ households." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage:
                "url(/placeholder.jpg)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-950/70 via-brand-900/40 to-transparent" />
          <div className="relative mx-auto max-w-7xl px-5 md:px-8 py-24 md:py-36 text-white max-w-3xl">
            <div className="text-xs uppercase tracking-[0.24em] text-brand-200 mb-3">Our Story</div>
            <h1 className="font-display text-4xl md:text-6xl leading-tight text-balance">
              A better way to feed the people we love.
            </h1>
            <p className="mt-5 text-lg text-white/85 max-w-2xl leading-relaxed">
              Farmora began in 2021 as a small WhatsApp group of friends asking a simple question:
              <em> what if groceries were harvested this morning, not three weeks ago?</em>
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-8 grid md:grid-cols-3 gap-8">
            {[
              { icon: Leaf, title: "Farm-first sourcing", text: "We work directly with 140+ small farms, cutting out the seven layers of middlemen that age produce." },
              { icon: ShieldCheck, title: "Radical transparency", text: "Every basket ships with a lab report — residue levels, harvest date, and the name of the farmer who grew it." },
              { icon: Sprout, title: "Same-day freshness", text: "Our cold-chain logistics deliver within 14 hours of harvest. No shortcuts, no cold-storage shortcuts." },
            ].map((m) => (
              <div key={m.title} className="bg-white rounded-3xl border border-brand-100 p-8">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 grid place-items-center text-brand-700 mb-4">
                  <m.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-2xl mb-2 text-brand-950">{m.title}</h3>
                <p className="text-brand-700 text-sm leading-relaxed">{m.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Numbers */}
        <section className="py-14 md:py-20 bg-brand-950 text-white">
          <div className="mx-auto max-w-7xl px-5 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "250K+", label: "Households served", icon: Users },
              { value: "140+", label: "Partner farms", icon: Sprout },
              { value: "6", label: "Cities live", icon: MapPin },
              { value: "4.8★", label: "Average rating", icon: Award },
            ].map((n) => (
              <div key={n.label}>
                <n.icon className="w-6 h-6 text-brand-300 mb-3" />
                <div className="font-display text-4xl md:text-5xl">{n.value}</div>
                <div className="text-brand-300 text-sm mt-1">{n.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-5 md:px-8">
            <div className="text-center mb-12">
              <div className="text-xs uppercase tracking-[0.24em] text-brand-600 mb-2">Our Journey</div>
              <h2 className="font-display text-3xl md:text-5xl text-brand-950">Five years of small, stubborn wins.</h2>
            </div>
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-brand-200" />
              {milestones.map((m, i) => (
                <div key={m.year} className={`relative mb-10 md:mb-14 grid md:grid-cols-2 gap-6 ${i % 2 === 0 ? "" : "md:direction-rtl"}`}>
                  <div className={`md:pr-10 ${i % 2 === 1 ? "md:col-start-2" : ""}`}>
                    <div className="bg-white border border-brand-100 rounded-2xl p-5 ml-10 md:ml-0 shadow-soft">
                      <div className="text-xs uppercase tracking-widest text-brand-600 mb-1">{m.year}</div>
                      <div className="font-display text-xl text-brand-950">{m.title}</div>
                      <p className="text-sm text-brand-700 mt-1">{m.text}</p>
                    </div>
                  </div>
                  <div className="absolute left-4 md:left-1/2 top-4 -translate-x-1/2 w-3 h-3 rounded-full bg-brand-600 ring-4 ring-cream-50" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-14 md:py-20 bg-white">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="max-w-2xl mb-12">
              <div className="text-xs uppercase tracking-[0.24em] text-brand-600 mb-2">Our Values</div>
              <h2 className="font-display text-3xl md:text-5xl text-brand-950">What we won&apos;t compromise on.</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "No cold-storage shortcuts. Ever.",
                "Farmers are paid within 48 hours of delivery.",
                "Lab reports are public — no cherry-picking.",
                "Packaging is 92% plastic-free and counting.",
                "Every hire spends a week on a partner farm before onboarding.",
                "Customers can trace every basket back to the grower.",
              ].map((v) => (
                <div key={v} className="flex items-start gap-3 bg-cream-50 rounded-2xl p-5 border border-brand-100">
                  <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                  <span className="text-brand-900">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-3xl px-5 md:px-8 text-center">
            <TrendingUp className="w-10 h-10 mx-auto text-brand-600 mb-4" />
            <h2 className="font-display text-3xl md:text-5xl text-brand-950 text-balance">
              We&apos;re just getting started.
            </h2>
            <p className="mt-4 text-brand-700 leading-relaxed">
              By 2028, we aim to reach 1 million households across 25 cities — and make the
              farm-to-home supply chain the most transparent in India. Join us.
            </p>
            <div className="mt-8 flex gap-3 justify-center flex-wrap">
              <a href="/shop" className="bg-brand-900 text-white rounded-full px-6 py-3.5 font-semibold text-sm">Start shopping</a>
              <a href="/careers" className="bg-white border border-brand-200 rounded-full px-6 py-3.5 font-semibold text-sm">Work with us</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
