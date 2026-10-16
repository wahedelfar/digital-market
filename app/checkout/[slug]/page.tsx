import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { notFound } from "next/navigation";
import { CheckoutForm } from "@/components/checkout-form";
import { Badge } from "@/components/ui/primitives";
import { getProduct } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> { const product = getProduct(params.slug); return { title: product ? `إتمام شراء ${product.title}` : "إتمام الشراء" }; }

export default function CheckoutPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();
  return <main className="mx-auto max-w-6xl px-5 py-12 lg:py-20"><Link href={`/p/${product.slug}`} className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-coral"><ArrowRight size={16} /> العودة إلى المنتج</Link><div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start"><div><Badge className="bg-mint text-[#27634c]">خطوة أخيرة</Badge><h1 className="mt-5 text-4xl font-black tracking-tight text-ink dark:text-white">أكمل طلبك بهدوء.</h1><p className="mt-3 max-w-lg text-slate-500 dark:text-slate-400">أدخل بريدك، اختر طريقة الدفع، واستلم منتجك فور تأكيد العملية.</p><div className="mt-9 max-w-xl"><CheckoutForm product={product} /></div></div><aside className="rounded-[26px] border border-line bg-white p-5 shadow-card dark:border-white/10 dark:bg-[#202b38] lg:sticky lg:top-28"><img src={product.thumbnail} alt="" className="aspect-[1.7] w-full rounded-2xl object-cover" /><div className="mt-5 flex items-start justify-between gap-3"><div><p className="text-xs text-slate-400">أنت تشتري</p><h2 className="mt-1 font-black text-ink dark:text-white">{product.title}</h2></div><span className="font-black text-ink dark:text-white">{formatPrice(product.price, product.currency)}</span></div><div className="my-5 border-t border-dashed border-line dark:border-white/10" /><div className="flex items-center justify-between text-sm"><span className="text-slate-500">الإجمالي</span><span className="text-lg font-black text-ink dark:text-white">{formatPrice(product.price, product.currency)}</span></div><p className="mt-5 flex items-center gap-2 text-xs text-slate-400"><LockKeyhole size={14} className="text-coral" /> عملية دفع آمنة 100%</p></aside></div></main>;
}
