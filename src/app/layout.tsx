import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { JsonLd } from "@/components/seo/JsonLd";
import { CityNotifyAuto } from "@/components/city/CityModal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://farmora.vercel.app"),
  title: {
    default: "Farmora — Farm Fresh Groceries, Delivered in Hours",
    template: "%s · Farmora",
  },
  description:
    "Hand-picked fruits, crisp vegetables, farm-fresh dairy and wholesome pantry staples. Farmora delivers premium, pesticide-tested groceries to your doorstep, same day.",
  keywords: [
    "fresh vegetables online",
    "organic fruits delivery",
    "farm fresh groceries",
    "dairy delivery",
    "healthy food online",
    "same day grocery delivery",
  ],
  authors: [{ name: "Farmora" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Farmora",
    title: "Farmora — Farm Fresh Groceries, Delivered in Hours",
    description:
      "Hand-picked, pesticide-tested produce delivered same-day from partner farms.",
    images: ["/og-cover.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Farmora — Farm Fresh Groceries",
    description: "Premium, same-day grocery delivery from partner farms.",
    images: ["/og-cover.jpg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://farmora.vercel.app" },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "GroceryStore",
  name: "Farmora",
  url: "https://farmora.vercel.app",
  logo: "https://farmora.vercel.app/logo.svg",
  sameAs: [
    "https://instagram.com/farmora",
    "https://facebook.com/farmora",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-1800-000-0000",
    contactType: "customer service",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="bg-cream-50 text-brand-950 antialiased">
        <JsonLd data={organizationSchema} />
        {children}
        <CartDrawer />
        <CityNotifyAuto />
        <Toaster />
      </body>
    </html>
  );
}
