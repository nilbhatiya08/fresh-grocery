"use client";
import { useState } from "react";
import { FolderTree, Plus, Edit, Trash2, Check, X, Star, Eye, Layers, Image as ImageIcon, Sparkles } from "lucide-react";
import { useAdminStore, type AdminCategory } from "@/store/adminStore";
import { useAdminAuth } from "@/store/adminAuth";
import { useToasts } from "@/store/shop";
import { cn } from "@/lib/utils";
import { getCategoryStatus } from "@/lib/categoryHelper";

export function CategoryManagement() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdminStore();
  const { user, hasPermission } = useAdminAuth();
  const pushToast = useToasts((s) => s.push);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<AdminCategory | null>(null);
  const [formData, setFormData] = useState<Partial<AdminCategory>>({});

  const canEdit = hasPermission("categories.edit");

  const handleOpenAdd = () => {
    if (!canEdit) {
      pushToast("Permission denied: You need 'categories.edit' permission", "info");
      return;
    }
    setEditingCat(null);
    setFormData({
      name: "",
      slug: "",
      icon: "🥗",
      image: "/images/categories/vegetables.png",
      count: 0,
      featured: true,
      status: "Coming Soon",
      order: categories.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: AdminCategory) => {
    if (!canEdit) {
      pushToast("Permission denied: You need 'categories.edit' permission", "info");
      return;
    }
    setEditingCat(cat);
    setFormData({ ...cat, status: getCategoryStatus(cat) });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      pushToast("Category Name and Slug are required", "info");
      return;
    }

    const u = user?.name || "Super Admin";
    const r = user?.role || "Super Admin";

    if (editingCat) {
      updateCategory(editingCat.slug, formData as Partial<AdminCategory>, u, r);
      pushToast(`Updated category "${formData.name}"`, "success");
    } else {
      addCategory(
        {
          name: formData.name,
          slug: formData.slug,
          icon: formData.icon || "🛒",
          image: formData.image || "/images/categories/vegetables.png",
          count: 0,
          featured: formData.featured ?? false,
          status: formData.status || "Coming Soon",
          order: formData.order ?? categories.length + 1
        },
        u,
        r
      );
      pushToast(`Created category "${formData.name}"`, "success");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (slug: string, name: string) => {
    if (!canEdit) {
      pushToast("Permission denied", "info");
      return;
    }
    if (window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      deleteCategory(slug, user?.name || "Super Admin", user?.role || "Super Admin");
      pushToast(`Deleted category "${name}"`, "info");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-brand-100 dark:border-zinc-800 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-brand-950 dark:text-zinc-100 flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-brand-600 dark:text-brand-400" /> Category Management
          </h2>
          <p className="text-xs text-brand-600 dark:text-zinc-400 mt-0.5">
            Organize product hierarchy, storefront navigation icons, and featured homepage banners.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white text-xs font-bold flex items-center gap-2 shadow-glow-cta transition active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Category
        </button>
      </div>

      {/* Categories Grid / List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const status = getCategoryStatus(cat);
          return (
            <div key={cat.slug} className="bg-white dark:bg-zinc-900 rounded-3xl border border-brand-100 dark:border-zinc-800 p-5 shadow-soft hover:shadow-lift transition flex flex-col justify-between space-y-4 group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-zinc-800 flex items-center justify-center text-2xl group-hover:scale-110 transition shadow-sm">
                    {cat.icon}
                  </div>
                  <div>
                    <div className="font-display font-bold text-base text-brand-950 dark:text-zinc-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
                      {cat.name}
                    </div>
                    <div className="text-xs font-mono text-brand-600 dark:text-zinc-500">/{cat.slug}</div>
                  </div>
                </div>
                {cat.featured && (
                  <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> Featured
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-brand-700 dark:text-zinc-400 pt-2 border-t border-brand-100/60 dark:border-zinc-800">
                <div className="flex items-center gap-1.5 font-semibold">
                  <Layers className="w-3.5 h-3.5 text-brand-500" /> {cat.count} Products
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      const newStatus = status === "Active" ? "Coming Soon" : "Active";
                      updateCategory(cat.slug, { status: newStatus }, user?.name || "Super Admin", user?.role || "Super Admin");
                      pushToast(`"${cat.name}" is now ${newStatus}!`, "success");
                    }}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 border shadow-sm",
                      status === "Active"
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
                        : "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800"
                    )}
                    title="Click to toggle between Active and Coming Soon"
                  >
                    {status === "Active" ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <span>🚀</span>
                        <span>Soon</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-zinc-800 text-brand-700 dark:text-zinc-300 transition"
                    title="Edit Category"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.slug, cat.name)}
                    className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-600 dark:text-rose-400 transition"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-950/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-lg w-full p-6 border border-brand-100 dark:border-zinc-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-brand-100 dark:border-zinc-800 pb-4">
              <h3 className="font-display text-xl font-bold text-brand-950 dark:text-zinc-100 flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-brand-600" /> {editingCat ? `Edit Category: ${editingCat.name}` : "Create New Category"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-brand-700 hover:text-brand-950">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-brand-900 dark:text-zinc-200 mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Milk & Dairy"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") })}
                    className="w-full bg-brand-50/70 dark:bg-zinc-800 border border-brand-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-semibold text-sm text-brand-950 dark:text-zinc-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-brand-900 dark:text-zinc-200 mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug || ""}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-brand-50/70 dark:bg-zinc-800 border border-brand-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 font-mono text-brand-950 dark:text-zinc-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-brand-900 dark:text-zinc-200 mb-1">Emoji / Icon *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 🥛 or 🥑"
                    value={formData.icon || ""}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full bg-brand-50/70 dark:bg-zinc-800 border border-brand-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xl text-center outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-brand-900 dark:text-zinc-200 mb-1">Display Order Priority</label>
                  <input
                    type="number"
                    value={formData.order || 1}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 1 })}
                    className="w-full bg-brand-50/70 dark:bg-zinc-800 border border-brand-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-brand-900 dark:text-zinc-200 mb-1">Banner Image URL</label>
                <input
                  type="text"
                  value={formData.image || ""}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-brand-50/70 dark:bg-zinc-800 border border-brand-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 font-mono text-brand-950 dark:text-zinc-100 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-900 dark:text-zinc-200 mb-1">Operational Status *</label>
                <select
                  value={getCategoryStatus(formData as any)}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full bg-brand-50/70 dark:bg-zinc-800 border border-brand-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-bold text-brand-950 dark:text-zinc-100 outline-none"
                >
                  <option value="Active">✅ Active (Fully Operational)</option>
                  <option value="Coming Soon">🚀 Coming Soon (Waitlist & VIP Preview)</option>
                  <option value="Hidden">👁️ Hidden (Private / Internal)</option>
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-brand-50 dark:bg-zinc-800 flex items-center justify-between border border-brand-100 dark:border-zinc-700">
                <div>
                  <div className="font-bold text-sm text-brand-950 dark:text-zinc-100">Featured on Storefront Homepage</div>
                  <div className="text-[11px] text-brand-600 dark:text-zinc-400">Display in primary navigation grid</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.featured ?? false}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5 rounded border-brand-300 text-brand-600 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-brand-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-brand-200 dark:border-zinc-700 font-semibold text-brand-800 dark:text-zinc-300 hover:bg-brand-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 text-white font-bold shadow-glow-cta transition active:scale-95"
                >
                  {editingCat ? "Save Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
