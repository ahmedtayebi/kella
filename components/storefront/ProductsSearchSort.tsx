"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X, ChevronDown, SlidersHorizontal } from "lucide-react";
import { useState, useRef, useTransition, useCallback } from "react";
import { cn } from "@/lib/cn";

const SORT_OPTIONS = [
  { value: "newest",     label: "الأحدث" },
  { value: "price_asc",  label: "السعر: الأقل أولاً" },
  { value: "price_desc", label: "السعر: الأعلى أولاً" },
] as const;

interface ProductsSearchSortProps {
  total:             number;
  onMobileFilterToggle?: () => void;
  mobileFiltersOpen?: boolean;
}

export function ProductsSearchSort({
  total,
  onMobileFilterToggle,
  mobileFiltersOpen,
}: ProductsSearchSortProps) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentQ    = searchParams.get("q")    ?? "";
  const currentSort = searchParams.get("sort") ?? "newest";

  const [inputValue, setInputValue] = useState(currentQ);
  const debounceRef  = useRef<ReturnType<typeof setTimeout>>(undefined);

  const buildUrl = useCallback(
    (overrides: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(overrides)) {
        if (v === null || v === "") params.delete(k);
        else params.set(k, v);
      }
      // Reset page on filter change
      params.delete("page");
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams]
  );

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      startTransition(() => router.push(buildUrl({ q: value || null })));
    }, 400);
  };

  const clearSearch = () => {
    setInputValue("");
    clearTimeout(debounceRef.current);
    startTransition(() => router.push(buildUrl({ q: null })));
  };

  const handleSort = (value: string) => {
    startTransition(() => router.push(buildUrl({ sort: value === "newest" ? null : value })));
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

      {/* ── Search input ── */}
      <div className="relative flex-1">
        <label htmlFor="product-search" className="sr-only">البحث عن منتج</label>
        <Search
          size={16}
          strokeWidth={2}
          className="absolute top-1/2 -translate-y-1/2 end-3.5 text-[var(--color-muted)] pointer-events-none"
          aria-hidden="true"
        />
        <input
          id="product-search"
          type="search"
          inputMode="search"
          autoComplete="off"
          placeholder="ابحث عن منتج..."
          value={inputValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full h-11 pe-10 ps-4 bg-white border border-[var(--color-border)] rounded-xl text-[15px] font-medium text-[var(--color-foreground)] placeholder:text-[var(--color-subtle)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15 transition-all duration-150"
        />
        {inputValue && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="مسح البحث"
            className="absolute top-1/2 -translate-y-1/2 start-3 text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors p-0.5"
          >
            <X size={14} strokeWidth={2.5} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2.5 flex-shrink-0">

        {/* ── Sort dropdown ── */}
        <div className="relative flex-1 sm:flex-none">
          <label htmlFor="products-sort" className="sr-only">ترتيب المنتجات</label>
          <ChevronDown
            size={14}
            strokeWidth={2.5}
            className="absolute top-1/2 -translate-y-1/2 start-3 text-[var(--color-muted)] pointer-events-none"
            aria-hidden="true"
          />
          <select
            id="products-sort"
            value={currentSort}
            onChange={(e) => handleSort(e.target.value)}
            className="h-11 ps-8 pe-4 bg-white border border-[var(--color-border)] rounded-xl text-[14px] font-semibold text-[var(--color-secondary)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15 transition-all duration-150 cursor-pointer appearance-none w-full sm:w-auto"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* ── Mobile filter toggle ── */}
        {onMobileFilterToggle && (
          <button
            type="button"
            onClick={onMobileFilterToggle}
            aria-expanded={mobileFiltersOpen}
            aria-controls="products-sidebar"
            className={cn(
              "lg:hidden h-11 px-4 rounded-xl border font-semibold text-[14px] flex items-center gap-2 transition-all duration-150 flex-shrink-0",
              mobileFiltersOpen
                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                : "bg-white border-[var(--color-border)] text-[var(--color-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            )}
          >
            <SlidersHorizontal size={15} strokeWidth={2} aria-hidden="true" />
            <span className="hidden sm:inline">تصفية</span>
          </button>
        )}
      </div>

      {/* ── Result count (mobile) ── */}
      <p className="text-[13px] text-[var(--color-muted)] font-medium sm:hidden">
        {total.toLocaleString("ar-DZ")} منتج
      </p>
    </div>
  );
}
