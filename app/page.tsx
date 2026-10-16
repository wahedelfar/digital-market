"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search, Sparkles, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/primitives";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";

type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  currency: "EGP" | "USD";
  category: string;
  thumbnail: string | null;
  thumbnail_url: string | null;
  sales_count: number;
  profiles: { store_name: string | null } | { store_name: string | null }[] | null;
};

const categories = ["الكل", "كتب", "قوالب", "كورسات", "تصميمات"];

// Display-only examples used only if the database is unreachable. They are clearly labelled
// as demo content and are never sent to checkout or treated as real database products.
const demoProducts: Product[] = [
  {
    id: "demo-brand-kit",
    slug: "brand-starter-kit-demo",
    title: "حزمة بداية الهوية البصرية",
    description: "مثال توضيحي لقالب هوية بصرية قابل للتعديل.",
    price: 490,
    currency: "EGP",
    category: "قوالب",
    thumbnail: null,
    thumbnail_url: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=85",
    sales_count: 0,
    profiles: { store_name: "عرض تجريبي" },
  },
  {
    id: "demo-ebook",
    slug: "arabic-copywriting-demo",
    title: "دليل الكتابة التسويقية",
    description: "مثال توضيحي لكتاب رقمي باللغة العربية.",
    price: 180,
    currency: "EGP",
    category: "كتب",
    thumbnail: null,
    thumbnail_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=85",
    sales_count: 0,
    profiles: { store_name: "عرض تجريبي" },
  },
  {
    id: "demo-course",
    slug: "product-design-demo",
    title: "أساسيات تصميم المنتجات",
    description: "مثال توضيحي لمحتوى تعليمي رقمي.",
    price: 29,
    currency: "USD",
    category: "كورسات",
    thumbnail: null,
    thumbnail_url: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=900&q=85",
    sales_count: 0,
    profiles: { store_name: "عرض تجريبي" },
  },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState("الكل");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDemoFallback, setIsDemoFallback] = useState(false);

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        const db = getSupabaseBrowserClient();
        const { data, error } = await db
          .from("products")
          .select("id,slug,title,description,price,currency,category,thumbnail,thumbnail_url,sales_count,profiles(store_name)")
          .eq("is_published", true)
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (!active) return;
        setProducts((data ?? []) as Product[]);
      } catch (cause) {
        console.error("Homepage product loading failed; showing demo fallback:", cause);
        if (!active) return;
        setProducts(demoProducts);
        setIsDemoFallback(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadProducts();
    return () => {
      active = false;
    };
  }, []);

  const visible = useMemo(
    () =>
      products.filter((product) => {
        const seller = Array.isArray(product.profiles)
          ? product.profiles[0]?.store_name
          : product.profiles?.store_name;
        return (
          (category === "الكل" || product.category === category) &&
          `${product.title} ${product.description} ${seller ?? ""}`
            .toLowerCase()
            .includes(query.toLowerCase())
        );
      }),
    [products, category, query],
  );

  return (
    <main>
      <section className="relative overflow-hidden border-b border-line dark:border-white/10">
        <div className="grid-paper absolute inset-0 opacity-60" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:py-24">
          <div>
            <Badge className="mb-6 bg-mint text-[#27634c]"><Sparkles size={13} className="ml-1" /> سوق رقمي عربي</Badge>
            <h1 className="text-5xl font-black leading-tight tracking-tight text-ink sm:text-7xl dark:text-white">حوّل خبرتك<br /><span className="text-coral">إلى دخل.</span></h1>
            <p className="mt-7 max-w-lg text-lg leading-8 text-slate-600 dark:text-slate-300">أول منصة عربية للمنتجات الرقمية. اكتشف منتجات حقيقية أو ابدأ بيع خبرتك في مكان واحد.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#discover"><Button size="lg">اكتشف المنتجات <ArrowLeft size={18} /></Button></a>
              <Link href="/auth/register"><Button size="lg" variant="outline">أضف منتجك <Upload size={17} /></Button></Link>
            </div>
          </div>
          <div className="grid-paper rounded-[30px] bg-sand p-8 dark:bg-[#202b38] sm:p-12">
            <div className="text-xs font-bold tracking-widest text-coral">DIGITAL MARKET / 2026</div>
            <div className="mt-16 text-4xl font-black text-ink dark:text-white">أفكار صغيرة.<br /><span className="text-coral">أثر كبير.</span></div>
            <p className="mt-5 text-slate-500">ملفات، قوالب، كتب ودورات من صناع المحتوى.</p>
          </div>
        </div>
      </section>

      <section id="discover" className="mx-auto max-w-7xl px-5 py-20">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div><p className="mb-3 text-xs font-black uppercase tracking-[.2em] text-coral">السوق الحقيقي</p><h2 className="text-4xl font-black text-ink dark:text-white">منتجات تستحق وقتك.</h2></div>
          <div className="flex items-center gap-3"><Search size={18} className="text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث عن منتج..." className="h-12 rounded-full border border-line bg-white px-5 text-sm outline-none focus:border-coral dark:border-white/10 dark:bg-[#202b38] dark:text-white" /></div>
        </div>
        <div className="mt-8 flex gap-2 overflow-x-auto">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`rounded-full border px-4 py-2 text-sm font-bold ${category === item ? "border-ink bg-ink text-white" : "border-line bg-white text-slate-600 dark:border-white/10 dark:bg-[#202b38] dark:text-slate-300"}`}>{item}</button>)}</div>

        {isDemoFallback && !loading && <div role="status" className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">نعرض أمثلة تجريبية مؤقتًا لتعذر الوصول إلى قاعدة البيانات. هذه ليست منتجات فعلية، والشراء غير متاح من هذه البطاقات.</div>}

        {loading ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="h-72 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />)}</div>
        ) : visible.length ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((product) => {
              const seller = Array.isArray(product.profiles) ? product.profiles[0]?.store_name : product.profiles?.store_name;
              return (
                <Link key={product.id} href={isDemoFallback ? "#discover" : `/p/${product.slug}`} onClick={isDemoFallback ? (event) => event.preventDefault() : undefined} aria-disabled={isDemoFallback} className="group overflow-hidden rounded-[24px] border border-line bg-white transition hover:-translate-y-1 hover:shadow-soft dark:border-white/10 dark:bg-[#202b38]">
                  <div className="aspect-[1.3] bg-sand">{product.thumbnail_url || product.thumbnail ? <img src={(product.thumbnail_url || product.thumbnail)!} alt={product.title} className="h-full w-full object-cover transition group-hover:scale-105" /> : <div className="grid h-full place-items-center"><Sparkles className="text-coral" size={32} /></div>}</div>
                  <div className="p-5"><p className="text-xs font-bold text-coral">{product.category}</p><h3 className="mt-2 text-xl font-black text-ink dark:text-white">{product.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{product.description}</p><div className="mt-5 flex justify-between"><strong className="text-lg text-ink dark:text-white">{formatPrice(Number(product.price), product.currency)}</strong><span className="text-xs text-slate-400">{isDemoFallback ? "مثال تجريبي" : `${product.sales_count} مبيعة`}</span></div>{seller && <p className="mt-2 text-xs text-slate-400">{seller}</p>}</div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-dashed border-line py-20 text-center"><p className="font-bold text-ink dark:text-white">لا توجد منتجات منشورة حتى الآن.</p><Link href="/auth/register" className="mt-4 inline-block font-bold text-coral">ابدأ البيع الآن</Link></div>
        )}
      </section>
    </main>
  );
}
