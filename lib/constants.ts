export const SITE_NAME = "صيدلية كيلالا";
export const SITE_DESCRIPTION = "صيدليتك الموثوقة لكل احتياجاتك الصحية والدوائية";

export const PHARMACY_PHONE = "";
export const PHARMACY_EMAIL = "";
export const PHARMACY_ADDRESS = "";

export const ITEMS_PER_PAGE = 24;

export const ROUTES = {
  home: "/",
  categories: "/categories",
  products: "/products",
  cart: "/cart",
  checkout: "/checkout",
  account: "/account",
  admin: {
    dashboard: "/admin",
    products: "/admin/products",
    orders: "/admin/orders",
    customers: "/admin/customers",
    categories: "/admin/categories",
    settings: "/admin/settings",
    login: "/admin/login",
  },
} as const;
