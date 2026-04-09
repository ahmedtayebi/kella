import Link from "next/link";
import Image from "next/image";
import {
  Pill,
  Leaf,
  Sparkles,
  Stethoscope,
  Baby,
  Droplets,
  Truck,
  ShieldCheck,
  Wallet,
  Headphones,
  ArrowLeft,
  MapPin,
  ShoppingBag,
  ChevronLeft,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Category, Product } from "@/types";

// ─────────────────────────────────────────────
//  CATEGORY ICON MAP  (slug → Lucide icon)
// ─────────────────────────────────────────────
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  adwiya: <Pill size={32} strokeWidth={1.5} />,
  mokamelat: <Leaf size={32} strokeWidth={1.5} />,
  tajmil: <Sparkles size={32} strokeWidth={1.5} />,
  "ajhiza-tibiya": <Stethoscope size={32} strokeWidth={1.5} />,
  atfal: <Baby size={32} strokeWidth={1.5} />,
  nathafa: <Droplets size={32} strokeWidth={1.5} />,
};

// ─────────────────────────────────────────────
//  DATA FETCHING
// ─────────────────────────────────────────────
async function fetchData() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return { categories: [], products: [] };
    }
    const supabase = await createClient();
    const [catRes, prodRes] = await Promise.all([
      supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order"),
      supabase
        .from("products")
        .select("id, name, slug, price, compare_price, images, category_id")
        .eq("is_featured", true)
        .eq("is_active", true)
        .limit(8),
    ]);
    return {
      categories: (catRes.data ?? []) as Category[],
      products: (prodRes.data ?? []) as Product[],
    };
  } catch {
    return { categories: [], products: [] };
  }
}

// ─────────────────────────────────────────────
//  PAGE
// ─────────────────────────────────────────────
export default async function HomePage() {
  const { categories, products } = await fetchData();

  return (
    <>
      <HeroSection />
      <CategoriesSection categories={categories} />
      <FeaturedProductsSection products={products} />
      <TrustSection />
      <AboutSection />
    </>
  );
}

// ══════════════════════════════════════════════
//  1. HERO
// ══════════════════════════════════════════════
function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-white"
      style={{ minHeight: "calc(100vh - 68px)" }}
      aria-label="الرئيسية"
    >
      {/* ── Background: repeating pharmacy cross pattern ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect x='27' y='14' width='10' height='36' rx='2' fill='%231B8C3A' fill-opacity='0.055'/%3E%3Crect x='14' y='27' width='36' height='10' rx='2' fill='%231B8C3A' fill-opacity='0.055'/%3E%3C/svg%3E")`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* ── Soft green radial glow (top-right, which is RTL start) ── */}
      <div
        aria-hidden="true"
        className="absolute top-0 end-0 w-[600px] h-[600px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 80% 20%, rgba(27,140,58,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center py-16 lg:py-0" style={{ minHeight: "calc(100vh - 68px)" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">

          {/* ── TEXT column (RIGHT in RTL) ── */}
          <div className="space-y-7 text-right">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary-50)] border border-[var(--color-primary-100)]">
              <MapPin size={13} className="text-[var(--color-primary)]" />
              <span className="text-[13px] font-semibold text-[var(--color-primary)]">
                صيدلية كيلالا — ليوة، الوادي
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-[48px] sm:text-[56px] lg:text-[64px] font-black leading-[1.15] tracking-tight text-[var(--color-secondary)]">
                صحتك{" "}
                <span className="relative inline-block text-[var(--color-primary)]">
                  أمانة
                  {/* Underline accent */}
                  <svg
                    aria-hidden="true"
                    className="absolute -bottom-2 start-0 w-full"
                    height="6"
                    viewBox="0 0 100 6"
                    preserveAspectRatio="none"
                    fill="none"
                  >
                    <path
                      d="M0 4 Q25 1 50 4 Q75 7 100 4"
                      stroke="#1B8C3A"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.5"
                    />
                  </svg>
                </span>
                <br />
                بين أيدينا
              </h1>
              <p className="text-[17px] text-[var(--color-muted)] leading-relaxed max-w-md ml-auto text-right" dir="rtl">
                نوفر لك أفضل الأدوية والمنتجات الصحية بأسعار مناسبة، مع خدمة توصيل
                سريعة وآمنة إلى جميع الولايات الجزائرية الـ 58.
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-3 justify-right">
              <Link
                href="/products"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[var(--color-primary)] text-white font-bold text-[15px] hover:bg-[var(--color-primary-light)] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_14px_0_rgba(27,140,58,0.3)]"
              >
                تصفح المنتجات
                <ChevronLeft size={18} />
              </Link>
              <Link
                href="/#about"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-[var(--color-border-strong)] text-[var(--color-secondary)] font-semibold text-[15px] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-50)] transition-all duration-200"
              >
                تعرف علينا
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 justify-right pt-2">
              <div className="text-right">
                <p className="text-[28px] font-black text-[var(--color-secondary)] leading-none">58</p>
                <p className="text-[12px] text-[var(--color-muted)] font-semibold mt-1">ولاية</p>
              </div>
              <div className="w-px h-10 bg-[var(--color-border)]" />
              <div className="text-right">
                <p className="text-[28px] font-black text-[var(--color-secondary)] leading-none">100%</p>
                <p className="text-[12px] text-[var(--color-muted)] font-semibold mt-1">أصيل</p>
              </div>
              <div className="w-px h-10 bg-[var(--color-border)]" />
              <div className="text-right">
                <p className="text-[28px] font-black text-[var(--color-secondary)] leading-none">دفع</p>
                <p className="text-[12px] text-[var(--color-muted)] font-semibold mt-1">عند الاستلام</p>
              </div>
            </div>
          </div>

          {/* ── ILLUSTRATION column (LEFT in RTL) ── */}
          <div
            className="hidden lg:flex items-center justify-center"
            aria-hidden="true"
          >
            <HeroIllustration />
          </div>
        </div>
      </div>


    </section>
  );
}

// ── Hero decorative illustration ──
function HeroIllustration() {
  return (
    <div className="relative w-[420px] h-[420px]">
      {/* Concentric circles */}
      {[200, 160, 120].map((r, i) => (
        <div
          key={r}
          className="absolute inset-0 m-auto rounded-full border border-[var(--color-primary)]"
          style={{
            width: r * 2,
            height: r * 2,
            opacity: 0.06 + i * 0.03,
          }}
        />
      ))}

      {/* Large pharmacy cross — center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width="220" height="220" viewBox="0 0 220 220" fill="none">
          {/* Cross shape */}
          <rect x="77" y="20" width="66" height="180" rx="16" fill="#1B8C3A" fillOpacity="0.10" />
          <rect x="20" y="77" width="180" height="66" rx="16" fill="#1B8C3A" fillOpacity="0.10" />
          {/* Inner cross (slightly lighter) */}
          <rect x="87" y="30" width="46" height="160" rx="10" fill="#1B8C3A" fillOpacity="0.08" />
          <rect x="30" y="87" width="160" height="46" rx="10" fill="#1B8C3A" fillOpacity="0.08" />
        </svg>
      </div>

      {/* Floating pill card — top left */}
      <div className="absolute top-10 start-4 bg-white rounded-2xl shadow-[0_4px_20px_0_rgb(0_0_0/0.08)] border border-[var(--color-border)] p-3.5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[var(--color-primary-50)] flex items-center justify-center flex-shrink-0">
          <Pill size={18} strokeWidth={1.5} className="text-[var(--color-primary)]" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-[var(--color-secondary)]">أدوية أصيلة</p>
          <p className="text-[10px] text-[var(--color-muted)]">100% معتمدة</p>
        </div>
      </div>

      {/* Floating delivery card — bottom right */}
      <div className="absolute bottom-10 end-4 bg-white rounded-2xl shadow-[0_4px_20px_0_rgb(0_0_0/0.08)] border border-[var(--color-border)] p-3.5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[var(--color-primary-50)] flex items-center justify-center flex-shrink-0">
          <Truck size={18} strokeWidth={1.5} className="text-[var(--color-primary)]" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-[var(--color-secondary)]">توصيل سريع</p>
          <p className="text-[10px] text-[var(--color-muted)]">58 ولاية</p>
        </div>
      </div>

      {/* Floating verified card — middle left */}
      <div className="absolute top-1/2 -translate-y-1/2 -start-6 bg-[var(--color-primary)] rounded-2xl shadow-[0_4px_20px_0_rgba(27,140,58,0.3)] p-3.5 flex items-center gap-2.5">
        <ShieldCheck size={18} strokeWidth={1.5} className="text-white" />
        <p className="text-[11px] font-bold text-white whitespace-nowrap">دفع آمن</p>
      </div>

      {/* Decorative dots */}
      {[
        { top: "15%", right: "15%" },
        { top: "80%", right: "18%" },
        { top: "20%", left: "18%" },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]"
          style={{ ...pos, opacity: 0.2 + i * 0.05 }}
        />
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════
//  2. CATEGORIES
// ══════════════════════════════════════════════

// Fallback static categories for when DB isn't connected
const STATIC_CATEGORIES: Category[] = [
  { id: "1", name: "أدوية", slug: "adwiya", icon: "", sort_order: 1, is_active: true, created_at: "" },
  { id: "2", name: "مكملات غذائية", slug: "mokamelat", icon: "", sort_order: 2, is_active: true, created_at: "" },
  { id: "3", name: "تجميل وعناية", slug: "tajmil", icon: "", sort_order: 3, is_active: true, created_at: "" },
  { id: "5", name: "أطفال ورضع", slug: "atfal", icon: "", sort_order: 5, is_active: true, created_at: "" },
  { id: "6", name: "نظافة", slug: "nathafa", icon: "", sort_order: 6, is_active: true, created_at: "" },
];

function CategoriesSection({ categories }: { categories: Category[] }) {
  const display = categories.length > 0 ? categories : STATIC_CATEGORIES;

  return (
    <section className="py-20 bg-[var(--color-surface-warm)]" aria-label="التصنيفات">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[13px] font-bold text-[var(--color-primary)] tracking-widest uppercase mb-3">
            تصفح حسب الفئة
          </p>
          <h2 className="text-[32px] sm:text-[38px] font-black text-[var(--color-secondary)] mb-4">
            ماذا تبحث عن؟
          </h2>
          <p className="text-[16px] text-[var(--color-muted)] max-w-md mx-auto">
            اختر من بين تصنيفاتنا المتنوعة للعثور على ما تحتاجه بسرعة وسهولة
          </p>
        </div>

        {/* Grid */}
        <div className="flex flex-wrap gap-4 justify-center items-center">
          {display.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center gap-4 p-6 bg-white rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-[0_4px_20px_0_rgba(27,140,58,0.12)] transition-all duration-250 text-center"
            >
              {/* Icon container */}
              <div className="w-14 h-14 rounded-xl bg-[var(--color-surface-warm)] group-hover:bg-[var(--color-primary-50)] flex items-center justify-center text-[var(--color-secondary)] group-hover:text-[var(--color-primary)] transition-all duration-250 flex-shrink-0">
                {CATEGORY_ICONS[cat.slug] ?? <Pill size={32} strokeWidth={1.5} />}
              </div>
              {/* Name */}
              <span className="text-[14px] font-bold text-[var(--color-secondary)] group-hover:text-[var(--color-primary)] transition-colors duration-200 leading-snug">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════
//  3. FEATURED PRODUCTS
// ══════════════════════════════════════════════
function FeaturedProductsSection({ products }: { products: Product[] }) {
  return (
    <section className="py-20 bg-white" aria-label="المنتجات المميزة">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-[13px] font-bold text-[var(--color-primary)] tracking-widest uppercase mb-3">
              منتجاتنا
            </p>
            <h2 className="text-[32px] sm:text-[38px] font-black text-[var(--color-secondary)]">
              المنتجات المميزة
            </h2>
          </div>
          <Link
            href="/products"
            className="flex-shrink-0 flex items-center gap-1.5 text-[14px] font-bold text-[var(--color-primary)] hover:gap-3 transition-all duration-200 group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
            عرض الكل
          </Link>
        </div>

        {products.length === 0 ? (
          <EmptyProductsState />
        ) : (
          /* Horizontal scroll on mobile, grid on desktop */
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:pb-0 snap-x snap-mandatory sm:snap-none">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const hasImage = product.images && product.images.length > 0;
  const hasDiscount = product.compare_price && product.compare_price > product.price;

  return (
    <article className="flex-shrink-0 w-[220px] sm:w-auto snap-start sm:snap-align-none bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden group hover:shadow-[0_8px_30px_0_rgb(0_0_0/0.1)] hover:border-[var(--color-primary-100)] transition-all duration-250">
      {/* Image */}
      <div className="relative aspect-square bg-[var(--color-surface-warm)] overflow-hidden">
        {hasImage ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 220px, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-350"
          />
        ) : (
          <ProductImagePlaceholder name={product.name} />
        )}
        {hasDiscount && (
          <div className="absolute top-3 start-3 px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-lg">
            خصم
          </div>
        )}
        {product.requires_prescription && (
          <div className="absolute top-3 end-3 px-2 py-1 bg-[var(--color-secondary)] text-white text-[10px] font-bold rounded-lg">
            وصفة طبية
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        <h3 className="text-[14px] font-bold text-[var(--color-foreground)] line-clamp-2 leading-snug text-right">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center justify-end gap-2">
          {hasDiscount && (
            <span className="text-[13px] text-[var(--color-muted)] line-through">
              {product.compare_price?.toLocaleString("ar-DZ")} دج
            </span>
          )}
          <span className="text-[17px] font-black text-[var(--color-primary)]">
            {product.price.toLocaleString("ar-DZ")} دج
          </span>
        </div>

        {/* Add to cart */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[var(--color-primary-50)] text-[var(--color-primary)] font-bold text-[13px] hover:bg-[var(--color-primary)] hover:text-white transition-all duration-200 group/btn"
          aria-label={`أضف ${product.name} إلى السلة`}
        >
          <ShoppingBag size={15} strokeWidth={2} />
          أضف للسلة
        </button>
      </div>
    </article>
  );
}

function ProductImagePlaceholder({ name }: { name: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[var(--color-surface-warm)]">
      <svg width="48" height="48" viewBox="0 0 34 34" fill="none" aria-hidden="true">
        <rect width="34" height="34" rx="8" fill="#1B8C3A" fillOpacity="0.1" />
        <path
          d="M13.5 7H20.5V13.5H27V20.5H20.5V27H13.5V20.5H7V13.5H13.5V7Z"
          fill="#1B8C3A"
          fillOpacity="0.4"
        />
      </svg>
      <span className="text-[11px] text-[var(--color-muted)] text-center px-4 leading-snug">
        {name}
      </span>
    </div>
  );
}

function EmptyProductsState() {
  return (
    <div className="flex flex-col items-center gap-5 py-20 text-center">
      <div className="w-20 h-20 rounded-2xl bg-[var(--color-surface-warm)] flex items-center justify-center">
        <ShoppingBag size={32} strokeWidth={1.25} className="text-[var(--color-muted)]" />
      </div>
      <div>
        <p className="text-[18px] font-bold text-[var(--color-secondary)] mb-2">
          لا توجد منتجات مميزة حالياً
        </p>
        <p className="text-[14px] text-[var(--color-muted)]">
          تفقد قسم المنتجات لاستعراض جميع المنتجات المتوفرة
        </p>
      </div>
      <Link
        href="/products"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold text-[14px] hover:bg-[var(--color-primary-light)] transition-colors duration-200"
      >
        <ChevronLeft size={16} />
        تصفح المنتجات
      </Link>
    </div>
  );
}

// ══════════════════════════════════════════════
//  4. TRUST SECTION
// ══════════════════════════════════════════════
const TRUST_ITEMS = [
  {
    icon: <Truck size={28} strokeWidth={1.5} />,
    title: "توصيل لجميع الولايات",
    desc: "خدمة توصيل موثوقة تصل إلى جميع الولايات الجزائرية الـ 58 بأسعار مناسبة",
  },
  {
    icon: <ShieldCheck size={28} strokeWidth={1.5} />,
    title: "منتجات أصيلة 100%",
    desc: "جميع منتجاتنا مرخصة ومعتمدة من الجهات الصحية الجزائرية",
  },
  {
    icon: <Wallet size={28} strokeWidth={1.5} />,
    title: "دفع عند الاستلام",
    desc: "ادفع بأمان عند استلام طلبك مباشرةً، بدون أي مخاطر",
  },
  {
    icon: <Headphones size={28} strokeWidth={1.5} />,
    title: "خدمة عملاء متاحة",
    desc: "فريقنا متاح للإجابة على استفساراتك طوال أيام الأسبوع",
  },
];

function TrustSection() {
  return (
    <section
      className="py-16 bg-[var(--color-surface-warm)] border-y border-[var(--color-border)]"
      aria-label="مزايانا"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 divide-y sm:divide-y-0 sm:divide-x-reverse sm:divide-x divide-[var(--color-border)]">
          {TRUST_ITEMS.map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center gap-4 px-6 py-10 group hover:bg-white transition-colors duration-200"
            >
              {/* Icon circle */}
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary-50)] border border-[var(--color-primary-100)] flex items-center justify-center text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white group-hover:border-[var(--color-primary)] transition-all duration-250 flex-shrink-0">
                {item.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-[16px] font-black text-[var(--color-secondary)] leading-snug">
                  {item.title}
                </h3>
                <p className="text-[13px] text-[var(--color-muted)] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════
//  5. ABOUT
// ══════════════════════════════════════════════
function AboutSection() {
  return (
    <section className="py-24 bg-white" aria-label="من نحن" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Decorative illustration (RIGHT in RTL) ── */}
          <div className="flex items-center justify-center order-last lg:order-first" aria-hidden="true">
            <AboutIllustration />
          </div>

          {/* ── Text (LEFT in RTL = grid col 2) ── */}
          <div className="space-y-6 text-right">
            <div>
              <p className="text-[13px] font-bold text-[var(--color-primary)] tracking-widest uppercase mb-3">
                من نحن
              </p>
              <h2 className="text-[32px] sm:text-[40px] font-black text-[var(--color-secondary)] leading-snug mb-4">
                صيدلية كيلالا
                <span className="block text-[var(--color-primary)]">في ليوة، الوادي</span>
              </h2>
            </div>

            <div className="space-y-4 text-[16px] text-[var(--color-muted)] leading-relaxed">
              <p>
                صيدلية كيلالا هي مؤسسة صيدلانية موثوقة تعمل في مدينة ليوة بولاية الوادي. نلتزم بتقديم أفضل الخدمات الصيدلانية لسكان المنطقة وضمان حصولهم على الأدوية والمنتجات الصحية الأصيلة.
              </p>
              <p>
                نوفر مجموعة واسعة من الأدوية، المكملات الغذائية، منتجات التجميل والعناية،   إضافة إلى منتجات الأطفال والنظافة الشخصية — كل ذلك تحت سقف واحد.
              </p>
            </div>

            {/* Highlights */}
            <ul className="space-y-3" role="list">
              {[
                "أدوية مرخصة ومعتمدة من وزارة الصحة",
                "توصيل موثوق إلى كامل التراب الوطني",
                "فريق صيدلاني متخصص وذو خبرة",
                "أسعار تنافسية وشفافة",
              ].map((point, i) => (
                <li key={i} className="flex items-center gap-3 justify-right">
                  <div className="w-5 h-5 rounded-full bg-[var(--color-primary-50)] border border-[var(--color-primary-100)] flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 2.5" stroke="#1B8C3A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-[15px] font-semibold text-[var(--color-foreground)]">
                    {point}
                  </span>

                </li>
              ))}
            </ul>

            <div className="pt-2">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[var(--color-secondary)] text-white font-bold text-[15px] hover:bg-[var(--color-secondary-light)] transition-all duration-200"
              >
                تواصل معنا
                <ArrowLeft size={17} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── About decorative illustration ──
function AboutIllustration() {
  return (
    <div className="relative w-[340px] h-[340px]">
      {/* Background card */}
      <div className="absolute inset-6 bg-[var(--color-secondary)] rounded-[2rem] opacity-5" />

      {/* Main card */}
      <div className="absolute inset-0 bg-[var(--color-primary-50)] rounded-[2rem] border border-[var(--color-primary-100)] overflow-hidden flex items-center justify-center">
        {/* Pharmacy cross watermark */}
        <svg width="200" height="200" viewBox="0 0 220 220" fill="none" opacity="0.15">
          <rect x="77" y="20" width="66" height="180" rx="16" fill="#1B8C3A" />
          <rect x="20" y="77" width="180" height="66" rx="16" fill="#1B8C3A" />
        </svg>
      </div>

      {/* Pill icon card — top */}
      {/* <div className="absolute -top-4 inset-x-0 flex justify-center">
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_0_rgb(0_0_0/0.1)] border border-[var(--color-border)] px-5 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-50)] flex items-center justify-center">
            <Stethoscope size={16} strokeWidth={1.5} className="text-[var(--color-primary)]" />
          </div>
          <div className="text-right">
            <p className="text-[12px] font-black text-[var(--color-secondary)]">صيادلة متخصصون</p>
            <p className="text-[10px] text-[var(--color-muted)]">خبرة واحترافية</p>
          </div>
        </div>
      </div> */}

      {/* Location card — bottom */}
      <div className="absolute -bottom-4 inset-x-0 flex justify-center">
        <div className="bg-[var(--color-primary)] rounded-2xl shadow-[0_4px_20px_0_rgba(27,140,58,0.35)] px-5 py-3 flex items-center gap-2.5">
          <MapPin size={16} strokeWidth={1.75} className="text-white" />
          <div className="text-right">
            <p className="text-[12px] font-black text-white">ليوة، ولاية الوادي</p>
            <p className="text-[10px] text-white/70">الجزائر</p>
          </div>
        </div>
      </div>
    </div>
  );
}
