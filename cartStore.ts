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

export const FREE_SHIPPING_THRESHOLD_NZD = 500;
export const SHIPPING_FEE_NZD = 25;

interface CartStore {
  items: CartItem[];
  currency: Currency;
  promoCode: string | null;
  discountPercent: number;
  discountFixed: number;  // B07: fixed-amount discount support
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, qty: number) => void;
  setCurrency: (c: Currency) => void;
  setPromoCode: (code: string | null, discountPercent: number, discountFixed: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  totalItems: () => number;
  subtotalNZD: () => number;
  shippingNZD: () => number;
  totalNZD: () => number;
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
      discountFixed: 0,
      isOpen: false,
      addItem: (item) =>
        set((s) => {
          // B10: dedup by productId + size + color (all three must match)
          const existing = s.items.find(
            (i) => i.productId === item.productId && i.size === item.size && i.color === item.color
          );
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.productId === item.productId && i.size === item.size && i.color === item.color
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return { items: [...s.items, { ...item, quantity: 1 }] };
        }),
      removeItem: (productId, size, color) =>
        set((s) => ({
          items: s.items.filter(
            (i) => !(i.productId === productId && i.size === size && i.color === color)
          ),
        })),
      updateQuantity: (productId, size, color, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter(
                  (i) => !(i.productId === productId && i.size === size && i.color === color)
                )
              : s.items.map((i) =>
                  i.productId === productId && i.size === size && i.color === color
                    ? { ...i, quantity: qty }
                    : i
                ),
        })),
      setCurrency: (currency) => set({ currency }),
      setPromoCode: (code, discountPercent, discountFixed) =>
        set({ promoCode: code, discountPercent, discountFixed }),
      clearCart: () => set({ items: [], promoCode: null, discountPercent: 0, discountFixed: 0 }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
      setCartOpen: (open) => set({ isOpen: open }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotalNZD: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      shippingNZD: () => {
        const sub = get().subtotalNZD();
        return sub >= FREE_SHIPPING_THRESHOLD_NZD ? 0 : SHIPPING_FEE_NZD;
      },
      totalNZD: () => {
        const s = get();
        const sub = s.subtotalNZD();
        const discountAmt = sub * (s.discountPercent / 100) + s.discountFixed;
        return Math.max(0, sub - discountAmt + s.shippingNZD());
      },
    }),
    { name: 'pa-cart' }
  )
);
