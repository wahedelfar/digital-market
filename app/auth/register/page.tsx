"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

const AUTH_CALLBACK_URL = "https://digital-market-pink.vercel.app/auth/callback";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [store, setStore] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setMessage("كلمة المرور يجب ألا تقل عن 8 أحرف.");
      return;
    }

    setBusy(true);
    setMessage("");

    try {
      const db = getSupabaseBrowserClient();
      const { data, error } = await db.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { store_name: store.trim() },
          emailRedirectTo: AUTH_CALLBACK_URL,
        },
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      // With email confirmation enabled, signUp returns no session. The
      // database trigger creates the profile securely before confirmation.
      if (data.user && data.session) {
        const { error: profileError } = await db.from("profiles").upsert(
          {
            id: data.user.id,
            email: data.user.email ?? email.trim(),
            store_name: store.trim(),
          },
          { onConflict: "id" },
        );

        if (profileError) {
          console.error("Profile update after signup failed:", profileError);
          setMessage("تم إنشاء الحساب. تم تجهيز ملف المتجر تلقائيًا، ويمكنك تعديل بياناته بعد تسجيل الدخول.");
        } else {
          setMessage("تم إنشاء الحساب بنجاح.");
        }

        router.push("/dashboard");
        router.refresh();
        return;
      }

      setMessage("تم إنشاء الحساب. تحقق من بريدك الإلكتروني لتأكيده، ثم سجّل الدخول.");
    } catch (error) {
      console.error("Signup failed:", error);
      setMessage("تعذر إكمال إنشاء الحساب. تحقق من اتصال الإنترنت وحاول مرة أخرى.");
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
      console.error("Google signup failed:", error);
      setMessage("تعذر بدء التسجيل باستخدام Google. حاول مرة أخرى.");
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-5 py-16">
      <div className="rounded-3xl border border-line bg-white p-7 shadow-soft dark:border-white/10 dark:bg-[#202b38]">
        <h1 className="text-3xl font-black text-ink dark:text-white">ابدأ البيع</h1>
        <p className="mt-2 text-sm text-slate-500">أنشئ حسابك ومتجرك الرقمي.</p>
        <form onSubmit={submit} className="mt-7 space-y-4">
          <label className="block text-sm font-bold">
            اسم المتجر
            <input required maxLength={80} value={store} onChange={(e) => setStore(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-line bg-transparent px-4" />
          </label>
          <label className="block text-sm font-bold">
            البريد الإلكتروني
            <input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-line bg-transparent px-4" />
          </label>
          <label className="block text-sm font-bold">
            كلمة المرور
            <input required minLength={8} type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-line bg-transparent px-4" />
          </label>
          <Button disabled={busy} className="w-full">{busy ? "جارٍ إنشاء الحساب…" : "إنشاء حساب"}</Button>
        </form>
        <button disabled={busy} onClick={google} className="mt-3 w-full rounded-xl border border-line p-3 text-sm font-bold disabled:opacity-60">
          إنشاء حساب باستخدام Google
        </button>
        {message && <p role="status" className="mt-4 break-words text-sm text-coral">{message}</p>}
        <p className="mt-6 text-center text-sm text-slate-500">
          لديك حساب؟ <Link href="/auth/login" className="font-bold text-coral">سجّل الدخول</Link>
        </p>
      </div>
    </main>
  );
}
