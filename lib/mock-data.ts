export type ProductCategory = "كتب" | "قوالب" | "كورسات" | "تصميمات";
export type ProductLanguage = "العربية" | "الإنجليزية";

export type Product = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  seller: string;
  sellerInitials: string;
  category: ProductCategory;
  language: ProductLanguage;
  price: number;
  currency: "EGP" | "USD";
  salesCount: number;
  rating: number;
  reviews: number;
  featured?: boolean;
  trending?: boolean;
  format: string;
  size: string;
  thumbnail: string;
  accent: string;
  includes: string[];
};

export const products: Product[] = [
  {
    id: "p1",
    slug: "brand-starter-kit",
    title: "Brand Starter Kit",
    shortDescription: "هوية بصرية عربية تبدأ بها علامتك من المكان الصحيح.",
    description: "نظام متكامل يساعدك على بناء هوية واضحة ومتماسكة لعلامتك الناشئة، مع ملفات قابلة للتعديل وأمثلة عربية عملية.",
    seller: "استوديو أثر",
    sellerInitials: "أث",
    category: "قوالب",
    language: "العربية",
    price: 490,
    currency: "EGP",
    salesCount: 128,
    rating: 4.9,
    reviews: 24,
    featured: true,
    trending: true,
    format: "Figma + PDF",
    size: "84 MB",
    thumbnail: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=85",
    accent: "#f26a4f",
    includes: ["قالب هوية كامل على Figma", "دليل ألوان وخطوط عربية", "42 نموذجًا للاستخدام اليومي", "تحديثات مجانية لمدة عام"]
  },
  {
    id: "p2",
    slug: "notion-freelance-os",
    title: "Freelance OS — Notion",
    shortDescription: "مساحة عمل هادئة تجمع مشاريعك وعملاءك ودخلك.",
    description: "نظام Notion عربي للمستقلين يخفف الفوضى ويمنحك صورة واحدة لكل مشروع وموعد وفاتورة.",
    seller: "رنا الخطيب",
    sellerInitials: "رك",
    category: "قوالب",
    language: "العربية",
    price: 320,
    currency: "EGP",
    salesCount: 86,
    rating: 4.8,
    reviews: 17,
    trending: true,
    format: "Notion template",
    size: "12 MB",
    thumbnail: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=900&q=85",
    accent: "#3f8f79",
    includes: ["لوحة مشاريع وعملاء", "متابعة الدخل والمصروفات", "قوالب عروض وفواتير", "فيديو شرح سريع بالعربية"]
  },
  {
    id: "p3",
    slug: "arabic-copywriting-playbook",
    title: "Arabic Copywriting Playbook",
    shortDescription: "اكتب صفحات بيع تُقرأ وتُقنع وتُباع.",
    description: "كتاب إلكتروني عملي مليء بالأمثلة والقوالب لكتابة العناوين، صفحات الهبوط، ورسائل البريد بأسلوب عربي حديث.",
    seller: "ياسر نجيب",
    sellerInitials: "ين",
    category: "كتب",
    language: "العربية",
    price: 180,
    currency: "EGP",
    salesCount: 214,
    rating: 4.7,
    reviews: 42,
    featured: true,
    format: "PDF · 168 صفحة",
    size: "18 MB",
    thumbnail: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=85",
    accent: "#e8b44f",
    includes: ["168 صفحة عملية", "90 قالبًا جاهزًا", "قائمة تدقيق قبل النشر", "نسخة Kindle وPDF"]
  },
  {
    id: "p4",
    slug: "product-design-foundations",
    title: "Product Design Foundations",
    shortDescription: "من الفكرة إلى واجهة يستخدمها الناس بحب.",
    description: "دورة قصيرة للمصممين وأصحاب المنتجات عن البحث، الهيكلة، اختبار النماذج، وبناء واجهات أكثر وضوحًا.",
    seller: "دينا مراد",
    sellerInitials: "دم",
    category: "كورسات",
    language: "الإنجليزية",
    price: 29,
    currency: "USD",
    salesCount: 63,
    rating: 4.9,
    reviews: 11,
    format: "Video course",
    size: "2.1 GB",
    thumbnail: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=900&q=85",
    accent: "#7b68ee",
    includes: ["6 ساعات فيديو", "ملفات Figma كاملة", "تمارين تطبيقية", "جلسة أسئلة وأجوبة"]
  },
  {
    id: "p5",
    slug: "social-content-calendar",
    title: "مفكرة المحتوى الاجتماعية",
    shortDescription: "90 فكرة عربية لمحتوى لا يشبه الضجيج.",
    description: "تقويم محتوى قابل للتعديل لمدة 90 يومًا، مصمم لرواد الأعمال وصناع المحتوى الذين يريدون الاستمرارية بلا ضغط.",
    seller: "نور غنيم",
    sellerInitials: "نغ",
    category: "كتب",
    language: "العربية",
    price: 150,
    currency: "EGP",
    salesCount: 94,
    rating: 4.6,
    reviews: 13,
    format: "PDF + Sheets",
    size: "9 MB",
    thumbnail: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=900&q=85",
    accent: "#d68b9a",
    includes: ["90 فكرة منشور", "تقويم Google Sheets", "نظام إعادة الاستخدام", "أمثلة captions عربية"]
  },
  {
    id: "p6",
    slug: "minimal-icon-library",
    title: "Minimal Icon Library",
    shortDescription: "أكثر من 400 أيقونة نظيفة لكل شاشاتك.",
    description: "مجموعة أيقونات هندسية خفيفة بصيغ SVG وFigma، مناسبة للمنتجات الرقمية والعروض ومواقع الويب.",
    seller: "بكسل عربي",
    sellerInitials: "بع",
    category: "تصميمات",
    language: "الإنجليزية",
    price: 16,
    currency: "USD",
    salesCount: 157,
    rating: 4.8,
    reviews: 29,
    format: "SVG + Figma",
    size: "46 MB",
    thumbnail: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=900&q=85",
    accent: "#6b9bd2",
    includes: ["400+ SVG icon", "3 أوزان مختلفة", "ملف Figma منظم", "ترخيص تجاري"]
  }
];

export const categories = [
  { label: "الكل", icon: "✦", count: 128 },
  { label: "كتب", icon: "▤", count: 42 },
  { label: "قوالب", icon: "◫", count: 36 },
  { label: "كورسات", icon: "▷", count: 18 },
  { label: "تصميمات", icon: "✳", count: 32 }
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
