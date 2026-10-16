"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type EmailOtpType =
  | "signup"
  | "invite"
  | "magiclink"
  | "recovery"
  | "email_change"
  | "email"
  | "sms"
  | "phone_change"
  | "reauthentication";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("جارٍ تأكيد البريد وتسجيل الدخول…");

  useEffect(() => {
    let active = true;

    async function run() {
      try {
        const db = getSupabaseBrowserClient();
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const tokenHash = params.get("token_hash");
        const type = params.get("type") as EmailOtpType | null;
        const authError = params.get("error_description") || params.get("error");

        if (authError) {
          if (active) setMessage(`تعذر تأكيد البريد: ${authError}. اطلب رابط تأكيد جديدًا وحاول مرة أخرى.`);
          return;
        }

        if (code) {
          const { error } = await db.auth.exchangeCodeForSession(code);
          if (error) {
            if (active) setMessage("انتهت صلاحية رابط التأكيد أو تم استخدامه. اطلب رسالة تأكيد جديدة.");
            return;
          }
        } else if (tokenHash && type && ["signup", "email", "magiclink", "invite", "recovery", "email_change"].includes(type)) {
          const { error } = await db.auth.verifyOtp({
            token_hash: tokenHash,
            type: type as "signup" | "email" | "magiclink" | "invite" | "recovery" | "email_change",
          });
          if (error) {
            if (active) setMessage("رابط التأكيد غير صالح أو انتهت صلاحيته. اطلب رسالة تأكيد جديدة.");
            return;
          }
        }

        const { data, error } = await db.auth.getUser();
        if (error || !data.user) {
          if (active) setMessage("لم يكتمل تأكيد البريد أو إنشاء جلسة الدخول. اطلب رابطًا جديدًا وتأكد من فتحه على هذا الموقع.");
          return;
        }

        const storeName = String(
          data.user.user_metadata?.store_name ||
          data.user.email?.split("@")[0] ||
          "متجري"
        );
        const { error: profileError } = await db.from("profiles").upsert(
          { id: data.user.id, email: data.user.email, store_name: storeName },
          { onConflict: "id" },
        );

        if (profileError) {
          console.error("Profile upsert after auth callback failed:", profileError);
          // The database trigger may already have created the profile; don't block authentication.
        }

        if (active) {
          router.replace("/dashboard");
          router.refresh();
        }
      } catch (error) {
        console.error("Auth callback failed:", error);
        if (active) setMessage("حدث خطأ أثناء تأكيد الحساب. اطلب رابط تأكيد جديدًا وحاول مرة أخرى.");
      }
    }

    void run();
    return () => {
      active = false;
    };
  }, [router]);

  return (
    <main className="mx-auto max-w-lg px-5 py-20 text-center">
      <p role="status" className="rounded-2xl border border-line p-8">{message}</p>
    </main>
  );
}
