"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/store/adminAuth";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminDashboard } from "@/components/admin/modules/AdminDashboard";
import { ActivityLogsModule } from "@/components/admin/modules/ActivityLogsModule";
import { ProductManagement } from "@/components/admin/modules/ProductManagement";
import { InventoryModule } from "@/components/admin/modules/InventoryModule";
import { CategoryManagement } from "@/components/admin/modules/CategoryManagement";
import { BrandManagement } from "@/components/admin/modules/BrandManagement";
import { OrderManagement } from "@/components/admin/modules/OrderManagement";
import { CustomerCRM } from "@/components/admin/modules/CustomerCRM";
import { CouponManagement } from "@/components/admin/modules/CouponManagement";
import { ReviewManagement } from "@/components/admin/modules/ReviewManagement";
import { SupportManagement } from "@/components/admin/modules/SupportManagement";
import { BannerManagement } from "@/components/admin/modules/BannerManagement";
import { CMSManagement } from "@/components/admin/modules/CMSManagement";
import { DeliveryManagement } from "@/components/admin/modules/DeliveryManagement";
import { NotificationManagement } from "@/components/admin/modules/NotificationManagement";
import { ReportsAnalytics } from "@/components/admin/modules/ReportsAnalytics";
import { SecurityRBAC } from "@/components/admin/modules/SecurityRBAC";
import { SettingsModule } from "@/components/admin/modules/SettingsModule";
import { RefreshCw, ShieldCheck } from "lucide-react";

export default function AdminPortalPage() {
  const router = useRouter();
  const { isAuthenticated, twoFactorPending, user } = useAdminAuth();

  const [activeModule, setActiveModule] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCheckingAuth(false);
      if (!isAuthenticated || twoFactorPending) {
        window.location.href = "/admin/login";
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [isAuthenticated, twoFactorPending]);

  if (isCheckingAuth || !isAuthenticated || twoFactorPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-950 via-zinc-900 to-brand-900 flex flex-col items-center justify-center p-4 text-white space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center text-3xl backdrop-blur-md border border-white/20 shadow-2xl animate-pulse">
          🌿
        </div>
        <div className="flex items-center gap-2 font-display font-bold text-lg text-zinc-200">
          <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" /> Verifying Enterprise Auth Session...
        </div>
        <p className="text-xs text-zinc-400 font-mono">Checking JWT Tokens & Role-Based Access Control matrix...</p>
      </div>
    );
  }

  const renderActiveModule = () => {
    switch (activeModule) {
      case "dashboard":
        return <AdminDashboard onNavigate={(mod) => setActiveModule(mod)} />;
      case "logs":
        return <ActivityLogsModule />;
      case "products":
        return <ProductManagement />;
      case "inventory":
        return <InventoryModule />;
      case "categories":
        return <CategoryManagement />;
      case "brands":
        return <BrandManagement />;
      case "orders":
        return <OrderManagement />;
      case "customers":
        return <CustomerCRM />;
      case "coupons":
        return <CouponManagement />;
      case "reviews":
        return <ReviewManagement />;
      case "support":
        return <SupportManagement />;
      case "banners":
        return <BannerManagement />;
      case "cms":
        return <CMSManagement />;
      case "delivery":
        return <DeliveryManagement />;
      case "notifications":
        return <NotificationManagement />;
      case "reports":
        return <ReportsAnalytics />;
      case "roles":
        return <SecurityRBAC />;
      case "settings":
        return <SettingsModule />;
      default:
        return <AdminDashboard onNavigate={(mod) => setActiveModule(mod)} />;
    }
  };

  return (
    <AdminLayout
      activeModule={activeModule}
      onSelectModule={(mod, q) => {
        setActiveModule(mod);
        if (q) setSearchQuery(q);
      }}
    >
      {renderActiveModule()}
    </AdminLayout>
  );
}
