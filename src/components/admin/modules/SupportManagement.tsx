"use client";
import { useState } from "react";
import { MessageSquare, CheckCircle2, Clock, AlertCircle, Send, User, Phone, Mail, Search, ShieldCheck } from "lucide-react";
import { useAdminAuth } from "@/store/adminAuth";
import { useToasts } from "@/store/shop";
import { cn } from "@/lib/utils";

interface Ticket {
  id: string;
  orderNo: string;
  customerName: string;
  customerPhone: string;
  subject: string;
  message: string;
  priority: "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Resolved";
  createdAt: string;
  reply?: string;
}

export function SupportManagement() {
  const { user, hasPermission } = useAdminAuth();
  const pushToast = useToasts((s) => s.push);

  const [tickets, setTickets] = useState<Ticket[]>([
    { id: "tck-101", orderNo: "#ORD-9821", customerName: "Ananya Sharma", customerPhone: "+91 98765 43210", subject: "Damaged Avocado Packaging", message: "Two out of four organic avocados in my evening order arrived bruised and crushed during transport.", priority: "High", status: "Open", createdAt: "10 mins ago" },
    { id: "tck-102", orderNo: "#ORD-9755", customerName: "Rahul Verma", customerPhone: "+91 98111 22334", subject: "Refund query for cancelled milk item", message: "I cancelled the Amul Taaza 1L item before dispatch. When will the ₹68 be credited back to my UPI?", priority: "Medium", status: "In Progress", createdAt: "1 hour ago", reply: "Our account team has initiated the UPI reversal. Reference ID: UPI-889900." },
    { id: "tck-103", orderNo: "#ORD-9610", customerName: "Priya Patel", customerPhone: "+91 99222 33445", subject: "Wrong item delivered", message: "Received Britannia Whole Wheat Bread instead of Multigrain Bread.", priority: "High", status: "Resolved", createdAt: "Yesterday", reply: "We have dispatched a free replacement order #ORD-9850 via express rider!" }
  ]);

  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState("");

  const canEdit = hasPermission("support.edit");

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyText) return;
    if (!canEdit) {
      pushToast("Permission denied: You need 'support.edit' permission", "info");
      return;
    }

    setTickets((prev) =>
      prev.map((t) => (t.id === activeTicket.id ? { ...t, status: "Resolved", reply: replyText } : t))
    );
    setActiveTicket((prev) => (prev ? { ...prev, status: "Resolved", reply: replyText } : null));
    setReplyText("");
    pushToast(`Reply sent to customer ${activeTicket.customerName} and ticket marked Resolved!`, "success");
  };

  const handleStatusChange = (id: string, st: "Open" | "In Progress" | "Resolved") => {
    if (!canEdit) {
      pushToast("Permission denied", "info");
      return;
    }
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: st } : t)));
    pushToast(`Ticket ${id} status changed to ${st}`, "info");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-brand-100 dark:border-zinc-800 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-brand-950 dark:text-zinc-100 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-brand-600 dark:text-brand-400" /> Customer Support Tickets & Desk
          </h2>
          <p className="text-xs text-brand-600 dark:text-zinc-400 mt-0.5">
            Resolve delivery complaints, handle product quality feedback, and issue instant order replacements.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 px-3 py-1 rounded-full">
            🔥 {tickets.filter((t) => t.status === "Open").length} Open Tickets
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tickets List (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          {tickets.map((tck) => (
            <div
              key={tck.id}
              onClick={() => { setActiveTicket(tck); setReplyText(tck.reply || ""); }}
              className={cn(
                "bg-white dark:bg-zinc-900 rounded-3xl border p-5 shadow-soft hover:shadow-lift transition cursor-pointer space-y-3",
                activeTicket?.id === tck.id ? "border-brand-500 ring-2 ring-brand-500/20" : "border-brand-100 dark:border-zinc-800"
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-bold text-sm text-brand-950 dark:text-zinc-100">
                  <span>{tck.subject}</span>
                  <span className="text-xs font-mono text-brand-600 dark:text-zinc-500">({tck.orderNo})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded", tck.priority === "High" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800")}>
                    {tck.priority} Priority
                  </span>
                  <span className={cn("text-[10px] font-bold px-2.5 py-0.5 rounded-full", tck.status === "Resolved" ? "bg-emerald-100 text-emerald-800" : tck.status === "In Progress" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800")}>
                    {tck.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-brand-700 dark:text-zinc-300 line-clamp-2 leading-relaxed">&quot;{tck.message}&quot;</p>

              <div className="flex items-center justify-between text-[11px] text-brand-600 dark:text-zinc-400 pt-2 border-t border-brand-100/60 dark:border-zinc-800">
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {tck.customerName} ({tck.customerPhone})</span>
                <span>{tck.createdAt}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Ticket Reply Box (1 Col) */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-brand-100 dark:border-zinc-800 shadow-soft h-fit space-y-6">
          {activeTicket ? (
            <div className="space-y-4 text-xs">
              <div className="border-b border-brand-100 dark:border-zinc-800 pb-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-base text-brand-950 dark:text-zinc-100">Ticket #{activeTicket.id}</div>
                  <div className="text-brand-600 dark:text-zinc-400">Order: {activeTicket.orderNo} · {activeTicket.customerName}</div>
                </div>
                <select
                  value={activeTicket.status}
                  onChange={(e) => handleStatusChange(activeTicket.id, e.target.value as any)}
                  className="bg-brand-50 dark:bg-zinc-800 border rounded-xl px-2.5 py-1 font-bold outline-none"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div className="p-3.5 rounded-2xl bg-brand-50/70 dark:bg-zinc-800/70 border border-brand-100 dark:border-zinc-700 space-y-1">
                <div className="font-bold text-brand-950 dark:text-zinc-100">Customer Message:</div>
                <p className="text-brand-800 dark:text-zinc-300 leading-relaxed italic">&quot;{activeTicket.message}&quot;</p>
              </div>

              {activeTicket.reply && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1 text-emerald-900 dark:text-emerald-200">
                  <div className="font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Support Response Sent:</div>
                  <p className="leading-relaxed">&quot;{activeTicket.reply}&quot;</p>
                </div>
              )}

              <form onSubmit={handleSendReply} className="space-y-3 pt-2">
                <label className="block font-bold text-brand-900 dark:text-zinc-200">Send Response to Customer</label>
                <textarea
                  rows={4}
                  placeholder="Type your official support resolution message..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full bg-brand-50/70 dark:bg-zinc-800 border border-brand-200 dark:border-zinc-700 rounded-xl p-3 outline-none leading-relaxed"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 text-white font-bold shadow-glow-cta transition flex items-center justify-center gap-2 active:scale-95"
                >
                  <Send className="w-4 h-4" /> Reply & Resolve Ticket
                </button>
              </form>
            </div>
          ) : (
            <div className="py-12 text-center text-brand-600 dark:text-zinc-500 font-medium space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto opacity-40" />
              <div>Select a ticket from the left to view conversation details and send a resolution reply.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
