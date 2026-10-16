import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, LockKeyhole, Store } from "lucide-react";
import { Badge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

type Product = { id:string; slug:string; title:string; description:string; price:number; currency:"EGP"|"USD"; category:string; thumbnail:string|null; thumbnail_url:string|null; preview_url:string|null; sales_count:number; views:number; profiles:{store_name:string|null;bio:string|null}|{store_name:string|null;bio:string|null}[]|null };
async function fetchProduct(slug:string) {
 const db=createSupabaseServerClient();
 const {data,error}=await db.from("products").select("id,slug,title,description,price,currency,category,thumbnail,thumbnail_url,preview_url,sales_count,views,profiles(store_name,bio)").eq("slug",slug).eq("is_published",true).maybeSingle();
 if(error) console.error("Product lookup failed:",error.message);
 if(data) void db.from("products").update({views:(data.views??0)+1}).eq("id",data.id);
 return data as Product|null;
}
export async function generateMetadata({params}:{params:{slug:string}}):Promise<Metadata>{const p=await fetchProduct(params.slug);return p?{title:p.title,description:p.description,openGraph:{title:p.title,description:p.description,images:[p.thumbnail_url||p.thumbnail||""]}}:{title:"المنتج غير موجود"}}
export default async function ProductPage({params}:{params:{slug:string}}){
 const p=await fetchProduct(params.slug);if(!p)notFound();
 const seller=Array.isArray(p.profiles)?p.profiles[0]:p.profiles;
 const image=p.thumbnail_url||p.thumbnail;
 return <main className="mx-auto max-w-7xl px-5 py-10 lg:py-16"><div className="mb-8 flex items-center gap-2 text-sm text-slate-400"><Link href="/" className="hover:text-coral">السوق</Link><span>/</span><span>{p.category}</span></div><div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-start"><div><div className="overflow-hidden rounded-[30px] bg-sand dark:bg-[#202b38]">{image?<img src={image} alt={p.title} className="aspect-[1.35] w-full object-cover"/>:<div className="grid aspect-[1.35] place-items-center text-coral"><Store size={48}/></div>}</div><div className="mt-6 rounded-2xl border border-line p-5 dark:border-white/10"><p className="font-black text-ink dark:text-white">{seller?.store_name||"بائع على Digital Market"}</p><p className="mt-2 text-sm leading-7 text-slate-500">{seller?.bio||"منتج رقمي منشور على المنصة."}</p></div></div><div className="lg:sticky lg:top-28"><Badge className="bg-mint text-[#27634c]">{p.category||"منتج رقمي"}</Badge><h1 className="mt-5 text-4xl font-black leading-tight text-ink sm:text-5xl dark:text-white">{p.title}</h1><p className="mt-5 whitespace-pre-wrap text-lg leading-8 text-slate-600 dark:text-slate-300">{p.description}</p><div className="mt-7 flex items-end justify-between border-b border-line pb-7 dark:border-white/10"><span className="text-4xl font-black text-ink dark:text-white">{formatPrice(Number(p.price),p.currency)}</span><span className="text-xs text-slate-400">{p.sales_count} مبيعة · {p.views} مشاهدة</span></div><Link href={`/checkout/${p.slug}`} className="mt-7 block"><Button size="lg" className="w-full">اشترِ الآن <ArrowLeft size={18}/></Button></Link><div className="mt-7 grid grid-cols-2 gap-3 text-xs text-slate-500"><span className="flex items-center gap-2"><LockKeyhole size={15} className="text-coral"/> تنزيل محمي</span><span className="flex items-center gap-2"><Download size={15} className="text-coral"/> حد تنزيلات</span></div></div></div>{p.preview_url&&<section className="mt-12"><h2 className="text-xl font-black text-ink dark:text-white">معاينة المنتج</h2><a className="mt-3 inline-block text-coral underline" href={p.preview_url} target="_blank" rel="noreferrer">افتح المعاينة</a></section>}</main>
}
