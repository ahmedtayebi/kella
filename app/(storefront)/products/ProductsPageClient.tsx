"use client";

import { useState } from "react";
import { ProductsSearchSort } from "@/components/storefront/ProductsSearchSort";
import { ProductsSidebar }    from "@/components/storefront/ProductsSidebar";
import type { Category }      from "@/types";

interface ProductsPageClientProps {
  categories: Category[];
  total:      number;
}

export function ProductsPageClient({ categories, total }: ProductsPageClientProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <>
      {/* Search + sort bar */}
      <ProductsSearchSort
        total={total}
        onMobileFilterToggle={() => setMobileFiltersOpen((o) => !o)}
        mobileFiltersOpen={mobileFiltersOpen}
      />

      {/* Mobile sidebar (collapsible, below search bar) */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          mobileFiltersOpen ? "max-h-[600px] mt-4" : "max-h-0"
        }`}
        aria-hidden={!mobileFiltersOpen}
      >
        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-5 shadow-[var(--shadow-card)]">
          <ProductsSidebar
            categories={categories}
            total={total}
            open={mobileFiltersOpen}
          />
        </div>
      </div>
    </>
  );
}
