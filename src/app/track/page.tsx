import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  CheckCircle2,
  Circle,
  Package,
  Truck,
  MapPin,
  Phone,
  ShieldCheck,
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Track Order · Live delivery status",
  robots: { index: false, follow: false },
};

const steps = [
  { id: "confirmed", label: "Order confirmed", time: "9:14 AM", done: true },
  { id: "packing", label: "Being packed at our hub", time: "9:22 AM", done: true },
  { id: "out", label: "Out for delivery", time: "9:48 AM", done: true, current: true },
  { id: "delivered", label: "Delivered", time: "Est. 10:02 AM", done: false },
];

export default function TrackPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl px-5 md:px-8 py-10 md:py-14">
        <div className="mb-8">
          <div className="text-xs text-brand-500 mb-2"><a href="/" className="hover:text-brand-700">Home</a> / Track Order</div>
          <h1 className="font-display text-4xl md:text-5xl text-brand-950">Order #FRM-823145</h1>
          <p className="text-brand-700 mt-1">Instant delivery · Placed 9:14 AM today</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-5">
            <div className="bg-cta-500 text-white rounded-3xl p-6 shadow-glow-cta relative overflow-hidden">
              <div aria-hidden className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
              <div className="relative flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="text-xs uppercase tracking-widest opacity-80">Live status</div>
                  <div className="font-display text-3xl mt-1">Rahul is 1.2 km away</div>
                  <div className="text-sm opacity-90 mt-1">Estimated arrival · 10:02 AM (12 min)</div>
                </div>
                <div className="flex items-center gap-2">
                  <a href="tel:+919876543210" className="bg-white text-cta-600 rounded-full px-4 py-2.5 text-sm font-semibold flex items-center gap-1.5">
                    <Phone className="w-4 h-4" /> Call Rahul
                  </a>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="relative rounded-3xl overflow-hidden aspect-[16/9] bg-gradient-to-br from-brand-100 to-cream-100 border border-brand-100">
              <div className="absolute inset-0 opacity-60" style={{
                backgroundImage: "radial-gradient(circle at 30% 40%, #c3e3bb 0, transparent 40%), radial-gradient(circle at 70% 60%, #96cd8a 0, transparent 50%)"
              }} />
              <div className="absolute top-1/2 left-[30%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-cta-500 border-4 border-white shadow-glow-cta pulse-ring" />
              <div className="absolute top-1/2 left-[70%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-brand-900 border-4 border-white shadow-soft flex items-center justify-center">
                <MapPin className="w-3 h-3 text-white" />
              </div>
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M 30 50 Q 50 40, 70 50" stroke="#2f7229" strokeWidth="0.6" strokeDasharray="1.5 1.5" fill="none" />
              </svg>
              <div className="absolute bottom-4 left-4 glass-strong rounded-full px-3 py-1.5 text-xs flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-brand-700" /> Live tracking · GPS enabled
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-3xl border border-brand-100 p-6">
              <h3 className="font-display text-xl mb-5">Order progress</h3>
              <div className="relative">
                <div className="absolute left-3 top-2 bottom-2 w-px bg-brand-100" />
                {steps.map((s) => (
                  <div key={s.id} className="relative flex items-start gap-4 pb-6 last:pb-0">
                    <div className="relative z-10">
                      {s.done ? (
                        <div className="w-6 h-6 rounded-full bg-brand-600 text-white grid place-items-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : s.current ? (
                        <div className="w-6 h-6 rounded-full bg-cta-500 text-white grid place-items-center pulse-ring">
                          <Circle className="w-3 h-3" fill="currentColor" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-brand-200 bg-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{s.label}</div>
                      <div className="text-xs text-brand-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {s.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-white rounded-3xl border border-brand-100 p-5">
              <h4 className="font-semibold text-sm mb-3">Delivery partner</h4>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 grid place-items-center text-white font-semibold">RS</div>
                <div>
                  <div className="font-semibold">Rahul Singh</div>
                  <div className="text-xs text-brand-600">4.9 ★ · 1,240 deliveries</div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-brand-50 rounded-xl text-xs text-brand-700 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-600" /> OTP verification at door · <b>4821</b>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-brand-100 p-5">
              <h4 className="font-semibold text-sm mb-3">Delivery address</h4>
              <p className="text-sm text-brand-700">
                Flat 402, Prestige Shantiniketan<br />
                Indiranagar, Bengaluru 560048
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-brand-100 p-5">
              <h4 className="font-semibold text-sm mb-3">Items (6)</h4>
              <div className="space-y-2 text-sm">
                {[
                  { n: "Vine-Ripened Tomatoes", q: "1 kg" },
                  { n: "Baby Spinach", q: "250 g" },
                  { n: "Farm-fresh Milk", q: "1 L" },
                  { n: "Malai Paneer", q: "200 g" },
                  { n: "Sourdough Loaf", q: "1" },
                  { n: "California Almonds", q: "250 g" },
                ].map((i) => (
                  <div key={i.n} className="flex justify-between text-brand-800">
                    <span>{i.n}</span><span className="text-brand-500">{i.q}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
