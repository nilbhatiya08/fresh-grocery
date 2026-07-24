"use client";
import { useEffect, useState } from "react";
import { MapPin, Check, Sparkles } from "lucide-react";

export function PincodeChecker() {
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "no">("idle");

  useEffect(() => {
    if (pin.length === 6) {
      const n = Number(pin);
      // mock: all 56xxxx (Bengaluru), 40xxxx (Mumbai), 11xxxx (Delhi), 50xxxx (Hyd) are serviceable
      const ok =
        String(n).startsWith("56") ||
        String(n).startsWith("40") ||
        String(n).startsWith("11") ||
        String(n).startsWith("50");
      setStatus(ok ? "ok" : "no");
    } else {
      setStatus("idle");
    }
  }, [pin]);

  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="relative rounded-[36px] bg-gradient-to-br from-brand-900 via-brand-800 to-emerald-800 text-white p-8 md:p-12 overflow-hidden">
          <div aria-hidden className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-2xl" />
          <div aria-hidden className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-lime-300/10 blur-2xl" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                <Sparkles className="w-3.5 h-3.5" /> Same-day delivery
              </div>
              <h3 className="font-display text-3xl md:text-4xl leading-tight">
                Do we deliver to your pincode?
              </h3>
              <p className="text-white/80 mt-3 max-w-md">
                We&apos;re live in Bengaluru, Mumbai, Delhi-NCR, Hyderabad, Pune and Chennai.
                Enter your pincode to check availability and slots.
              </p>
            </div>

            <div>
              <div className="flex items-center bg-white rounded-2xl p-1.5 shadow-soft">
                <MapPin className="w-4 h-4 text-brand-700 ml-3" />
                <input
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter 6-digit pincode"
                  className="flex-1 bg-transparent outline-none px-3 py-3 text-brand-950 placeholder:text-brand-400"
                />
                <button className="bg-brand-900 hover:bg-brand-800 text-white text-sm font-semibold px-5 py-3 rounded-xl">
                  Check
                </button>
              </div>
              {status === "ok" && (
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <div className="w-5 h-5 rounded-full bg-lime-300 text-brand-900 grid place-items-center">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-white/90">
                    Yes! We deliver to <b>{pin}</b> — earliest slot today at 4:00 PM.
                  </span>
                </div>
              )}
              {status === "no" && (
                <div className="mt-3 text-sm text-amber-200">
                  We don&apos;t deliver to {pin} yet. Join the waitlist and we&apos;ll notify you.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
