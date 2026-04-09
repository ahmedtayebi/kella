import { Suspense } from "react";
import Link from "next/link";
import { Package, ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProductCard }        from "@/components/storefront/ProductCard";
import { ProductsSidebar }    from "@/components/storefront/ProductsSidebar";
import { ProductsSearchSort } from "@/components/storefront/ProductsSearchSort";
import { Pagination }         from "@/components/storefront/Pagination";
import { ProductsPageClient } from "./ProductsPageClient";
import type { Category }      from "@/types";
import type { Metadata }      from "next";

// ─────────────────────────────────────────────
//  Metadata
// ─────────────────────────────────────────────
export const metadata: Metadata = {
  title: "المنتجات",
  description: "تصفح جميع منتجات صيدلية كيلالا — أدوية، مكملات، تجميل، أجهزة طبية والمزيد",
};

// ─────────────────────────────────────────────
//  Constants
// ─────────────────────────────────────────────
const ITEMS_PER_PAGE = 12;

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────
type SearchParams = {
  category?:     string;
  sort?:         string;
  page?:         string;
  q?:            string;
  prescription?: string;
};

type ProductRow = {
  id:                   string;
  name:                 string;
  slug:                 string;
  price:                number;
  compare_price:        number | null;
  images:               string[];
  requires_prescription: boolean;
  category:             { name: string; slug: string } | null;
};

// ─────────────────────────────────────────────
//  Data fetching
// ─────────────────────────────────────────────
async function fetchPageData(params: SearchParams) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { products: [], categories: [], total: 0 };
  }
  try {
    const supabase = await createClient();
    const page     = Math.max(1, parseInt(params.page ?? "1"));
    const from     = (page - 1) * ITEMS_PER_PAGE;
    const to       = from + ITEMS_PER_PAGE - 1;

    // ── Parallel: categories + category-id lookup ──
    const [catListRes, activeCatRes] = await Promise.all([
      supabase.from("categories").select("*").eq("is_active", true).order("sort_order"),
      params.category
        ? supabase.from("categories").select("id").eq("slug", params.category).maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

    const categories = (catListRes.data ?? []) as Category[];
    const activeCatId = (activeCatRes.data as { id: string } | null)?.id ?? null;

    // ── Products query ──
    let query = supabase
      .from("products")
      .select("id, name, slug, price, compare_price, images, requires_prescription, category:categories(name, slug)", { count: "exact" })
      .eq("is_active", true);

    if (activeCatId)               query = query.eq("category_id", activeCatId);
    if (params.q)                  query = query.ilike("name", `%${params.q}%`);
    if (params.prescription === "1") query = query.eq("requires_prescription", true);

    if (params.sort === "price_asc")  query = query.order("price", { ascending: true });
    else if (params.sort === "price_desc") query = query.order("price", { ascending: false });
    else query = query.order("created_at", { ascending: false });

    query = query.range(from, to);

    const { data, count } = await query;
    return {
      products:   (data ?? []) as ProductRow[],
      categories,
      total:      count ?? 0,
    };
  } catch {
    return { products: [], categories: [], total: 0 };
  }
}

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────
function buildPageUrl(current: SearchParams, page: number) {
  const p = new URLSearchParams();
  if (current.category)     p.set("category",     current.category);
  if (current.sort)         p.set("sort",         current.sort);
  if (current.q)            p.set("q",            current.q);
  if (current.prescription) p.set("prescription", current.prescription);
  p.set("page", String(page));
  return `/products?${p.toString()}`;
}

// ─────────────────────────────────────────────
//  Page
// ─────────────────────────────────────────────
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params                        = await searchParams;
  const { products, categories, total } = await fetchPageData(params);

  const currentPage  = Math.max(1, parseInt(params.page ?? "1"));
  const totalPages   = Math.ceil(total / ITEMS_PER_PAGE);
  const activeCategory = categories.find((c) => c.slug === params.category);

  return (
    <>
      {/* ── Page header ── */}
      <div
        className="relative overflow-hidden bg-white border-b border-[var(--color-border)]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect x='20' y='10' width='8' height='28' rx='2' fill='%231B8C3A' fill-opacity='0.04'/%3E%3Crect x='10' y='20' width='28' height='8' rx='2' fill='%231B8C3A' fill-opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: "48px 48px",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav aria-label="مسار التنقل" className="flex items-center gap-2 text-[13px] font-semibold mb-4">
            <Link href="/" className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors">
              الرئيسية
            </Link>
            <ChevronLeft size={12} className="text-[var(--color-muted)] flex-shrink-0" aria-hidden="true" />
            <span className="text-[var(--color-secondary)]">المنتجات</span>
            {activeCategory && (
              <>
                <ChevronLeft size={12} className="text-[var(--color-muted)] flex-shrink-0" aria-hidden="true" />
                <span className="text-[var(--color-primary)]">{activeCategory.name}</span>
              </>
            )}
          </nav>

          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-[28px] sm:text-[34px] font-black text-[var(--color-secondary)]">
                {activeCategory ? activeCategory.name : "جميع المنتجات"}
              </h1>
              <p className="text-[14px] text-[var(--color-muted)] font-medium mt-1">
                {total > 0
                  ? `عرض ${((currentPage - 1) * ITEMS_PER_PAGE + 1).toLocaleString("ar-DZ")}–${Math.min(currentPage * ITEMS_PER_PAGE, total).toLocaleString("ar-DZ")} من ${total.toLocaleString("ar-DZ")} منتج`
                  : "لا توجد منتجات"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search + sort + mobile filter toggle — must be inside Suspense for useSearchParams */}
        <div className="mb-6">
          <Suspense fallback={<SearchSortSkeleton />}>
            <ProductsPageClient
              categories={categories}
              total={total}
            />
          </Suspense>
        </div>

        <div className="flex gap-8 items-start">

          {/* ── Sidebar (desktop) — hidden on mobile, shown via client toggle ── */}
          <div className="hidden lg:block w-56 xl:w-64 flex-shrink-0 sticky top-[88px]">
            <div className="bg-white rounded-2xl border border-[var(--color-border)] p-5 shadow-[var(--shadow-card)]">
              <Suspense fallback={null}>
                <ProductsSidebarStatic categories={categories} total={total} />
              </Suspense>
            </div>
          </div>

          {/* ── Products grid + pagination ── */}
          <div className="flex-1 min-w-0">
            {products.length === 0 ? (
              <EmptyState hasFilters={!!(params.q || params.category || params.prescription)} />
            ) : (
              <>
                <ul
                  className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4"
                  aria-label="قائمة المنتجات"
                  role="list"
                >
                  {products.map((product, i) => (
                    <li key={product.id}>
                      <ProductCard product={product} priority={i < 4} />
                    </li>
                  ))}
                </ul>

                {totalPages > 1 && (
                  <div className="mt-10 flex flex-col items-center gap-2">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      buildHref={(p) => buildPageUrl(params, p)}
                    />
                    <p className="text-[12px] text-[var(--color-muted)]">
                      الصفحة {currentPage.toLocaleString("ar-DZ")} من {totalPages.toLocaleString("ar-DZ")}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Static sidebar wrapper (server) ──
// ProductsSidebar is a Client Component; we pass data via props
function ProductsSidebarStatic({ categories, total }: { categories: Category[]; total: number }) {
  // Rendered inside a Suspense by the parent — just forward to the client component
  // The mobile open state is managed in ProductsPageClient
  return <ProductsSidebarInner categories={categories} total={total} />;
}

// Re-export to avoid circular imports
function ProductsSidebarInner({ categories, total }: { categories: Category[]; total: number }) {
  // On desktop the sidebar is always open (CSS hidden/block)
  return <ProductsSidebar categories={categories} total={total} open={true} />;
}

// ─────────────────────────────────────────────
//  Empty state
// ─────────────────────────────────────────────
function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-4">
      <div className="w-20 h-20 rounded-3xl bg-[var(--color-surface-warm)] border border-[var(--color-border)] flex items-center justify-center mb-5">
        <Package size={36} strokeWidth={1.25} className="text-[var(--color-muted)]" aria-hidden="true" />
      </div>
      <h2 className="text-[22px] font-black text-[var(--color-secondary)] mb-2">
        لا توجد منتجات
      </h2>
      <p className="text-[15px] text-[var(--color-muted)] max-w-xs mb-6 leading-relaxed">
        {hasFilters
          ? "لم نجد منتجات تطابق معايير البحث. جرب تغيير الفلاتر."
          : "لا توجد منتجات متاحة حالياً. تفقدنا مجدداً قريباً."}
      </p>
      {hasFilters && (
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold text-[14px] hover:bg-[var(--color-primary-light)] transition-colors"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          عرض جميع المنتجات
        </Link>
      )}
    </div>
  );
}

// ── Skeleton while search+sort hydrates ──
function SearchSortSkeleton() {
  return (
    <div className="flex gap-3 animate-pulse">
      <div className="flex-1 h-11 rounded-xl bg-[var(--color-surface-muted)]" />
      <div className="w-40 h-11 rounded-xl bg-[var(--color-surface-muted)]" />
    </div>
  );
}
