import { useTranslation } from 'react-i18next';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCartStore, formatPrice } from '@/stores/cartStore';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const CartDrawer = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const {
    items, currency, isOpen, setCartOpen,
    removeItem, updateQuantity, subtotalNZD,
    promoCode, discountPercent, setPromoCode,
  } = useCartStore();
  const [promoInput, setPromoInput] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  const subtotal = subtotalNZD();
  const discount = subtotal * (discountPercent / 100);
  const total = subtotal - discount;

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', promoInput.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !data) {
        toast.error(lang === 'zh' ? '无效促销码' : 'Invalid promo code');
        return;
      }

      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        toast.error(lang === 'zh' ? '促销码已过期' : 'Promo code expired');
        return;
      }

      if (data.usage_limit && data.used_count && data.used_count >= data.usage_limit) {
        toast.error(lang === 'zh' ? '促销码已用完' : 'Promo code usage limit reached');
        return;
      }

      if (data.min_order_nzd && subtotal < data.min_order_nzd) {
        toast.error(lang === 'zh' ? `最低消费 ${formatPrice(data.min_order_nzd, currency)}` : `Minimum order ${formatPrice(data.min_order_nzd, currency)}`);
        return;
      }

      const discountVal = data.discount_type === 'percent' ? (data.discount_value || 0) : 0;
      setPromoCode(data.code, discountVal);
      toast.success(lang === 'zh' ? `已应用促销码：${data.code}` : `Applied: ${data.code}`);
    } catch {
      toast.error(lang === 'zh' ? '验证失败' : 'Verification failed');
    } finally {
      setPromoLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/40 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background z-50 flex flex-col shadow-elevated"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-xl text-foreground">
                {lang === 'zh' ? '购物车' : 'Cart'}
              </h2>
              <button onClick={() => setCartOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground font-body">
                    {lang === 'zh' ? '购物车为空' : 'Your cart is empty'}
                  </p>
                  <Link
                    to="/shop"
                    onClick={() => setCartOpen(false)}
                    className="inline-block mt-4 text-sm text-accent underline font-body"
                  >
                    {lang === 'zh' ? '去选购' : 'Browse Products'}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.size}`} className="flex gap-4 py-4 border-b border-border last:border-0">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-sm flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm text-foreground truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground font-body">{item.size} {item.color && `· ${item.color}`}</p>
                        <p className="text-sm text-accent font-body mt-1">{formatPrice(item.price, currency)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                            className="w-7 h-7 border border-border rounded-sm flex items-center justify-center text-foreground hover:bg-secondary"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-body w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                            className="w-7 h-7 border border-border rounded-sm flex items-center justify-center text-foreground hover:bg-secondary"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeItem(item.productId, item.size)}
                            className="ml-auto text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-6 space-y-4">
                {/* Promo code */}
                {!promoCode ? (
                  <div className="flex gap-2">
                    <input
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder={lang === 'zh' ? '促销码' : 'Promo code'}
                      className="flex-1 px-3 py-2 text-sm border border-border rounded-sm bg-background font-body text-foreground placeholder:text-muted-foreground"
                    />
                    <button
                      onClick={handleApplyPromo}
                      disabled={promoLoading}
                      className="px-4 py-2 text-sm bg-foreground text-background rounded-sm font-body hover:bg-foreground/90 disabled:opacity-50"
                    >
                      {lang === 'zh' ? '应用' : 'Apply'}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-sm font-body">
                    <span className="text-accent">✓ {promoCode}</span>
                    <button onClick={() => setPromoCode(null, 0)} className="text-muted-foreground text-xs underline">
                      {lang === 'zh' ? '移除' : 'Remove'}
                    </button>
                  </div>
                )}

                {/* Totals */}
                <div className="space-y-2 text-sm font-body">
                  <div className="flex justify-between text-foreground">
                    <span>{lang === 'zh' ? '小计' : 'Subtotal'}</span>
                    <span>{formatPrice(subtotal, currency)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-accent">
                      <span>{lang === 'zh' ? '折扣' : 'Discount'}</span>
                      <span>-{formatPrice(discount, currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-foreground font-medium text-base pt-2 border-t border-border">
                    <span>{lang === 'zh' ? '合计' : 'Total'}</span>
                    <span>{formatPrice(total, currency)}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="block w-full py-3 bg-accent text-accent-foreground text-center font-body font-medium rounded-sm hover:bg-accent/90 transition-colors"
                >
                  {lang === 'zh' ? '去结账' : 'Checkout'}
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
