import Link from "next/link";
import { Check, Download, Mail, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/primitives";
import { getProduct } from "@/lib/mock-data";

export default function CheckoutSuccessPage({ params, searchParams }: { params: { slug: string }; searchParams: { email?: string; provider?: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();
  const email = searchParams.email || "بريدك الإلكتروني";
  return <main className="mx-auto max-w-2xl px-5 py-16 text-center lg:py-24"><div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-mint text-[#27634c]"><Check size={38} strokeWidth={2.5} /></div><p className="mt-7 text-xs font-black uppercase tracking-[.2em] text-[#3f8f79]">تمت العملية بنجاح</p><h1 className="mt-4 text-4xl font-black tracking-tight text-ink dark:text-white">منتجك جاهز لك.</h1><p className="mx-auto mt-4 max-w-md leading-7 text-slate-500 dark:text-slate-400">أرسلنا رابط التحميل ومفتاح الترخيص إلى <strong className="text-ink dark:text-white">{email}</strong>.</p><Card className="mt-10 p-6 text-right shadow-none"><div className="flex items-center gap-4"><img src={product.thumbnail} alt="" className="h-16 w-16 rounded-xl object-cover" /><div><h2 className="font-black text-ink dark:text-white">{product.title}</h2><p className="mt-1 text-xs text-slate-400">ترخيص شخصي · 3 تنزيلات متاحة</p></div></div><div className="mt-6 rounded-xl bg-sand p-4 dark:bg-white/5"><p className="text-xs text-slate-400">مفتاح الترخيص</p><p className="mt-2 font-mono text-lg font-bold tracking-widest text-ink dark:text-white">DM-{product.id.toUpperCase()}-2026-AR</p></div><a href={`/api/download?path=${product.slug}.zip&expires=${encodeURIComponent(new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString())}`} className="mt-5 block"><Button size="lg" className="w-full">تحميل {product.title} <Download size={18} /></Button></a></Card><div className="mt-7 flex flex-wrap items-center justify-center gap-5 text-xs text-slate-400"><span className="flex items-center gap-2"><Mail size={14} /> تحقق من بريدك</span><span className="flex items-center gap-2"><ShieldCheck size={14} /> رابط صالح لـ 48 ساعة</span></div><Link href="/" className="mt-10 inline-block text-sm font-bold text-coral">العودة إلى السوق</Link></main>;
}
