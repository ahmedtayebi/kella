"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, User, Home, Truck, ShieldCheck, AlertCircle } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { createOrder } from "@/app/actions/order";
import { cn } from "@/lib/cn";

type DeliveryRow = {
  wilaya_id:   number;
  wilaya_name: string;
  desk_price:  number;
  home_price:  number;
};

export function CheckoutForm({ deliveryPricing }: { deliveryPricing: DeliveryRow[] }) {
  const router   = useRouter();
  const [pending, startTransition] = useTransition();
  const items    = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clearCart = useCartStore((s) => s.clearCart);

  // Form state
  const [name,     setName]     = useState("");
  const [phone,    setPhone]    = useState("");
  const [phone2,   setPhone2]   = useState("");
  const [wilayaId, setWilayaId] = useState<number | "">("");
  const [commune,  setCommune]  = useState("");
  const [address,  setAddress]  = useState("");
  const [delivery, setDelivery] = useState<"desk" | "home">("home");
  const [notes,    setNotes]    = useState("");
  const [error,    setError]    = useState<string | null>(null);

  // Compute delivery fee
  const selectedWilaya = deliveryPricing.find((w) => w.wilaya_id === wilayaId);
  const deliveryFee    = selectedWilaya
    ? delivery === "desk" ? selectedWilaya.desk_price : selectedWilaya.home_price
    : 0;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!wilayaId) {
      setError("يرجى اختيار الولاية");
      return;
    }
    if (!items.length) {
      setError("سلتك فارغة");
      return;
    }

    startTransition(async () => {
      const result = await createOrder({
        customer_name:    name,
        customer_phone:   phone,
        customer_phone2:  phone2 || undefined,
        wilaya_id:        wilayaId as number,
        commune,
        address,
        delivery_type:    delivery,
        delivery_fee:     deliveryFee,
        notes:            notes || undefined,
        items: items.map((i) => ({
          product_id: i.product_id,
          quantity:   i.quantity,
          unit_price: i.price,
          name:       i.name,
        })),
      });

      if (result.success) {
        clearCart();
        router.push(`/order-confirmation/${result.orderNumber}`);
      } else {
        setError(result.error);
      }
    });
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-[17px] text-[var(--color-muted)] mb-4">سلتك فارغة.</p>
        <Link href="/products" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold text-[14px] hover:bg-[var(--color-primary-light)] transition-colors">
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8 items-start flex-col lg:flex-row-reverse">

          {/* ── Order summary (right in RTL) ── */}
          <div className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-[88px] space-y-4">

            {/* Items */}
            <div className="bg-white rounded-2xl border border-[var(--color-border)] p-5 shadow-[var(--shadow-card)]">
              <h2 className="text-[16px] font-black text-[var(--color-secondary)] mb-4">المنتجات ({items.length})</h2>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.product_id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-warm)] border border-[var(--color-border)] overflow-hidden flex-shrink-0 relative">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill sizes="48px" className="object-contain p-1" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg width="24" height="24" viewBox="0 0 34 34" fill="none" aria-hidden="true">
                            <rect width="34" height="34" rx="8" fill="#1B8C3A" fillOpacity="0.08" />
                            <path d="M13.5 7H20.5V13.5H27V20.5H20.5V27H13.5V20.5H7V13.5H13.5V7Z" fill="#1B8C3A" fillOpacity="0.35" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-[var(--color-foreground)] line-clamp-1">{item.name}</p>
                      <p className="text-[12px] text-[var(--color-muted)]">×{item.quantity}</p>
                    </div>
                    <span className="text-[13px] font-bold text-[var(--color-primary)] tabular-nums flex-shrink-0">
                      {(item.price * item.quantity).toLocaleString("ar-DZ")} دج
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Totals */}
            <div className="bg-white rounded-2xl border border-[var(--color-border)] p-5 shadow-[var(--shadow-card)] space-y-3">
              <div className="flex items-center justify-between text-[14px]">
                <span className="font-bold text-[var(--color-primary)] tabular-nums">{subtotal.toLocaleString("ar-DZ")} دج</span>
                <span className="text-[var(--color-muted)]">المجموع الفرعي</span>
              </div>
              <div className="flex items-center justify-between text-[14px]">
                <span className={cn("font-bold tabular-nums", deliveryFee > 0 ? "text-[var(--color-secondary)]" : "text-[var(--color-muted)]")}>
                  {deliveryFee > 0 ? `${deliveryFee.toLocaleString("ar-DZ")} دج` : "—"}
                </span>
                <span className="text-[var(--color-muted)]">التوصيل</span>
              </div>
              {deliveryFee > 0 && (
                <div className="border-t border-[var(--color-border)] pt-3 flex items-center justify-between">
                  <span className="text-[17px] font-black text-[var(--color-primary)] tabular-nums">{total.toLocaleString("ar-DZ")} دج</span>
                  <span className="text-[15px] font-bold text-[var(--color-secondary)]">الإجمالي</span>
                </div>
              )}

              {/* Trust badges */}
              <div className="pt-2 space-y-1.5">
                {[
                  { icon: <ShieldCheck size={13} strokeWidth={2} />, text: "دفع عند الاستلام — لا دفع مسبق" },
                  { icon: <Truck size={13} strokeWidth={2} />, text: "توصيل لجميع الولايات الجزائرية" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-[12px] text-[var(--color-muted)]">
                    <span className="text-[var(--color-primary)]">{icon}</span>
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px] font-semibold" role="alert">
                <AlertCircle size={16} strokeWidth={2} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={pending}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[var(--color-primary)] text-white font-black text-[16px] hover:bg-[var(--color-primary-light)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_4px_16px_0_rgba(27,140,58,0.3)]"
            >
              {pending ? (
                <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" /> جاري إرسال الطلب...</>
              ) : (
                "تأكيد الطلب"
              )}
            </button>
          </div>

          {/* ── Form fields ── */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* Customer info */}
            <section className="bg-white rounded-2xl border border-[var(--color-border)] p-6 shadow-[var(--shadow-card)]">
              <h2 className="text-[17px] font-black text-[var(--color-secondary)] mb-5 flex items-center gap-2">
                <User size={18} strokeWidth={2} className="text-[var(--color-primary)]" aria-hidden="true" />
                بيانات المستلم
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="block text-[13px] font-bold text-[var(--color-secondary)] mb-1.5">
                    الاسم الكامل <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: محمد بن علي"
                    className="w-full h-11 px-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-warm)] text-[15px] text-[var(--color-foreground)] placeholder:text-[var(--color-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-[13px] font-bold text-[var(--color-secondary)] mb-1.5">
                    رقم الهاتف <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05XXXXXXXX"
                    dir="ltr"
                    className="w-full h-11 px-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-warm)] text-[15px] text-[var(--color-foreground)] placeholder:text-[var(--color-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all font-mono tracking-wide text-right"
                  />
                </div>

                <div>
                  <label htmlFor="phone2" className="block text-[13px] font-bold text-[var(--color-secondary)] mb-1.5">
                    هاتف بديل <span className="text-[var(--color-muted)] font-normal">(اختياري)</span>
                  </label>
                  <input
                    id="phone2"
                    type="tel"
                    inputMode="numeric"
                    value={phone2}
                    onChange={(e) => setPhone2(e.target.value)}
                    placeholder="06XXXXXXXX"
                    dir="ltr"
                    className="w-full h-11 px-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-warm)] text-[15px] text-[var(--color-foreground)] placeholder:text-[var(--color-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all font-mono tracking-wide text-right"
                  />
                </div>
              </div>
            </section>

            {/* Delivery address */}
            <section className="bg-white rounded-2xl border border-[var(--color-border)] p-6 shadow-[var(--shadow-card)]">
              <h2 className="text-[17px] font-black text-[var(--color-secondary)] mb-5 flex items-center gap-2">
                <MapPin size={18} strokeWidth={2} className="text-[var(--color-primary)]" aria-hidden="true" />
                عنوان التوصيل
              </h2>
              <div className="space-y-4">

                {/* Wilaya */}
                <div>
                  <label htmlFor="wilaya" className="block text-[13px] font-bold text-[var(--color-secondary)] mb-1.5">
                    الولاية <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="wilaya"
                    required
                    value={wilayaId}
                    onChange={(e) => setWilayaId(Number(e.target.value))}
                    className="w-full h-11 px-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-warm)] text-[15px] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all appearance-none cursor-pointer"
                  >
                    <option value="">-- اختر الولاية --</option>
                    {deliveryPricing.map((w) => (
                      <option key={w.wilaya_id} value={w.wilaya_id}>
                        {w.wilaya_id.toString().padStart(2, "0")} — {w.wilaya_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Commune */}
                <div>
                  <label htmlFor="commune" className="block text-[13px] font-bold text-[var(--color-secondary)] mb-1.5">
                    البلدية <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="commune"
                    type="text"
                    required
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    placeholder="مثال: ليوة"
                    className="w-full h-11 px-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-warm)] text-[15px] text-[var(--color-foreground)] placeholder:text-[var(--color-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                  />
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-[13px] font-bold text-[var(--color-secondary)] mb-1.5">
                    العنوان التفصيلي <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="address"
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="الحي، الشارع، رقم البناية..."
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-warm)] text-[15px] text-[var(--color-foreground)] placeholder:text-[var(--color-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Delivery type */}
            <section className="bg-white rounded-2xl border border-[var(--color-border)] p-6 shadow-[var(--shadow-card)]">
              <h2 className="text-[17px] font-black text-[var(--color-secondary)] mb-5 flex items-center gap-2">
                <Truck size={18} strokeWidth={2} className="text-[var(--color-primary)]" aria-hidden="true" />
                طريقة التوصيل
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(["home", "desk"] as const).map((type) => {
                  const price = selectedWilaya
                    ? type === "desk" ? selectedWilaya.desk_price : selectedWilaya.home_price
                    : null;
                  return (
                    <label
                      key={type}
                      className={cn(
                        "relative flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-150",
                        delivery === type
                          ? "border-[var(--color-primary)] bg-[var(--color-primary-50)]"
                          : "border-[var(--color-border)] bg-[var(--color-surface-warm)] hover:border-[var(--color-primary-100)]"
                      )}
                    >
                      <input
                        type="radio"
                        name="delivery_type"
                        value={type}
                        checked={delivery === type}
                        onChange={() => setDelivery(type)}
                        className="sr-only"
                      />
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors",
                        delivery === type ? "border-[var(--color-primary)]" : "border-[var(--color-border)]"
                      )}>
                        {delivery === type && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-[14px] font-bold text-[var(--color-secondary)]">
                          {type === "home" ? "توصيل للمنزل" : "توصيل للمكتب (Stop Desk)"}
                        </p>
                        <p className="text-[12px] text-[var(--color-muted)] mt-0.5">
                          {type === "home" ? "يصل إلى بابك مباشرة" : "تستلمه من أقرب مكتب توصيل"}
                        </p>
                        {price !== null && (
                          <p className={cn(
                            "text-[13px] font-black tabular-nums mt-1",
                            delivery === type ? "text-[var(--color-primary)]" : "text-[var(--color-muted)]"
                          )}>
                            {price.toLocaleString("ar-DZ")} دج
                          </p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </section>

            {/* Notes */}
            <section className="bg-white rounded-2xl border border-[var(--color-border)] p-6 shadow-[var(--shadow-card)]">
              <h2 className="text-[17px] font-black text-[var(--color-secondary)] mb-4 flex items-center gap-2">
                <Home size={18} strokeWidth={2} className="text-[var(--color-primary)]" aria-hidden="true" />
                ملاحظات إضافية
                <span className="text-[var(--color-muted)] font-normal text-[14px]">(اختياري)</span>
              </h2>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أي تعليمات خاصة بالتوصيل أو ملاحظات للصيدلي..."
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-warm)] text-[15px] text-[var(--color-foreground)] placeholder:text-[var(--color-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all resize-none"
              />
            </section>

            {/* Mobile submit */}
            <div className="lg:hidden">
              {error && (
                <div className="flex items-start gap-2.5 p-4 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px] font-semibold" role="alert">
                  <AlertCircle size={16} strokeWidth={2} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={pending}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[var(--color-primary)] text-white font-black text-[16px] hover:bg-[var(--color-primary-light)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_4px_16px_0_rgba(27,140,58,0.3)]"
              >
                {pending ? (
                  <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> جاري إرسال الطلب...</>
                ) : (
                  "تأكيد الطلب"
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}
