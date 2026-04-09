/**
 * Format a price in Algerian Dinar (or configured currency)
 */
export function formatPrice(amount: number, currency = "DZD"): string {
  return new Intl.NumberFormat("ar-DZ", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Slugify Arabic + Latin text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]/g, "")
    .replace(/--+/g, "-");
}

/**
 * Truncate text to a max length with ellipsis
 */
export function truncate(text: string, maxLength = 100): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Generate a full Supabase storage public URL
 */
export function getStorageUrl(path: string, bucket = "products"): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base || !path) return "";
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}
