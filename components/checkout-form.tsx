"use client";

import { ArrowLeft, Check, CreditCard, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, Input } from "@/components/ui/primitives";
import { type Product } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";

export function CheckoutForm({ product }: { product: Product }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [provider, setProvider] = useState<"paymob" | "fawry">("paymob");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.includes("@")) { setError("اكتب بريدًا إلكترونيًا صحيحًا لاستلام المنتج."); return; }
    setError(""); setLoading(true);
    window.setTimeout(() => router.push(`/checkout/${product.slug}/success?email=${encodeURIComponent(email)}&provider=${provider}`), 700);
  }
  return <form onSubmit={submit} className="space-y-5"><Card className="p-6 shadow-none"><label className="mb-2 block text-sm font-black text-ink dark:text-white">البريد الإلكتروني</label><div className="relative"><Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} /><Input required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" type="email" className="pr-11" /></div><p className="mt-2 text-xs text-slate-400">سنرسل رابط التحميل ومفتاح الترخيص إلى هذا البريد.</p></Card><Card className="p-6 shadow-none"><div className="mb-4 flex items-center justify-between"><span className="text-sm font-black text-ink dark:text-white">طريقة الدفع</span><ShieldCheck size={18} className="text-[#3f8f79]" /></div><div className="grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => setProvider("paymob")} className={`rounded-2xl border p-4 text-right transition ${provider === "paymob" ? "border-coral bg-coral/5 ring-2 ring-coral/10" : "border-line dark:border-white/10"}`}><span className="flex items-center justify-between"><span className="font-black text-ink dark:text-white">Paymob</span>{provider === "paymob" && <Check size={16} className="text-coral" />}</span><span className="mt-1 block text-xs text-slate-400">بطاقة أو محفظة أو InstaPay</span></button><button type="button" onClick={() => setProvider("fawry")} className={`rounded-2xl border p-4 text-right transition ${provider === "fawry" ? "border-coral bg-coral/5 ring-2 ring-coral/10" : "border-line dark:border-white/10"}`}><span className="flex items-center justify-between"><span className="font-black text-ink dark:text-white">Fawry</span>{provider === "fawry" && <Check size={16} className="text-coral" />}</span><span className="mt-1 block text-xs text-slate-400">ادفع من أقرب ماكينة فوري</span></button></div></Card>{error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}<Button disabled={loading} size="lg" className="w-full">{loading ? "جارٍ تجهيز الدفع..." : <>ادفع {formatPrice(product.price, product.currency)} <CreditCard size={18} /></>}</Button><p className="flex items-center justify-center gap-2 text-center text-xs text-slate-400"><ShieldCheck size={14} /> بياناتك محمية ولا نخزن معلومات البطاقة.</p></form>;
}
