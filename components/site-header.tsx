"use client";

import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#121a24]/90"><div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5"><Link href="/" className="group flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-[13px] bg-ink text-xl font-black text-coral transition group-hover:rotate-3 dark:bg-white">D</span><span className="text-[17px] font-black tracking-tight text-ink dark:text-white">digital<span className="text-coral">.</span>market</span></Link><nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex dark:text-slate-300"><Link href="/#discover" className="transition hover:text-coral">اكتشف المنتجات</Link><Link href="/dashboard" className="transition hover:text-coral">لوحة البائع</Link><Link href="/dashboard/new" className="transition hover:text-coral">بع منتجك</Link></nav><div className="flex items-center gap-2"><div className="hidden items-center gap-2 sm:flex"><Link href="/dashboard"><Button size="sm" variant="outline">تسجيل الدخول</Button></Link><Link href="/dashboard/new"><Button size="sm">ابدأ البيع</Button></Link></div><ThemeToggle /><button aria-label="فتح القائمة" onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-full border border-line md:hidden dark:border-white/10">{open ? <X size={18} /> : <Menu size={18} />}</button></div></div>{open && <div className="border-t border-line bg-paper px-5 py-5 md:hidden dark:border-white/10 dark:bg-[#121a24]"><div className="flex flex-col gap-4 text-sm font-semibold"><Link onClick={() => setOpen(false)} href="/#discover">اكتشف المنتجات</Link><Link onClick={() => setOpen(false)} href="/dashboard">لوحة البائع</Link><Link onClick={() => setOpen(false)} href="/dashboard/new">بع منتجك</Link><Link href="/dashboard" className="mt-2"><Button className="w-full">الدخول إلى حسابك</Button></Link></div></div>}</header>;
}
