import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  FileText,
  Tag,
  Package,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { createClient }           from "@/lib/supabase/server";
import { ProductImageGallery }    from "@/components/storefront/ProductImageGallery";
import { AddToCartSection }       from "@/components/storefront/AddToCartSection";
import { ProductCard }            from "@/components/storefront/ProductCard";
import type { Metadata }          from "next";

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────
type FullProduct = {
  id:                    string;
  name:                  string;
  slug:                  string;
  description:           string | null;
  price:                 number;
  compare_price:         number | null;
  images:                string[];
  stock_quantity:        number;
  requires_prescription: boolean;
  is_active:             boolean;
  brand:                 string | null;
  barcode:               string | null;
  category_id:           string;
  category:              { id: string; name: string; slug: string } | null;
};

type RelatedProduct = {
  id:                    string;
  name:                  string;
  slug:                  string;
  price:                 number;
  compare_price:         number | null;
  images:                string[];
  requires_prescription: boolean;
  category:              { name: string; slug: string } | null;
};

// ─────────────────────────────────────────────
//  Metadata
// ─────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { title: "منتج" };
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("name, description")
      .eq("slug", slug)
      .maybeSingle() as unknown as { data: { name: string; description: string | null } | null };
    return {
      title:       data?.name ?? "منتج",
      description: data?.description ?? undefined,
    };
  } catch {
    return { title: "منتج" };
  }
}

// ─────────────────────────────────────────────
//  Data fetching
// ─────────────────────────────────────────────
async function fetchProduct(slug: string): Promise<FullProduct | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(id, name, slug)")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();
    if (error || !data) return null;
    return data as FullProduct;
  } catch {
    return null;
  }
}

async function fetchRelated(categoryId: string, excludeId: string): Promise<RelatedProduct[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("id, name, slug, price, compare_price, images, requires_prescription, category:categories(name, slug)")
      .eq("category_id", categoryId)
      .eq("is_active", true)
      .neq("id", excludeId)
      .limit(4);
    return (data ?? []) as RelatedProduct[];
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────
//  Page
// ─────────────────────────────────────────────
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await fetchProduct(slug);
  if (!product) notFound();

  const related = await fetchRelated(product.category_id, product.id);

  const inStock       = product.stock_quantity > 0;
  const hasDiscount   = !!product.compare_price && product.compare_price > product.price;
  const discountPct   = hasDiscount
    ? Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)
    : 0;

  return (
    <>
      {/* ─── Page header (breadcrumb) ─── */}
      <div className="bg-white border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav aria-label="مسار التنقل" className="flex items-center gap-2 text-[13px] font-semibold flex-wrap">
            <Link href="/" className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors">
              الرئيسية
            </Link>
            <ChevronLeft size={12} className="text-[var(--color-muted)] flex-shrink-0" aria-hidden="true" />
            <Link href="/products" className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors">
              المنتجات
            </Link>
            {product.category && (
              <>
                <ChevronLeft size={12} className="text-[var(--color-muted)] flex-shrink-0" aria-hidden="true" />
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronLeft size={12} className="text-[var(--color-muted)] flex-shrink-0" aria-hidden="true" />
            <span className="text-[var(--color-secondary)] line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ─── Main product section ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* ── LEFT (RTL end): Image gallery ── */}
          <div className="order-first lg:order-last">
            <ProductImageGallery images={product.images} productName={product.name} />
          </div>

          {/* ── RIGHT (RTL start): Product info ── */}
          <div className="space-y-6 text-right">

            {/* Category + badges */}
            <div className="flex items-center justify-end gap-2 flex-wrap">
              {product.category && (
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--color-primary-50)] border border-[var(--color-primary-100)] text-[var(--color-primary)] text-[12px] font-bold hover:bg-[var(--color-primary-100)] transition-colors"
                >
                  <Tag size={11} strokeWidth={2.5} aria-hidden="true" />
                  {product.category.name}
                </Link>
              )}
              {product.requires_prescription && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-[12px] font-bold">
                  <FileText size={11} strokeWidth={2.5} aria-hidden="true" />
                  يتطلب وصفة طبية
                </span>
              )}
              {!inStock && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[12px] font-bold">
                  <Package size={11} strokeWidth={2.5} aria-hidden="true" />
                  نفذ من المخزون
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="text-[26px] sm:text-[32px] font-black text-[var(--color-secondary)] leading-snug">
              {product.name}
            </h1>

            {/* Brand */}
            {product.brand && (
              <p className="text-[14px] font-semibold text-[var(--color-muted)]">
                العلامة التجارية: <span className="text-[var(--color-secondary)]">{product.brand}</span>
              </p>
            )}

            {/* Price block */}
            <div className="flex items-end justify-end gap-4 p-5 rounded-2xl bg-[var(--color-surface-warm)] border border-[var(--color-border)]">
              <div className="text-right">
                {hasDiscount && (
                  <p className="text-[15px] text-[var(--color-muted)] line-through tabular-nums mb-1">
                    {product.compare_price!.toLocaleString("ar-DZ")} دج
                  </p>
                )}
                <p className="text-[34px] font-black text-[var(--color-primary)] tabular-nums leading-none">
                  {product.price.toLocaleString("ar-DZ")}
                  <span className="text-[18px] font-bold ms-1">دج</span>
                </p>
              </div>
              {hasDiscount && (
                <span className="px-3 py-1.5 bg-red-500 text-white text-[13px] font-black rounded-xl flex-shrink-0">
                  خصم {discountPct}%
                </span>
              )}
            </div>

            {/* Separator */}
            <div className="border-t border-[var(--color-border)]" />

            {/* Add to cart section */}
            <AddToCartSection
              productId={product.id}
              productName={product.name}
              price={product.price}
              inStock={inStock}
              maxQuantity={Math.min(product.stock_quantity, 99)}
              image={product.images?.[0] ?? ""}
              slug={product.slug}
            />

            {/* Trust mini-badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Truck size={16} strokeWidth={1.75} />, label: "توصيل لجميع الولايات" },
                { icon: <ShieldCheck size={16} strokeWidth={1.75} />, label: "منتج أصيل 100%" },
                { icon: <Package size={16} strokeWidth={1.75} />, label: "دفع عند الاستلام" },
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[var(--color-border)] bg-white text-center"
                >
                  <span className="text-[var(--color-primary)]" aria-hidden="true">{icon}</span>
                  <span className="text-[10px] font-bold text-[var(--color-secondary)] leading-snug">{label}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            {product.description && (
              <div className="space-y-3">
                <div className="border-t border-[var(--color-border)]" />
                <h2 className="text-[16px] font-black text-[var(--color-secondary)]">وصف المنتج</h2>
                <div className="text-[15px] text-[var(--color-muted)] leading-relaxed whitespace-pre-line">
                  {product.description}
                </div>
              </div>
            )}

            {/* Barcode */}
            {product.barcode && (
              <p className="text-[12px] text-[var(--color-muted)] font-medium">
                الباركود: <span className="font-mono tracking-wider">{product.barcode}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ─── Related products ─── */}
      {related.length > 0 && (
        <section className="bg-[var(--color-surface-warm)] border-t border-[var(--color-border)] py-14" aria-label="منتجات ذات صلة">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[12px] font-bold text-[var(--color-primary)] tracking-widest uppercase mb-2">
                  اكتشف أيضاً
                </p>
                <h2 className="text-[26px] font-black text-[var(--color-secondary)]">
                  منتجات ذات صلة
                </h2>
              </div>
              {product.category && (
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="flex items-center gap-1.5 text-[13px] font-bold text-[var(--color-primary)] hover:gap-3 transition-all duration-200 group flex-shrink-0"
                >
                  <ChevronLeft size={15} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
                  عرض الكل
                </Link>
              )}
            </div>
            <ul
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              aria-label="منتجات ذات صلة"
              role="list"
            >
              {related.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
