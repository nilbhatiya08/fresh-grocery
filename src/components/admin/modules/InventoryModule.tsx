"use client";
import { useState } from "react";
import {
  Boxes,
  PlusCircle,
  MinusCircle,
  RefreshCw,
  AlertTriangle,
  Search,
  CheckCircle2,
  Scan,
  Truck,
  Building2,
  ArrowRightLeft,
  X,
  FileText,
  DollarSign
} from "lucide-react";
import { useAdminStore, type AdminProduct, type InventoryLog } from "@/store/adminStore";
import { useAdminAuth } from "@/store/adminAuth";
import { useToasts } from "@/store/shop";
import { cn, formatINR } from "@/lib/utils";

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  category: string;
  rating: number;
  status: "Active" | "Inactive";
}

export function InventoryModule() {
  const { products, inventoryLogs, addInventoryLog, updateProductStock } = useAdminStore();
  const { user, hasPermission } = useAdminAuth();
  const pushToast = useToasts((s) => s.push);

  const [activeTab, setActiveTab] = useState<"stock_levels" | "stock_in" | "stock_out" | "transfer" | "suppliers" | "history">("stock_levels");
  const [query, setQuery] = useState("");
  const [hubFilter, setHubFilter] = useState("All");

  // Barcode Scanner Modal State
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [scannedProduct, setScannedProduct] = useState<AdminProduct | null>(null);
  const [scanQty, setScanQty] = useState(10);
  const [scanType, setScanType] = useState<"in" | "out">("in");

  // Stock In / Purchase Entry Form
  const [selProductId, setSelProductId] = useState("");
  const [selSupplier, setSelSupplier] = useState("Green Valley Agro Farms");
  const [stockQty, setStockQty] = useState("");
  const [stockNotes, setStockNotes] = useState("");
  const [stockRef, setStockRef] = useState(`PUR-${Math.floor(1000 + Math.random() * 9000)}`);
  const [stockHub, setStockHub] = useState("Hub-A (North Ahmedabad)");

  // Simulated Suppliers
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: "sup-1", name: "Green Valley Agro Farms", contactPerson: "Rajesh Patel", phone: "+91 98250 11223", email: "rajesh@greenvalley.com", category: "Fresh Produce", rating: 4.9, status: "Active" },
    { id: "sup-2", name: "Amul Dairy Best India Ltd", contactPerson: "Suresh Mehta", phone: "+91 98250 44556", email: "orders@amuldairy.in", category: "Milk & Dairy", rating: 5.0, status: "Active" },
    { id: "sup-3", name: "Organic Harvest India Pvt", contactPerson: "Ananya Desai", phone: "+91 98250 77889", email: "contact@organicharvest.in", category: "Staples & Grains", rating: 4.8, status: "Active" },
    { id: "sup-4", name: "Global Exotic Imports", contactPerson: "Vikram Shah", phone: "+91 98250 99000", email: "import@exoticfruits.com", category: "Exotic Fruits", rating: 4.7, status: "Active" }
  ]);

  const canManage = hasPermission("inventory.edit");

  // Metrics
  const totalValuation = products.reduce((acc, p) => acc + p.currentStock * p.costPrice, 0);
  const outOfStockCount = products.filter((p) => p.currentStock === 0).length;
  const lowStockCount = products.filter((p) => p.currentStock <= p.minStock && p.currentStock > 0).length;

  const filteredProducts = products.filter((p) => {
    const matchQ = p.name.toLowerCase().includes(query.toLowerCase()) || p.sku.toLowerCase().includes(query.toLowerCase()) || p.barcode.includes(query);
    const matchHub = hubFilter === "All" || p.warehouse === hubFilter;
    return matchQ && matchHub;
  });

  const handleSimulateBarcodeScan = (barcodeToTest?: string) => {
    const code = barcodeToTest || scannedBarcode.trim();
    if (!code) {
      pushToast("Please enter a barcode or SKU to scan", "info");
      return;
    }
    const found = products.find((p) => p.barcode === code || p.sku.toLowerCase() === code.toLowerCase());
    if (found) {
      setScannedProduct(found);
      pushToast(`Barcoded verified: Found "${found.name}" (Stock: ${found.currentStock})`, "success");
    } else {
      setScannedProduct(null);
      pushToast(`No product found in database matching barcode/SKU: ${code}`, "info");
    }
  };

  const handleApplyScanAdjustment = () => {
    if (!scannedProduct || !canManage) return;
    const u = user?.name || "Super Admin";
    const r = user?.role || "Super Admin";

    const prev = scannedProduct.currentStock;
    const qty = scanQty || 10;
    const next = scanType === "in" ? prev + qty : Math.max(0, prev - qty);

    updateProductStock(scannedProduct.id, next, u, r);
    addInventoryLog(
      {
        type: scanType === "in" ? "Stock In" : "Stock Out",
        productId: scannedProduct.id,
        productName: scannedProduct.name,
        sku: scannedProduct.sku,
        quantity: qty,
        previousStock: prev,
        newStock: next,
        referenceNo: `SCAN-${Math.floor(100 + Math.random() * 900)}`,
        warehouse: scannedProduct.warehouse,
        notes: `Instant ${scanType === "in" ? "replenishment" : "deduction"} via Barcode Scanner.`
      },
      u,
      r
    );

    pushToast(`Stock updated for "${scannedProduct.name}" (${prev} → ${next})!`, "success");
    setIsScannerOpen(false);
    setScannedProduct(null);
    setScannedBarcode("");
  };

  const handleSubmitStockEntry = (e: React.FormEvent, type: "Stock In" | "Stock Out" | "Transfer" | "Damage" | "Return") => {
    e.preventDefault();
    if (!canManage) {
      pushToast("Permission denied: You need 'inventory.edit' permission", "info");
      return;
    }
    if (!selProductId || !stockQty) {
      pushToast("Please select a product and enter quantity", "info");
      return;
    }
    const prod = products.find((p) => p.id === selProductId);
    if (!prod) return;

    const qtyVal = parseInt(stockQty, 10);
    if (isNaN(qtyVal) || qtyVal <= 0) {
      pushToast("Please enter a valid positive quantity", "info");
      return;
    }

    const prev = prod.currentStock;
    let next = prev;
    if (type === "Stock In" || type === "Return") next = prev + qtyVal;
    else next = Math.max(0, prev - qtyVal);

    const u = user?.name || "Super Admin";
    const r = user?.role || "Super Admin";

    updateProductStock(prod.id, next, u, r);
    addInventoryLog(
      {
        type,
        productId: prod.id,
        productName: prod.name,
        sku: prod.sku,
        quantity: qtyVal,
        previousStock: prev,
        newStock: next,
        referenceNo: stockRef || `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        warehouse: stockHub,
        notes: stockNotes || `${type} entry recorded via Admin Inventory module (Supplier: ${selSupplier}).`
      },
      u,
      r
    );

    pushToast(`${type} successfully processed for "${prod.name}" (${prev} → ${next} units)!`, "success");
    setStockQty("");
    setStockNotes("");
    setStockRef(`PUR-${Math.floor(1000 + Math.random() * 9000)}`);
    setActiveTab("stock_levels");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header & Valuation Cards */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-brand-100 dark:border-zinc-800 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-brand-950 dark:text-zinc-100 flex items-center gap-2">
            <Boxes className="w-6 h-6 text-brand-600 dark:text-brand-400" /> Inventory & Stock Control
          </h2>
          <p className="text-xs text-brand-600 dark:text-zinc-400 mt-0.5">
            Monitor real-time warehouse stock valuation, purchase entries, and barcode scanning.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsScannerOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white text-xs font-bold flex items-center gap-2 shadow-glow-cta transition active:scale-95"
          >
            <Scan className="w-4 h-4" /> Barcode Scanner
          </button>
        </div>
      </div>

      {/* 2. Valuation Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-brand-100 dark:border-zinc-800 shadow-soft">
          <div className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-zinc-400 mb-1 flex items-center justify-between">
            <span>Total Valuation</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-display font-bold text-2xl text-brand-950 dark:text-zinc-100">{formatINR(totalValuation)}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Based on Supplier Cost Price</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-brand-100 dark:border-zinc-800 shadow-soft">
          <div className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-zinc-400 mb-1 flex items-center justify-between">
            <span>Out of Stock (OOS)</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="font-display font-bold text-2xl text-rose-600 dark:text-rose-400">{outOfStockCount} items</div>
          <div className="text-[11px] text-rose-600 font-semibold mt-1">Requires emergency reorder</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-brand-100 dark:border-zinc-800 shadow-soft">
          <div className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-zinc-400 mb-1 flex items-center justify-between">
            <span>Low Stock Warning</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="font-display font-bold text-2xl text-amber-600 dark:text-amber-400">{lowStockCount} items</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">Below minimum threshold</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-brand-100 dark:border-zinc-800 shadow-soft">
          <div className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-zinc-400 mb-1 flex items-center justify-between">
            <span>Active Warehouses</span>
            <Building2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="font-display font-bold text-2xl text-brand-950 dark:text-zinc-100">3 Hubs</div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">Ahmedabad & Gandhinagar</div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-brand-200/60 dark:border-zinc-800 overflow-x-auto scrollbar-hide text-xs font-bold">
        {[
          { id: "stock_levels", label: "Stock Levels & Hubs", icon: Boxes },
          { id: "stock_in", label: "Stock In / Purchase Entry", icon: PlusCircle },
          { id: "stock_out", label: "Stock Out / Damage", icon: MinusCircle },
          { id: "transfer", label: "Warehouse Transfer", icon: ArrowRightLeft },
          { id: "suppliers", label: "Supplier Directory", icon: Truck },
          { id: "history", label: "Transaction Logs", icon: FileText }
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-t-2xl transition border-b-2 whitespace-nowrap",
                isActive
                  ? "border-brand-600 dark:border-brand-400 bg-white dark:bg-zinc-900 text-brand-950 dark:text-zinc-100 shadow-sm"
                  : "border-transparent text-brand-700 dark:text-zinc-400 hover:bg-brand-50 dark:hover:bg-zinc-800"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. TAB 1: STOCK LEVELS & HUBS */}
      {activeTab === "stock_levels" && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-brand-100 dark:border-zinc-800 shadow-sm flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="w-4 h-4 text-brand-500 dark:text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by product name, SKU, or barcode..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-brand-50/70 dark:bg-zinc-800 border border-brand-100 dark:border-zinc-700 text-xs text-brand-950 dark:text-zinc-100 outline-none"
              />
            </div>
            <select
              value={hubFilter}
              onChange={(e) => setHubFilter(e.target.value)}
              className="bg-brand-50/70 dark:bg-zinc-800 border border-brand-100 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs font-semibold text-brand-900 dark:text-zinc-200 outline-none"
            >
              <option value="All">All Warehouses</option>
              <option value="Hub-A (North Ahmedabad)">Hub-A (North Ahmedabad)</option>
              <option value="Hub-B (Gandhinagar Central)">Hub-B (Gandhinagar Central)</option>
              <option value="Hub-C (Satellite & SG Highway)">Hub-C (Satellite & SG Highway)</option>
            </select>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-brand-100 dark:border-zinc-800 overflow-hidden shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-50/60 dark:bg-zinc-800/80 border-b border-brand-100 dark:border-zinc-800 text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-zinc-400">
                    <th className="py-3.5 px-4">Product & Barcode</th>
                    <th className="py-3.5 px-4">Warehouse Location</th>
                    <th className="py-3.5 px-4">Current Stock</th>
                    <th className="py-3.5 px-4">Available vs Reserved</th>
                    <th className="py-3.5 px-4">Min Threshold</th>
                    <th className="py-3.5 px-4 text-right">Quick Restock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-100/60 dark:divide-zinc-800 text-xs">
                  {filteredProducts.map((prod) => {
                    const isOOS = prod.currentStock === 0;
                    const isLow = prod.currentStock <= prod.minStock && !isOOS;

                    return (
                      <tr key={prod.id} className="hover:bg-brand-50/40 dark:hover:bg-zinc-800/40 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-sm text-brand-950 dark:text-zinc-100">{prod.name}</div>
                          <div className="text-[11px] text-brand-600 dark:text-zinc-500">
                            SKU: {prod.sku} · Barcode: <span className="font-mono">{prod.barcode}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-brand-800 dark:text-zinc-300">{prod.warehouse}</td>
                        <td className="py-3.5 px-4">
                          <span className={cn("font-bold text-sm px-2.5 py-1 rounded-xl inline-block", isOOS ? "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300" : isLow ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300" : "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300")}>
                            {prod.currentStock} units {isOOS ? "(OOS)" : isLow ? "(Low)" : ""}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-brand-950 dark:text-zinc-100">{prod.availableStock} Available</span> · <span className="text-brand-600 dark:text-zinc-500">{prod.reservedStock} Reserved</span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-brand-700 dark:text-zinc-400">{prod.minStock} units min</td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              updateProductStock(prod.id, prod.currentStock + 50, user?.name || "Super Admin", user?.role || "Super Admin");
                              addInventoryLog({ type: "Stock In", productId: prod.id, productName: prod.name, sku: prod.sku, quantity: 50, previousStock: prod.currentStock, newStock: prod.currentStock + 50, referenceNo: `QUICK-${Math.floor(100+Math.random()*900)}`, warehouse: prod.warehouse, notes: "Quick +50 replenishment" }, user?.name || "Super Admin", user?.role || "Super Admin");
                              pushToast(`Added +50 units to "${prod.name}"`, "success");
                            }}
                            className="px-3 py-1.5 rounded-xl bg-brand-900 dark:bg-brand-600 hover:bg-brand-800 text-white text-xs font-semibold shadow-sm transition active:scale-95"
                          >
                            +50 Units
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 2: STOCK IN / PURCHASE ENTRY */}
      {(activeTab === "stock_in" || activeTab === "stock_out" || activeTab === "transfer") && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-brand-100 dark:border-zinc-800 shadow-soft max-w-2xl mx-auto space-y-6">
          <div className="border-b border-brand-100 dark:border-zinc-800 pb-4">
            <h3 className="font-display text-xl font-bold text-brand-950 dark:text-zinc-100 flex items-center gap-2">
              {activeTab === "stock_in" ? <PlusCircle className="w-5 h-5 text-emerald-600" /> : activeTab === "stock_out" ? <MinusCircle className="w-5 h-5 text-rose-600" /> : <ArrowRightLeft className="w-5 h-5 text-blue-600" />}
              {activeTab === "stock_in" ? "New Purchase / Stock In Entry" : activeTab === "stock_out" ? "Stock Deduction / Damage Entry" : "Warehouse Stock Transfer"}
            </h3>
            <p className="text-xs text-brand-600 dark:text-zinc-400 mt-0.5">
              Record inventory modifications to maintain audit history and accurate stock valuations.
            </p>
          </div>

          <form onSubmit={(e) => handleSubmitStockEntry(e, activeTab === "stock_in" ? "Stock In" : activeTab === "stock_out" ? "Damage" : "Transfer")} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-brand-900 dark:text-zinc-200 mb-1">Select Product *</label>
              <select
                value={selProductId}
                onChange={(e) => setSelProductId(e.target.value)}
                required
                className="w-full bg-brand-50/70 dark:bg-zinc-800 border border-brand-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-semibold text-sm text-brand-950 dark:text-zinc-100 outline-none"
              >
                <option value="">-- Choose Product from Catalog --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} (Current Stock: {p.currentStock}) — SKU: {p.sku}</option>
                ))}
              </select>
            </div>

            {activeTab === "stock_in" && (
              <div>
                <label className="block font-bold text-brand-900 dark:text-zinc-200 mb-1">Supplier / Vendor *</label>
                <select
                  value={selSupplier}
                  onChange={(e) => setSelSupplier(e.target.value)}
                  className="w-full bg-brand-50/70 dark:bg-zinc-800 border border-brand-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-semibold text-brand-950 dark:text-zinc-100 outline-none"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.name}>{s.name} ({s.contactPerson})</option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-brand-900 dark:text-zinc-200 mb-1">Quantity (Units) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 100"
                  value={stockQty}
                  onChange={(e) => setStockQty(e.target.value)}
                  className="w-full bg-brand-50/70 dark:bg-zinc-800 border border-brand-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-bold text-base text-brand-950 dark:text-zinc-100 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-900 dark:text-zinc-200 mb-1">Reference / Invoice No *</label>
                <input
                  type="text"
                  required
                  value={stockRef}
                  onChange={(e) => setStockRef(e.target.value)}
                  className="w-full bg-brand-50/70 dark:bg-zinc-800 border border-brand-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-mono text-brand-950 dark:text-zinc-100 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-brand-900 dark:text-zinc-200 mb-1">Destination / Source Warehouse</label>
              <select
                value={stockHub}
                onChange={(e) => setStockHub(e.target.value)}
                className="w-full bg-brand-50/70 dark:bg-zinc-800 border border-brand-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-semibold text-brand-950 dark:text-zinc-100 outline-none"
              >
                <option value="Hub-A (North Ahmedabad)">Hub-A (North Ahmedabad)</option>
                <option value="Hub-B (Gandhinagar Central)">Hub-B (Gandhinagar Central)</option>
                <option value="Hub-C (Satellite & SG Highway)">Hub-C (Satellite & SG Highway)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-brand-900 dark:text-zinc-200 mb-1">Notes / Reason</label>
              <textarea
                rows={3}
                placeholder="e.g. Regular weekly replenishment from vendor farm."
                value={stockNotes}
                onChange={(e) => setStockNotes(e.target.value)}
                className="w-full bg-brand-50/70 dark:bg-zinc-800 border border-brand-200 dark:border-zinc-700 rounded-xl p-3 text-brand-950 dark:text-zinc-100 outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-bold text-sm shadow-glow-cta transition active:scale-95"
              >
                Submit {activeTab === "stock_in" ? "Purchase Entry (+ Units)" : activeTab === "stock_out" ? "Deduction (- Units)" : "Transfer"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 6. TAB 5: SUPPLIER DIRECTORY */}
      {activeTab === "suppliers" && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-brand-100 dark:border-zinc-800 p-6 shadow-soft space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-brand-950 dark:text-zinc-100">Supplier & Vendor Directory</h3>
              <p className="text-xs text-brand-600 dark:text-zinc-400">Verified partner farms and dairy distributors.</p>
            </div>
            <button
              onClick={() => pushToast("Simulated modal: Supplier onboarded successfully!", "success")}
              className="px-4 py-2 rounded-xl bg-brand-900 dark:bg-brand-600 hover:bg-brand-800 text-white text-xs font-bold shadow-sm transition"
            >
              + Add New Supplier
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {suppliers.map((sup) => (
              <div key={sup.id} className="p-4 rounded-2xl bg-brand-50/60 dark:bg-zinc-800/60 border border-brand-100 dark:border-zinc-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white dark:bg-zinc-900 px-2 py-0.5 rounded text-brand-600 dark:text-zinc-300">
                    {sup.category}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">★ {sup.rating}</span>
                </div>
                <div className="font-bold text-sm text-brand-950 dark:text-zinc-100">{sup.name}</div>
                <div className="text-xs text-brand-700 dark:text-zinc-400 space-y-0.5">
                  <div>Contact: <strong>{sup.contactPerson}</strong></div>
                  <div>Phone: {sup.phone}</div>
                  <div>Email: {sup.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. TAB 6: TRANSACTION HISTORY LOGS */}
      {activeTab === "history" && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-brand-100 dark:border-zinc-800 overflow-hidden shadow-soft">
          <div className="px-6 py-4 border-b border-brand-100 dark:border-zinc-800">
            <h3 className="font-display text-lg font-bold text-brand-950 dark:text-zinc-100">Inventory Transaction History</h3>
            <p className="text-xs text-brand-600 dark:text-zinc-400">Complete audit trail of every stock modification.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-50/60 dark:bg-zinc-800/80 border-b border-brand-100 dark:border-zinc-800 text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-zinc-400">
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Type & Reference</th>
                  <th className="py-3.5 px-4">Product & SKU</th>
                  <th className="py-3.5 px-4">Qty Change</th>
                  <th className="py-3.5 px-4">Stock Transition</th>
                  <th className="py-3.5 px-4">Warehouse</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100/60 dark:divide-zinc-800 text-xs">
                {inventoryLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-brand-600 dark:text-zinc-500 font-medium">
                      No inventory transaction logs recorded yet.
                    </td>
                  </tr>
                ) : (
                  inventoryLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-brand-50/40 dark:hover:bg-zinc-800/40 transition">
                      <td className="py-3.5 px-4 whitespace-nowrap font-medium text-brand-950 dark:text-zinc-100">{log.date} {log.time}</td>
                      <td className="py-3.5 px-4">
                        <span className={cn("font-bold px-2 py-0.5 rounded-md text-[10px]", log.type === "Stock In" || log.type === "Return" ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300" : "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300")}>
                          {log.type}
                        </span>
                        <div className="text-[11px] font-mono text-brand-600 dark:text-zinc-400 mt-0.5">{log.referenceNo}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-brand-950 dark:text-zinc-100">
                        {log.productName} <span className="text-[11px] font-normal text-brand-600 dark:text-zinc-500">({log.sku})</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-sm">
                        {log.type === "Stock In" || log.type === "Return" ? <span className="text-emerald-600">+{log.quantity}</span> : <span className="text-rose-600">-{log.quantity}</span>}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-brand-800 dark:text-zinc-300">
                        {log.previousStock} → <strong className="text-brand-950 dark:text-zinc-100">{log.newStock}</strong>
                      </td>
                      <td className="py-3.5 px-4 text-brand-600 dark:text-zinc-400 truncate max-w-[150px]">{log.warehouse}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8. Barcode Scanner Modal */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-lg w-full p-6 border border-brand-100 dark:border-zinc-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-brand-100 dark:border-zinc-800 pb-4">
              <h3 className="font-display text-xl font-bold text-brand-950 dark:text-zinc-100 flex items-center gap-2">
                <Scan className="w-5 h-5 text-brand-600" /> Warehouse Barcode Scanner
              </h3>
              <button onClick={() => setIsScannerOpen(false)} className="p-1 text-brand-700 hover:text-brand-950">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-brand-950 text-white text-center space-y-3 shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b981_1px,transparent_1px)] bg-[size:20px] opacity-10" />
              <Scan className="w-12 h-12 text-emerald-400 mx-auto animate-pulse" />
              <div className="text-sm font-bold tracking-wider uppercase text-emerald-300">Ready to Scan Barcode / SKU</div>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                Scan item with barcode reader or enter code below to verify and adjust stock.
              </p>

              <div className="flex gap-2 max-w-sm mx-auto pt-2">
                <input
                  type="text"
                  placeholder="Try 890100112233 or FRM-SKU-1001..."
                  value={scannedBarcode}
                  onChange={(e) => setScannedBarcode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSimulateBarcodeScan()}
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-emerald-500"
                />
                <button
                  onClick={() => handleSimulateBarcodeScan()}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-brand-950 font-bold text-xs transition"
                >
                  Verify
                </button>
              </div>

              <div className="flex flex-wrap justify-center gap-2 pt-2 text-[10px]">
                <button onClick={() => { setScannedBarcode("890100112233"); handleSimulateBarcodeScan("890100112233"); }} className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
                  Simulate Mango Scan
                </button>
                <button onClick={() => { setScannedBarcode("890100223344"); handleSimulateBarcodeScan("890100223344"); }} className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
                  Simulate Amul Milk Scan
                </button>
              </div>
            </div>

            {scannedProduct && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verified Item Match
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300">{scannedProduct.sku}</span>
                </div>
                <div className="font-bold text-base text-brand-950 dark:text-zinc-100">{scannedProduct.name}</div>
                <div className="text-xs text-brand-700 dark:text-zinc-400 flex items-center justify-between">
                  <span>Current Stock: <strong className="text-brand-950 dark:text-zinc-100 font-bold">{scannedProduct.currentStock} units</strong></span>
                  <span>Price: ₹{scannedProduct.weights[0]?.price}</span>
                </div>

                <div className="border-t border-emerald-200 dark:border-emerald-800/60 pt-3 flex items-center gap-3">
                  <div className="flex gap-1 bg-white dark:bg-zinc-900 p-1 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs font-bold">
                    <button
                      onClick={() => setScanType("in")}
                      className={cn("px-3 py-1 rounded-lg transition", scanType === "in" ? "bg-emerald-600 text-white" : "text-brand-700 dark:text-zinc-300")}
                    >
                      + Stock In
                    </button>
                    <button
                      onClick={() => setScanType("out")}
                      className={cn("px-3 py-1 rounded-lg transition", scanType === "out" ? "bg-rose-600 text-white" : "text-brand-700 dark:text-zinc-300")}
                    >
                      - Stock Out
                    </button>
                  </div>
                  <input
                    type="number"
                    placeholder="Qty"
                    value={scanQty}
                    onChange={(e) => setScanQty(parseInt(e.target.value, 10) || 1)}
                    className="w-20 bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-800 rounded-xl px-2.5 py-1.5 text-xs font-bold text-center outline-none"
                  />
                  <button
                    onClick={handleApplyScanAdjustment}
                    className="flex-1 py-2 rounded-xl bg-brand-900 dark:bg-brand-600 hover:bg-brand-800 text-white font-bold text-xs shadow-sm transition active:scale-95"
                  >
                    Apply Adjustment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
