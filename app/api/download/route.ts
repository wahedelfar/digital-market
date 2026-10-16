import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");
  const expires = request.nextUrl.searchParams.get("expires");
  if (!path || !expires || new Date(expires).getTime() < Date.now()) return Response.json({ error: "انتهت صلاحية رابط التنزيل." }, { status: 410 });
  return Response.json({ ok: true, message: "Signed download ready", path, remainingDownloads: 3 });
}
