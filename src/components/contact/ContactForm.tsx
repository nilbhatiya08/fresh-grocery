"use client";
import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  return (
    <form
      className="bg-white rounded-3xl border border-brand-100 p-8 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      {sent && (
        <div className="flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-xl p-3 text-sm text-brand-800">
          <CheckCircle2 className="w-4 h-4 text-brand-600" /> Thanks — we'll reply within 4 hours.
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        <label className="block">
          <div className="text-xs font-semibold text-brand-700 mb-1.5">Name</div>
          <input className="input" placeholder="Your name" required />
        </label>
        <label className="block">
          <div className="text-xs font-semibold text-brand-700 mb-1.5">Phone</div>
          <input className="input" placeholder="98xxxxxxx0" required />
        </label>
      </div>
      <label className="block">
        <div className="text-xs font-semibold text-brand-700 mb-1.5">Email</div>
        <input type="email" className="input" placeholder="you@email.com" required />
      </label>
      <label className="block">
        <div className="text-xs font-semibold text-brand-700 mb-1.5">Subject</div>
        <select className="input">
          <option>General enquiry</option>
          <option>Order issue</option>
          <option>Partnership / Press</option>
          <option>Careers</option>
        </select>
      </label>
      <label className="block">
        <div className="text-xs font-semibold text-brand-700 mb-1.5">Message</div>
        <textarea rows={5} className="input resize-none" placeholder="How can we help?" required />
      </label>
      <button className="w-full bg-brand-900 hover:bg-brand-800 text-white rounded-full py-3.5 font-semibold text-sm flex items-center justify-center gap-2">
        Send message <Send className="w-4 h-4" />
      </button>
    </form>
  );
}
