import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-[24px] border border-line bg-white shadow-card dark:border-white/10 dark:bg-[#202b38]", className)} {...props} />;
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("h-11 w-full rounded-xl border border-line bg-white px-4 text-sm text-ink outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/10 dark:border-white/10 dark:bg-[#1a2430] dark:text-white", className)} {...props} />;
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("min-h-28 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/10 dark:border-white/10 dark:bg-[#1a2430] dark:text-white", className)} {...props} />;
}

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex items-center rounded-full bg-sand px-3 py-1 text-[11px] font-bold text-ink dark:bg-white/10 dark:text-white", className)} {...props} />;
}
