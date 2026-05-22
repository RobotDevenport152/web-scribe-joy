import React, { useEffect } from 'react';
import { type Currency, useCartStore } from '@/stores/cartStore';
import { type Product, type CartItem, formatPrice, PROMO_CODES } from '@/lib/store';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, variant?: string) => void;
  removeFromCart: (productId: string, variant?: string) => void;
  updateQuantity: (productId: string, qty: number, variant?: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  promoCode: string;
  setPromoCode: (code: string) => void;
  promoDiscount: number;
  setPromoDiscount: (d: number) => void;
  applyPromo: (code: string) => boolean;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  fp: (amount: number) => string;
}

// CartProvider runs a one-time migration from the old pa-cart-v1 key
// (CartContext's localStorage) to pa-cart (cartStore's Zustand-persisted key).
export function CartProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    try {
      const legacyRaw = localStorage.getItem('pa-cart-v1');
      if (!legacyRaw) return;
      const legacy: CartItem[] = JSON.parse(legacyRaw);
      if (!Array.isArray(legacy) || legacy.length === 0) return;

      const storeRaw = localStorage.getItem('pa-cart');
      const storeParsed = storeRaw ? JSON.parse(storeRaw) : null;
      const storeItems = storeParsed?.state?.items ?? [];
      if (storeItems.length > 0) {
        // cartStore already has items — don't clobber
        localStorage.removeItem('pa-cart-v1');
        return;
      }

      // Port legacy items into cartStore format
      const store = useCartStore.getState();
      for (const item of legacy) {
        store.addItem({
          productId: item.product.id,
          name: item.product.nameZh,
          nameEn: item.product.nameEn,
          price_nzd: item.product.prices.NZD,
          price_cny: item.product.prices.CNY,
          price_usd: item.product.prices.USD,
          size: item.variant ?? '',
          color: '',
          image: item.product.image,
        });
      }
      localStorage.removeItem('pa-cart-v1');
    } catch {
      // Migration failed — safe to ignore; fresh cart
    }
  }, []);

  return <>{children}</>;
}

// useCart is a thin adapter: reads from cartStore and presents the legacy
// CartContext interface so existing consumers (Checkout, CartDrawer, etc.)
// need no changes.
export function useCart(): CartContextType {
  const {
    items,
    currency,
    promoCode: storePromoCode,
    discount,
    isOpen,
    addItem,
    removeItem,
    updateQuantity: storeUpdateQty,
    setCurrency,
    setPromoCode: storeSetPromoCode,
    clearCart,
    setCartOpen,
    totalItems,
  } = useCartStore();

  // Reconstruct CartContext's Product-typed items from the flat cartStore schema.
  // Fields not stored in cartStore (descEn/Zh, variants, etc.) get safe defaults
  // since Checkout.tsx and CartDrawer.tsx only need id, names, prices, and image.
  const cart: CartItem[] = items.map(item => ({
    product: {
      id: item.productId,
      nameEn: item.nameEn,
      nameZh: item.name,
      descEn: '',
      descZh: '',
      category: 'bedding' as const,
      prices: { NZD: item.price_nzd, CNY: item.price_cny, USD: item.price_usd },
      image: item.image,
      stock: 1,
      featured: false,
    } as Product,
    quantity: item.quantity,
    variant: item.size || undefined,
  }));

  // cartTotal is in the display currency (matches original CartContext behaviour
  // where each item's price was fetched in the current currency).
  const priceForCurrency = (item: typeof items[0]) =>
    currency === 'CNY' ? item.price_cny
    : currency === 'USD' ? item.price_usd
    : item.price_nzd;

  const cartTotal = items.reduce(
    (sum, item) => sum + priceForCurrency(item) * item.quantity,
    0,
  );
  const cartCount = totalItems();

  // promoDiscount in display currency (percent applies to cartTotal which is
  // already in display currency; fixed uses the raw NZD amount as the original did)
  const promoDiscount = !discount ? 0
    : discount.type === 'percent'
    ? parseFloat((cartTotal * discount.value / 100).toFixed(2))
    : discount.amountNZD;

  const promoCode = storePromoCode ?? '';

  const fp = (amount: number) => formatPrice(amount, currency);

  const addToCart = (product: Product, variant?: string) => {
    addItem({
      productId: product.id,
      name: product.nameZh,
      nameEn: product.nameEn,
      price_nzd: product.prices.NZD,
      price_cny: product.prices.CNY,
      price_usd: product.prices.USD,
      size: variant ?? '',
      color: '',
      image: product.image,
    });
    setCartOpen(true);
  };

  const removeFromCart = (productId: string, variant?: string) =>
    removeItem(productId, variant ?? '');

  const updateQuantity = (productId: string, qty: number, variant?: string) =>
    storeUpdateQty(productId, variant ?? '', qty);

  const applyPromo = (code: string): boolean => {
    const promo = PROMO_CODES[code.toUpperCase()];
    if (!promo) return false;
    if (promo.minAmount && cartTotal < promo.minAmount) return false;
    const discountObj = promo.type === 'percent'
      ? { type: 'percent' as const, value: promo.discount }
      : { type: 'fixed' as const, amountNZD: promo.discount };
    storeSetPromoCode(code.toUpperCase(), discountObj);
    return true;
  };

  const setPromoCode = (code: string) => {
    if (!code) storeSetPromoCode(null, null);
    // Setting a code string without a discount value is only used to clear;
    // actual application goes through applyPromo.
  };

  const setPromoDiscount = (_d: number) => {
    // No-op: discount is managed through applyPromo/setPromoCode.
    // Kept for API compatibility with components that call setPromoDiscount(0).
  };

  return {
    cart, addToCart, removeFromCart, updateQuantity, clearCart,
    cartTotal, cartCount,
    promoCode, setPromoCode, promoDiscount, setPromoDiscount, applyPromo,
    cartOpen: isOpen, setCartOpen,
    currency, setCurrency,
    fp,
  };
}
