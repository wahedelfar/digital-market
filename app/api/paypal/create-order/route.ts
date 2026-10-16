import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { paypalCurrency, paypalRequest } from "@/lib/payments/paypal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Server database credentials are not configured");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const productId = typeof body.productId === "string" ? body.productId : "";
    const buyerEmail = typeof body.buyerEmail === "string" ? body.buyerEmail.trim().toLowerCase() : "";
    if (!productId || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail)) {
      return NextResponse.json({ error: "المنتج والبريد الإلكتروني مطلوبان." }, { status: 400 });
    }
    const supabase = adminClient();
    const { data: product, error } = await supabase.from("products").select("id,title,price,currency,is_published,published").eq("id", productId).maybeSingle();
    if (error || !product || !(product.is_published || product.published)) return NextResponse.json({ error: "المنتج غير متاح." }, { status: 404 });
    const currency = paypalCurrency();
    if (currency !== "USD" || String(product.currency || "EGP").toUpperCase() !== "USD") {
      return NextResponse.json({ error: "PayPal مضبوط حاليًا لمنتجات USD فقط. اضبط عملة المنتج إلى USD قبل الدفع." }, { status: 400 });
    }
    const amount = Number(product.price);
    if (!Number.isFinite(amount) || amount <= 0) return NextResponse.json({ error: "سعر المنتج غير صالح." }, { status: 400 });
    const order = await paypalRequest<{ id: string }>("/v2/checkout/orders", {
      method: "POST",
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          custom_id: product.id,
          description: String(product.title).slice(0, 127),
          amount: { currency_code: currency, value: amount.toFixed(2) },
          payment_instruction: undefined,
        }],
        application_context: { user_action: "PAY_NOW", shipping_preference: "NO_SHIPPING" },
      }),
    });
    return NextResponse.json({ orderID: order.id });
  } catch (error) {
    console.error("PayPal create order failed", error);
    return NextResponse.json({ error: "تعذر بدء الدفع عبر PayPal." }, { status: 502 });
  }
}
