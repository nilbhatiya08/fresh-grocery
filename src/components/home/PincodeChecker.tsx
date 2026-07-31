"use client";
import { useState } from "react";
import { MapPin, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function PincodeChecker() {
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "no">("idle");

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 6) return;

    setStatus("loading");
    setTimeout(() => {
      const pinNum = parseInt(pin, 10);
      
      // Validation rule:
      // - Gandhinagar Sectors 1-29 pincodes: 382001 to 382030
      // - Sargasan / Kudasan pincodes: 382421
      const isGandhinagarSector = pinNum >= 382001 && pinNum <= 382030;
      const isSargasanOrKudasan = pinNum === 382421;

      if (isGandhinagarSector || isSargasanOrKudasan) {
        setStatus("ok");
      } else {
        setStatus("no");
      }
    }, 750); // Simulated loading spinner for smooth UX
  };

  return (
    <section className="pt-6 pb-12 md:pt-8 md:pb-16 bg-cream-50">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="relative rounded-[36px] bg-gradient-to-br from-brand-900 via-brand-800 to-emerald-800 text-white p-8 md:p-12 overflow-hidden shadow-soft">
          <div aria-hidden className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <div aria-hidden className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-lime-300/10 blur-2xl pointer-events-none" />
          
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                <Sparkles className="w-3.5 h-3.5" /> 🚚 Same-day Delivery
              </div>
              <h3 className="font-display text-3xl md:text-4xl leading-tight">
                Do we deliver to your pincode?
              </h3>
              <div className="text-white/80 mt-3 text-sm leading-relaxed max-w-md">
                <p>We&apos;re currently delivering only in Gandhinagar.</p>
                <div className="mt-4 space-y-1">
                  <div className="font-semibold text-white">Available delivery areas:</div>
                  <div className="pl-3">• Sector 1 to Sector 29</div>
                  <div className="pl-3">• Sargasan</div>
                  <div className="pl-3">• Kudasan</div>
                </div>
                <p className="mt-4 text-white/70 text-xs">
                  Enter your 6-digit Gandhinagar pincode to check availability.
                </p>
              </div>
            </div>

            <div>
              <form onSubmit={handleCheck} className="flex items-center bg-white rounded-2xl p-1.5 shadow-soft">
                <MapPin className="w-4 h-4 text-brand-700 ml-3 shrink-0" />
                <input
                  type="text"
                  pattern="\d{6}"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value.replace(/\D/g, "").slice(0, 6));
                    setStatus("idle");
                  }}
                  placeholder="Enter 6-digit pincode"
                  className="flex-1 bg-transparent outline-none px-3 py-3 text-brand-950 placeholder:text-brand-400 text-sm min-w-0"
                />
                <button
                  type="submit"
                  disabled={status === "loading" || pin.length !== 6}
                  className="bg-brand-900 hover:bg-brand-950 disabled:bg-brand-200 text-white text-sm font-semibold px-6 py-3 rounded-xl transition flex items-center gap-2 shrink-0"
                >
                  {status === "loading" ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Checking...
                    </>
                  ) : (
                    "Check"
                  )}
                </button>
              </form>

              <AnimatePresence mode="wait">
                {status === "ok" && (
                  <motion.div
                    key="ok"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 p-4 rounded-2xl bg-lime-500/20 border border-lime-400/30 flex items-start gap-2.5 text-sm"
                  >
                    <span className="text-lg shrink-0">✅</span>
                    <div>
                      <div className="font-bold text-lime-200">Great! We deliver to your location.</div>
                      <div className="text-xs text-white/90 mt-1">Earliest delivery slot today at 4:00 PM.</div>
                    </div>
                  </motion.div>
                )}
                {status === "no" && (
                  <motion.div
                    key="no"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 p-4 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-start gap-2.5 text-sm"
                  >
                    <span className="text-lg shrink-0">❌</span>
                    <div>
                      <div className="font-bold text-amber-200">Sorry, we&apos;re not delivering to your area yet.</div>
                      <div className="text-xs text-white/90 mt-1">We&apos;re expanding soon. Stay tuned!</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
