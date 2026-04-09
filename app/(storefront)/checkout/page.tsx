import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CheckoutForm } from "./CheckoutForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إتمام الطلب",
  description: "أدخل بيانات التوصيل لإتمام طلبك",
};

type DeliveryRow = {
  wilaya_id:   number;
  wilaya_name: string;
  desk_price:  number;
  home_price:  number;
};

async function fetchDeliveryPricing(): Promise<DeliveryRow[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("delivery_pricing")
      .select("wilaya_id, wilaya_name, desk_price, home_price")
      .eq("is_active", true)
      .order("wilaya_id");
    return (data ?? []) as DeliveryRow[];
  } catch {
    return [];
  }
}

export default async function CheckoutPage() {
  const deliveryPricing = await fetchDeliveryPricing();

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
            <Link href="/cart" className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors">
              سلة التسوق
            </Link>
            <ChevronLeft size={12} className="text-[var(--color-muted)] flex-shrink-0" aria-hidden="true" />
            <span className="text-[var(--color-secondary)]">إتمام الطلب</span>
          </nav>
          <h1 className="text-[28px] font-black text-[var(--color-secondary)]">إتمام الطلب</h1>
        </div>
      </div>

      <CheckoutForm deliveryPricing={deliveryPricing} />
    </>
  );
}
