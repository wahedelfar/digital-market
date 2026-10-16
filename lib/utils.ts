import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number, currency?: string) {
  const cur: "EGP" | "USD" = currency === "USD" || currency === "EGP" ? currency : "EGP";

  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: cur,
    maximumFractionDigits: 0
  }).format(value);
}
