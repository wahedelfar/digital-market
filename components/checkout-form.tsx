"use client";

import { Check, CreditCard, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, Input } from "@/components/ui/primitives";
import { formatPrice } from "@/lib/utils";

type CheckoutProduct = { id: string; slug: string; title: string; price: number; currency: string };

export function CheckoutForm({ product }: { product: CheckoutProduct }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("اكتب بريدًا إلكترونيًا صحيحًا."); return; }
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: product.id, buyerEmail: email }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "تعذر إنشاء طلب الشراء.");
      router.push(`/success/${encodeURIComponent(result.saleId)}?token=${encodeURIComponent(result.downloadToken)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "حدث خطأ غير متوقع.");
      setLoading(false);
    }
  }
  return <form onSubmit={submit} className="space-y-5">
    <Card className="p-6 shadow-none"><label className="mb-2 block text-sm font-black text-ink dark:text-white">البريد الإلكتروني</label><div className="relative"><Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={17}/><Input required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" type="email" className="pr-11"/></div><p className="mt-2 text-xs text-slate-400">سنستخدمه لتسجيل طلب الشراء.</p></Card>
    <Card className="p-6 shadow-none"><div className="flex items-center justify-between"><span className="text-sm font-black text-ink dark:text-white">ملخص الطلب</span><ShieldCheck size={18} className="text-[#3f8f79]"/></div><p className="mt-3 text-sm text-slate-500">{product.title}</p><p className="mt-2 text-xl font-black text-ink dark:text-white">{formatPrice(product.price, product.currency)}</p><p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs leading-6 text-amber-800">الدفع الإلكتروني غير مفعّل حتى الآن. سيتم إنشاء طلب بحالة «قيد انتظار الدفع» ولن يُفتح التنزيل قبل تأكيد عملية الدفع من مزود الدفع.</p></Card>
    {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
    <Button disabled={loading} size="lg" className="w-full">{loading ? "جارٍ إنشاء الطلب..." : <>إنشاء طلب الشراء <CreditCard size={18}/></>}</Button>
    <p className="flex items-center justify-center gap-2 text-center text-xs text-slate-400"><Check size={14}/> لن يتم تحصيل أي مبلغ من هذه الخطوة.</p>
  </form>;
}
