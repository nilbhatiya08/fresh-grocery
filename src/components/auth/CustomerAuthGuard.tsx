"use client";
import { useEffect, useState } from "react";
import { useCustomerAuth } from "@/store/customerAuth";
import { useRouter, usePathname } from "next/navigation";

export function CustomerAuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, openLoginModal, isLoginModalOpen } = useCustomerAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for Zustand persist hydration
    const timer = setTimeout(() => {
      setIsChecking(false);
      if (!isAuthenticated) {
        openLoginModal(pathname);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, pathname, openLoginModal]);

  useEffect(() => {
    // If the modal is closed and they are still not authenticated, redirect them away
    if (!isChecking && !isAuthenticated && !isLoginModalOpen) {
      router.push("/");
    }
  }, [isChecking, isAuthenticated, isLoginModalOpen, router]);

  if (isChecking || !isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-brand-900">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin mb-4" />
        <p className="font-semibold text-lg">Secure Login Required</p>
        <p className="text-sm text-brand-600 mt-1">Please sign in to access this page.</p>
      </div>
    );
  }

  return <>{children}</>;
}
