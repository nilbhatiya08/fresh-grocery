import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/contact/ContactForm";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Farmora — We're here to help",
  description:
    "Reach Farmora customer care via WhatsApp, phone, email or visit our experience store in Bengaluru.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl px-5 md:px-8 py-14 md:py-20">
        <div className="max-w-2xl mb-12">
          <div className="text-xs uppercase tracking-[0.24em] text-brand-600 mb-2">Get in touch</div>
          <h1 className="font-display text-4xl md:text-6xl text-brand-950 text-balance">
            We read every message. Usually reply within <span className="italic text-brand-600">4 hours</span>.
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <ContactForm />

          <div className="space-y-4">
            {[
              { icon: MessageCircle, label: "WhatsApp", value: "+91 98765 43210", sub: "Fastest · replies in under 10 mins" },
              { icon: Phone, label: "Call us", value: "1800-123-FARM (toll free)", sub: "Mon–Sat · 8 AM – 10 PM" },
              { icon: Mail, label: "Email", value: "hello@farmora.in", sub: "We reply within 4 business hours" },
              { icon: MapPin, label: "Visit our flagship", value: "100 Feet Rd, Indiranagar, Bengaluru 560038", sub: "Open daily 8 AM – 10 PM" },
            ].map((c) => (
              <div key={c.label} className="bg-white rounded-3xl border border-brand-100 p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 grid place-items-center text-brand-700 shrink-0">
                  <c.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-brand-500">{c.label}</div>
                  <div className="font-display text-xl text-brand-950 mt-1">{c.value}</div>
                  <div className="text-sm text-brand-600 mt-0.5">{c.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
