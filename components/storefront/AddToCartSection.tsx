"use client";

import { useState } from "react";
import { ShoppingBag, Minus, Plus, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { useCartStore } from "@/store/cartStore";

interface AddToCartSectionProps {
  productId:   string;
  productName: string;
  price:       number;
  inStock:     boolean;
  maxQuantity: number;
  image?:      string;
  slug?:       string;
}

export function AddToCartSection({
  productId,
  productName,
  price,
  inStock,
  maxQuantity,
  image = "",
  slug  = "",
}: AddToCartSectionProps) {
  const [qty,   setQty]   = useState(1);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);

  const decrease = () => setQty((q) => Math.max(1, q - 1));
  const increase = () => setQty((q) => Math.min(maxQuantity, q + 1));

  const handleAddToCart = () => {
    if (!inStock) return;
    addItem({ product_id: productId, name: productName, price, image, slug, quantity: qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  if (!inStock) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" aria-hidden="true" />
          <div>
            <p className="text-[15px] font-bold text-red-700">نفذ من المخزون</p>
            <p className="text-[13px] text-red-600 mt-0.5">سيتم إشعارك عند توفره مجدداً</p>
          </div>
        </div>
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="w-full h-14 rounded-2xl bg-[var(--color-surface-muted)] text-[var(--color-muted)] font-bold text-[16px] cursor-not-allowed opacity-60 flex items-center justify-center gap-3"
        >
          <ShoppingBag size={20} strokeWidth={1.75} aria-hidden="true" />
          أضف للسلة
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* Stock badge */}
      <div className="flex items-center gap-2.5">
        <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] flex-shrink-0" aria-hidden="true" />
        <span className="text-[14px] font-bold text-[var(--color-primary)]">متوفر في المخزون</span>
        {maxQuantity <= 10 && (
          <span className="text-[12px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
            {maxQuantity} قطعة متبقية فقط
          </span>
        )}
      </div>

      {/* Quantity selector */}
      <div className="flex items-center gap-4">
        <span className="text-[14px] font-bold text-[var(--color-secondary)]">الكمية:</span>
        <div
          className="flex items-center gap-0 bg-[var(--color-surface-warm)] border border-[var(--color-border)] rounded-xl overflow-hidden"
          role="group"
          aria-label="اختر الكمية"
        >
          <button
            type="button"
            onClick={decrease}
            disabled={qty <= 1}
            aria-label="تقليل الكمية"
            className="w-10 h-10 flex items-center justify-center text-[var(--color-secondary)] hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
          >
            <Minus size={16} strokeWidth={2.5} aria-hidden="true" />
          </button>
          <span
            className="w-12 h-10 flex items-center justify-center text-[16px] font-black text-[var(--color-secondary)] tabular-nums border-x border-[var(--color-border)]"
            aria-live="polite"
            aria-atomic="true"
          >
            {qty}
          </span>
          <button
            type="button"
            onClick={increase}
            disabled={qty >= maxQuantity}
            aria-label="زيادة الكمية"
            className="w-10 h-10 flex items-center justify-center text-[var(--color-secondary)] hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
          >
            <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>
        <span className="text-[15px] font-bold text-[var(--color-muted)] ms-auto tabular-nums">
          = {(price * qty).toLocaleString("ar-DZ")} دج
        </span>
      </div>

      {/* Add to cart CTA */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={added}
        aria-label={`أضف ${qty} من ${productName} إلى السلة`}
        aria-live="polite"
        className={cn(
          "w-full h-14 rounded-2xl font-bold text-[16px] flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer",
          added
            ? "bg-[var(--color-primary-dark)] text-white"
            : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)] active:scale-[0.98] shadow-[0_4px_16px_0_rgba(27,140,58,0.3)]"
        )}
      >
        {added ? (
          <>
            <Check size={20} strokeWidth={2.5} aria-hidden="true" />
            أُضيف إلى السلة
          </>
        ) : (
          <>
            <ShoppingBag size={20} strokeWidth={1.75} aria-hidden="true" />
            أضف للسلة
          </>
        )}
      </button>
    </div>
  );
}
