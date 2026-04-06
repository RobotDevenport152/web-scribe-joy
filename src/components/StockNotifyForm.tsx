import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
  productId: string;
  locale: 'zh' | 'en';
}

export default function StockNotifyForm({ productId, locale }: Props) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      toast.error(locale === 'zh' ? '请输入有效邮箱' : 'Please enter a valid email');
      return;
    }
    setLoading(true);
    try {
      const key = 'pa-stock-notify';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const entry = { product_id: productId, email: email.trim().toLowerCase(), created_at: new Date().toISOString() };
      localStorage.setItem(key, JSON.stringify([...existing, entry]));
      setSubmitted(true);
      toast.success(locale === 'zh' ? '已登记！到货后我们会第一时间通知您' : 'Noted! We will email you when it is back in stock');
    } catch {
      toast.error(locale === 'zh' ? '提交失败，请稍后再试' : 'Submission failed, please try again');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="w-full py-3 border border-gold/40 text-gold text-sm font-body text-center rounded-sm">
        {locale === 'zh' ? '✓ 到货后将发送邮件通知' : '✓ We will notify you by email'}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground font-body">
        {locale === 'zh' ? '该产品暂时缺货 — 留下邮箱，到货即通知：' : 'Out of stock — enter your email to be notified:'}
      </p>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder={locale === 'zh' ? '您的邮箱' : 'Your email'}
          className="flex-1 px-3 py-2 text-sm border border-border rounded-sm bg-background font-body focus:outline-none focus:border-gold"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-accent text-accent-foreground text-sm font-body font-medium rounded-sm hover:bg-accent/90 disabled:opacity-50 transition"
        >
          {loading ? '...' : locale === 'zh' ? '提醒我' : 'Notify me'}
        </button>
      </div>
    </div>
  );
}
