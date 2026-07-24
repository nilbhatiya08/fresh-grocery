"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  MapPin,
  CalendarClock,
  CreditCard,
  Smartphone,
  Wallet,
  Banknote,
  ShieldCheck,
  Tag,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "@/store/shop";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Form = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  slot: string;
  payment: "upi" | "card" | "wallet" | "cod";
  coupon: string;
};

const slots = [
  { label: "Today · 4:00 – 6:00 PM", value: "today-4" },
  { label: "Today · 6:00 – 8:00 PM", value: "today-6" },
  { label: "Tomorrow · 8:00 – 10:00 AM", value: "tom-8" },
  { label: "Tomorrow · 10:00 AM – 12:00 PM", value: "tom-10" },
  { label: "Tomorrow · 2:00 – 4:00 PM", value: "tom-2" },
];

export function CheckoutForm() {
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const discount = useCart((s) => s.discount());
  const clear = useCart((s) => s.clear);
  const [placed, setPlaced] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<Form>({
    defaultValues: { payment: "upi", slot: "today-4" },
  });

  const payment = watch("payment");
  const coupon = watch("coupon");
  const couponOk = coupon?.toUpperCase() === "FARMORA10";
  const couponAmt = couponOk ? Math.round(subtotal * 0.1) : 0;
  const deliveryFee = subtotal > 499 || subtotal === 0 ? 0 : 39;
  const total = Math.max(0, subtotal - couponAmt) + deliveryFee;

  const onSubmit = () => {
    setPlaced(true);
    clear();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (placed) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-brand-50 grid place-items-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-brand-600" />
        </div>
        <h1 className="font-display text-4xl text-brand-950 mb-3">Order placed!</h1>
        <p className="text-brand-700 mb-6">
          Thank you. We&apos;ve sent a confirmation to your email and WhatsApp. Your basket will arrive in your chosen slot.
        </p>
        <div className="inline-flex items-center gap-2 bg-brand-50 rounded-full px-4 py-2 text-sm">
          Order #FRM-{Math.floor(Math.random() * 900000 + 100000)}
        </div>
        <div className="mt-8 flex gap-3 justify-center flex-wrap">
          <a href="/track" className="bg-brand-900 text-white rounded-full px-5 py-3 text-sm font-semibold">Track order</a>
          <a href="/shop" className="bg-white border border-brand-200 rounded-full px-5 py-3 text-sm font-semibold">Continue shopping</a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-8">
        <div className="text-xs text-brand-500 mb-2"><a href="/" className="hover:text-brand-700">Home</a> / Checkout</div>
        <h1 className="font-display text-4xl md:text-5xl text-brand-950">Checkout</h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-10">
        <div className="space-y-8">
          {/* Delivery address */}
          <section className="bg-white rounded-3xl border border-brand-100 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-5">
              <MapPin className="w-4 h-4 text-brand-600" />
              <h2 className="font-display text-xl text-brand-950">Delivery address</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Full name" error={errors.name?.message}>
                <input {...register("name", { required: "Required" })} className="input" placeholder="Aarav Sharma" />
              </Field>
              <Field label="Phone" error={errors.phone?.message}>
                <input {...register("phone", { required: "Required", pattern: { value: /^[0-9]{10}$/, message: "10-digit number" } })} className="input" placeholder="98xxxxxxx0" />
              </Field>
              <Field label="Email" error={errors.email?.message}>
                <input type="email" {...register("email", { required: "Required" })} className="input" placeholder="you@email.com" />
              </Field>
              <Field label="Pincode" error={errors.pincode?.message}>
                <input {...register("pincode", { required: "Required", pattern: { value: /^[0-9]{6}$/, message: "6 digits" } })} className="input" placeholder="560001" />
              </Field>
              <Field label="Address" error={errors.address?.message} className="md:col-span-2">
                <textarea {...register("address", { required: "Required" })} rows={2} className="input resize-none" placeholder="Flat, street, landmark..." />
              </Field>
              <Field label="City" error={errors.city?.message}>
                <input {...register("city", { required: "Required" })} className="input" placeholder="Bengaluru" />
              </Field>
            </div>
          </section>

          {/* Delivery slot */}
          <section className="bg-white rounded-3xl border border-brand-100 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-5">
              <CalendarClock className="w-4 h-4 text-brand-600" />
              <h2 className="font-display text-xl text-brand-950">Delivery slot</h2>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
              {slots.map((s) => (
                <button
                  type="button"
                  key={s.value}
                  onClick={() => setValue("slot", s.value, { shouldValidate: true })}
                  className={cn(
                    "text-left p-4 rounded-2xl border text-sm transition",
                    watch("slot") === s.value
                      ? "border-brand-600 bg-brand-50 ring-2 ring-brand-100"
                      : "border-brand-200 hover:border-brand-400"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </section>

          {/* Payment */}
          <section className="bg-white rounded-3xl border border-brand-100 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-5">
              <CreditCard className="w-4 h-4 text-brand-600" />
              <h2 className="font-display text-xl text-brand-950">Payment method</h2>
            </div>
            <div className="space-y-2">
              {([
                { id: "upi", icon: Smartphone, label: "UPI · GPay, PhonePe, Paytm" },
                { id: "card", icon: CreditCard, label: "Credit / Debit card" },
                { id: "wallet", icon: Wallet, label: "Wallet · Amazon Pay, Mobills" },
                { id: "cod", icon: Banknote, label: "Cash on delivery" },
              ] as const).map((m) => (
                <label
                  key={m.id}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition",
                    payment === m.id ? "border-brand-600 bg-brand-50" : "border-brand-200 hover:border-brand-400"
                  )}
                >
                  <input
                    type="radio"
                    className="accent-brand-600"
                    checked={payment === m.id}
                    onChange={() => setValue("payment", m.id)}
                  />
                  <m.icon className="w-5 h-5 text-brand-700" />
                  <span className="font-medium text-sm">{m.label}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-28 self-start">
          <div className="bg-white rounded-3xl border border-brand-100 p-6 md:p-8 space-y-4">
            <h3 className="font-display text-xl text-brand-950">Order summary</h3>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.length === 0 && (
                <p className="text-sm text-brand-600">Your basket is empty.</p>
              )}
              {items.map((i) => (
                <div key={i.productId + i.weight} className="flex items-center gap-3 text-sm">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 overflow-hidden shrink-0">
                    <img src={i.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{i.name}</div>
                    <div className="text-xs text-brand-500">{i.weight} × {i.quantity}</div>
                  </div>
                  <div className="font-semibold">{formatINR(i.price * i.quantity)}</div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-dashed border-brand-100 space-y-1.5 text-sm">
              <div className="flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-xl px-3 py-2">
                <Tag className="w-4 h-4 text-brand-600" />
                <input
                  {...register("coupon")}
                  placeholder="Coupon code"
                  className="flex-1 bg-transparent outline-none text-sm"
                />
                {couponOk && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
              </div>
              <div className="text-xs text-brand-600">Try <b>FARMORA10</b> for 10% off</div>
            </div>

            <div className="pt-3 border-t border-dashed border-brand-100 space-y-1.5 text-sm">
              <div className="flex justify-between text-brand-700">
                <span>Subtotal</span><span>{formatINR(subtotal)}</span>
              </div>
              {couponAmt > 0 && (
                <div className="flex justify-between text-brand-600">
                  <span>Coupon (10%)</span><span>- {formatINR(couponAmt)}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-brand-600">
                  <span>You save</span><span>- {formatINR(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-brand-700">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? "Free" : formatINR(deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-2 border-t border-brand-100">
                <span>Total</span><span>{formatINR(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={items.length === 0}
              className="w-full bg-brand-900 hover:bg-brand-800 disabled:bg-brand-300 text-white rounded-full py-4 font-semibold text-sm transition"
            >
              Place order · {formatINR(total)}
            </button>
            <div className="flex items-center justify-center gap-1.5 text-xs text-brand-600">
              <ShieldCheck className="w-3.5 h-3.5" /> Secure 256-bit SSL checkout
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <div className="text-xs font-semibold text-brand-700 mb-1.5">{label}</div>
      {children}
      {error && <div className="text-xs text-berry mt-1">{error}</div>}
    </label>
  );
}
