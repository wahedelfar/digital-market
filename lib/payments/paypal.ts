const PAYPAL_BASE = process.env.PAYPAL_MODE === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

async function accessToken(): Promise<string> {
  const id = required("PAYPAL_CLIENT_ID");
  const secret = required("PAYPAL_CLIENT_SECRET");
  const response = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok || typeof data.access_token !== "string") throw new Error("PayPal authentication failed");
  return data.access_token;
}

export async function paypalRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await accessToken();
  const response = await fetch(`${PAYPAL_BASE}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...(init.headers || {}) },
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(typeof data.message === "string" ? data.message : "PayPal request failed");
  return data as T;
}

export function paypalCurrency(): string {
  return process.env.PAYPAL_CURRENCY || "USD";
}
