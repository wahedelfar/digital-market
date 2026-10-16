"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  function toggle() {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
    localStorage.setItem("dm-theme", isDark ? "dark" : "light");
  }
  return <button aria-label="تغيير الوضع" onClick={toggle} className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition hover:bg-sand dark:border-white/10 dark:text-white dark:hover:bg-white/10">{dark ? <Sun size={17} /> : <Moon size={17} />}</button>;
}
