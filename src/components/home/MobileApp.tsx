import {
  Smartphone,
  Download,
  Zap,
  CalendarClock,
  Bell,
  RotateCcw,
  Star,
  ShieldCheck,
} from "lucide-react";

export function MobileApp() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="relative rounded-[36px] overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-emerald-900 p-8 md:p-14 text-white">
          <div aria-hidden className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-cta-500/30 blur-3xl" />
          <div aria-hidden className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-lime-300/20 blur-3xl" />

          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-cta-500/20 border border-cta-400/30 text-cta-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                <Download className="w-3.5 h-3.5" /> Farmora Mobile App · Launching soon
              </div>
              <h2 className="font-display text-3xl md:text-5xl text-balance leading-tight">
                Your entire kitchen, <span className="italic text-cta-300">in your pocket.</span>
              </h2>
              <p className="text-white/85 mt-4 max-w-lg leading-relaxed">
                Order anywhere, track in real time, manage subscriptions, one-tap reorder and
                exclusive app-only offers — built to make grocery shopping feel effortless.
              </p>

              <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { icon: Zap, title: "Live tracking", sub: "GPS + OTP verify" },
                  { icon: CalendarClock, title: "Subscription", sub: "Pause · Skip · Resume" },
                  { icon: Bell, title: "Smart alerts", sub: "Seasonal drops" },
                  { icon: RotateCcw, title: "One-tap reorder", sub: "Favourites saved" },
                  { icon: Star, title: "Reward points", sub: "Earn on every ₹" },
                  { icon: ShieldCheck, title: "Secure pay", sub: "UPI · Cards · COD" },
                ].map((f) => (
                  <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
                    <f.icon className="w-5 h-5 text-cta-300 mb-2" />
                    <div className="text-sm font-semibold">{f.title}</div>
                    <div className="text-xs text-white/70 mt-0.5">{f.sub}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-3 bg-white/10 border border-white/15 rounded-2xl px-5 py-3">
                  <Smartphone className="w-6 h-6 text-white/90" />
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-wider text-white/60">Get it on</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                  <span className="text-[10px] bg-cta-500 text-white px-2 py-0.5 rounded-full font-bold ml-2">SOON</span>
                </div>
                <div className="inline-flex items-center gap-3 bg-white/10 border border-white/15 rounded-2xl px-5 py-3">
                  <Smartphone className="w-6 h-6 text-white/90" />
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-wider text-white/60">Download on</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                  <span className="text-[10px] bg-cta-500 text-white px-2 py-0.5 rounded-full font-bold ml-2">SOON</span>
                </div>
              </div>
            </div>

            {/* Mock phone */}
            <div className="relative hidden lg:block">
              <div className="relative mx-auto w-[300px] h-[600px] rounded-[52px] bg-gradient-to-b from-brand-800 to-brand-950 p-3 shadow-lift">
                <div className="absolute inset-0 rounded-[52px] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                <div className="relative w-full h-full rounded-[40px] overflow-hidden bg-cream-50">
                  <div className="bg-brand-900 text-white p-4 flex items-center justify-between">
                    <div className="text-xs">9:41</div>
                    <div className="font-display text-sm">Farmora</div>
                    <div className="text-xs">100%</div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="bg-cta-500 rounded-2xl p-4 text-white">
                      <div className="text-[10px] uppercase tracking-wider opacity-80">Live order</div>
                      <div className="font-display text-xl">Out for delivery</div>
                      <div className="text-xs opacity-85 mt-1">Arriving in 12 min · Rahul on the way</div>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-brand-100">
                      <div className="text-[10px] uppercase tracking-wider text-brand-600">Today's subscription</div>
                      <div className="flex items-center justify-between mt-2">
                        <div>
                          <div className="font-semibold text-sm">Farm-fresh milk · 1 L</div>
                          <div className="text-xs text-brand-600">Delivered 6:30 AM</div>
                        </div>
                        <div className="text-sm font-semibold text-brand-900">₹54</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {["Milk", "Paneer", "Curd"].map((i) => (
                        <div key={i} className="bg-brand-50 rounded-xl p-2 text-center">
                          <div className="w-8 h-8 rounded-lg bg-white mx-auto mb-1" />
                          <div className="text-[11px] font-medium">{i}</div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-gradient-to-br from-brand-100 to-cream-100 rounded-2xl p-4">
                      <div className="text-[10px] uppercase tracking-wider text-brand-700 mb-1">Reward points</div>
                      <div className="font-display text-3xl text-brand-900">2,450</div>
                      <div className="text-xs text-brand-700">= ₹245 off next order</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-cta-500 text-white rounded-full px-3 py-1.5 text-xs font-bold shadow-glow-cta pulse-ring">
                COMING SOON
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
