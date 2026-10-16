"use client";

import { Check, CreditCard, Mail, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, Input } from "@/components/ui/primitives";
import { formatPrice } from "@/lib/utils";

type CheckoutProduct = { id: string; slug: string; title: string; price: number; currency: string };
type PayPalButtonsInstance = { render: (selector: HTMLElement) => Promise<void> };
type PayPalNamespace = { Buttons: (options: {
  createOrder: () => Promise<string>;
  onApprove: (data: { orderID: string }) => Promise<void>;
  onError: (error: unknown) => void;
}) => PayPalButtonsInstance };
declare global { interface Window { paypal?: PayPalNamespace } }

export function CheckoutForm({ product }: { product: CheckoutProduct }) {
  const router = useRouter();
  const paypalRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const paypalAvailable = Boolean(clientId) && product.currency.toUpperCase() === "USD";

  useEffect(() => {
    if (!paypalAvailable || !paypalRef.current) return;
    const target = paypalRef.current;
    let cancelled = false;
    const renderButtons = () => {
      if (cancelled || !window.paypal || !target || target.dataset.rendered === "true") return;
      target.dataset.rendered = "true";
      window.paypal.Buttons({
        createOrder: async () => {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("اكتب بريدًا إلكترونيًا صحيحًا أولًا.");
          const response = await fetch("/api/paypal/create-order", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: product.id, buyerEmail: email }),
          });
          const result = await response.json();
          if (!response.ok || !result.orderID) throw new Error(result.error || "تعذر بدء الدفع عبر PayPal.");
          return result.orderID as string;
        },
        onApprove: async ({ orderID }) => {
          setLoading(true); setError("");
          const response = await fetch("/api/paypal/capture", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderID, productId: product.id, buyerEmail: email }),
          });
          const result = await response.json();
          if (!response.ok || !result.saleId || !result.downloadToken) throw new Error(result.error || "تعذر تأكيد الدفع.");
          router.push(`/success/${encodeURIComponent(result.saleId)}?token=${encodeURIComponent(result.downloadToken)}`);
        },
        onError: (e) => { setError(e instanceof Error ? e.message : "حدث خطأ في PayPal."); setLoading(false); },
      }).render(target).catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "تعذر تحميل PayPal.");
      });
    };
    const existing = document.querySelector<HTMLScriptElement>('script[data-paypal-sdk="true"]');
    if (existing) {
      if (window.paypal) renderButtons();
      else existing.addEventListener("load", renderButtons, { once: true });
      return () => { cancelled = true; existing.removeEventListener("load", renderButtons); };
    }
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId!)}&currency=USD&intent=capture`;
    script.async = true; script.dataset.paypalSdk = "true";
    script.onload = renderButtons;
    script.onerror = () => setError("تعذر تحميل زر PayPal.");
    document.body.appendChild(script);
    return () => { cancelled = true; script.onload = null; };
  }, [clientId, email, paypalAvailable, product.id, router]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("اكتب بريدًا إلكترونيًا صحيحًا."); return; }
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: product.id, buyerEmail: email }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "تعذر إنشاء طلب الشراء.");
      setError("تم إنشاء طلب غير مدفوع. لا يوجد تحصيل أو تنزيل متاح قبل تأكيد الدفع.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "حدث خطأ غير متوقع.");
    } finally { setLoading(false); }
  }

  return <div className="space-y-5">
    <Card className="p-6 shadow-none"><label className="mb-2 block text-sm font-black text-ink dark:text-white">البريد الإلكتروني</label><div className="relative"><Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={17}/><Input required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" type="email" className="pr-11"/></div><p className="mt-2 text-xs text-slate-400">أدخل البريد قبل الضغط على زر PayPal.</p></Card>
    <Card className="p-6 shadow-none"><div className="flex items-center justify-between"><span className="text-sm font-black text-ink dark:text-white">ملخص الطلب</span><ShieldCheck size={18} className="text-[#3f8f79]"/></div><p className="mt-3 text-sm text-slate-500">{product.title}</p><p className="mt-2 text-xl font-black text-ink dark:text-white">{formatPrice(product.price, product.currency)}</p>
      {paypalAvailable ? <><p className="mt-3 mb-4 text-xs leading-6 text-slate-500">الدفع عبر PayPal في وضع الاختبار. يتم التحقق من السعر على الخادم قبل التحصيل.</p><div ref={paypalRef} aria-label="PayPal Checkout"/></> : <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs leading-6 text-amber-800">PayPal متاح للمنتجات المسعرة بالدولار فقط، ويلزم إعداد NEXT_PUBLIC_PAYPAL_CLIENT_ID.</p>}
    </Card>
    {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
    <form onSubmit={submit}><Button disabled={loading} type="submit" variant="outline" size="lg" className="w-full">{loading ? "جارٍ إنشاء الطلب..." : <>إنشاء طلب غير مدفوع <CreditCard size={18}/></>}</Button></form>
    <p className="flex items-center justify-center gap-2 text-center text-xs text-slate-400"><Check size={14}/> لا يُعد الطلب غير المدفوع عملية شراء مكتملة.</p>
  </div>;
}
