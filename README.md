# Digital Market — ديجيتال ماركت

منصة عربية لبيع وشراء المنتجات الرقمية، مبنية باستخدام Next.js 14 App Router وTypeScript وTailwind CSS وSupabase.

**الموقع:** https://digital-market-pink.vercel.app  
**المستودع:** https://github.com/wahedelfar/digital-market

## التقنيات

- Next.js 14 وTypeScript strict.
- Tailwind CSS وواجهات عربية تدعم RTL والوضع الداكن.
- Supabase Auth وPostgres وStorage.
- Recharts لرسوم لوحة التحكم.
- Paymob كمسار الدفع الأساسي المخطط للسوق المصري.

## تشغيل المشروع محليًا

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

ثم افتح `http://localhost:3000`.

## إعداد Supabase

1. أنشئ مشروع Supabase أو استخدم المشروع المرتبط بالفعل.
2. أضف متغيرات البيئة من `.env.example` إلى إعدادات المشروع في Vercel والبيئة المحلية.
3. ملف المخطط الأساسي: `supabase/migrations/001_initial_schema.sql`.
4. يحتوي المخطط على `profiles` و`products` و`sales` و`downloads` مع سياسات RLS وفهارس أساسية.
5. ينشئ المخطط bucket خاصًا باسم `digital-files` بحد أقصى 2GB وسياسات وصول مبنية على مجلد المستخدم.

### متغيرات البيئة

- `NEXT_PUBLIC_SUPABASE_URL`: رابط مشروع Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: مفتاح publishable/anon العام. يجوز استخدامه في المتصفح مع سياسات RLS صحيحة.
- `SUPABASE_SERVICE_ROLE_KEY`: مفتاح خادم حساس فقط. لا تضعه في متغير يبدأ بـ `NEXT_PUBLIC_` ولا تضفه إلى Git.
- `NEXT_PUBLIC_SITE_URL`: عنوان الموقع العام.
- `PAYMOB_API_KEY`, `PAYMOB_INTEGRATION_ID`, `PAYMOB_IFRAME_ID`, `PAYMOB_HMAC_SECRET`: إعدادات Paymob على الخادم فقط.

لا ترفع ملف `.env` أو `.env.local` إلى GitHub. ملف `.env.example` مخصص لأسماء المتغيرات والقيم العامة غير السرية.

## المسارات الرئيسية

- `/`: واجهة السوق والبحث والفئات.
- `/p/[slug]`: صفحة المنتج.
- `/checkout/[slug]`: تدفق الشراء.
- `/dashboard`: لوحة البائع.
- `/dashboard/new`: إضافة منتج.
- `/dashboard/products`, `/dashboard/sales`, `/dashboard/payouts`, `/dashboard/settings`: إدارة المتجر.

## الدفع والتنزيلات

لا تُدخل مفاتيح Paymob أو مفاتيح الخادم في ملفات الواجهة. قبل تفعيل البيع الحقيقي، يجب أن يكون تأكيد الدفع صادرًا من خادم موثوق بعد التحقق من توقيع webhook، وألا يُعتبر رجوع المستخدم إلى صفحة النجاح إثباتًا للدفع. يجب إصدار رابط Storage موقّع بعد التحقق من رمز التنزيل، وانتهاء الصلاحية، وحد التنزيلات في قاعدة البيانات.

## التحقق

```bash
pnpm typecheck
pnpm build
pnpm start
```

> ملاحظة حالة التنفيذ: المخطط الأساسي والتخزين الخاص تم إعدادهما على Supabase. يجب التحقق من كل مسار مصادقة وشراء وتنزيل على بيئة النشر قبل اعتبار المنصة جاهزة لاستقبال مدفوعات أو ملفات عملاء حقيقية.
