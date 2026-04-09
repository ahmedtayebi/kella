import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin, Mail, Clock } from "lucide-react";

// ── SVG Social Icons ────────────────────────────────────────────────────────
function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

// ── Data ────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { href: "/",         label: "الرئيسية" },
  { href: "/products", label: "جميع المنتجات" },
  { href: "/cart",     label: "سلة التسوق" },
  { href: "/#about",   label: "من نحن" },
];

const CATEGORIES = [
  { href: "/products?category=adwiya",       label: "أدوية ومستحضرات" },
  { href: "/products?category=mokamelat",    label: "مكملات غذائية" },
  { href: "/products?category=tajmil",       label: "تجميل وعناية" },
  { href: "/products?category=ajhiza-tibia", label: "أجهزة طبية" },
  { href: "/products?category=atfal",        label: "منتجات الأطفال" },
];

const SOCIAL = [
  { href: "#", label: "فيسبوك",   Icon: FacebookIcon },
  { href: "#", label: "إنستغرام", Icon: InstagramIcon },
  { href: "#", label: "واتساب",   Icon: WhatsAppIcon },
];

// ── Sub-components ───────────────────────────────────────────────────────────
function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="group inline-flex flex-col text-[14px] text-white/45 hover:text-white transition-colors duration-200"
      >
        <span>{label}</span>
        <span
          aria-hidden="true"
          className="block h-px bg-[var(--color-primary)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right"
        />
      </Link>
    </li>
  );
}

function ColHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-black tracking-[0.18em] uppercase text-[var(--color-primary)] mb-6">
      {children}
    </p>
  );
}

// ── Footer ───────────────────────────────────────────────────────────────────
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-[#12237a]">

      {/* ── Top accent line — green gradient ── */}
      <div
        aria-hidden="true"
        className="h-px"
        style={{
          background:
            "linear-gradient(to left, transparent 0%, #12237a 35%, #22a847 50%, #1B8C3A 65%, transparent 100%)",
        }}
      />

      {/* ── Brand hero ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Image
                src="/logo.png"
                alt="شعار صيدلية كيلالا"
                width={64}
                height={64}
                className="rounded-xl flex-shrink-0 object-contain"
                priority
              />
              <h2 className="text-[36px] sm:text-[48px] font-black leading-none tracking-tight text-white/95">
                صيدلية كيلالا
              </h2>
            </div>
            <p className="text-[13px] text-white/30 ps-[80px]" style={{ letterSpacing: "0.04em" }}>
              Pharmacie Kelala &nbsp;·&nbsp; ليوة — الوادي — الجزائر
            </p>
          </div>

          {/* Phone CTA */}
          <a
            href="tel:+213"
            className="self-start sm:self-auto inline-flex items-center gap-2.5 px-5 py-3 rounded-xl text-[14px] font-bold text-[var(--color-primary)] border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/8 hover:bg-[var(--color-primary)]/15 hover:border-[var(--color-primary)]/60 hover:scale-[1.02] active:scale-[0.97] transition-all duration-200"
          >
            <Phone size={15} strokeWidth={2} />
            اتصل بنا الآن
          </a>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-white/[0.07]" />
      </div>

      {/* ── 4-column grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Col 1: About + Social */}
          <div className="sm:col-span-2 lg:col-span-1">
            <ColHeading>عن الصيدلية</ColHeading>
            <p className="text-[13px] text-white/40 leading-relaxed mb-7">
              صيدليتك الموثوقة في قلب ليوة. منتجات صحية ودوائية أصيلة بأسعار مناسبة مع توصيل سريع لجميع ولايات الجزائر.
            </p>

            {/* Hours card */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.04] border border-white/[0.07] mb-6">
              <Clock size={14} strokeWidth={2} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[12px] font-bold text-white/65 mb-1.5">ساعات العمل</p>
                <p className="text-[12px] text-white/38">السبت — الخميس&nbsp; 8:00 – 21:00</p>
                <p className="text-[12px] text-white/28 mt-1">الجمعة — مغلق</p>
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-2">
              {SOCIAL.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white/35 border border-white/[0.09] bg-white/[0.04] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/10 hover:scale-110 transition-all duration-200"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Nav links */}
          <div>
            <ColHeading>روابط سريعة</ColHeading>
            <ul className="space-y-4" role="list">
              {NAV_LINKS.map((link) => (
                <FooterLink key={link.href} href={link.href} label={link.label} />
              ))}
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <ColHeading>أقسام المنتجات</ColHeading>
            <ul className="space-y-4" role="list">
              {CATEGORIES.map((link) => (
                <FooterLink key={link.href} href={link.href} label={link.label} />
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <ColHeading>تواصل معنا</ColHeading>
            <ul className="space-y-5" role="list">
              <li>
                <a
                  href="https://maps.google.com/?q=ليوة+الوادي+الجزائر"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 text-white/40 hover:text-white/80 transition-colors duration-200"
                >
                  <MapPin size={15} strokeWidth={1.75} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                  <span className="text-[13px] leading-snug">
                    ليوة، ولاية الوادي
                    <br />
                    الجزائر
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+213"
                  className="group flex items-center gap-3 text-white/40 hover:text-white/80 transition-colors duration-200"
                >
                  <Phone size={15} strokeWidth={1.75} className="text-[var(--color-primary)] flex-shrink-0" />
                  <span className="text-[13px] font-mono tracking-widest">+213 --- --- ----</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@pharmacie-kelala.dz"
                  className="group flex items-center gap-3 text-white/40 hover:text-white/80 transition-colors duration-200"
                >
                  <Mail size={15} strokeWidth={1.75} className="text-[var(--color-primary)] flex-shrink-0" />
                  <span className="text-[13px] break-all">contact@pharmacie-kelala.dz</span>
                </a>
              </li>
            </ul>

            <a
              href="https://maps.google.com/?q=ليوة+الوادي+الجزائر"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[12px] font-medium text-white/30 border border-white/[0.08] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/40 transition-all duration-200"
            >
              <MapPin size={12} strokeWidth={2} />
              عرض على خرائط جوجل
            </a>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/[0.06] bg-black/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[12px] text-white/22">
            © {year} صيدلية كيلالا — جميع الحقوق محفوظة
          </p>
          <p className="text-[12px] text-white/18">
            ليوة · الوادي · الجزائر
          </p>
        </div>
      </div>
    </footer>
  );
}
