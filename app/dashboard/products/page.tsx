"use client";

import Link from "next/link";
import { Edit3, ExternalLink, MoreHorizontal, Package, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge, Card } from "@/components/ui/primitives";
import { products as initialProducts } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";

export default function ProductsPage() {
  const [items, setItems] = useState(initialProducts);
  function remove(id: string) { setItems((current) => current.filter((item) => item.id !== id)); }
  return <div><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start"><div><p className="text-sm font-semibold text-slate-400">كتالوجك</p><h1 className="mt-2 text-3xl font-black tracking-tight text-ink dark:text-white">منتجاتي</h1><p className="mt-2 text-sm text-slate-500">{items.length} منتجات منشورة في متجرك.</p></div><Link href="/dashboard/new"><Button><Plus size={17} /> منتج جديد</Button></Link></div><Card className="mt-8 overflow-hidden shadow-none"><div className="flex items-center justify-between border-b border-line p-5 dark:border-white/10"><div className="flex items-center gap-2"><Package size={18} className="text-coral" /><span className="text-sm font-black text-ink dark:text-white">كل المنتجات</span></div><Badge>منشور</Badge></div><div className="divide-y divide-line dark:divide-white/10">{items.map((product) => <div key={product.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center"><img src={product.thumbnail} alt="" className="h-16 w-20 rounded-xl object-cover" /><div className="min-w-0 flex-1"><Link href={`/p/${product.slug}`} className="font-black text-ink hover:text-coral dark:text-white">{product.title}</Link><p className="mt-1 text-xs text-slate-400">{product.category} · {product.salesCount} مبيعات · {product.language}</p></div><div className="text-right"><p className="font-black text-ink dark:text-white">{formatPrice(product.price, product.currency)}</p><p className="mt-1 text-[11px] text-[#3f8f79]">نشط الآن</p></div><div className="flex items-center gap-1"><Link href={`/p/${product.slug}`} aria-label="مشاهدة"><Button variant="ghost" size="sm"><ExternalLink size={15} /></Button></Link><Button variant="ghost" size="sm" aria-label="تعديل"><Edit3 size={15} /></Button><Button variant="ghost" size="sm" aria-label="حذف" onClick={() => remove(product.id)}><Trash2 size={15} className="text-red-500" /></Button><MoreHorizontal size={17} className="mr-2 text-slate-400" /></div></div>)}{items.length === 0 && <div className="py-20 text-center"><p className="font-bold text-ink dark:text-white">لا توجد منتجات بعد.</p><Link href="/dashboard/new" className="mt-3 inline-block text-sm font-bold text-coral">أضف منتجك الأول</Link></div>}</div></Card></div>;
}
