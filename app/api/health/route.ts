export function GET() {
  return Response.json({ ok: true, service: "digital-market", timestamp: new Date().toISOString() });
}
