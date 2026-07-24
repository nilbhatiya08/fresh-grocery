"use client";
import { useState } from "react";
import { Send, Check } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (email) setOk(true);
      }}
      className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-1.5 max-w-md w-full"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 bg-transparent outline-none px-4 text-sm placeholder:text-brand-300"
      />
      <button
        type="submit"
        className="bg-brand-500 hover:bg-brand-400 text-white px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2"
      >
        {ok ? (
          <>
            Subscribed <Check className="w-3.5 h-3.5" />
          </>
        ) : (
          <>
            Subscribe <Send className="w-3.5 h-3.5" />
          </>
        )}
      </button>
    </form>
  );
}
