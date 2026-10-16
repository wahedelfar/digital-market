import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DownloadTokenResult = { file_path: string };

export async function GET(_request: Request, { params }: { params: { token: string } }) {
  const token = params.token;
  if (!token || token.length > 200) return NextResponse.json({ error: "رمز التنزيل غير صالح" }, { status: 404 });
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.rpc("consume_download_token", { p_token: token }).maybeSingle();
  // The generated Supabase RPC types do not currently describe this function result.
  const download = data as unknown as DownloadTokenResult | null;
  if (error || !download?.file_path) {
    const message = error?.message ?? "";
    if (/not found/i.test(message) || error?.code === "P0002") return NextResponse.json({ error: "رابط التنزيل غير موجود" }, { status: 404 });
    if (/expired/i.test(message)) return NextResponse.json({ error: "انتهت صلاحية رابط التنزيل" }, { status: 410 });
    if (/limit/i.test(message)) return NextResponse.json({ error: "تم استنفاد عدد مرات التنزيل" }, { status: 429 });
    if (/payment not confirmed/i.test(message)) return NextResponse.json({ error: "لم يتم تأكيد الدفع بعد" }, { status: 402 });
    return NextResponse.json({ error: "تعذر التحقق من رابط التنزيل" }, { status: 400 });
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serverKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  // Storage signing requires an authorized server credential because the bucket is private.
  // Never expose this key to browser bundles. If not configured, fail closed.
  if (!url || !serverKey) return NextResponse.json({ error: "تنزيل الملفات غير مهيأ على الخادم" }, { status: 503 });
  const admin = createClient(url, serverKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: signed, error: signedError } = await admin.storage.from("digital-files").createSignedUrl(download.file_path, 60);
  if (signedError || !signed?.signedUrl) return NextResponse.json({ error: "تعذر إنشاء رابط الملف" }, { status: 500 });
  return NextResponse.redirect(signed.signedUrl, { status: 302 });
}
