"use client";
import { useState } from "react";
import { Bell, Send, CheckCircle2, Clock, Users, Smartphone, Radio, Sparkles, ShieldCheck } from "lucide-react";
import { useAdminAuth } from "@/store/adminAuth";
import { useToasts } from "@/store/shop";
import { cn } from "@/lib/utils";

interface SentNotification {
  id: string;
  title: string;
  message: string;
  target: string;
  sentAt: string;
  deliveredCount: number;
  clickRate: string;
}

export function NotificationManagement() {
  const { user, hasPermission } = useAdminAuth();
  const pushToast = useToasts((s) => s.push);

  const [history, setHistory] = useState<SentNotification[]>([
    { id: "notif-1", title: "🌧️ Monsoon Magic: 20% Extra Discount!", message: "Rainy day cravings? Order hot snacks & tea with code RAIN20 for instant delivery.", target: "All Customers", sentAt: "Yesterday, 4:30 PM", deliveredCount: 4250, clickRate: "18.4%" },
    { id: "notif-2", title: "🥑 Fresh Organic Avocados Back in Stock!", message: "Limited stock arrived from Ratnagiri organic farms. Order before they run out!", target: "VIP Customers (Spent > ₹5,000)", sentAt: "July 22, 11:00 AM", deliveredCount: 890, clickRate: "32.1%" },
    { id: "notif-3", title: "⚠️ Delivery Partner SLA Incentive Alert", message: "Earn ₹50 extra bonus on every delivery completed under 15 minutes during peak evening hours.", target: "Delivery Drivers & Fleet", sentAt: "July 20, 6:00 PM", deliveredCount: 145, clickRate: "94.5%" }
  ]);

  const [target, setTarget] = useState("All Customers");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("/category/fruits");
  const [isSending, setIsSending] = useState(false);

  const canEdit = hasPermission("notifications.edit");

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) {
      pushToast("Permission denied: You need 'notifications.edit' permission", "info");
      return;
    }
    if (!title || !message) {
      pushToast("Title and Message body are required", "info");
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      const newN: SentNotification = {
        id: `notif-${Date.now()}`,
        title,
        message,
        target,
        sentAt: "Just Now",
        deliveredCount: target.includes("VIP") ? 890 : target.includes("Drivers") ? 150 : 4320,
        clickRate: "0.0% (Sending...)"
      };
      setHistory((prev) => [newN, ...prev]);
      setIsSending(false);
      setTitle("");
      setMessage("");
      pushToast(`Push notification broadcasted to ${target}!`, "success");
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-brand-100 dark:border-zinc-800 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-brand-950 dark:text-zinc-100 flex items-center gap-2">
            <Bell className="w-6 h-6 text-brand-600 dark:text-brand-400 animate-bounce" /> Push Notifications & Alerts
          </h2>
          <p className="text-xs text-brand-600 dark:text-zinc-400 mt-0.5">
            Broadcast instant mobile app alerts, SMS promotional campaigns, and driver announcements.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Broadcaster Form (1 Col) */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-brand-100 dark:border-zinc-800 shadow-soft space-y-6 h-fit">
          <div className="flex items-center gap-2 border-b border-brand-100 dark:border-zinc-800 pb-4">
            <Radio className="w-5 h-5 text-brand-600 animate-pulse" />
            <h3 className="font-display font-bold text-base text-brand-950 dark:text-zinc-100">Broadcast Campaign</h3>
          </div>

          <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-brand-900 dark:text-zinc-200 mb-1">Target Audience *</label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full bg-brand-50/70 dark:bg-zinc-800 border border-brand-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-bold text-brand-950 dark:text-zinc-100 outline-none"
              >
                <option value="All Customers">All Active Customers (~4,300 users)</option>
                <option value="VIP Customers (Spent > ₹5,000)">VIP Customers (~890 users)</option>
                <option value="Inactive Customers (No order in 30 days)">Inactive Churned Users (~1,200 users)</option>
                <option value="Delivery Drivers & Fleet">Active Delivery Fleet (~150 drivers)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-brand-900 dark:text-zinc-200 mb-1">Notification Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. ⚡ Flash Sale: Flat 30% Off on Fruits!"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-brand-50/70 dark:bg-zinc-800 border border-brand-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-bold text-sm outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-brand-900 dark:text-zinc-200 mb-1">Message Body *</label>
              <textarea
                rows={4}
                required
                placeholder="e.g. Order fresh organic produce in the next 2 hours and get free delivery + instant dispatch!"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-brand-50/70 dark:bg-zinc-800 border border-brand-200 dark:border-zinc-700 rounded-xl p-3.5 outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-bold text-brand-900 dark:text-zinc-200 mb-1">Deep Link Target URL</label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full bg-brand-50/70 dark:bg-zinc-800 border border-brand-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 font-mono text-brand-950 dark:text-zinc-100 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 text-white font-bold text-xs shadow-glow-cta transition flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
            >
              {isSending ? (
                <span>Sending Broadcast...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Send Notification Now
                </>
              )}
            </button>
          </form>
        </div>

        {/* History Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-brand-100 dark:border-zinc-800 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-brand-100 dark:border-zinc-800 pb-4">
            <h3 className="font-display font-bold text-base text-brand-950 dark:text-zinc-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600" /> Recent Broadcast Campaigns
            </h3>
            <span className="text-xs text-brand-600 dark:text-zinc-400 font-semibold">{history.length} Campaigns Sent</span>
          </div>

          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-brand-50/50 dark:bg-zinc-800/50 border border-brand-100 dark:border-zinc-700 space-y-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="font-display font-bold text-sm text-brand-950 dark:text-zinc-100">{item.title}</div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Sent
                  </span>
                </div>

                <p className="text-xs text-brand-700 dark:text-zinc-300 leading-relaxed">&quot;{item.message}&quot;</p>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-brand-600 dark:text-zinc-400 pt-2 border-t border-brand-100 dark:border-zinc-700">
                  <span className="flex items-center gap-1 font-semibold"><Users className="w-3.5 h-3.5 text-brand-500" /> Target: {item.target}</span>
                  <div className="flex items-center gap-4">
                    <span>Delivered: <strong className="text-brand-900 dark:text-zinc-200 font-mono">{item.deliveredCount}</strong></span>
                    <span>CTR: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{item.clickRate}</strong></span>
                    <span className="text-zinc-400">{item.sentAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
