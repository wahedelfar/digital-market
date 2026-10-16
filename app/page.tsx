"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search, Sparkles, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/primitives";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";

type Product = { id:string; slug:string; title:string; description:string; price:number; currency:"EGP"|"USD"; category:string; thumbnail:string|null; thumbnail_url:string|null; sales_count:number; profiles:{store_name:string|null}|{store_name:string|null}[]|null };
const categories = ["الكل","كتب","قوالب","كورسات","تصميمات"];

export default function HomePage() {
 const [products,setProducts]=useState<Product[]>([]),[category,setCategory]=useState("الكل"),[query,setQuery]=useState(""),[loading,setLoading]=useState(true),[error,setError]=useState("");
 useEffect(()=>{
  let active=true;
  const loadProducts=async()=>{
   try {
    const db=getSupabaseBrowserClient();
    const {data,error:queryError}=await db.from("products").select("id,slug,title,description,price,currency,category,thumbnail,thumbnail_url,sales_count,profiles(store_name)").eq("is_published",true).order("created_at",{ascending:false});
    if(!active)return;
    if(queryError)setError("تعذر تحميل المنتجات. تحقق من اتصال قاعدة البيانات وسياسات الوصول.");
    setProducts((data??[]) as Product[]);
   } catch (cause) {
    if(!active)return;
    console.error("Homepage product loading failed:",cause);
    setError("تعذر الاتصال بقاعدة البيانات حاليًا. حاول تحديث الصفحة بعد قليل.");
   } finally {
    if(active)setLoading(false);
   }
  };
  void loadProducts();
  return()=>{active=false};
 },[]);
 const visible=useMemo(()=>products.filter(p=>(category==="الكل"||p.category===category)&&`${p.title} ${p.description} ${Array.isArray(p.profiles)?p.profiles[0]?.store_name:p.profiles?.store_name}`.toLowerCase().includes(query.toLowerCase())),[products,category,query]);
 return <main>
 <section className="relative overflow-hidden border-b border-line dark:border-white/10"><div className="grid-paper absolute inset-0 opacity-60"/><div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:py-24"><div><Badge className="mb-6 bg-mint text-[#27634c]"><Sparkles size={13} className="ml-1"/> سوق رقمي عربي</Badge><h1 className="text-5xl font-black leading-tight tracking-tight text-ink sm:text-7xl dark:text-white">حوّل خبرتك<br/><span className="text-coral">إلى دخل.</span></h1><p className="mt-7 max-w-lg text-lg leading-8 text-slate-600 dark:text-slate-300">أول منصة عربية للمنتجات الرقمية. اكتشف منتجات حقيقية أو ابدأ بيع خبرتك في مكان واحد.</p><div className="mt-9 flex flex-wrap gap-3"><a href="#discover"><Button size="lg">اكتشف المنتجات <ArrowLeft size={18}/></Button></a><Link href="/auth/register"><Button size="lg" variant="outline">أضف منتجك <Upload size={17}/></Button></Link></div></div><div className="grid-paper rounded-[30px] bg-sand p-8 dark:bg-[#202b38] sm:p-12"><div className="text-xs font-bold tracking-widest text-coral">DIGITAL MARKET / 2026</div><div className="mt-16 text-4xl font-black text-ink dark:text-white">أفكار صغيرة.<br/><span className="text-coral">أثر كبير.</span></div><p className="mt-5 text-slate-500">ملفات، قوالب، كتب ودورات من صناع المحتوى.</p></div></div></section>
 <section id="discover" className="mx-auto max-w-7xl px-5 py-20"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="mb-3 text-xs font-black uppercase tracking-[.2em] text-coral">السوق الحقيقي</p><h2 className="text-4xl font-black text-ink dark:text-white">منتجات تستحق وقتك.</h2></div><div className="flex items-center gap-3"><Search size={18} className="text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="ابحث عن منتج..." className="h-12 rounded-full border border-line bg-white px-5 text-sm outline-none focus:border-coral dark:border-white/10 dark:bg-[#202b38] dark:text-white"/></div></div>
 <div className="mt-8 flex gap-2 overflow-x-auto">{categories.map(c=><button key={c} onClick={()=>setCategory(c)} className={`rounded-full border px-4 py-2 text-sm font-bold ${category===c?"border-ink bg-ink text-white":"border-line bg-white text-slate-600 dark:border-white/10 dark:bg-[#202b38] dark:text-slate-300"}`}>{c}</button>)}</div>
 {loading?<div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3,4,5,6].map(n=><div key={n} className="h-72 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800"/>)}</div>:error?<p role="alert" className="mt-8 rounded-xl bg-red-50 p-5 text-red-700">{error}</p>:visible.length?<div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{visible.map(p=><Link key={p.id} href={`/p/${p.slug}`} className="group overflow-hidden rounded-[24px] border border-line bg-white transition hover:-translate-y-1 hover:shadow-soft dark:border-white/10 dark:bg-[#202b38]"><div className="aspect-[1.3] bg-sand">{p.thumbnail_url||p.thumbnail?<img src={(p.thumbnail_url||p.thumbnail)!} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105"/>:<div className="grid h-full place-items-center"><Sparkles className="text-coral" size={32}/></div>}</div><div className="p-5"><p className="text-xs font-bold text-coral">{p.category}</p><h3 className="mt-2 text-xl font-black text-ink dark:text-white">{p.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{p.description}</p><div className="mt-5 flex justify-between"><strong className="text-lg text-ink dark:text-white">{formatPrice(Number(p.price),p.currency)}</strong><span className="text-xs text-slate-400">{p.sales_count} مبيعة</span></div></div></Link>)}</div>:<div className="mt-10 rounded-3xl border border-dashed border-line py-20 text-center"><p className="font-bold text-ink dark:text-white">{products.length?"لا توجد نتائج مطابقة.":"لا توجد منتجات منشورة حتى الآن."}</p><Link href="/auth/register" className="mt-4 inline-block font-bold text-coral">ابدأ البيع الآن</Link></div>}
 </section></main>;
}
