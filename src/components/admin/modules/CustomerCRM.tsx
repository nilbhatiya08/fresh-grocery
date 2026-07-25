"use client";
import { useState } from "react";
import { Users, Search, Wallet, Award, Phone, Mail, MapPin, Ban, CheckCircle2, Eye, X, DollarSign, PlusCircle, MinusCircle } from "lucide-react";
import { useAdminStore, type AdminCustomer } from "@/store/adminStore";
import { useAdminAuth } from "@/store/adminAuth";
import { useToasts } from "@/store/shop";
import { cn, formatINR } from "@/lib/utils";

export function CustomerCRM() {
  const { customers, orders, updateCustomerStatus, adjustCustomerWallet } = useAdminStore();
  const { user, hasPermission } = useAdminAuth();
  const pushToast = useToasts((s) => s.push);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeCust, setActiveCust] = useState<AdminCustomer | null>(null);

  // Wallet Modal state
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletCust, setWalletCust] = useState<AdminCustomer | null>(null);
  const [walletAmount, setWalletAmount] = useState("");
  const [walletType, setWalletType] = useState<"add" | "sub">("add");
  const [walletNote, setWalletNote] = useState("");

  const canEdit = hasPermission("customers.edit");

  const filteredCustomers = customers.filter((c) => {
    const matchQ =
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase()) ||
      c.phone.includes(query);
    const matchSt = statusFilter === "All" || c.status === statusFilter;
    return matchQ && matchSt;
  });

  const handleToggleStatus = (cust: AdminCustomer) => {
    if (!canEdit) {
      pushToast("Permission denied: You need 'customers.edit' permission", "info");
      return;
    }
    const nextSt = cust.status === "Active" ? "Blocked" : "Active";
    const u = user?.name || "Super Admin";
    const r = user?.role || "Super Admin";
    updateCustomerStatus(cust.id, nextSt, u, r);
    pushToast(`Customer "${cust.name}" account is now ${nextSt}!`, "info");
    if (activeCust && activeCust.id === cust.id) {
      setActiveCust((prev) => (prev ? { ...prev, status: nextSt } : null));
    }
  };

  const handleOpenWalletModal = (cust: AdminCustomer) => {
    if (!canEdit) {
      pushToast("Permission denied: You need 'customers.edit' permission", "info");
      return;
    }
    setWalletCust(cust);
    setWalletAmount("");
    setWalletType("add");
    setWalletNote("Customer support loyalty credit.");
    setIsWalletModalOpen(true);
  };

  const handleApplyWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletCust || !walletAmount) return;
    const val = parseFloat(walletAmount);
    if (isNaN(val) || val <= 0) {
      pushToast("Please enter a valid positive amount", "info");
      return;
    }
    const u = user?.name || "Super Admin";
    const r = user?.role || "Super Admin";
    adjustCustomerWallet(walletCust.id, val, walletType, u, r);
    pushToast(`Successfully ${walletType === "add" ? "added" : "deducted"} ₹${val} to ${walletCust.name}'s wallet!`, "success");
    setIsWalletModalOpen(false);
    setWalletCust(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-brand-100 dark:border-zinc-800 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-brand-950 dark:text-zinc-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-600 dark:text-brand-400" /> Customer CRM & Wallet
          </h2>
          <p className="text-xs text-brand-600 dark:text-zinc-400 mt-0.5">
            View 360° customer profiles, order history, manage digital wallet credits, and loyalty rewards.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-brand-50 dark:bg-zinc-800 px-3 py-1.5 rounded-xl border border-brand-100 dark:border-zinc-700 text-xs font-bold text-brand-900 dark:text-zinc-200">
            Total Customers: <span className="text-brand-600 dark:text-brand-400">{customers.length}</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-brand-100 dark:border-zinc-800 shadow-sm flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 text-brand-500 dark:text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer by name, email, or phone number..."
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
          <option value="Active">Active Accounts</option>
          <option value="Blocked">Blocked Accounts</option>
        </select>
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-brand-100 dark:border-zinc-800 overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-50/60 dark:bg-zinc-800/80 border-b border-brand-100 dark:border-zinc-800 text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-zinc-400">
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Contact & Location</th>
                <th className="py-3.5 px-4">Orders & Lifetime Value</th>
                <th className="py-3.5 px-4">Wallet & Loyalty</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100/60 dark:divide-zinc-800 text-xs">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-brand-600 dark:text-zinc-500 font-medium">
                    No customers found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-brand-50/40 dark:hover:bg-zinc-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                          {cust.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div onClick={() => setActiveCust(cust)} className="font-bold text-sm text-brand-950 dark:text-zinc-100 hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer">
                            {cust.name}
                          </div>
                          <div className="text-[11px] text-brand-600 dark:text-zinc-500">Joined: {cust.joinedAt}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-brand-900 dark:text-zinc-200 font-semibold">
                        <Mail className="w-3.5 h-3.5 text-brand-500 shrink-0" /> {cust.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-brand-600 dark:text-zinc-400">
                        <Phone className="w-3.5 h-3.5 text-brand-500 shrink-0" /> {cust.phone}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-sm text-brand-950 dark:text-zinc-100">{cust.ordersCount} Orders</div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                        LTV: {formatINR(cust.totalSpent)}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 font-bold text-sm text-brand-950 dark:text-zinc-100">
                        <Wallet className="w-4 h-4 text-emerald-600" /> {formatINR(cust.walletBalance)}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                        <Award className="w-3.5 h-3.5" /> {cust.loyaltyPoints} Points
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={cn(
                          "text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1",
                          cust.status === "Active"
                            ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                            : "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300"
                        )}
                      >
                        {cust.status === "Active" ? <CheckCircle2 className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                        {cust.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenWalletModal(cust)}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-100 transition shadow-sm"
                          title="Adjust Wallet"
                        >
                          + Wallet
                        </button>
                        <button
                          onClick={() => setActiveCust(cust)}
                          className="p-1.5 rounded-lg hover:bg-brand-100 dark:hover:bg-zinc-800 text-brand-700 dark:text-zinc-300 transition"
                          title="360 Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(cust)}
                          className={cn(
                            "p-1.5 rounded-lg transition",
                            cust.status === "Active" ? "hover:bg-rose-100 text-rose-600" : "hover:bg-emerald-100 text-emerald-600"
                          )}
                          title={cust.status === "Active" ? "Block Account" : "Unblock Account"}
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer 360 Drawer */}
      {activeCust && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-brand-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-xl h-full flex flex-col border-l border-brand-100 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in slide-in-from-right">
            <div className="p-6 border-b border-brand-100 dark:border-zinc-800 bg-brand-50/50 dark:bg-zinc-800/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 text-white font-bold text-base flex items-center justify-center shadow-md">
                  {activeCust.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-brand-950 dark:text-zinc-100">{activeCust.name}</h3>
                  <p className="text-xs text-brand-600 dark:text-zinc-400">Joined on {activeCust.joinedAt} · Account: {activeCust.status}</p>
                </div>
              </div>
              <button onClick={() => setActiveCust(null)} className="p-1.5 rounded-xl text-brand-700 dark:text-zinc-400 hover:bg-brand-100 dark:hover:bg-zinc-700 transition">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-brand-950 dark:text-zinc-100">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
                  <div className="text-[11px] uppercase font-bold">Wallet Credit</div>
                  <div className="font-display font-bold text-2xl mt-0.5">{formatINR(activeCust.walletBalance)}</div>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200">
                  <div className="text-[11px] uppercase font-bold">Loyalty Points</div>
                  <div className="font-display font-bold text-2xl mt-0.5">{activeCust.loyaltyPoints} pts</div>
                </div>
              </div>

              <div className="space-y-2 p-4 rounded-2xl bg-brand-50/70 dark:bg-zinc-800/70 border border-brand-100 dark:border-zinc-700">
                <div className="font-bold text-sm mb-1">Contact & Saved Addresses</div>
                <div className="flex items-center gap-2 text-brand-700 dark:text-zinc-400"><Mail className="w-3.5 h-3.5 text-brand-500" /> {activeCust.email}</div>
                <div className="flex items-center gap-2 text-brand-700 dark:text-zinc-400"><Phone className="w-3.5 h-3.5 text-brand-500" /> {activeCust.phone}</div>
                <div className="pt-2 border-t border-brand-200 dark:border-zinc-700 space-y-1">
                  {activeCust.addresses.map((addr: any, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-brand-800 dark:text-zinc-300">
                      <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0 mt-0.5" />
                      <span>{typeof addr === "string" ? addr : `${addr.label || ""}: ${addr.addressLine || ""}, ${addr.city || ""} - ${addr.pincode || ""}`}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="font-bold text-sm flex items-center justify-between">
                  <span>Recent Order History ({orders.filter((o) => o.customerEmail === activeCust.email || o.customerName === activeCust.name).length})</span>
                  <span className="text-emerald-600 font-bold">LTV: {formatINR(activeCust.totalSpent)}</span>
                </div>
                <div className="space-y-2">
                  {orders.filter((o) => o.customerEmail === activeCust.email || o.customerName === activeCust.name).slice(0, 4).map((ord) => (
                    <div key={ord.id} className="p-3 rounded-2xl bg-white dark:bg-zinc-800 border border-brand-100 dark:border-zinc-700 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-brand-950 dark:text-zinc-100">{ord.id} — {ord.invoiceNo}</div>
                        <div className="text-[11px] text-brand-600 dark:text-zinc-400">{ord.items.length} items · {ord.createdAt}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-brand-950 dark:text-zinc-100">{formatINR(ord.total)}</div>
                        <span className="text-[10px] font-semibold bg-brand-100 dark:bg-zinc-700 px-2 py-0.5 rounded">{ord.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-brand-100 dark:border-zinc-800 bg-brand-50/50 dark:bg-zinc-800/50 flex justify-end gap-3">
              <button onClick={() => setActiveCust(null)} className="px-5 py-2.5 rounded-xl border font-semibold text-brand-800 dark:text-zinc-300">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Wallet Modal */}
      {isWalletModalOpen && walletCust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-md w-full p-6 border border-brand-100 dark:border-zinc-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-brand-100 dark:border-zinc-800 pb-4">
              <h3 className="font-display text-xl font-bold text-brand-950 dark:text-zinc-100 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-600" /> Adjust Wallet Credit
              </h3>
              <button onClick={() => setIsWalletModalOpen(false)} className="p-1 text-brand-700 hover:text-brand-950">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyWallet} className="space-y-4 text-xs">
              <div className="p-3 bg-brand-50 dark:bg-zinc-800 rounded-2xl border border-brand-100 dark:border-zinc-700">
                <div className="font-bold text-sm text-brand-950 dark:text-zinc-100">{walletCust.name}</div>
                <div className="text-brand-600 dark:text-zinc-400">Current Balance: <strong className="text-emerald-600 font-bold">{formatINR(walletCust.walletBalance)}</strong></div>
              </div>

              <div>
                <label className="block font-bold text-brand-900 dark:text-zinc-200 mb-1">Action Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWalletType("add")}
                    className={cn("py-2.5 rounded-xl font-bold border transition flex items-center justify-center gap-1.5", walletType === "add" ? "bg-emerald-600 text-white border-transparent shadow-sm" : "bg-white dark:bg-zinc-800 border-brand-200 text-brand-800")}
                  >
                    <PlusCircle className="w-4 h-4" /> Add Credit (+ ₹)
                  </button>
                  <button
                    type="button"
                    onClick={() => setWalletType("sub")}
                    className={cn("py-2.5 rounded-xl font-bold border transition flex items-center justify-center gap-1.5", walletType === "sub" ? "bg-rose-600 text-white border-transparent shadow-sm" : "bg-white dark:bg-zinc-800 border-brand-200 text-brand-800")}
                  >
                    <MinusCircle className="w-4 h-4" /> Deduct Credit (- ₹)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-brand-900 dark:text-zinc-200 mb-1">Amount (₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 250"
                  value={walletAmount}
                  onChange={(e) => setWalletAmount(e.target.value)}
                  className="w-full bg-brand-50/70 dark:bg-zinc-800 border border-brand-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-bold text-base outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-900 dark:text-zinc-200 mb-1">Reason / Note</label>
                <input
                  type="text"
                  required
                  value={walletNote}
                  onChange={(e) => setWalletNote(e.target.value)}
                  className="w-full bg-brand-50/70 dark:bg-zinc-800 border border-brand-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-brand-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsWalletModalOpen(false)}
                  className="px-4 py-2 rounded-xl border font-semibold text-brand-800 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 text-white font-bold shadow-glow-cta transition active:scale-95"
                >
                  Apply Credit Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
