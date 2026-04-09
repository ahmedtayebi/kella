import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CartContent } from "./CartContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سلة التسوق",
  description: "مراجعة منتجاتك قبل إتمام الطلب",
};

export default function CartPage() {
  return (
    <>
      {/* ── Header ── */}
      <div className="bg-white border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav aria-label="مسار التنقل" className="flex items-center gap-2 text-[13px] font-semibold mb-3">
            <Link href="/" className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors">
              الرئيسية
            </Link>
            <ChevronLeft size={12} className="text-[var(--color-muted)] flex-shrink-0" aria-hidden="true" />
            <span className="text-[var(--color-secondary)]">سلة التسوق</span>
          </nav>
          <h1 className="text-[28px] font-black text-[var(--color-secondary)]">سلة التسوق</h1>
        </div>
      </div>

      {/* ── Content (client) ── */}
      <CartContent />
    </>
  );
}
