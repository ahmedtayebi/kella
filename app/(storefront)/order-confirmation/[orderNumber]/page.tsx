import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle, Package, MapPin, Phone, Truck, ShoppingBag } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ClearCartEffect } from "./ClearCartEffect";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تم استلام طلبك",
  description: "شكراً على طلبك من صيدلية كيلالا",
};

type OrderRow = {
  id:              string;
  order_number:    string;
  status:          string;
  customer_name:   string;
  customer_phone:  string;
  wilaya_id:       number;
  commune:         string;
  address:         string;
  delivery_type:   string;
  delivery_fee:    number;
  subtotal:        number;
  total:           number;
  notes:           string | null;
  created_at:      string;
  order_items: {
    quantity:   number;
    unit_price: number;
    name:       string;
  }[];
};

const WILAYA_NAMES: Record<number, string> = {
  1:"أدرار",2:"الشلف",3:"الأغواط",4:"أم البواقي",5:"باتنة",6:"بجاية",7:"بسكرة",8:"بشار",
  9:"البليدة",10:"البويرة",11:"تمنراست",12:"تبسة",13:"تلمسان",14:"تيارت",15:"تيزي وزو",
  16:"الجزائر",17:"الجلفة",18:"جيجل",19:"سطيف",20:"سعيدة",21:"سكيكدة",22:"سيدي بلعباس",
  23:"عنابة",24:"قالمة",25:"قسنطينة",26:"المدية",27:"مستغانم",28:"م'سيلة",29:"معسكر",
  30:"ورقلة",31:"وهران",32:"البيض",33:"إليزي",34:"برج بوعريريج",35:"بومرداس",36:"الطارف",
  37:"تندوف",38:"تيسمسيلت",39:"الوادي",40:"خنشلة",41:"سوق أهراس",42:"تيبازة",43:"ميلة",
  44:"عين الدفلى",45:"النعامة",46:"عين تيموشنت",47:"غرداية",48:"غليزان",49:"تيميمون",
  50:"برج باجي مختار",51:"أولاد جلال",52:"بني عباس",53:"عين صالح",54:"عين قزام",
  55:"توقرت",56:"جانت",57:"المغير",58:"المنيعة",
};

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending:    { label: "قيد الانتظار",   color: "text-amber-700 bg-amber-50 border-amber-200" },
  confirmed:  { label: "مؤكد",           color: "text-blue-700 bg-blue-50 border-blue-200" },
  shipped:    { label: "في الطريق",       color: "text-indigo-700 bg-indigo-50 border-indigo-200" },
  delivered:  { label: "تم التسليم",      color: "text-[var(--color-primary)] bg-[var(--color-primary-50)] border-[var(--color-primary-100)]" },
  cancelled:  { label: "ملغي",            color: "text-red-700 bg-red-50 border-red-200" },
};

async function fetchOrder(orderNumber: string): Promise<OrderRow | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(quantity, unit_price, name)")
      .eq("order_number", orderNumber)
      .maybeSingle();
    if (error || !data) return null;
    return data as OrderRow;
  } catch {
    return null;
  }
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await fetchOrder(orderNumber);
  if (!order) notFound();

  const status = STATUS_MAP[order.status] ?? STATUS_MAP.pending;
  const wilayaName = WILAYA_NAMES[order.wilaya_id] ?? `الولاية ${order.wilaya_id}`;
  const orderDate = new Date(order.created_at).toLocaleDateString("ar-DZ", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <>
      {/* Clear cart on mount */}
      <ClearCartEffect />

      {/* ── Success hero ── */}
      <div className="bg-white border-b border-[var(--color-border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center">
          <div className="w-20 h-20 rounded-full bg-[var(--color-primary-50)] border-2 border-[var(--color-primary-100)] flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={38} strokeWidth={1.5} className="text-[var(--color-primary)]" aria-hidden="true" />
          </div>
          <h1 className="text-[30px] sm:text-[36px] font-black text-[var(--color-secondary)] mb-2">
            شكراً على طلبك!
          </h1>
          <p className="text-[16px] text-[var(--color-muted)] max-w-sm mx-auto leading-relaxed">
            تم استلام طلبك بنجاح. سنتصل بك قريباً لتأكيد التوصيل.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[var(--color-surface-warm)] border border-[var(--color-border)]">
            <span className="text-[13px] text-[var(--color-muted)] font-semibold">رقم الطلب:</span>
            <span className="text-[15px] font-black text-[var(--color-secondary)] tracking-wide font-mono">{order.order_number}</span>
          </div>
        </div>
      </div>

      {/* ── Details ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-5">

        {/* Status */}
        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-5 shadow-[var(--shadow-card)] flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[13px] text-[var(--color-muted)] mb-1">{orderDate}</p>
            <p className="text-[15px] font-bold text-[var(--color-secondary)]">حالة الطلب</p>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border text-[13px] font-bold ${status.color}`}>
            {status.label}
          </span>
        </div>

        {/* Delivery info */}
        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-5 shadow-[var(--shadow-card)]">
          <h2 className="text-[16px] font-black text-[var(--color-secondary)] mb-4 flex items-center gap-2">
            <MapPin size={17} strokeWidth={2} className="text-[var(--color-primary)]" aria-hidden="true" />
            بيانات التوصيل
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "الاسم",          value: order.customer_name },
              { label: "الهاتف",         value: order.customer_phone, mono: true },
              { label: "الولاية",        value: wilayaName },
              { label: "البلدية",        value: order.commune },
              { label: "العنوان",        value: order.address },
              { label: "طريقة التوصيل", value: order.delivery_type === "home" ? "توصيل للمنزل" : "توصيل للمكتب" },
            ].map(({ label, value, mono }) => (
              <div key={label}>
                <dt className="text-[12px] font-bold text-[var(--color-muted)] mb-0.5">{label}</dt>
                <dd className={`text-[14px] font-bold text-[var(--color-foreground)] ${mono ? "font-mono tracking-wide" : ""}`}>{value}</dd>
              </div>
            ))}
          </dl>
          {order.notes && (
            <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
              <dt className="text-[12px] font-bold text-[var(--color-muted)] mb-0.5">ملاحظات</dt>
              <dd className="text-[14px] text-[var(--color-foreground)]">{order.notes}</dd>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-5 shadow-[var(--shadow-card)]">
          <h2 className="text-[16px] font-black text-[var(--color-secondary)] mb-4 flex items-center gap-2">
            <Package size={17} strokeWidth={2} className="text-[var(--color-primary)]" aria-hidden="true" />
            المنتجات
          </h2>
          <ul className="space-y-2.5">
            {order.order_items.map((item, i) => (
              <li key={i} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[13px] font-bold text-[var(--color-muted)] flex-shrink-0 tabular-nums w-6 text-left">×{item.quantity}</span>
                  <span className="text-[14px] font-semibold text-[var(--color-foreground)] truncate">{item.name}</span>
                </div>
                <span className="text-[14px] font-bold text-[var(--color-secondary)] tabular-nums flex-shrink-0">
                  {(item.unit_price * item.quantity).toLocaleString("ar-DZ")} دج
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 pt-4 border-t border-[var(--color-border)] space-y-2">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[var(--color-muted)] font-bold tabular-nums">{order.subtotal.toLocaleString("ar-DZ")} دج</span>
              <span className="text-[var(--color-muted)]">المجموع الفرعي</span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[var(--color-muted)] font-bold tabular-nums">
                {order.delivery_fee.toLocaleString("ar-DZ")} دج
              </span>
              <span className="text-[var(--color-muted)] flex items-center gap-1">
                <Truck size={12} strokeWidth={2} aria-hidden="true" />
                التوصيل
              </span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[18px] font-black text-[var(--color-primary)] tabular-nums">{order.total.toLocaleString("ar-DZ")} دج</span>
              <span className="text-[15px] font-bold text-[var(--color-secondary)]">الإجمالي</span>
            </div>
            <p className="text-[12px] text-[var(--color-muted)] text-center pt-1">الدفع عند الاستلام (COD)</p>
          </div>
        </div>

        {/* Phone contact */}
        <div className="bg-[var(--color-primary-50)] rounded-2xl border border-[var(--color-primary-100)] p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white border border-[var(--color-primary-100)] flex items-center justify-center flex-shrink-0">
            <Phone size={20} strokeWidth={1.75} className="text-[var(--color-primary)]" aria-hidden="true" />
          </div>
          <div>
            <p className="text-[14px] font-black text-[var(--color-secondary)]">هل تحتاج مساعدة؟</p>
            <p className="text-[13px] text-[var(--color-muted)] mt-0.5">
              تواصل معنا على:{" "}
              <a href="tel:+213XXXXXXXXX" className="font-bold text-[var(--color-primary)] hover:underline font-mono tracking-wide">
                +213 XXX XXX XXX
              </a>
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/products"
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-[var(--color-primary)] text-white font-black text-[15px] hover:bg-[var(--color-primary-light)] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_16px_0_rgba(27,140,58,0.3)]"
          >
            <ShoppingBag size={18} strokeWidth={2} aria-hidden="true" />
            متابعة التسوق
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border border-[var(--color-border)] text-[var(--color-secondary)] font-bold text-[15px] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-150"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </>
  );
}
