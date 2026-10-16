# Digital Market — ديجيتال ماركت

منصة عربية لبيع وشراء المنتجات الرقمية، مبنية باستخدام Next.js 14 App Router وTypeScript وTailwind CSS وSupabase.

**الموقع:** https://digital-market-pink.vercel.app  
**المستودع:** https://github.com/wahedelfar/digital-market

## التقنيات

- Next.js 14 وTypeScript strict.
- Tailwind CSS وواجهات عربية تدعم RTL والوضع الداكن.
- Supabase Auth وPostgres وStorage.
- Recharts لرسوم لوحة التحكم.
- PayPal Checkout (Sandbox افتراضيًا).

## تشغيل المشروع محليًا

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

## إعداد PayPal Sandbox

1. افتح https://developer.paypal.com/dashboard/applications/sandbox وأنشئ تطبيقًا من نوع REST API.
2. انسخ Client ID إلى `NEXT_PUBLIC_PAYPAL_CLIENT_ID` و`PAYPAL_CLIENT_ID`.
3. انسخ Secret إلى `PAYPAL_CLIENT_SECRET` فقط. لا تضعه في متغير يبدأ بـ `NEXT_PUBLIC_` ولا في Git.
4. اضبط `PAYPAL_MODE=sandbox` و`PAYPAL_CURRENCY=USD`.
5. أضف المتغيرات إلى Vercel في بيئات Preview وProduction حسب الحاجة، ثم أعد النشر.
6. اختبر ببيانات حسابات Sandbox من لوحة PayPal Developer. لا تستخدم أموالًا حقيقية أثناء اختبار Sandbox.

**مهم:** إصدار الدفع الحالي يقبل المنتجات ذات العملة USD فقط. لا تغيّر عملة منتج مسعّر بالجنيه إلى USD دون تحديد سعر دولار صحيح؛ لا توجد هنا آلية تحويل عملة. يلزم مراجعة إعدادات العملة وسياسة الضرائب قبل الإطلاق الحقيقي.

## إعداد Supabase

- `NEXT_PUBLIC_SUPABASE_URL`: رابط مشروع Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: مفتاح publishable/anon العام.
- `SUPABASE_SERVICE_ROLE_KEY`: سر الخادم فقط. لا تعرضه للمتصفح أو Git.
- `NEXT_PUBLIC_SITE_URL`: عنوان الموقع.
- ملف المخطط الأساسي: `supabase/migrations/001_initial_schema.sql`.

لا ترفع `.env` أو `.env.local` إلى GitHub.

## المسارات الرئيسية

- `/`: واجهة السوق.
- `/p/[slug]`: صفحة المنتج.
- `/checkout/[slug]`: إتمام الطلب وPayPal.
- `/dashboard`: لوحة البائع.
- `/dashboard/new`: إضافة منتج.
- `/dashboard/products`, `/dashboard/sales`: إدارة المنتجات والمبيعات.
- `/api/paypal/create-order`: إنشاء طلب PayPal بعد قراءة السعر من قاعدة البيانات.
- `/api/paypal/capture`: التحقق من المنتج والمبلغ ثم تحصيل الدفع وتسجيل البيع ورمز التنزيل.
- `/api/download/[token]`: التحقق من رمز التنزيل وإصدار رابط مؤقت للملف الخاص.

## الأمان والتحقق

- مفتاح PayPal السري ومفتاح Supabase service role مخصصان للخادم فقط.
- لا يُسمح بإصدار رمز تنزيل من واجهة المتصفح وحدها.
- يجب اختبار حدود التنزيل، انتهاء الصلاحية، ومنع إعادة استخدام عملية التحصيل.
- قبل البيع الحقيقي، نفّذ مراجعة أمنية مستقلة، واختبر سياسات RLS، ومعالجة حالات انقطاع الشبكة أو نجاح الدفع مع فشل تسجيل البيع، وأضف مراقبة وتسوية للمدفوعات.

## فحوص المشروع

```bash
pnpm typecheck
pnpm build
```

لا تعتبر المنصة جاهزة للإنتاج إلا بعد نجاح الفحوص واختبار رحلة شراء كاملة باستخدام حسابات Sandbox، ثم ضبط حساب PayPal Business وبيانات Live بشكل منفصل.
