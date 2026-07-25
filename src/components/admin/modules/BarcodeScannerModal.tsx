"use client";
import { useState, useEffect, useRef } from "react";
import {
  X,
  ScanLine,
  Search,
  Boxes,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useAdminStore, type AdminProduct } from "@/store/adminStore";
import { cn, formatINR } from "@/lib/utils";

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProductCell: (productId: string, field: "currentStock" | "price") => void;
}

export function BarcodeScannerModal({
  isOpen,
  onClose,
  onSelectProductCell
}: BarcodeScannerModalProps) {
  const { products } = useAdminStore();
  const [inputVal, setInputVal] = useState("");
  const [matchedProduct, setMatchedProduct] = useState<AdminProduct | null>(null);
  const [targetField, setTargetField] = useState<"currentStock" | "price">("currentStock");
  const [errorMsg, setErrorMsg] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setInputVal("");
      setMatchedProduct(null);
      setErrorMsg("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSearch = (val: string) => {
    setInputVal(val);
    setErrorMsg("");
    if (!val.trim()) {
      setMatchedProduct(null);
      return;
    }
    const clean = val.trim().toLowerCase();
    const found = products.find((p) =>
      p.barcode?.toLowerCase() === clean ||
      p.sku?.toLowerCase() === clean ||
      p.name.toLowerCase().includes(clean)
    );
    if (found) {
      setMatchedProduct(found);
    } else {
      setMatchedProduct(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (matchedProduct) {
        onSelectProductCell(matchedProduct.id, targetField);
        onClose();
      } else if (inputVal.trim()) {
        setErrorMsg(`No product found with barcode or SKU "${inputVal}"`);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-brand-100 flex flex-col animate-scale-up">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-brand-950 to-brand-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/40 animate-pulse">
              <ScanLine className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-white">Barcode & SKU Scanner</h3>
              <p className="text-xs text-brand-300">Scan hardware barcode or type SKU to jump directly to cell</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-brand-300 hover:text-white rounded-xl hover:bg-white/10 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scanner Input Area */}
        <div className="p-6 space-y-6">
          <div>
            <label className="text-xs font-bold text-brand-900 uppercase tracking-wider mb-2 block flex items-center justify-between">
              <span>Scan Barcode / Enter SKU</span>
              <span className="text-brand-500 font-normal">Press Enter after scan</span>
            </label>
            <div className="relative">
              <ScanLine className="w-5 h-5 text-brand-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. 8901002000 or FRM-SKU-1000..."
                className="w-full pl-12 pr-4 py-3.5 bg-brand-50/50 border-2 border-brand-300 rounded-2xl text-base font-mono font-bold text-brand-950 placeholder:text-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
              />
            </div>
            {errorMsg && (
              <div className="mt-2 text-xs text-rose-600 font-semibold flex items-center gap-1.5 animate-shake">
                <AlertCircle className="w-4 h-4" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Quick Demo Barcodes */}
          <div>
            <label className="text-[11px] font-bold text-brand-500 uppercase tracking-wider mb-2 block">
              Quick Test Barcodes (Click to simulate scan)
            </label>
            <div className="flex flex-wrap gap-2">
              {products.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSearch(p.barcode || p.sku)}
                  className="px-2.5 py-1 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200 text-xs font-mono transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-brand-600" />
                  <span>{p.barcode || p.sku} ({p.name.slice(0, 15)}...)</span>
                </button>
              ))}
            </div>
          </div>

          {/* Matched Product Preview */}
          {matchedProduct ? (
            <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-2xl border-2 border-emerald-300 space-y-4 animate-fade-in">
              <div className="flex items-start gap-4">
                <img
                  src={matchedProduct.image || "/images/categories/vegetables.png"}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover border border-emerald-200 bg-white shadow-sm shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900">
                      Match Found ✓
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-800">
                      {matchedProduct.sku}
                    </span>
                  </div>
                  <h4 className="font-bold text-brand-950 text-base mt-1 truncate">
                    {matchedProduct.name}
                  </h4>
                  <div className="text-xs text-brand-700 mt-1 flex items-center gap-3">
                    <span>Price: <strong>{formatINR(matchedProduct.weights[0]?.price ?? matchedProduct.price)}</strong></span>
                    <span>·</span>
                    <span>Stock: <strong>{matchedProduct.currentStock} units</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Focus Selector */}
              <div className="pt-2 border-t border-emerald-200/60">
                <label className="text-xs font-bold text-emerald-900 mb-2 block">
                  Where should the cursor focus in the spreadsheet?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTargetField("currentStock")}
                    className={cn(
                      "p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition",
                      targetField === "currentStock"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                        : "bg-white text-brand-800 border-emerald-200 hover:bg-emerald-50"
                    )}
                  >
                    <Boxes className="w-4 h-4" />
                    <span>Focus Stock Qty Cell</span>
                  </button>
                  <button
                    onClick={() => setTargetField("price")}
                    className={cn(
                      "p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition",
                      targetField === "price"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                        : "bg-white text-brand-800 border-emerald-200 hover:bg-emerald-50"
                    )}
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Focus Price Cell</span>
                  </button>
                </div>
              </div>
            </div>
          ) : inputVal && !errorMsg ? (
            <div className="p-8 text-center text-brand-400 font-medium bg-brand-50/50 rounded-2xl border border-dashed border-brand-200">
              Searching for product...
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-brand-100 bg-brand-50/50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-brand-200 text-brand-700 font-bold text-xs hover:bg-white transition"
          >
            Cancel
          </button>
          <button
            disabled={!matchedProduct}
            onClick={() => {
              if (matchedProduct) {
                onSelectProductCell(matchedProduct.id, targetField);
                onClose();
              }
            }}
            className={cn(
              "px-6 py-2.5 rounded-xl font-extrabold text-xs shadow-lg transition flex items-center gap-2",
              matchedProduct
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white cursor-pointer"
                : "bg-brand-200 text-brand-400 cursor-not-allowed"
            )}
          >
            <span>Jump to Cell in Spreadsheet</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
