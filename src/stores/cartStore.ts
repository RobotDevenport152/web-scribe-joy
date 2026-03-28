import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Currency = 'NZD' | 'CNY' | 'USD';

interface CartItem {
  productId: string;
  name: string;
  nameEn: string;
  price: number; // NZD
  size: string;
  color: string;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  currency: Currency;
  promoCode: string | null;
  discountPercent: number;
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, qty: number) => void;
  setCurrency: (c: Currency) => void;
  setPromoCode: (code: string | null, discount: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  totalItems: () => number;
  subtotalNZD: () => number;
}

const RATES: Record<Currency, number> = { NZD: 1, CNY: 4.5, USD: 0.62 };

export const formatPrice = (nzd: number, currency: Currency): string => {
  const converted = nzd * RATES[currency];
  const symbols: Record<Currency, string> = { NZD: 'NZ$', CNY: '¥', USD: '$' };
  return `${symbols[currency]}${converted.toFixed(0)}`;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      currency: 'CNY',
      promoCode: null,
      discountPercent: 0,
      isOpen: false,
      addItem: (item) =>
        set((s) => {
          const existing = s.items.find(
            (i) => i.productId === item.productId && i.size === item.size
          );
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.productId === item.productId && i.size === item.size
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return { items: [...s.items, { ...item, quantity: 1 }] };
        }),
      removeItem: (productId, size) =>
        set((s) => ({
          items: s.items.filter(
            (i) => !(i.productId === productId && i.size === size)
          ),
        })),
      updateQuantity: (productId, size, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter(
                  (i) => !(i.productId === productId && i.size === size)
                )
              : s.items.map((i) =>
                  i.productId === productId && i.size === size
                    ? { ...i, quantity: qty }
                    : i
                ),
        })),
      setCurrency: (currency) => set({ currency }),
      setPromoCode: (code, discount) =>
        set({ promoCode: code, discountPercent: discount }),
      clearCart: () => set({ items: [], promoCode: null, discountPercent: 0 }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
      setCartOpen: (open) => set({ isOpen: open }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotalNZD: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: 'pa-cart' }
  )
);
