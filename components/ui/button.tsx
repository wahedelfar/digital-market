import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
};

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return <button className={cn("inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-200 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50", {
    "bg-coral text-white shadow-[0_8px_20px_rgba(242,106,79,.2)] hover:bg-[#e75c42]": variant === "primary",
    "bg-ink text-white hover:bg-[#2b3745] dark:bg-white dark:text-ink dark:hover:bg-gray-100": variant === "secondary",
    "border border-line bg-transparent text-ink hover:bg-sand dark:border-white/15 dark:text-white dark:hover:bg-white/10": variant === "outline",
    "text-ink hover:bg-sand dark:text-white dark:hover:bg-white/10": variant === "ghost",
    "bg-red-50 text-red-700 hover:bg-red-100": variant === "danger",
    "h-9 px-4 text-xs": size === "sm",
    "h-11 px-5 text-sm": size === "md",
    "h-14 px-7 text-base": size === "lg"
  }, className)} {...props} />;
}
