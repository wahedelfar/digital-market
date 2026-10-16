"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

const AUTH_CALLBACK_URL = "https://digital-market-pink.vercel.app/auth/callback";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const db = getSupabaseBrowserClient();
      const { error } = await db.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        setMessage(error.message);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Login failed:", error);
      setMessage("تعذر تسجيل الدخول. تحقق من الإعدادات والاتصال ثم حاول مرة أخرى.");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setBusy(true);
    setMessage("");
    try {
      const db = getSupabaseBrowserClient();
      const { error } = await db.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: AUTH_CALLBACK_URL },
      });
      if (error) {
        setMessage(error.message);
        setBusy(false);
      }
    } catch (error) {
      console.error("Google login failed:", error);
      setMessage("تعذر بدء تسجيل الدخول باستخدام Google. حاول مرة أخرى.");
      setBusy(false);
    }
  }

  async function magic() {
    if (!email.trim()) {
      setMessage("اكتب بريدك الإلكتروني أولًا.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const db = getSupabaseBrowserClient();
      const { error } = await db.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: AUTH_CALLBACK_URL },
      });
      setMessage(error ? error.message : "تم إرسال رابط الدخول إلى بريدك الإلكتروني.");
    } catch (error) {
      console.error("Magic link failed:", error);
      setMessage("تعذر إرسال رابط الدخول. حاول مرة أخرى.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-5 py-16">
      <div className="rounded-3xl border border-line bg-white p-7 shadow-soft dark:border-white/10 dark:bg-[#202b38]">
        <h1 className="text-3xl font-black text-ink dark:text-white">تسجيل الدخول</h1>
        <p className="mt-2 text-sm text-slate-500">ادخل إلى حسابك لإدارة منتجاتك.</p>
        <form onSubmit={submit} className="mt-7 space-y-4">
          <label className="block text-sm font-bold">
            البريد الإلكتروني
            <input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-line bg-transparent px-4" />
          </label>
          <label className="block text-sm font-bold">
            كلمة المرور
            <input required type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-line bg-transparent px-4" />
          </label>
          <Button disabled={busy} className="w-full">{busy ? "جارٍ الدخول…" : "دخول بالبريد وكلمة المرور"}</Button>
        </form>
        <button disabled={busy} onClick={google} className="mt-3 w-full rounded-xl border border-line p-3 text-sm font-bold disabled:opacity-60">المتابعة باستخدام Google</button>
        <button disabled={busy} onClick={magic} className="mt-3 w-full rounded-xl border border-line p-3 text-sm font-bold disabled:opacity-60">إرسال رابط دخول بالبريد</button>
        {message && <p role="status" className="mt-4 break-words text-sm text-coral">{message}</p>}
        <p className="mt-6 text-center text-sm text-slate-500">
          ليس لديك حساب؟ <Link href="/auth/register" className="font-bold text-coral">إنشاء حساب</Link>
        </p>
      </div>
    </main>
  );
}
