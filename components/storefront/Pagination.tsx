import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

interface PaginationProps {
  currentPage: number;
  totalPages:  number;
  buildHref:   (page: number) => string;
}

export function Pagination({ currentPage, totalPages, buildHref }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Build visible page range — always show first, last, current ± 1
  const pages = buildPageRange(currentPage, totalPages);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav aria-label="ترقيم الصفحات" className="flex items-center justify-center gap-1.5 flex-wrap">

      {/* Previous (→ in RTL) */}
      <PaginationLink href={hasPrev ? buildHref(currentPage - 1) : null} aria-label="الصفحة التالية للخلف">
        <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
      </PaginationLink>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="w-10 h-10 flex items-center justify-center text-[var(--color-muted)] text-sm select-none">
            …
          </span>
        ) : (
          <PaginationLink
            key={p}
            href={buildHref(p as number)}
            active={p === currentPage}
            aria-label={`الصفحة ${p}`}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </PaginationLink>
        )
      )}

      {/* Next (← in RTL) */}
      <PaginationLink href={hasNext ? buildHref(currentPage + 1) : null} aria-label="الصفحة التالية">
        <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
      </PaginationLink>
    </nav>
  );
}

function PaginationLink({
  href,
  active = false,
  children,
  ...props
}: {
  href: string | null;
  active?: boolean;
  children: React.ReactNode;
  "aria-label"?: string;
  "aria-current"?: "page" | undefined;
}) {
  const base = "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-150 select-none";

  if (!href) {
    return (
      <span className={cn(base, "text-[var(--color-muted)] opacity-40 cursor-not-allowed")} aria-disabled="true">
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        base,
        active
          ? "bg-[var(--color-primary)] text-white shadow-[0_2px_8px_0_rgba(27,140,58,0.3)]"
          : "bg-white border border-[var(--color-border)] text-[var(--color-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-50)]"
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

function buildPageRange(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const result: (number | "…")[] = [];
  const addPage = (p: number) => { if (!result.includes(p)) result.push(p); };
  const addEllipsis = () => { if (result[result.length - 1] !== "…") result.push("…"); };

  addPage(1);
  if (current > 3) addEllipsis();
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) addPage(p);
  if (current < total - 2) addEllipsis();
  addPage(total);

  return result;
}
