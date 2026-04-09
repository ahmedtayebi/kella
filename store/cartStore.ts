"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  product_id:  string;
  name:        string;
  price:       number;
  quantity:    number;
  image:       string;
  slug:        string;
};

type CartStore = {
  items:          CartItem[];
  addItem:        (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem:     (product_id: string) => void;
  updateQuantity: (product_id: string, quantity: number) => void;
  clearCart:      () => void;
  totalItems:     () => number;
  subtotal:       () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { product_id, name, price, image, slug, quantity = 1 } = item;
        set((state) => {
          const existing = state.items.find((i) => i.product_id === product_id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product_id === product_id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { product_id, name, price, image, slug, quantity }],
          };
        });
      },

      removeItem: (product_id) =>
        set((state) => ({
          items: state.items.filter((i) => i.product_id !== product_id),
        })),

      updateQuantity: (product_id, quantity) => {
        if (quantity < 1) {
          get().removeItem(product_id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product_id === product_id ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "kelala-cart",
    }
  )
);
