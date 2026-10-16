import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { notFound } from "next/navigation";
import { CheckoutForm } from "@/components/checkout-form";
import { Badge } from "@/components/ui/primitives";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

type Product = { id: string; slug: string; title: string; description: string; price: number; currency: "EGP" | "USD"; thumbnail_url: string | null; is_published: boolean; published: boolean };

async function findProduct(slug: string): Promise<Product | null> {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("products").select("id,slug,title,description,price,currency,thumbnail_url,is_published,published").eq("slug", slug).maybeSingle();
  if (!data || !(data.is_published || data.published)) return null;
  return data as Product;
}
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await findProduct(params.slug);
  return { title: product ? `إتمام شراء ${product.title}` : "إتمام الشراء" };
}
export default async function CheckoutPage({ params }: { params: { slug: string } }) {
  const product = await findProduct(params.slug);
  if (!product) notFound();
  return <main className="mx-auto max-w-6xl px-5 py-12 lg:py-20"><Link href={`/p/${product.slug}`} className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-coral"><ArrowRight size={16}/> العودة إلى المنتج</Link><div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start"><div><Badge className="bg-mint text-[#27634c]">طلب المنتج</Badge><h1 className="mt-5 text-4xl font-black tracking-tight text-ink dark:text-white">أكمل طلبك.</h1><p className="mt-3 max-w-lg text-slate-500 dark:text-slate-400">أدخل بريدك لإنشاء طلب شراء. لن يتاح الملف إلا بعد تأكيد الدفع.</p><div className="mt-9 max-w-xl"><CheckoutForm product={product}/></div></div><aside className="rounded-[26px] border border-line bg-white p-5 shadow-card dark:border-white/10 dark:bg-[#202b38] lg:sticky lg:top-28">{product.thumbnail_url ? <img src={product.thumbnail_url} alt="" className="aspect-[1.7] w-full rounded-2xl object-cover"/> : <div className="grid aspect-[1.7] w-full place-items-center rounded-2xl bg-sand text-slate-400">منتج رقمي</div>}<div className="mt-5 flex items-start justify-between gap-3"><div><p className="text-xs text-slate-400">أنت تطلب</p><h2 className="mt-1 font-black text-ink dark:text-white">{product.title}</h2></div><span className="font-black text-ink dark:text-white">{formatPrice(product.price, product.currency)}</span></div><div className="my-5 border-t border-dashed border-line dark:border-white/10"/><div className="flex items-center justify-between text-sm"><span className="text-slate-500">الإجمالي</span><span className="text-lg font-black text-ink dark:text-white">{formatPrice(product.price, product.currency)}</span></div><p className="mt-5 flex items-center gap-2 text-xs text-slate-400"><LockKeyhole size={14} className="text-coral"/> الدفع غير مفعّل بعد</p></aside></div></main>;
}
