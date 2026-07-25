"use client";
import { useState } from "react";
import { Image as ImageIcon, Plus, Edit, Trash2, Check, X, ExternalLink, Sparkles, Layers } from "lucide-react";
import { useAdminAuth } from "@/store/adminAuth";
import { useToasts } from "@/store/shop";
import { cn } from "@/lib/utils";

interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  position: "Hero Carousel" | "Category Strip" | "Offer Popup" | "Footer Promo";
  status: "Active" | "Inactive";
  order: number;
}

export function BannerManagement() {
  const { hasPermission } = useAdminAuth();
  const pushToast = useToasts((s) => s.push);

  const [banners, setBanners] = useState<BannerItem[]>([
    { id: "ban-1", title: "Fresh Organic Mangoes 30% Off", subtitle: "Direct from Ratnagiri farms delivered in 30 minutes", image: "/images/categories/fruits.png", link: "/category/fruits", position: "Hero Carousel", status: "Active", order: 1 },
    { id: "ban-2", title: "Daily Dairy & Breakfast Essentials", subtitle: "Free delivery on orders above ₹299", image: "/images/categories/dairy.png", link: "/category/dairy", position: "Hero Carousel", status: "Active", order: 2 },
    { id: "ban-3", title: "Midnight Snack Fiesta — Flat 50% Off", subtitle: "Haldiram's, chips and beverages", image: "/images/categories/snacks.png", link: "/category/snacks", position: "Category Strip", status: "Active", order: 3 },
    { id: "ban-4", title: "100% Pure Cold-Pressed Cooking Oils", subtitle: "Health and wellness starts in your kitchen", image: "/images/categories/essentials.png", link: "/category/essentials", position: "Footer Promo", status: "Inactive", order: 4 }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  const [formData, setFormData] = useState<Partial<BannerItem>>({});

  const canEdit = hasPermission("banners.edit");

  const handleOpenAdd = () => {
    if (!canEdit) {
      pushToast("Permission denied: You need 'banners.edit' permission", "info");
      return;
    }
    setEditingBanner(null);
    setFormData({
      title: "Weekend Organic Harvest Sale",
      subtitle: "Up to 40% discount on fresh vegetables and fruits",
      image: "/images/categories/vegetables.png",
      link: "/category/vegetables",
      position: "Hero Carousel",
      status: "Active",
      order: banners.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ban: BannerItem) => {
    if (!canEdit) {
      pushToast("Permission denied", "info");
      return;
    }
    setEditingBanner(ban);
    setFormData({ ...ban });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.image) {
      pushToast("Banner Title and Image URL are required", "info");
      return;
    }

    if (editingBanner) {
      setBanners((prev) => prev.map((b) => (b.id === editingBanner.id ? { ...b, ...formData } as BannerItem : b)));
      pushToast(`Updated banner "${formData.title}"`, "success");
    } else {
      const newB: BannerItem = {
        id: `ban-${Date.now()}`,
        title: formData.title,
        subtitle: formData.subtitle || "",
        image: formData.image,
        link: formData.link || "/",
        position: formData.position || "Hero Carousel",
        status: formData.status || "Active",
        order: formData.order || banners.length + 1
      };
      setBanners((prev) => [...prev, newB]);
      pushToast(`Created banner "${formData.title}"`, "success");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (!canEdit) {
      pushToast("Permission denied", "info");
      return;
    }
    if (window.confirm(`Are you sure you want to delete banner "${title}"?`)) {
      setBanners((prev) => prev.filter((b) => b.id !== id));
      pushToast(`Deleted banner "${title}"`, "info");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-brand-100 dark:border-zinc-800 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-brand-950 dark:text-zinc-100 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" /> Promotional Banners
          </h2>
          <p className="text-xs text-brand-600 dark:text-zinc-400 mt-0.5">
            Manage storefront marketing sliders, category discount banners, and offer popups.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white text-xs font-bold flex items-center gap-2 shadow-glow-cta transition active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Banner
        </button>
      </div>

      {/* Banners Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {banners.map((ban) => (
          <div key={ban.id} className="bg-white dark:bg-zinc-900 rounded-3xl border border-brand-100 dark:border-zinc-800 overflow-hidden shadow-soft hover:shadow-lift transition flex flex-col justify-between group">
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-100 dark:bg-brand-900/60 text-brand-800 dark:text-brand-300 px-2.5 py-0.5 rounded-full">
                  {ban.position}
                </span>
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", ban.status === "Active" ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400")}>
                  {ban.status}
                </span>
              </div>

              <div className="font-display font-bold text-lg text-brand-950 dark:text-zinc-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
                {ban.title}
              </div>
              <p className="text-xs text-brand-600 dark:text-zinc-400">{ban.subtitle}</p>

              <div className="p-3 rounded-2xl bg-brand-50 dark:bg-zinc-800 border border-brand-100 dark:border-zinc-700 font-mono text-[11px] text-brand-700 dark:text-zinc-300 truncate">
                🔗 Target Link: <span className="text-brand-950 dark:text-zinc-100 font-bold">{ban.link}</span>
              </div>
            </div>

            <div className="px-5 py-3 bg-brand-50/60 dark:bg-zinc-800/60 border-t border-brand-100 dark:border-zinc-800 flex items-center justify-between text-xs text-brand-600 dark:text-zinc-400">
              <span className="font-bold">Priority Order: #{ban.order}</span>
              <div className="flex items-center gap-1.5">
                <button onClick={() => handleOpenEdit(ban)} className="p-1.5 rounded-lg hover:bg-brand-100 text-brand-700 dark:text-zinc-300 transition" title="Edit">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(ban.id, ban.title)} className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600 transition" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-950/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-lg w-full p-6 border border-brand-100 dark:border-zinc-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-brand-100 dark:border-zinc-800 pb-4">
              <h3 className="font-display text-xl font-bold text-brand-950 dark:text-zinc-100 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-brand-600" /> {editingBanner ? `Edit Banner: ${editingBanner.title}` : "Create New Banner"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-brand-700 hover:text-brand-950">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-brand-900 dark:text-zinc-200 mb-1">Banner Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fresh Organic Mangoes 30% Off"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-brand-50/70 dark:bg-zinc-800 border border-brand-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-bold text-sm text-brand-950 dark:text-zinc-100 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-900 dark:text-zinc-200 mb-1">Subtitle / Offer Description</label>
                <input
                  type="text"
                  placeholder="e.g. Direct from Ratnagiri farms delivered in 30 minutes"
                  value={formData.subtitle || ""}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full bg-brand-50/70 dark:bg-zinc-800 border border-brand-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-brand-900 dark:text-zinc-200 mb-1">Display Position</label>
                  <select
                    value={formData.position || "Hero Carousel"}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value as any })}
                    className="w-full bg-brand-50/70 dark:bg-zinc-800 border border-brand-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-semibold text-brand-950 dark:text-zinc-100 outline-none"
                  >
                    <option value="Hero Carousel">Hero Carousel</option>
                    <option value="Category Strip">Category Strip</option>
                    <option value="Offer Popup">Offer Popup</option>
                    <option value="Footer Promo">Footer Promo</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-brand-900 dark:text-zinc-200 mb-1">Display Priority Order</label>
                  <input
                    type="number"
                    value={formData.order || 1}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 1 })}
                    className="w-full bg-brand-50/70 dark:bg-zinc-800 border border-brand-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-brand-900 dark:text-zinc-200 mb-1">Target Click URL *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /category/fruits"
                  value={formData.link || ""}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full bg-brand-50/70 dark:bg-zinc-800 border border-brand-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 font-mono text-brand-950 dark:text-zinc-100 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-900 dark:text-zinc-200 mb-1">Banner Image URL *</label>
                <input
                  type="text"
                  required
                  value={formData.image || ""}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-brand-50/70 dark:bg-zinc-800 border border-brand-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 font-mono text-brand-950 dark:text-zinc-100 outline-none"
                />
              </div>

              <div className="p-3 bg-brand-50 dark:bg-zinc-800 rounded-2xl border border-brand-100 dark:border-zinc-700 flex items-center justify-between">
                <span className="font-bold">Active Status</span>
                <input
                  type="checkbox"
                  checked={formData.status === "Active"}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked ? "Active" : "Inactive" })}
                  className="w-4 h-4 rounded border-brand-300 text-brand-600 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-brand-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border font-semibold text-brand-800 dark:text-zinc-300 hover:bg-brand-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 text-white font-bold shadow-glow-cta transition active:scale-95"
                >
                  {editingBanner ? "Save Banner" : "Create Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
