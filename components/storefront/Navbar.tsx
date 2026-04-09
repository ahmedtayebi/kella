"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useCartStore } from "@/store/cartStore";

const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "المنتجات" },
  { href: "/#about", label: "من نحن" },
  { href: "/#contact", label: "تواصل معنا" },
];

function PharmacyCrossLogo() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="34" height="34" rx="8" fill="#1B8C3A" />
      <path
        d="M13.5 7H20.5V13.5H27V20.5H20.5V27H13.5V20.5H7V13.5H13.5V7Z"
        fill="white"
      />
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const cartCount  = totalItems;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 bg-white transition-all duration-300",
        scrolled
          ? "shadow-[0_2px_12px_0_rgb(0_0_0/0.08)]"
          : "border-b border-[var(--color-border)]"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between gap-4">
        {/* ── RIGHT side (RTL start): Logo ── */}
        <Link
          href="/"
          className="flex items-center gap-2.5 flex-shrink-0 group"
          aria-label="صيدلية كيلالا — الرئيسية"
        >
          <div className="flex flex-col leading-tight">
            <span className="text-[16px] font-bold text-[var(--color-secondary)] tracking-tight group-hover:text-[var(--color-primary)] transition-colors duration-200">
              صيدلية كيلالا
            </span>
            <span className="text-[10px] font-medium text-[var(--color-muted)] tracking-wide">
              ليوة — الوادي
            </span>
          </div>
          <PharmacyCrossLogo />
        </Link>


        {/* ── CENTER: Nav links (desktop) ── */}
        <ul className="hidden md:flex items-center gap-0.5 flex-1 justify-center" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="relative px-4 py-2 text-[15px] font-semibold text-[#374151] hover:text-[var(--color-primary)] rounded-xl hover:bg-[var(--color-primary-50)] transition-all duration-200 block group"
              >
                {link.label}
                <span className="absolute bottom-1 inset-x-4 h-0.5 bg-[var(--color-primary)] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-right rounded-full" />
              </Link>
            </li>
          ))}
        </ul>

        {/* ── LEFT side (RTL end): Cart + Mobile toggle ── */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/cart"
            aria-label={`سلة التسوق${cartCount > 0 ? ` — ${cartCount} منتج` : ""}`}
            className="relative group p-2 rounded-xl text-[var(--color-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-50)] transition-all duration-200"
          >
            <ShoppingBag size={22} strokeWidth={1.75} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -start-0.5 min-w-[18px] h-[18px] bg-[var(--color-primary)] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            className="md:hidden p-2 rounded-xl text-[var(--color-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-50)] transition-all duration-200"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="القائمة الرئيسية"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile menu ── */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 border-t border-[var(--color-border)] bg-white",
          menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        )}
        aria-hidden={!menuOpen}
      >
        <ul className="flex flex-col px-4 py-3 gap-1" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="flex items-center px-4 py-3 text-[15px] font-semibold text-[#374151] hover:text-[var(--color-primary)] rounded-xl hover:bg-[var(--color-primary-50)] transition-all duration-200"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
