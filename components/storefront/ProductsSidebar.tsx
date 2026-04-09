"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { Pill, Leaf, Sparkles, Stethoscope, Baby, Droplets, LayoutGrid, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import type { Category } from "@/types";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  adwiya:          <Pill        size={16} strokeWidth={1.75} />,
  mokamelat:       <Leaf        size={16} strokeWidth={1.75} />,
  tajmil:          <Sparkles    size={16} strokeWidth={1.75} />,
  "ajhiza-tibiya": <Stethoscope size={16} strokeWidth={1.75} />,
  atfal:           <Baby        size={16} strokeWidth={1.75} />,
  nathafa:         <Droplets    size={16} strokeWidth={1.75} />,
};

interface ProductsSidebarProps {
  categories: Category[];
  total:      number;
  open:       boolean;
}

export function ProductsSidebar({ categories, total, open }: ProductsSidebarProps) {
  const searchParams  = useSearchParams();
  const pathname      = usePathname();
  const activeCategory = searchParams.get("category") ?? "";
  const [prescriptionOnly, setPrescriptionOnly] = useState(
    searchParams.get("prescription") === "1"
  );

  function buildCatUrl(slug: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("category", slug);
    else      params.delete("category");
    params.delete("page");
    return `${pathname}?${params.toString()}`;
  }

  function buildPrescriptionUrl(on: boolean) {
    const params = new URLSearchParams(searchParams.toString());
    if (on) params.set("prescription", "1");
    else    params.delete("prescription");
    params.delete("page");
    return `${pathname}?${params.toString()}`;
  }

  return (
    <aside
      id="products-sidebar"
      aria-label="تصفية المنتجات"
      className={cn(
        "lg:block",
        open ? "block" : "hidden"
      )}
    >
      <div className="space-y-6">

        {/* ── Section: Categories ── */}
        <SidebarSection title="التصنيفات">
          <nav aria-label="تصنيفات المنتجات">
            <ul className="space-y-1" role="list">
              {/* All */}
              <SidebarCategoryItem
                href={buildCatUrl(null)}
                active={!activeCategory}
                icon={<LayoutGrid size={16} strokeWidth={1.75} />}
                label="جميع المنتجات"
                count={!activeCategory ? total : undefined}
              />
              {categories.map((cat) => (
                <SidebarCategoryItem
                  key={cat.id}
                  href={buildCatUrl(cat.slug)}
                  active={activeCategory === cat.slug}
                  icon={CATEGORY_ICONS[cat.slug] ?? <Pill size={16} strokeWidth={1.75} />}
                  label={cat.name}
                />
              ))}
            </ul>
          </nav>
        </SidebarSection>

        {/* ── Section: Type filter ── */}
        <SidebarSection title="نوع المنتج">
          <label className="flex items-center justify-between cursor-pointer group py-2 px-1 rounded-xl hover:bg-[var(--color-primary-50)] transition-colors duration-150">
            <span className="text-[14px] font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors">
              يتطلب وصفة طبية
            </span>
            <Link
              href={buildPrescriptionUrl(!prescriptionOnly)}
              onClick={() => setPrescriptionOnly(!prescriptionOnly)}
              role="checkbox"
              aria-checked={prescriptionOnly}
              className={cn(
                "w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150",
                prescriptionOnly
                  ? "bg-[var(--color-primary)] border-[var(--color-primary)]"
                  : "bg-white border-[var(--color-border-strong)]"
              )}
              aria-label="تصفية المنتجات التي تتطلب وصفة طبية"
            >
              {prescriptionOnly && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </Link>
          </label>
        </SidebarSection>
      </div>
    </aside>
  );
}

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between group"
        aria-expanded={!collapsed}
      >
        <h3 className="text-[13px] font-black text-[var(--color-secondary)] tracking-wide uppercase">
          {title}
        </h3>
        <ChevronDown
          size={14}
          strokeWidth={2.5}
          className={cn(
            "text-[var(--color-muted)] transition-transform duration-200",
            collapsed && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>
      {!collapsed && children}
    </div>
  );
}

function SidebarCategoryItem({
  href,
  active,
  icon,
  label,
  count,
}: {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
  count?: number;
}) {
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold transition-all duration-150",
          active
            ? "bg-[var(--color-primary)] text-white shadow-[0_2px_8px_0_rgba(27,140,58,0.25)]"
            : "text-[var(--color-foreground)] hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary)]"
        )}
      >
        <span className={cn("flex-shrink-0", active ? "text-white" : "text-[var(--color-muted)]")}>
          {icon}
        </span>
        <span className="flex-1 text-right">{label}</span>
        {count !== undefined && (
          <span className={cn(
            "text-[11px] font-bold tabular-nums",
            active ? "text-white/75" : "text-[var(--color-muted)]"
          )}>
            {count.toLocaleString("ar-DZ")}
          </span>
        )}
      </Link>
    </li>
  );
}
