import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: { token: string } }) {
  const token = params.token;
  if (!token || token.length > 200) return NextResponse.json({ error: "رمز التنزيل غير صالح" }, { status: 404 });
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.rpc("consume_download_token", { p_token: token }).maybeSingle();
  if (error || !data?.file_path) {
    const message = error?.message ?? "";
    if (/not found/i.test(message) || error?.code === "P0002") return NextResponse.json({ error: "رابط التنزيل غير موجود" }, { status: 404 });
    if (/expired/i.test(message)) return NextResponse.json({ error: "انتهت صلاحية رابط التنزيل" }, { status: 410 });
    if (/limit/i.test(message)) return NextResponse.json({ error: "تم استنفاد عدد مرات التنزيل" }, { status: 429 });
    if (/payment not confirmed/i.test(message)) return NextResponse.json({ error: "لم يتم تأكيد الدفع بعد" }, { status: 402 });
    return NextResponse.json({ error: "تعذر التحقق من رابط التنزيل" }, { status: 400 });
  }
  const { data: signed, error: signedError } = await supabase.storage.from("digital-files").createSignedUrl(data.file_path, 60);
  if (signedError || !signed?.signedUrl) return NextResponse.json({ error: "تعذر إنشاء رابط الملف" }, { status: 500 });
  return NextResponse.redirect(signed.signedUrl, { status: 302 });
}
