"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export function CartContent() {
  const items          = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem     = useCartStore((s) => s.removeItem);
  const subtotal       = useCartStore((s) => s.subtotal());

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-28 px-4">
        <div className="w-20 h-20 rounded-3xl bg-[var(--color-surface-warm)] border border-[var(--color-border)] flex items-center justify-center mb-5">
          <ShoppingBag size={36} strokeWidth={1.25} className="text-[var(--color-muted)]" aria-hidden="true" />
        </div>
        <h2 className="text-[22px] font-black text-[var(--color-secondary)] mb-2">سلتك فارغة</h2>
        <p className="text-[15px] text-[var(--color-muted)] max-w-xs mb-6 leading-relaxed">
          لم تضف أي منتجات بعد. تصفح منتجاتنا واختر ما تحتاجه.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold text-[14px] hover:bg-[var(--color-primary-light)] transition-colors"
        >
          <ShoppingBag size={16} aria-hidden="true" />
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8 items-start flex-col lg:flex-row">

        {/* ── Items list ── */}
        <div className="flex-1 min-w-0 space-y-3">
          {items.map((item) => (
            <div
              key={item.product_id}
              className="flex gap-4 items-start bg-white rounded-2xl border border-[var(--color-border)] p-4 shadow-[var(--shadow-card)]"
            >
              {/* Image */}
              <Link href={`/products/${item.slug}`} className="flex-shrink-0">
                <div className="w-20 h-20 rounded-xl bg-[var(--color-surface-warm)] overflow-hidden relative border border-[var(--color-border)]">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-contain p-2"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg width="32" height="32" viewBox="0 0 34 34" fill="none" aria-hidden="true">
                        <rect width="34" height="34" rx="8" fill="#1B8C3A" fillOpacity="0.08" />
                        <path d="M13.5 7H20.5V13.5H27V20.5H20.5V27H13.5V20.5H7V13.5H13.5V7Z" fill="#1B8C3A" fillOpacity="0.35" />
                      </svg>
                    </div>
                  )}
                </div>
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.slug}`}>
                  <h3 className="text-[15px] font-bold text-[var(--color-foreground)] line-clamp-2 hover:text-[var(--color-primary)] transition-colors">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-[14px] font-black text-[var(--color-primary)] tabular-nums mt-1">
                  {item.price.toLocaleString("ar-DZ")} دج
                </p>
              </div>

              {/* Controls */}
              <div className="flex flex-col items-end gap-3 flex-shrink-0">
                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeItem(item.product_id)}
                  aria-label={`احذف ${item.name} من السلة`}
                  className="p-1.5 text-[var(--color-muted)] hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-150"
                >
                  <Trash2 size={15} strokeWidth={2} aria-hidden="true" />
                </button>

                {/* Quantity */}
                <div
                  className="flex items-center bg-[var(--color-surface-warm)] border border-[var(--color-border)] rounded-xl overflow-hidden"
                  role="group"
                  aria-label={`كمية ${item.name}`}
                >
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    aria-label="تقليل الكمية"
                    className="w-9 h-9 flex items-center justify-center text-[var(--color-secondary)] hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus size={14} strokeWidth={2.5} aria-hidden="true" />
                  </button>
                  <span
                    className="w-10 h-9 flex items-center justify-center text-[14px] font-black text-[var(--color-secondary)] tabular-nums border-x border-[var(--color-border)]"
                    aria-live="polite"
                  >
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    aria-label="زيادة الكمية"
                    className="w-9 h-9 flex items-center justify-center text-[var(--color-secondary)] hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    <Plus size={14} strokeWidth={2.5} aria-hidden="true" />
                  </button>
                </div>

                {/* Line total */}
                <span className="text-[13px] font-bold text-[var(--color-muted)] tabular-nums">
                  {(item.price * item.quantity).toLocaleString("ar-DZ")} دج
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Summary sidebar ── */}
        <div className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-[88px]">
          <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 shadow-[var(--shadow-card)] space-y-4">
            <h2 className="text-[18px] font-black text-[var(--color-secondary)]">ملخص الطلب</h2>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[14px]">
                <span className="font-bold text-[var(--color-primary)] tabular-nums">
                  {subtotal.toLocaleString("ar-DZ")} دج
                </span>
                <span className="text-[var(--color-muted)]">المجموع الفرعي</span>
              </div>
              <div className="flex items-center justify-between text-[13px] text-[var(--color-muted)]">
                <span>يُحسب عند الدفع</span>
                <span>رسوم التوصيل</span>
              </div>
            </div>

            <div className="border-t border-[var(--color-border)] pt-4">
              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[var(--color-primary)] text-white font-black text-[16px] hover:bg-[var(--color-primary-light)] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_16px_0_rgba(27,140,58,0.3)]"
              >
                إتمام الطلب
                <ArrowLeft size={18} strokeWidth={2.5} aria-hidden="true" />
              </Link>
            </div>

            <Link
              href="/products"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[var(--color-secondary)] font-bold text-[14px] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-150"
            >
              متابعة التسوق
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
