import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { productId?: string; buyerEmail?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 }); }
  if (!body.productId || !body.buyerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.buyerEmail)) {
    return NextResponse.json({ error: "أدخل بريدًا إلكترونيًا صحيحًا" }, { status: 400 });
  }
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.rpc("create_checkout_sale", {
    p_product_id: body.productId,
    p_buyer_email: body.buyerEmail.trim().toLowerCase(),
  }).maybeSingle();
  if (error || !data?.sale_id) return NextResponse.json({ error: "تعذر إنشاء طلب الشراء" }, { status: 400 });
  return NextResponse.json({
    saleId: data.sale_id,
    // Token is created now, but downloads remain blocked until a verified payment marks the sale paid.
    downloadToken: data.download_token,
    paymentStatus: "pending",
    message: "تم إنشاء الطلب. سيتم تفعيل التنزيل بعد تأكيد الدفع.",
  }, { status: 201 });
}
