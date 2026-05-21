import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Currency = 'NZD' | 'CNY' | 'USD';

interface CartItem {
  productId: string;
  name: string;
  nameEn: string;
  // Actual per-currency prices from DB — not rate-converted
  price_nzd: number;
  price_cny: number;
  price_usd: number;
  size: string;
  color: string;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  currency: Currency;
  promoCode: string | null;
  discount: { type: 'percent'; value: number } | { type: 'fixed'; amountNZD: number } | null;
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, qty: number) => void;
  setCurrency: (c: Currency) => void;
  setPromoCode: (code: string | null, discount: { type: 'percent'; value: number } | { type: 'fixed'; amountNZD: number } | null) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  totalItems: () => number;
  subtotalNZD: () => number;
}

const SYMBOLS: Record<Currency, string> = { NZD: 'NZ$', CNY: '¥', USD: '$' };

// FIX: Use actual per-product prices from DB instead of fixed-rate conversion.
// Previously: price_nzd * RATES[currency] (gave wrong CNY — up to 35% off for some products)
export const formatPrice = (item: CartItem | number, currency: Currency): string => {
  if (typeof item === 'number') {
    // Legacy path: single NZD amount (e.g. shipping, totals)
    // Use approximate rates for totals/shipping only
    const RATES: Record<Currency, number> = { NZD: 1, CNY: 4.9, USD: 0.62 };
    return `${SYMBOLS[currency]}${Math.round(item * RATES[currency]).toLocaleString()}`;
  }
  const price = currency === 'CNY' ? item.price_cny
              : currency === 'USD' ? item.price_usd
              : item.price_nzd;
  return `${SYMBOLS[currency]}${price.toLocaleString()}`;
};

// For displaying a simple NZD amount (shipping, promo discounts, totals)
export const formatNZD = (nzd: number, currency: Currency): string => {
  const RATES: Record<Currency, number> = { NZD: 1, CNY: 4.9, USD: 0.62 };
  return `${SYMBOLS[currency]}${Math.round(nzd * RATES[currency]).toLocaleString()}`;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      currency: 'CNY',
      promoCode: null,
      discount: null,
      isOpen: false,

      addItem: (item) =>
        set((s) => {
          const existing = s.items.find(
            (i) => i.productId === item.productId && i.size === item.size,
          );
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.productId === item.productId && i.size === item.size
                  ? { ...i, quantity: i.quantity + 1 }
                  : i,
              ),
            };
          }
          return { items: [...s.items, { ...item, quantity: 1 }] };
        }),

      removeItem: (productId, size) =>
        set((s) => ({
          items: s.items.filter(
            (i) => !(i.productId === productId && i.size === size),
          ),
        })),

      updateQuantity: (productId, size, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter(
                  (i) => !(i.productId === productId && i.size === size),
                )
              : s.items.map((i) =>
                  i.productId === productId && i.size === size
                    ? { ...i, quantity: qty }
                    : i,
                ),
        })),

      setCurrency: (currency) => set({ currency }),

      setPromoCode: (code, discount) =>
        set({ promoCode: code, discount }),

      clearCart: () => set({ items: [], promoCode: null, discount: null }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
      setCartOpen: (open) => set({ isOpen: open }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotalNZD: () =>
        get().items.reduce((sum, i) => sum + i.price_nzd * i.quantity, 0),
    }),
    { name: 'pa-cart' },
  ),
);
