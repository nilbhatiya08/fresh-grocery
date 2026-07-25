"use client";
import { useState } from "react";
import {
  X,
  History,
  DollarSign,
  Boxes,
  Search,
  ArrowRight,
  User,
  Calendar,
  Clock,
  Tag,
  AlertCircle
} from "lucide-react";
import { useAdminStore, type AdminProduct } from "@/store/adminStore";
import { cn, formatINR } from "@/lib/utils";

interface PriceStockHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProduct: AdminProduct | null;
}

export function PriceStockHistoryModal({
  isOpen,
  onClose,
  targetProduct
}: PriceStockHistoryModalProps) {
  const { priceHistory, stockHistory } = useAdminStore();
  const [tab, setTab] = useState<"price" | "stock">("price");
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const filteredPriceHistory = priceHistory.filter((h) => {
    const matchProd = !targetProduct || h.productId === targetProduct.id;
    const matchQ =
      h.productName.toLowerCase().includes(search.toLowerCase()) ||
      h.sku.toLowerCase().includes(search.toLowerCase()) ||
      h.user.toLowerCase().includes(search.toLowerCase());
    return matchProd && matchQ;
  });

  const filteredStockHistory = stockHistory.filter((h) => {
    const matchProd = !targetProduct || h.productId === targetProduct.id;
    const matchQ =
      h.productName.toLowerCase().includes(search.toLowerCase()) ||
      h.sku.toLowerCase().includes(search.toLowerCase()) ||
      h.user.toLowerCase().includes(search.toLowerCase());
    return matchProd && matchQ;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-brand-100 flex flex-col max-h-[85vh] animate-scale-up">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-brand-900 via-brand-950 to-brand-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
              <History className="w-6 h-6 text-brand-300" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
                <span>Audit Trail History</span>
                {targetProduct && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {targetProduct.sku}
                  </span>
                )}
              </h3>
              <p className="text-xs text-brand-300 mt-0.5">
                {targetProduct
                  ? `Showing price & inventory change logs for ${targetProduct.name}`
                  : "Showing global enterprise price & inventory audit logs across all products"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-brand-300 hover:text-white rounded-xl hover:bg-white/10 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs & Search */}
        <div className="p-4 bg-brand-50/70 border-b border-brand-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-brand-200 shadow-sm w-full sm:w-auto">
            <button
              onClick={() => setTab("price")}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition flex-1 sm:flex-none justify-center",
                tab === "price" ? "bg-emerald-600 text-white shadow-md" : "text-brand-700 hover:bg-brand-50"
              )}
            >
              <DollarSign className="w-4 h-4" />
              <span>Price History ({filteredPriceHistory.length})</span>
            </button>
            <button
              onClick={() => setTab("stock")}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition flex-1 sm:flex-none justify-center",
                tab === "stock" ? "bg-blue-600 text-white shadow-md" : "text-brand-700 hover:bg-brand-50"
              )}
            >
              <Boxes className="w-4 h-4" />
              <span>Stock History ({filteredStockHistory.length})</span>
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-brand-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search SKU, product, or user..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-brand-200 rounded-xl text-xs font-medium text-brand-900 placeholder:text-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Content Table */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === "price" ? (
            <div className="overflow-x-auto rounded-2xl border border-brand-100 bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-brand-50/80 text-brand-700 font-bold uppercase border-b border-brand-200">
                  <tr>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Product / SKU</th>
                    <th className="p-3.5 text-center">Selling Price Change</th>
                    <th className="p-3.5 text-center">MRP Change</th>
                    <th className="p-3.5">Modified By</th>
                    <th className="p-3.5">Reason / Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-100/60 font-medium text-brand-900">
                  {filteredPriceHistory.map((rec) => {
                    const priceUp = rec.newPrice > rec.oldPrice;
                    const priceDown = rec.newPrice < rec.oldPrice;

                    return (
                      <tr key={rec.id} className="hover:bg-brand-50/50 transition">
                        <td className="p-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 font-mono text-brand-700">
                            <Calendar className="w-3.5 h-3.5 text-brand-400" />
                            <span>{rec.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5 font-mono text-[10px] text-brand-400 mt-0.5">
                            <Clock className="w-3 h-3" />
                            <span>{rec.time}</span>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold text-brand-950">{rec.productName}</div>
                          <div className="text-[10px] text-brand-500 font-mono mt-0.5">{rec.sku}</div>
                        </td>
                        <td className="p-3.5 text-center">
                          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-brand-50 font-bold">
                            <span className="text-brand-500 line-through">{formatINR(rec.oldPrice)}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-brand-400" />
                            <span className={cn(priceUp ? "text-rose-600" : priceDown ? "text-emerald-600" : "text-brand-900")}>
                              {formatINR(rec.newPrice)}
                            </span>
                          </div>
                        </td>
                        <td className="p-3.5 text-center">
                          {rec.oldMrp && rec.newMrp ? (
                            <div className="inline-flex items-center gap-1.5 text-brand-600">
                              <span className="line-through">{formatINR(rec.oldMrp)}</span>
                              <ArrowRight className="w-3 h-3 text-brand-300" />
                              <span className="font-semibold">{formatINR(rec.newMrp)}</span>
                            </div>
                          ) : (
                            <span className="text-brand-300">—</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5 font-semibold text-brand-800">
                            <User className="w-3.5 h-3.5 text-brand-500" />
                            <span>{rec.user}</span>
                          </div>
                        </td>
                        <td className="p-3.5 text-brand-600 italic">
                          {rec.reason || "Spreadsheet inline modification"}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredPriceHistory.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-brand-500 font-normal">
                        No price change records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-brand-100 bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-brand-50/80 text-brand-700 font-bold uppercase border-b border-brand-200">
                  <tr>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Product / SKU</th>
                    <th className="p-3.5 text-center">Stock Quantity Change</th>
                    <th className="p-3.5 text-center">Reason Type</th>
                    <th className="p-3.5">Modified By</th>
                    <th className="p-3.5">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-100/60 font-medium text-brand-900">
                  {filteredStockHistory.map((rec) => {
                    const stockUp = rec.newStock > rec.oldStock;
                    const stockDown = rec.newStock < rec.oldStock;

                    return (
                      <tr key={rec.id} className="hover:bg-brand-50/50 transition">
                        <td className="p-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 font-mono text-brand-700">
                            <Calendar className="w-3.5 h-3.5 text-brand-400" />
                            <span>{rec.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5 font-mono text-[10px] text-brand-400 mt-0.5">
                            <Clock className="w-3 h-3" />
                            <span>{rec.time}</span>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold text-brand-950">{rec.productName}</div>
                          <div className="text-[10px] text-brand-500 font-mono mt-0.5">{rec.sku}</div>
                        </td>
                        <td className="p-3.5 text-center">
                          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-brand-50 font-bold">
                            <span className="text-brand-500">{rec.oldStock} units</span>
                            <ArrowRight className="w-3.5 h-3.5 text-brand-400" />
                            <span className={cn(stockUp ? "text-emerald-700" : stockDown ? "text-rose-700" : "text-brand-900")}>
                              {rec.newStock} units
                            </span>
                          </div>
                        </td>
                        <td className="p-3.5 text-center">
                          <span className={cn(
                            "px-2.5 py-1 rounded-full text-[10px] font-bold border",
                            rec.reason === "Purchase" || rec.reason === "Stock In" as any ? "bg-emerald-100 text-emerald-800 border-emerald-300" :
                            rec.reason === "Sale" || rec.reason === "Stock Out" as any ? "bg-blue-100 text-blue-800 border-blue-300" :
                            rec.reason === "Damage" ? "bg-rose-100 text-rose-800 border-rose-300" :
                            "bg-purple-100 text-purple-800 border-purple-300"
                          )}>
                            {rec.reason}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5 font-semibold text-brand-800">
                            <User className="w-3.5 h-3.5 text-brand-500" />
                            <span>{rec.user}</span>
                          </div>
                        </td>
                        <td className="p-3.5 text-brand-600 italic">
                          {rec.notes || "Manual adjustment"}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredStockHistory.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-brand-500 font-normal">
                        No inventory change records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-brand-50 border-t border-brand-100 flex items-center justify-between text-xs text-brand-600">
          <div>
            Showing <strong>{tab === "price" ? filteredPriceHistory.length : filteredStockHistory.length}</strong> historical entries.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-brand-900 hover:bg-brand-950 text-white font-bold transition shadow-md"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
