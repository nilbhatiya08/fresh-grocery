"use client";
import { AnimatePresence, motion } from "framer-motion";
import { X, Check, MapPin, Rocket, Bell } from "lucide-react";
import { cities } from "@/data/catalog";
import { useCity } from "@/store/shop";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useToasts } from "@/store/shop";

export function CityModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const setCity = useCity((s) => s.setCity);
  const current = useCity((s) => s.slug);
  const push = useToasts((s) => s.push);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [picked, setPicked] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  const live = cities.filter((c) => c.live);
  const upcoming = cities.filter((c) => !c.live);

  const choose = (slug: string) => {
    const city = cities.find((c) => c.slug === slug);
    if (!city) return;
    if (city.live) {
      setCity(slug);
      push(`Delivery city set to ${city.name}`);
      onClose();
    } else {
      setPicked(slug);
    }
  };

  const submitNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !picked) return;
    setSubmitted(true);
    setTimeout(() => {
      push(`You're on the waitlist for ${cities.find(c => c.slug === picked)?.name}`);
      setSubmitted(false);
      setPicked("");
      setName("");
      setPhone("");
      setEmail("");
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-950/50 z-[80]"
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:top-[10vh] md:w-[560px] z-[90] bg-cream-50 rounded-3xl shadow-lift overflow-hidden max-h-[85vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-brand-100 flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-brand-600 mb-1">📍 Delivery location</div>
                <div className="font-display text-2xl text-brand-950">Choose your city</div>
                <p className="text-sm text-brand-700 mt-1">We deliver in 30–40 minutes to supported areas.</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-brand-100"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-brand-600 mb-3">
                  <div className="w-2 h-2 rounded-full bg-brand-500 pulse-ring" /> Currently serving
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {live.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => choose(c.slug)}
                      className={cn(
                        "text-left p-4 rounded-2xl border transition",
                        current === c.slug
                          ? "border-brand-600 bg-brand-50 ring-2 ring-brand-100"
                          : "border-brand-200 bg-white hover:border-brand-400"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-brand-600" />
                        <div className="font-semibold">{c.name}</div>
                        {current === c.slug && <Check className="w-4 h-4 text-brand-600 ml-auto" />}
                      </div>
                      <div className="text-xs text-brand-600 mt-1">⚡ {c.eta} · Instant + Bulk + Dairy</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-brand-600 mb-3">
                  <Rocket className="w-3.5 h-3.5" /> Upcoming cities
                </div>
                <div className="flex flex-wrap gap-2">
                  {upcoming.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => choose(c.slug)}
                      className={cn(
                        "px-3.5 py-2 rounded-full text-sm border transition",
                        picked === c.slug
                          ? "bg-cta-500 text-white border-cta-500"
                          : "bg-white border-brand-200 hover:border-cta-400"
                      )}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {picked && !cities.find(c => c.slug === picked)?.live && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  onSubmit={submitNotify}
                  className="bg-gradient-to-br from-cta-400 to-cta-600 text-white rounded-2xl p-5 space-y-3"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest">
                    <Bell className="w-3.5 h-3.5" /> Notify me when we launch in {cities.find(c => c.slug === picked)?.name}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Full name" className="rounded-xl px-3 py-2.5 text-sm text-brand-950 outline-none" />
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="Phone" className="rounded-xl px-3 py-2.5 text-sm text-brand-950 outline-none" />
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email (optional)" className="rounded-xl px-3 py-2.5 text-sm text-brand-950 outline-none col-span-2" />
                  </div>
                  <button
                    type="submit"
                    disabled={submitted}
                    className="w-full bg-white text-cta-600 rounded-full py-2.5 font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    {submitted ? <><Check className="w-4 h-4"/> You're on the list!</> : <>Join waitlist</>}
                  </button>
                </motion.form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Auto-prompt modal for unsupported cities (uses store flag)
export function CityNotifyAuto() {
  const open = useCity((s) => s.notifyModalOpen);
  const slug = useCity((s) => s.slug);
  const close = useCity((s) => s.closeNotify);
  const city = cities.find((c) => c.slug === slug);
  const push = useToasts((s) => s.push);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [ok, setOk] = useState(false);

  if (!city || city.live) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close} className="fixed inset-0 bg-brand-950/50 z-[80]"
          />
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            className="fixed inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:top-[15vh] md:w-[520px] z-[90] bg-cream-50 rounded-3xl shadow-lift p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cta-400 to-cta-600 grid place-items-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <button onClick={close} className="p-2"><X className="w-5 h-5"/></button>
            </div>
            <h3 className="font-display text-2xl text-brand-950">We're launching soon in {city.name}</h3>
            <p className="text-sm text-brand-700 mt-1">Leave your details and we'll text you the day we go live — plus ₹200 off your first order.</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              setOk(true);
              setTimeout(() => { push(`Waitlisted for ${city.name}`); close(); }, 1200);
            }} className="mt-5 space-y-2">
              <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="input" />
              <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="input" />
              <button className="w-full bg-cta-500 hover:bg-cta-600 text-white rounded-full py-3 font-semibold shadow-glow-cta">
                {ok ? "✓ You're on the list" : "Notify me on launch"}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
