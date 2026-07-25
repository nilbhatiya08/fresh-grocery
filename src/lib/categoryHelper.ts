import { categories as initialCategories, type Category } from "@/data/catalog";
import { useAdminStore, type AdminCategory } from "@/store/adminStore";

export type CategoryStatus = "Active" | "Coming Soon" | "Hidden";

/**
 * Returns the effective status of a category.
 * If status is not explicitly defined in persisted state, defaults to "Active" for vegetables and "Coming Soon" for all others.
 */
export function getCategoryStatus(cat?: { slug?: string; name?: string; status?: string }): CategoryStatus {
  if (!cat) return "Coming Soon";
  if (cat.status === "Active" || cat.status === "Coming Soon" || cat.status === "Hidden") {
    return cat.status as CategoryStatus;
  }
  const normalizedSlug = (cat.slug || "").toLowerCase().trim();
  const normalizedName = (cat.name || "").toLowerCase().trim();
  if (normalizedSlug === "vegetables" || normalizedName === "fresh vegetables" || normalizedName === "vegetables") {
    return "Active";
  }
  return "Coming Soon";
}

/**
 * Checks if a given category (by slug or name) is currently set to "Coming Soon".
 * Automatically checks dynamic adminStore state first, then falls back to static catalog.
 */
export function isCategoryComingSoon(
  categorySlugOrName: string,
  adminCategories?: Array<{ slug: string; name: string; status?: string }>
): boolean {
  if (!categorySlugOrName) return false;
  
  // Clean input
  const normalized = categorySlugOrName.toLowerCase().trim();
  if (normalized === "all" || !normalized) return false;

  // Get current categories from store or parameter
  const cats = adminCategories || useAdminStore.getState().categories || initialCategories;
  
  // Find matching category by slug or name
  const match = cats.find(
    (c) => c.slug.toLowerCase() === normalized || c.name.toLowerCase() === normalized
  );

  if (match) {
    return getCategoryStatus(match) === "Coming Soon";
  }

  // Fallback to initialCategories if not found in custom admin store list
  const initialMatch = initialCategories.find(
    (c) => c.slug.toLowerCase() === normalized || c.name.toLowerCase() === normalized
  );
  if (initialMatch) {
    return getCategoryStatus(initialMatch) === "Coming Soon";
  }

  // If unknown category, assume operational only if it's vegetables
  return normalized !== "vegetables" && normalized !== "fresh vegetables";
}
