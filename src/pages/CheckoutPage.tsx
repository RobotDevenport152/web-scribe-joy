import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCartStore, formatPrice } from '@/stores/cartStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

type Step = 'info' | 'payment' | 'confirm';

export default function CheckoutPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const { items, currency, subtotalNZD, discountPercent, clearCart } = useCartStore();
  const [step, setStep] = useState<Step>('info');
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    address: '',
    paymentMethod: 'stripe',
  });

  const subtotal = subtotalNZD();
  const discount = subtotal * (discountPercent / 100);
  const shipping = subtotal >= 500 ? 0 : 25;
  const total = subtotal - discount + shipping;

  const steps: { key: Step; labelZh: string; labelEn: string }[] = [
    { key: 'info', labelZh: '收货信息', labelEn: 'Shipping' },
    { key: 'payment', labelZh: '支付', labelEn: 'Payment' },
    { key: 'confirm', labelZh: '确认', labelEn: 'Confirm' },
  ];

  const handleField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitOrder = async () => {
    setSubmitting(true);
    try {
      const orderNumber = `PA-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;

      const { error } = await supabase.from('orders').insert({
        order_number: orderNumber,
        customer_email: form.email,
        customer_name: form.name,
        shipping_address: {
          province: form.province,
          city: form.city,
          district: form.district,
          address: form.address,
          phone: form.phone,
        },
        items: items.map((i) => ({
          product_id: i.productId,
          name: i.name,
          qty: i.quantity,
          price_nzd: i.price,
          size: i.size,
        })),
        subtotal_nzd: subtotal,
        shipping_nzd: shipping,
        discount_nzd: discount,
        total_nzd: total,
        currency,
        payment_method: form.paymentMethod,
        status: 'pending',
      });

      if (error) throw error;

      clearCart();
      toast.success(lang === 'zh' ? '订单已提交！' : 'Order submitted!');
      navigate(`/order-success?number=${orderNumber}`);
    } catch (err) {
      toast.error(lang === 'zh' ? '提交失败，请重试' : 'Submission failed, please retry');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-xl text-foreground mb-4">
            {lang === 'zh' ? '购物车为空' : 'Your cart is empty'}
          </p>
          <a href="/shop" className="text-accent underline font-body">{lang === 'zh' ? '去选购' : 'Browse Products'}</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <h1 className="font-display text-2xl md:text-3xl text-foreground mb-8">
          {lang === 'zh' ? '结账' : 'Checkout'}
        </h1>

        {/* Step bar */}
        <div className="flex items-center mb-10 max-w-md">
          {steps.map((s, idx) => (
            <div key={s.key} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-body ${
                step === s.key ? 'bg-accent text-accent-foreground' :
                steps.findIndex((x) => x.key === step) > idx ? 'bg-accent/20 text-accent' :
                'bg-muted text-muted-foreground'
              }`}>
                {steps.findIndex((x) => x.key === step) > idx ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              <span className="ml-2 text-xs font-body text-foreground hidden sm:inline">
                {lang === 'zh' ? s.labelZh : s.labelEn}
              </span>
              {idx < steps.length - 1 && <div className="flex-1 h-px bg-border mx-3" />}
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Main */}
          <div className="md:col-span-2">
            {step === 'info' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-body text-foreground mb-1 block">{lang === 'zh' ? '姓名' : 'Name'} *</label>
                    <input value={form.name} onChange={(e) => handleField('name', e.target.value)} className="w-full px-3 py-2 border border-border rounded-sm bg-background text-foreground font-body text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-body text-foreground mb-1 block">{lang === 'zh' ? '电话' : 'Phone'} *</label>
                    <input value={form.phone} onChange={(e) => handleField('phone', e.target.value)} className="w-full px-3 py-2 border border-border rounded-sm bg-background text-foreground font-body text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-body text-foreground mb-1 block">{lang === 'zh' ? '邮箱' : 'Email'} *</label>
                  <input type="email" value={form.email} onChange={(e) => handleField('email', e.target.value)} className="w-full px-3 py-2 border border-border rounded-sm bg-background text-foreground font-body text-sm" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-body text-foreground mb-1 block">{lang === 'zh' ? '省份' : 'Province'}</label>
                    <input value={form.province} onChange={(e) => handleField('province', e.target.value)} className="w-full px-3 py-2 border border-border rounded-sm bg-background text-foreground font-body text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-body text-foreground mb-1 block">{lang === 'zh' ? '城市' : 'City'}</label>
                    <input value={form.city} onChange={(e) => handleField('city', e.target.value)} className="w-full px-3 py-2 border border-border rounded-sm bg-background text-foreground font-body text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-body text-foreground mb-1 block">{lang === 'zh' ? '区县' : 'District'}</label>
                    <input value={form.district} onChange={(e) => handleField('district', e.target.value)} className="w-full px-3 py-2 border border-border rounded-sm bg-background text-foreground font-body text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-body text-foreground mb-1 block">{lang === 'zh' ? '详细地址' : 'Address'}</label>
                  <input value={form.address} onChange={(e) => handleField('address', e.target.value)} className="w-full px-3 py-2 border border-border rounded-sm bg-background text-foreground font-body text-sm" />
                </div>
                <button
                  onClick={() => {
                    if (!form.name || !form.email || !form.phone) {
                      toast.error(lang === 'zh' ? '请填写必填项' : 'Please fill required fields');
                      return;
                    }
                    setStep('payment');
                  }}
                  className="w-full py-3 bg-accent text-accent-foreground font-body font-medium rounded-sm hover:bg-accent/90 transition-colors"
                >
                  {lang === 'zh' ? '下一步' : 'Continue'}
                </button>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="space-y-3">
                  {[
                    { value: 'stripe', labelZh: '国际信用卡 (Stripe)', labelEn: 'Credit Card (Stripe)' },
                    { value: 'wechat', labelZh: '微信支付', labelEn: 'WeChat Pay' },
                  ].map((pm) => (
                    <button
                      key={pm.value}
                      onClick={() => handleField('paymentMethod', pm.value)}
                      className={`w-full text-left px-4 py-3 border rounded-sm font-body text-sm transition-colors ${
                        form.paymentMethod === pm.value
                          ? 'border-accent bg-accent/5 text-foreground'
                          : 'border-border text-foreground hover:border-accent'
                      }`}
                    >
                      {lang === 'zh' ? pm.labelZh : pm.labelEn}
                    </button>
                  ))}
                </div>

                {form.paymentMethod === 'wechat' && (
                  <div className="bg-secondary/50 p-4 rounded-sm text-center">
                    <p className="text-sm font-body text-foreground mb-2">
                      {lang === 'zh' ? '微信支付暂时需要人工处理' : 'WeChat Pay requires manual processing'}
                    </p>
                    <p className="text-xs text-muted-foreground font-body">
                      {lang === 'zh' ? '请联系微信客服：pacificalpacas' : 'Contact WeChat: pacificalpacas'}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('info')}
                    className="px-6 py-3 border border-border text-foreground rounded-sm font-body text-sm hover:bg-secondary"
                  >
                    {lang === 'zh' ? '返回' : 'Back'}
                  </button>
                  <button
                    onClick={() => setStep('confirm')}
                    className="flex-1 py-3 bg-accent text-accent-foreground font-body font-medium rounded-sm hover:bg-accent/90 transition-colors"
                  >
                    {lang === 'zh' ? '确认订单' : 'Review Order'}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'confirm' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-secondary/50 p-4 rounded-sm space-y-2 text-sm font-body">
                  <p className="text-foreground"><span className="text-muted-foreground">{lang === 'zh' ? '收件人：' : 'Name: '}</span>{form.name}</p>
                  <p className="text-foreground"><span className="text-muted-foreground">{lang === 'zh' ? '电话：' : 'Phone: '}</span>{form.phone}</p>
                  <p className="text-foreground"><span className="text-muted-foreground">{lang === 'zh' ? '邮箱：' : 'Email: '}</span>{form.email}</p>
                  <p className="text-foreground"><span className="text-muted-foreground">{lang === 'zh' ? '地址：' : 'Address: '}</span>{form.province} {form.city} {form.district} {form.address}</p>
                  <p className="text-foreground"><span className="text-muted-foreground">{lang === 'zh' ? '支付方式：' : 'Payment: '}</span>
                    {form.paymentMethod === 'stripe' ? (lang === 'zh' ? '国际信用卡' : 'Credit Card') : (lang === 'zh' ? '微信支付' : 'WeChat Pay')}
                  </p>
                </div>

                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.size}`} className="flex items-center gap-3 text-sm font-body">
                      {item.image && <img src={item.image} alt="" className="w-12 h-12 object-cover rounded-sm" />}
                      <div className="flex-1">
                        <p className="text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.size} × {item.quantity}</p>
                      </div>
                      <p className="text-foreground">{formatPrice(item.price * item.quantity, currency)}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('payment')}
                    className="px-6 py-3 border border-border text-foreground rounded-sm font-body text-sm hover:bg-secondary"
                  >
                    {lang === 'zh' ? '返回' : 'Back'}
                  </button>
                  <button
                    onClick={handleSubmitOrder}
                    disabled={submitting}
                    className="flex-1 py-3 bg-accent text-accent-foreground font-body font-medium rounded-sm hover:bg-accent/90 transition-colors disabled:opacity-50"
                  >
                    {submitting
                      ? (lang === 'zh' ? '提交中...' : 'Submitting...')
                      : (lang === 'zh' ? `提交订单 ${formatPrice(total, currency)}` : `Place Order ${formatPrice(total, currency)}`)}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="hidden md:block">
            <div className="sticky top-24 bg-card border border-border rounded-sm p-6">
              <h3 className="font-display text-base text-foreground mb-4">{lang === 'zh' ? '订单摘要' : 'Order Summary'}</h3>
              <div className="space-y-3 text-sm font-body">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="flex justify-between">
                    <span className="text-foreground truncate mr-2">{item.name} ×{item.quantity}</span>
                    <span className="text-foreground flex-shrink-0">{formatPrice(item.price * item.quantity, currency)}</span>
                  </div>
                ))}
                <div className="border-t border-border pt-3 space-y-2">
                  <div className="flex justify-between text-muted-foreground">
                    <span>{lang === 'zh' ? '小计' : 'Subtotal'}</span>
                    <span>{formatPrice(subtotal, currency)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-accent">
                      <span>{lang === 'zh' ? '折扣' : 'Discount'}</span>
                      <span>-{formatPrice(discount, currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground">
                    <span>{lang === 'zh' ? '运费' : 'Shipping'}</span>
                    <span>{shipping === 0 ? (lang === 'zh' ? '免运费' : 'Free') : formatPrice(shipping, currency)}</span>
                  </div>
                  <div className="flex justify-between text-foreground font-medium text-base pt-2 border-t border-border">
                    <span>{lang === 'zh' ? '合计' : 'Total'}</span>
                    <span>{formatPrice(total, currency)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
