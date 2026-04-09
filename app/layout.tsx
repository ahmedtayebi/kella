import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "صيدلية كيلالا",
    template: "%s | صيدلية كيلالا",
  },
  description: "صيدليتك الموثوقة لكل احتياجاتك الصحية والدوائية",
  keywords: ["صيدلية", "أدوية", "صحة", "kelala", "pharmacie"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
