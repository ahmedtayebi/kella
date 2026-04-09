"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/cn";

interface ProductImageGalleryProps {
  images:      string[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex]   = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const safeImages = images?.length ? images : [];
  const hasImages  = safeImages.length > 0;

  const prev = () => setActiveIndex((i) => (i === 0 ? safeImages.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === safeImages.length - 1 ? 0 : i + 1));

  return (
    <>
      <div className="space-y-3">

        {/* ── Main image ── */}
        <div className="relative aspect-square rounded-2xl bg-[var(--color-surface-warm)] border border-[var(--color-border)] overflow-hidden group">
          {hasImages ? (
            <>
              <Image
                key={activeIndex}
                src={safeImages[activeIndex]}
                alt={`${productName} — صورة ${activeIndex + 1}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-6 transition-opacity duration-200"
              />

              {/* Zoom button */}
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label="تكبير الصورة"
                className="absolute top-3 start-3 w-9 h-9 rounded-xl bg-white/80 backdrop-blur-sm border border-[var(--color-border)] flex items-center justify-center text-[var(--color-secondary)] hover:bg-white hover:text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-all duration-200"
              >
                <ZoomIn size={16} strokeWidth={1.75} aria-hidden="true" />
              </button>

              {/* Arrow nav (multiple images only) */}
              {safeImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="الصورة السابقة"
                    className="absolute top-1/2 -translate-y-1/2 end-3 w-9 h-9 rounded-xl bg-white/80 backdrop-blur-sm border border-[var(--color-border)] flex items-center justify-center text-[var(--color-secondary)] hover:bg-white hover:text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <ChevronRight size={18} strokeWidth={2} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="الصورة التالية"
                    className="absolute top-1/2 -translate-y-1/2 start-3 w-9 h-9 rounded-xl bg-white/80 backdrop-blur-sm border border-[var(--color-border)] flex items-center justify-center text-[var(--color-secondary)] hover:bg-white hover:text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <ChevronLeft size={18} strokeWidth={2} aria-hidden="true" />
                  </button>

                  {/* Dot indicator */}
                  <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5" aria-hidden="true">
                    {safeImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        type="button"
                        aria-label={`الصورة ${i + 1}`}
                        className={cn(
                          "rounded-full transition-all duration-200",
                          i === activeIndex
                            ? "w-5 h-1.5 bg-[var(--color-primary)]"
                            : "w-1.5 h-1.5 bg-[var(--color-border-strong)] hover:bg-[var(--color-muted)]"
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <PlaceholderGallery />
          )}
        </div>

        {/* ── Thumbnails ── */}
        {safeImages.length > 1 && (
          <div
            className="flex gap-2 overflow-x-auto pb-1 scroll-smooth"
            role="tablist"
            aria-label="صور المنتج"
          >
            {safeImages.map((src, i) => (
              <button
                key={i}
                role="tab"
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-selected={i === activeIndex}
                aria-label={`عرض الصورة ${i + 1}`}
                className={cn(
                  "relative flex-shrink-0 w-16 h-16 rounded-xl border-2 overflow-hidden transition-all duration-150",
                  i === activeIndex
                    ? "border-[var(--color-primary)] shadow-[0_0_0_2px_rgba(27,140,58,0.15)]"
                    : "border-[var(--color-border)] hover:border-[var(--color-primary-100)]"
                )}
              >
                <Image
                  src={src}
                  alt={`صورة مصغرة ${i + 1}`}
                  fill
                  sizes="64px"
                  className="object-contain p-1.5"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightboxOpen && hasImages && (
        <div
          className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="عرض الصورة مكبرة"
        >
          <div
            className="relative max-w-3xl w-full aspect-square"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={safeImages[activeIndex]}
              alt={productName}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="إغلاق"
            className="absolute top-4 end-4 w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}

function PlaceholderGallery() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
      <svg width="80" height="80" viewBox="0 0 34 34" fill="none" aria-hidden="true">
        <rect width="34" height="34" rx="8" fill="#1B8C3A" fillOpacity="0.08" />
        <path d="M13.5 7H20.5V13.5H27V20.5H20.5V27H13.5V20.5H7V13.5H13.5V7Z" fill="#1B8C3A" fillOpacity="0.3" />
      </svg>
      <span className="text-[13px] text-[var(--color-muted)] font-medium">لا توجد صورة</span>
    </div>
  );
}
