import { useTranslation } from 'react-i18next';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Share2 } from 'lucide-react';
import { toast } from 'sonner';

export default function OrderSuccessPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [params] = useSearchParams();
  const orderNumber = params.get('number') || '';

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Pacific Alpacas',
        text: lang === 'zh' ? `我刚在太平洋羊驼购买了羊驼被！订单号：${orderNumber}` : `I just ordered from Pacific Alpacas! Order: ${orderNumber}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(lang === 'zh' ? '链接已复制' : 'Link copied');
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md mx-auto px-4"
      >
        <CheckCircle className="w-16 h-16 text-accent mx-auto mb-6" />

        <h1 className="font-display text-2xl md:text-3xl text-foreground mb-2">
          {lang === 'zh' ? '订单已提交！' : 'Order Confirmed!'}
        </h1>

        <p className="font-body text-muted-foreground mb-6">
          {lang === 'zh'
            ? '感谢您的购买，我们将尽快处理您的订单。'
            : 'Thank you for your purchase. We will process your order shortly.'}
        </p>

        {orderNumber && (
          <div className="bg-secondary/50 rounded-sm p-4 mb-6">
            <p className="text-xs text-muted-foreground font-body mb-1">{lang === 'zh' ? '订单编号' : 'Order Number'}</p>
            <p className="font-mono text-lg text-foreground">{orderNumber}</p>
          </div>
        )}

        <div className="bg-card border border-border rounded-sm p-4 mb-6 text-left">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-accent" />
            <span className="text-sm font-body font-medium text-foreground">
              {lang === 'zh' ? '预计发货时间' : 'Estimated Shipping'}
            </span>
          </div>
          <p className="text-sm font-body text-muted-foreground">
            {lang === 'zh' ? '新西兰国内：3-5个工作日\n国际配送：7-14个工作日' : 'NZ Domestic: 3-5 business days\nInternational: 7-14 business days'}
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Link
            to="/shop"
            className="px-6 py-3 border border-border text-foreground rounded-sm font-body text-sm hover:bg-secondary transition-colors"
          >
            {lang === 'zh' ? '继续选购' : 'Continue Shopping'}
          </Link>
          <button
            onClick={handleShare}
            className="px-6 py-3 bg-accent text-accent-foreground rounded-sm font-body text-sm hover:bg-accent/90 transition-colors flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            {lang === 'zh' ? '分享给朋友' : 'Share'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
