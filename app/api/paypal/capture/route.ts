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

type PayPalOrder = { id: string; status: string; purchase_units?: Array<{ custom_id?: string; amount?: { currency_code?: string; value?: string } }> };
type CaptureResult = { id: string; status: string; purchase_units?: Array<{ payments?: { captures?: Array<{ id: string; status: string; amount?: { currency_code?: string; value?: string } }> } }> };

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderId = typeof body.orderID === "string" ? body.orderID : "";
    const productId = typeof body.productId === "string" ? body.productId : "";
    const buyerEmail = typeof body.buyerEmail === "string" ? body.buyerEmail.trim().toLowerCase() : "";
    if (!orderId || !productId || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail)) return NextResponse.json({ error: "بيانات الدفع غير مكتملة." }, { status: 400 });

    const supabase = adminClient();
    const { data: product, error: productError } = await supabase.from("products").select("id,title,price,currency,is_published,published").eq("id", productId).maybeSingle();
    if (productError || !product || !(product.is_published || product.published)) return NextResponse.json({ error: "المنتج غير متاح." }, { status: 404 });
    const currency = paypalCurrency();
    if (currency !== "USD" || String(product.currency || "EGP").toUpperCase() !== currency) return NextResponse.json({ error: "عملة المنتج لا تطابق إعدادات PayPal." }, { status: 400 });

    const order = await paypalRequest<PayPalOrder>(`/v2/checkout/orders/${encodeURIComponent(orderId)}`, { method: "GET" });
    const unit = order.purchase_units?.[0];
    const expectedAmount = Number(product.price).toFixed(2);
    if (unit?.custom_id !== product.id || unit.amount?.currency_code !== currency || unit.amount.value !== expectedAmount) {
      return NextResponse.json({ error: "بيانات الطلب لا تطابق المنتج وسعره." }, { status: 400 });
    }
    if (order.status !== "APPROVED" && order.status !== "CREATED") return NextResponse.json({ error: "طلب PayPal ليس جاهزًا للتحصيل." }, { status: 409 });

    const captured = await paypalRequest<CaptureResult>(`/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, { method: "POST", body: "{}" });
    const capture = captured.purchase_units?.[0]?.payments?.captures?.[0];
    if (captured.status !== "COMPLETED" || capture?.status !== "COMPLETED" || capture.amount?.currency_code !== currency || capture.amount.value !== expectedAmount) {
      return NextResponse.json({ error: "لم يؤكد PayPal اكتمال الدفع." }, { status: 402 });
    }

    const { data: existing } = await supabase.from("sales").select("id").eq("paymob_order_id", orderId).maybeSingle();
    if (existing?.id) {
      return NextResponse.json({ saleId: existing.id, alreadyProcessed: true });
    }

    const { data: sale, error: saleError } = await supabase.from("sales").insert({
      product_id: product.id,
      buyer_email: buyerEmail,
      amount: Number(capture.amount.value),
      status: "paid",
      paymob_order_id: orderId,
    }).select("id").single();
    if (saleError || !sale) {
      console.error("Could not persist paid PayPal sale", saleError);
      return NextResponse.json({ error: "تم الدفع لكن تعذر تسجيل الطلب. تواصل مع الدعم مع رقم PayPal." }, { status: 500 });
    }

    const token = crypto.randomUUID();
    const { error: downloadError } = await supabase.from("downloads").insert({
      sale_id: sale.id,
      token,
      max_downloads: 3,
      download_count: 0,
      expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    });
    if (downloadError) {
      console.error("Could not create PayPal download token", downloadError);
      return NextResponse.json({ error: "تم الدفع لكن تعذر تجهيز التنزيل. تواصل مع الدعم." }, { status: 500 });
    }
    return NextResponse.json({ success: true, saleId: sale.id, downloadToken: token });
  } catch (error) {
    console.error("PayPal capture failed", error);
    return NextResponse.json({ error: "تعذر تأكيد الدفع عبر PayPal." }, { status: 502 });
  }
}
