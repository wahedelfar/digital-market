# TODO — Digital Market

## 1. منصة Next.js وتجربة عربية RTL
- [ ] يجب أن يعمل الموقع كتطبيق Next.js 14 App Router مع TypeScript strict وTailwind CSS وواجهة مكونات بأسلوب shadcn/ui، وأن يكون RTL افتراضيًا responsive مع dark/light mode.
- [ ] يجب أن يحتوي المشروع على `/app/(marketing)/` و`/app/(dashboard)/` و`/app/p/[slug]/` و`/components/` و`/lib/` و`/supabase/`، وأن يكون جاهزًا للنشر على Manus hosting.

## 2. تدفق البائع خلال 60 ثانية
- [ ] على `/dashboard/new` يستطيع البائع رفع PDF أو ZIP أو MP4 حتى 2GB، مع progress bar، وإدخال الاسم والوصف بالعربية والإنجليزية والسعر EGP/USD والصورة المصغرة، ثم النشر والحصول على رابط `/p/[slug]`.
- [ ] يجب أن تكون روابط التنزيل موقعة ومؤقتة، بلا direct URL للملفات، مع انتهاء 48 ساعة أو بعد 3 تنزيلات، وواجهات rate limiting جاهزة.

## 3. تدفق المشتري
- [ ] يجب أن تعرض `/p/[slug]` صفحة بيع جميلة تحتوي الغلاف والعنوان والسعر والمعاينة وزر الشراء.
- [ ] يجب أن تعرض `/checkout/[slug]` التقاط البريد وتكامل Paymob/Fawry mock وصفحة نجاح مع زر تنزيل ومفتاح ترخيص بالبريد.

## 4. السوق والمنتجات
- [ ] الصفحة الرئيسية `/` تعرض Discover والبحث والفئات كتب، قوالب، كورسات، تصميمات، وفلاتر السعر واللغة وtrending.
- [ ] يجب أن تتوفر صفحات منتجات SSR ببيانات وصفية SEO وOG ديناميكية.

## 5. لوحة البائع
- [ ] `/dashboard` تعرض إجمالي المبيعات والإيرادات والمشاهدات برسوم Recharts.
- [ ] `/dashboard/products` توفر CRUD للمنتجات، و`/dashboard/sales` قائمة المبيعات مع بريد المشتري والمبلغ والتاريخ.
- [ ] `/dashboard/payouts` تعرض الرصيد وتتيح طلب السحب، و`/dashboard/settings` تسمح باسم المتجر والنبذة وحساب Paymob.

## 6. البنية الخلفية
- [ ] يجب أن تكون Supabase Client Ready دون hardcode للمفاتيح، مع `.env.example`، وAuth للبريد وGoogle وMagic Link، وStorage compatible مع Supabase/R2.
- [ ] يجب إنشاء migrations لجداول profiles وproducts وsales وdownloads مع RLS ready.
- [ ] يجب إنشاء abstract payment interface مع Paymob وFawry وStripe وPayPal، وواجهات signed download وupload جاهزة.

## 7. التسليم
- [ ] إضافة README.md بالعربية يشرح التشغيل وإعداد Supabase، وفحص lint/typecheck/build، ثم حفظ النسخة ودفعها إلى مستودع GitHub المحدد.
