"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileArchive, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, Input, Textarea } from "@/components/ui/primitives";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const MAX_SIZE = 2 * 1024 * 1024 * 1024;
const ALLOWED = new Set(["application/pdf", "application/zip", "application/x-zip-compressed", "video/mp4", "application/octet-stream"]);
const slugify = (value: string) => value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

export default function NewProductPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("EGP");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  function chooseFile(selected?: File) {
    if (!selected) return;
    if (selected.size > MAX_SIZE) { setError("حجم الملف يجب ألا يتجاوز 2GB."); return; }
    if (!ALLOWED.has(selected.type) && !/\.(pdf|zip|mp4)$/i.test(selected.name)) { setError("الملفات المدعومة: PDF وZIP وMP4."); return; }
    setError(""); setFile(selected);
  }
  async function publish() {
    if (!file || !title.trim() || !description.trim() || !price || Number(price) < 0) { setError("أكمل بيانات المنتج واختر الملف."); return; }
    setBusy(true); setError("");
    const supabase = getSupabaseBrowserClient();
    try {
      const { data: auth, error: authError } = await supabase.auth.getUser();
      if (authError || !auth.user) { router.push("/auth/login"); return; }
      const user = auth.user;
      const { error: profileError } = await supabase.from("profiles").upsert({ id: user.id, email: user.email ?? "", store_name: user.user_metadata?.store_name ?? user.email?.split("@")[0] ?? "متجري" }, { onConflict: "id" });
      if (profileError) throw profileError;
      const path = `${user.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const { data: uploaded, error: uploadError } = await supabase.storage.from("digital-files").upload(path, file, { upsert: false, contentType: file.type || "application/octet-stream" });
      if (uploadError) throw uploadError;
      const baseSlug = slugify(title) || "product";
      const slug = `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`;
      const { error: productError } = await supabase.from("products").insert({
        seller_id: user.id, slug, title: title.trim(), description: description.trim(),
        price: Number(price), currency, file_path: uploaded.path,
        thumbnail_url: null, is_published: true, published: true
      });
      if (productError) {
        await supabase.storage.from("digital-files").remove([uploaded.path]);
        throw productError;
      }
      router.push("/dashboard/products"); router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذر نشر المنتج. تحقق من إعدادات الحساب وحاول مجددًا.");
    } finally { setBusy(false); }
  }
  return <div className="max-w-3xl"><p className="text-sm font-semibold text-slate-400">منتج جديد</p><h1 className="mt-2 text-3xl font-black text-ink dark:text-white">حوّل فكرتك إلى منتج</h1><p className="mt-2 text-sm text-slate-500">ارفع ملفك واحفظه في التخزين الخاص.</p>
    <Card className="mt-7 space-y-5 p-6 shadow-none">
      <div><h2 className="font-black text-ink dark:text-white">الملف الأساسي</h2><p className="mt-1 text-xs text-slate-400">PDF أو ZIP أو MP4 — حتى 2GB</p>
      <input ref={inputRef} type="file" accept=".pdf,.zip,.mp4,application/pdf,application/zip,video/mp4" className="hidden" onChange={e => chooseFile(e.target.files?.[0])} />
      <button type="button" onClick={() => inputRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); chooseFile(e.dataTransfer.files?.[0]); }} className="mt-4 flex w-full flex-col items-center rounded-2xl border-2 border-dashed border-line p-8 text-center hover:border-coral">
        {file ? <><FileArchive size={28} className="text-coral"/><span className="mt-2 text-sm font-bold">{file.name}</span><span className="mt-1 text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span><span className="mt-2 text-xs text-coral">اضغط لتغيير الملف</span></> : <><Upload size={28} className="text-coral"/><span className="mt-3 text-sm font-bold">اسحب الملف هنا أو اختر من جهازك</span><span className="mt-1 text-xs text-slate-400">PDF, ZIP, MP4 · حد أقصى 2GB</span></>}
      </button>
      {file && <button onClick={() => setFile(null)} className="flex items-center gap-1 text-xs text-slate-500"><X size={14}/> إزالة الملف</button>}
      </div>
      <div className="grid gap-4"><label className="text-sm font-bold">اسم المنتج<Input value={title} onChange={e => setTitle(e.target.value)} className="mt-2" maxLength={120} required placeholder="مثال: دليل بناء علامة تجارية"/></label>
      <label className="text-sm font-bold">وصف المنتج<Textarea value={description} onChange={e => setDescription(e.target.value)} className="mt-2" required maxLength={5000} placeholder="ما الذي سيحصل عليه المشتري؟"/></label>
      <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold">السعر<Input type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="mt-2" required/></label><label className="text-sm font-bold">العملة<select value={currency} onChange={e => setCurrency(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-line bg-white px-3 dark:bg-[#1a2430]"><option value="EGP">جنيه مصري (EGP)</option><option value="USD">دولار أمريكي (USD)</option></select></label></div></div>
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <Button disabled={busy || !file || !title.trim() || !description.trim() || price === ""} onClick={publish} className="w-full">{busy ? "جارٍ رفع الملف وحفظ المنتج..." : "رفع الملف ونشر المنتج"}</Button>
      {busy && <p className="text-xs text-slate-500">لا تغلق الصفحة حتى يكتمل الرفع. قد يستغرق الملف الكبير وقتًا.</p>}
    </Card>
  </div>;
}
