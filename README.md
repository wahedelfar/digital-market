# Digital Market

منصة عربية أولًا لبيع المنتجات الرقمية، مبنية بـ **Next.js 14 App Router** وTypeScript strict وTailwind CSS. التجربة تعمل مباشرة ببيانات mock حتى قبل إضافة مفاتيح Supabase، مع طبقات جاهزة للتحويل إلى الإنتاج.

## التشغيل المحلي

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

افتح `http://localhost:3000`.

## أهم المسارات

- `/` السوق، البحث، الفئات والفلاتر.
- `/p/brand-starter-kit` صفحة بيع منتج.
- `/checkout/brand-starter-kit` الدفع التجريبي.
- `/dashboard` لوحة البائع والإحصاءات.
- `/dashboard/new` رفع ونشر منتج جديد.
- `/dashboard/products` و`/dashboard/sales` و`/dashboard/payouts` و`/dashboard/settings`.

## Supabase

1. أنشئ مشروعًا جديدًا في Supabase.
2. انسخ القيم إلى `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` للخادم فقط.
3. نفّذ ملف `supabase/migrations/001_initial_schema.sql` من SQL Editor.
4. فعّل Email وGoogle وMagic Link من Authentication Providers.
5. أنشئ bucket خاصًا للملفات الرقمية، واستخدم طبقة `lib/storage` لإصدار الروابط الموقعة بدل كشف المسار الأصلي.

## الدفع والتخزين

`lib/payments` يحتوي واجهة موحدة وadapters لـ Paymob وFawry وStripe وPayPal، مع أولوية Paymob لمصر. الواجهة الحالية تحاكي النتيجة الناجحة كي تبقى التجربة قابلة للاختبار بلا أسرار دفع. قبل الإنتاج، أضف مفاتيح المزود إلى بيئة الخادم واربط webhooks والتحقق من التوقيع.

## التحقق والبناء

```bash
pnpm typecheck
pnpm build
pnpm start
```

لا تضع أي مفاتيح سرية في Git. ملف `.env.example` هو المرجع الوحيد لأسماء المتغيرات.
