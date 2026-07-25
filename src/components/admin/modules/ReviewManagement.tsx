"use client";
import { useState } from "react";
import { Star, CheckCircle2, XCircle, Search, Filter, MessageSquare, ShieldCheck, ThumbsUp, Trash2 } from "lucide-react";
import { useAdminStore, type AdminReview } from "@/store/adminStore";
import { useAdminAuth } from "@/store/adminAuth";
import { useToasts } from "@/store/shop";
import { cn } from "@/lib/utils";

export function ReviewManagement() {
  const { reviews, updateReviewStatus } = useAdminStore();
  const { user, hasPermission } = useAdminAuth();
  const pushToast = useToasts((s) => s.push);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");

  const canEdit = hasPermission("reviews.edit");

  const filteredReviews = reviews.filter((rev) => {
    const matchQ =
      rev.productName.toLowerCase().includes(query.toLowerCase()) ||
      rev.customerName.toLowerCase().includes(query.toLowerCase()) ||
      rev.comment.toLowerCase().includes(query.toLowerCase());
    const matchSt = statusFilter === "All" || rev.status === statusFilter;
    const matchRt = ratingFilter === "All" || rev.rating.toString() === ratingFilter;
    return matchQ && matchSt && matchRt;
  });

  const handleStatusChange = (revId: string, nextSt: "Approved" | "Rejected" | "Pending", prodName: string) => {
    if (!canEdit) {
      pushToast("Permission denied: You need 'reviews.edit' permission", "info");
      return;
    }
    const u = user?.name || "Super Admin";
    const r = user?.role || "Super Admin";
    updateReviewStatus(revId, nextSt, u, r);
    pushToast(`Review for "${prodName}" marked as ${nextSt}!`, nextSt === "Approved" ? "success" : "info");
  };

  const pendingCount = reviews.filter((r) => r.status === "Pending").length;
  const approvedCount = reviews.filter((r) => r.status === "Approved").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-brand-100 dark:border-zinc-800 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-brand-950 dark:text-zinc-100 flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-500 fill-amber-500" /> Customer Reviews & Ratings
          </h2>
          <p className="text-xs text-brand-600 dark:text-zinc-400 mt-0.5">
            Moderate user feedback, approve storefront testimonials, and manage product review scores.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full">
            ⏳ {pendingCount} Pending Approval
          </span>
          <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full">
            ✅ {approvedCount} Approved
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-brand-100 dark:border-zinc-800 shadow-sm flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 text-brand-500 dark:text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product, reviewer name, or review comments..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-brand-50/70 dark:bg-zinc-800 border border-brand-100 dark:border-zinc-700 text-xs text-brand-950 dark:text-zinc-100 outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-brand-50/70 dark:bg-zinc-800 border border-brand-100 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs font-semibold text-brand-900 dark:text-zinc-200 outline-none"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending Review</option>
          <option value="Approved">Approved (Live)</option>
          <option value="Rejected">Rejected / Spam</option>
        </select>
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="bg-brand-50/70 dark:bg-zinc-800 border border-brand-100 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs font-semibold text-brand-900 dark:text-zinc-200 outline-none"
        >
          <option value="All">All Star Ratings</option>
          <option value="5">★★★★★ (5 Stars)</option>
          <option value="4">★★★★☆ (4 Stars)</option>
          <option value="3">★★★☆☆ (3 Stars)</option>
          <option value="2">★★☆☆☆ (2 Stars)</option>
          <option value="1">★☆☆☆☆ (1 Star)</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center text-brand-600 dark:text-zinc-500 border border-brand-100 dark:border-zinc-800">
            No customer reviews found matching your filter criteria.
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div key={rev.id} className="bg-white dark:bg-zinc-900 rounded-3xl border border-brand-100 dark:border-zinc-800 p-5 shadow-soft hover:shadow-lift transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1",
                      rev.status === "Approved" ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300" :
                      rev.status === "Pending" ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300" :
                      "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300"
                    )}
                  >
                    {rev.status === "Approved" ? "✅ Live on Store" : rev.status === "Pending" ? "⏳ Pending Review" : "❌ Rejected"}
                  </span>
                  <span className="text-xs font-bold text-brand-950 dark:text-zinc-100">{rev.productName}</span>
                  <span className="text-[11px] text-brand-600 dark:text-zinc-500 font-mono">({rev.createdAt})</span>
                </div>

                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn("w-4 h-4", i < rev.rating ? "fill-amber-500" : "text-zinc-300 dark:text-zinc-700")} />
                  ))}
                  <span className="text-xs font-bold text-brand-900 dark:text-zinc-200 ml-1">({rev.rating}.0 / 5.0)</span>
                </div>

                <p className="text-xs text-brand-800 dark:text-zinc-300 leading-relaxed bg-brand-50/50 dark:bg-zinc-800/50 p-3 rounded-2xl border border-brand-100/60 dark:border-zinc-700/60 italic">
                  &quot;{rev.comment}&quot;
                </p>

                <div className="text-[11px] text-brand-600 dark:text-zinc-500 flex items-center gap-2">
                  <span>Reviewer: <strong className="text-brand-900 dark:text-zinc-300">{rev.customerName}</strong></span>
                  {rev.verifiedPurchase && (
                    <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                    </span>
                  )}
                </div>
              </div>

              <div className="flex md:flex-col gap-2 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-brand-100 dark:border-zinc-800">
                {rev.status !== "Approved" && (
                  <button
                    onClick={() => handleStatusChange(rev.id, "Approved", rev.productName)}
                    className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1 active:scale-95"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve (Publish)
                  </button>
                )}
                {rev.status !== "Rejected" && (
                  <button
                    onClick={() => handleStatusChange(rev.id, "Rejected", rev.productName)}
                    className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 hover:bg-rose-100 font-bold text-xs transition flex items-center justify-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject / Remove
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
