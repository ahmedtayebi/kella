"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, FileText, Check } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";

export interface ProductCardProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_price?: number | null;
  images: string[];
  requires_prescription: boolean;
  category?: { name: string; slug: string } | null;
}

interface ProductCardProps {
  product: ProductCardProduct;
  compact?: boolean;
  priority?: boolean;
}

export function ProductCard({ product, compact = false, priority = false }: ProductCardProps) {
  const hasDiscount = !!product.compare_price && product.compare_price > product.price;
  const hasImage    = product.images?.length > 0;
  const pad         = compact ? "p-3" : "p-4";

  const addItem    = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      product_id: product.id,
      name:       product.name,
      price:      product.price,
      image:      product.images?.[0] ?? "",
      slug:       product.slug,
      quantity:   1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <article className="group flex flex-col bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-[0_8px_28px_0_rgb(0_0_0/0.1)] hover:border-[var(--color-primary-100)] transition-all duration-200">

      {/* ── Image ── */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-square bg-[var(--color-surface-warm)] overflow-hidden flex-shrink-0">
        {hasImage ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-4 group-hover:scale-[1.04] transition-transform duration-300"
          />
        ) : (
          <PlaceholderImage />
        )}

        {hasDiscount && (
          <span className="absolute top-2.5 start-2.5 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-lg leading-tight">
            خصم
          </span>
        )}

        {product.requires_prescription && (
          <span className="absolute top-2.5 end-2.5 px-1.5 py-0.5 bg-[var(--color-secondary)] text-white text-[9px] font-bold rounded-lg flex items-center gap-0.5 leading-tight">
            <FileText size={8} strokeWidth={2.5} />
            وصفة
          </span>
        )}
      </Link>

      {/* ── Info ── */}
      <div className={`flex flex-col flex-1 gap-2.5 ${pad}`}>

        {product.category && (
          <Link
            href={`/products?category=${product.category.slug}`}
            className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-wide hover:underline self-end"
          >
            {product.category.name}
          </Link>
        )}

        <Link href={`/products/${product.slug}`} className="flex-1">
          <h3 className="text-[14px] font-bold text-[var(--color-foreground)] line-clamp-2 leading-snug text-right hover:text-[var(--color-primary)] transition-colors duration-150">
            {product.name}
          </h3>
        </Link>

        {product.requires_prescription && (
          <div className="flex justify-end">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-semibold rounded-lg">
              <FileText size={10} strokeWidth={2} />
              يتطلب وصفة طبية
            </span>
          </div>
        )}

        <div className="flex items-baseline justify-end gap-2 mt-auto">
          {hasDiscount && (
            <span className="text-[12px] text-[var(--color-muted)] line-through tabular-nums leading-none">
              {product.compare_price!.toLocaleString("ar-DZ")}&nbsp;دج
            </span>
          )}
          <span className="text-[16px] font-black text-[var(--color-primary)] tabular-nums leading-none">
            {product.price.toLocaleString("ar-DZ")}&nbsp;دج
          </span>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-[13px] active:scale-[0.97] transition-all duration-150 cursor-pointer ${
            added
              ? "bg-[var(--color-primary)] text-white"
              : "bg-[var(--color-primary-50)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
          }`}
          aria-label={`أضف ${product.name} إلى السلة`}
        >
          {added ? (
            <><Check size={14} strokeWidth={2.5} aria-hidden="true" /> أُضيف</>
          ) : (
            <><ShoppingBag size={14} strokeWidth={2} aria-hidden="true" /> أضف للسلة</>
          )}
        </button>
      </div>
    </article>
  );
}

function PlaceholderImage() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg width="52" height="52" viewBox="0 0 34 34" fill="none" aria-hidden="true">
        <rect width="34" height="34" rx="8" fill="#1B8C3A" fillOpacity="0.08" />
        <path d="M13.5 7H20.5V13.5H27V20.5H20.5V27H13.5V20.5H7V13.5H13.5V7Z" fill="#1B8C3A" fillOpacity="0.35" />
      </svg>
    </div>
  );
}
