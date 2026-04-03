import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import Navbar from '@/components/Navbar';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderSuccessPage() {
  const { locale } = useApp();
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('number') || 'PA-2025-XXXXXXXX';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-16 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-10 h-10 text-green-600" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="font-display text-3xl mb-2">
            {locale === 'zh' ? '订单提交成功！' : 'Order Submitted!'}
          </h1>
          <p className="text-muted-foreground font-body mb-2">
            {locale === 'zh' ? '订单编号' : 'Order Number'}
          </p>
          <p className="font-mono text-lg text-gold font-semibold mb-8">{orderNumber}</p>
          <p className="text-muted-foreground font-body text-sm mb-8 max-w-md mx-auto">
            {locale === 'zh'
              ? '我们会尽快处理您的订单，您将收到一封确认邮件。'
              : 'We will process your order shortly. You will receive a confirmation email.'}
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/shop" className="px-6 py-3 border border-border rounded-sm font-body text-sm hover:bg-secondary transition-colors">
              {locale === 'zh' ? '继续购物' : 'Continue Shopping'}
            </Link>
            <Link to="/" className="px-6 py-3 bg-accent text-accent-foreground rounded-sm font-body text-sm hover:bg-accent/90 transition-colors">
              {locale === 'zh' ? '返回首页' : 'Back to Home'}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
