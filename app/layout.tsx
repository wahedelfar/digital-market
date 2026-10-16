import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: { default: "Digital Market — سوق المنتجات الرقمية العربي", template: "%s — Digital Market" },
  description: "اكتشف منتجات رقمية عربية من كتب وقوالب وكورسات وتصميمات، أو ابدأ ببيع خبرتك اليوم.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: { title: "Digital Market", description: "سوق المنتجات الرقمية العربي", type: "website", siteName: "Digital Market" },
  twitter: { card: "summary_large_image", title: "Digital Market", description: "سوق المنتجات الرقمية العربي" },
  icons: { icon: "/favicon.svg" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl" suppressHydrationWarning><body><SiteHeader />{children}<footer className="mt-24 border-t border-line bg-white dark:border-white/10 dark:bg-[#101720]"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-10 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between"><div><span className="font-black text-ink dark:text-white">digital<span className="text-coral">.</span>market</span><p className="mt-2 text-xs">مساحة أفضل لبيع ما تعرفه.</p></div><div className="flex gap-5"><a href="#discover" className="hover:text-coral">اكتشف</a><a href="/dashboard/new" className="hover:text-coral">بع منتجك</a><a href="/dashboard/settings" className="hover:text-coral">المساعدة</a></div><span className="text-xs">© 2026 Digital Market</span></div></footer></body></html>;
}
