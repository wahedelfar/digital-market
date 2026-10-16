import Link from "next/link";
import { BarChart3, ChevronLeft, CircleDollarSign, LayoutDashboard, Package, Plus, Settings, ShoppingBag, Wallet } from "lucide-react";

const links = [
  { href: "/dashboard", label: "نظرة عامة", icon: LayoutDashboard },
  { href: "/dashboard/products", label: "منتجاتي", icon: Package },
  { href: "/dashboard/sales", label: "المبيعات", icon: ShoppingBag },
  { href: "/dashboard/payouts", label: "السحوبات", icon: Wallet },
  { href: "/dashboard/settings", label: "الإعدادات", icon: Settings }
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <main className="min-h-[calc(100vh-76px)] bg-[#f3f2ee] dark:bg-[#121a24]"><div className="mx-auto flex max-w-7xl gap-8 px-5 py-8 lg:py-10"><aside className="hidden w-56 shrink-0 lg:block"><div className="sticky top-28"><div className="mb-8 flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-sm font-black text-coral dark:bg-white">أث</div><div><p className="text-sm font-black text-ink dark:text-white">استوديو أثر</p><p className="text-xs text-slate-400">حساب البائع</p></div></div><Link href="/dashboard/new" className="mb-7 flex h-11 items-center justify-center gap-2 rounded-xl bg-coral text-sm font-bold text-white shadow-lg shadow-coral/20 transition hover:bg-[#e75c42]"><Plus size={16} /> منتج جديد</Link><nav className="space-y-1">{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-ink dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"><Icon size={18} />{label}</Link>)}</nav><div className="mt-12 rounded-2xl bg-ink p-4 text-white"><CircleDollarSign size={19} className="text-coral" /><p className="mt-4 text-xs text-slate-400">الرصيد المتاح</p><p className="mt-1 text-xl font-black">١٬٢٤٠ ج.م</p><Link href="/dashboard/payouts" className="mt-4 flex items-center justify-between text-xs font-bold text-coral">طلب سحب <ChevronLeft size={14} /></Link></div></div></aside><div className="min-w-0 flex-1">{children}</div></div></main>;
}
