import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

const QUICK_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "جميع المنتجات" },
  { href: "/products?category=adwiya", label: "أدوية" },
  { href: "/products?category=mokamelat", label: "مكملات غذائية" },
  { href: "/products?category=tajmil", label: "تجميل وعناية" },
  { href: "/#about", label: "من نحن" },
];

function PharmacyCrossLogo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="34" height="34" rx="8" fill="white" fillOpacity="0.12" />
      <path
        d="M13.5 7H20.5V13.5H27V20.5H20.5V27H13.5V20.5H7V13.5H13.5V7Z"
        fill="white"
      />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-secondary)] text-white" id="contact">
      {/* ── Main footer body ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

          {/* ── Col 1: Brand ── */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex flex-col leading-tight">
                <span className="text-[18px] font-bold tracking-tight">صيدلية كيلالا</span>
                <span className="text-[12px] text-white/60 font-medium">Pharmacie Kelala</span>
              </div>
              <PharmacyCrossLogo />
            </div>
            <p className="text-[14px] text-white/70 leading-relaxed max-w-xs">
              صيدليتك الموثوقة في ليوة، ولاية الوادي. نوفر لك أفضل المنتجات الصحية والدوائية بأسعار مناسبة مع توصيل لجميع ولايات الجزائر.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="#"
                aria-label="فيسبوك"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[var(--color-primary)] flex items-center justify-center transition-all duration-200 group text-white/80 hover:text-white"
              >
                <FacebookIcon />
              </a>
              <a
                href="#"
                aria-label="إنستغرام"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[var(--color-primary)] flex items-center justify-center transition-all duration-200 group text-white/80 hover:text-white"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>

          {/* ── Col 2: Quick Links ── */}
          <div className="space-y-5">
            <h3 className="text-[15px] font-bold text-white/90 pb-1 border-b border-white/10">
              روابط سريعة
            </h3>
            <ul className="space-y-2.5" role="list">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-white/65 hover:text-white hover:translate-x-[-4px] transition-all duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[var(--color-primary)] group-hover:w-2 transition-all duration-200 flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3: Contact ── */}
          <div className="space-y-5">
            <h3 className="text-[15px] font-bold text-white/90 pb-1 border-b border-white/10">
              تواصل معنا
            </h3>
            <ul className="space-y-4" role="list">
              <li>
                <a
                  href="https://maps.google.com/?q=ليوة+الوادي+الجزائر"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-[14px] text-white/65 hover:text-white transition-colors duration-200 group"
                >
                  <MapPin size={16} className="mt-0.5 flex-shrink-0 text-[var(--color-primary)] group-hover:scale-110 transition-transform" />
                  <span>ليوة، ولاية الوادي، الجزائر</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+213"
                  className="flex items-center gap-3 text-[14px] text-white/65 hover:text-white transition-colors duration-200 group"
                >
                  <Phone size={16} className="flex-shrink-0 text-[var(--color-primary)] group-hover:scale-110 transition-transform" />
                  <span>--- --- ----</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@pharmacie-kelala.dz"
                  className="flex items-center gap-3 text-[14px] text-white/65 hover:text-white transition-colors duration-200 group"
                >
                  <Mail size={16} className="flex-shrink-0 text-[var(--color-primary)] group-hover:scale-110 transition-transform" />
                  <span>contact@pharmacie-kelala.dz</span>
                </a>
              </li>
            </ul>

            {/* Hours */}
            <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-[13px] font-semibold text-white/80 mb-2">ساعات العمل</p>
              <p className="text-[13px] text-white/55">السبت — الخميس: 8:00 ص — 9:00 م</p>
              <p className="text-[13px] text-white/55">الجمعة: مغلق</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[13px] text-white/40">
            © {year} صيدلية كيلالا — جميع الحقوق محفوظة
          </p>
          <p className="text-[12px] text-white/30">
            ليوة — الوادي — الجزائر
          </p>
        </div>
      </div>
    </footer>
  );
}
