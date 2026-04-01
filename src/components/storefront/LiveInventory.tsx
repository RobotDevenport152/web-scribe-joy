import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

interface Props {
  productId: string;
}

export function LiveInventory({ productId }: Props) {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const { data: stock } = useQuery({
    queryKey: ['inventory', productId],
    queryFn: async () => {
      const { data } = await supabase
        .from('products')
        .select('stock_quantity')
        .eq('id', productId)
        .single();
      return data?.stock_quantity ?? 0;
    },
    refetchInterval: 30000, // 30s polling
    staleTime: 0,
  });

  if (stock === undefined || stock === null) return null;

  if (stock === 0) {
    return (
      <p className="text-sm font-body font-medium text-destructive">
        {lang === 'zh' ? '暂时缺货' : 'Out of Stock'}
      </p>
    );
  }

  if (stock <= 5) {
    return (
      <p className="text-sm font-body font-medium text-amber-600">
        {lang === 'zh' ? `仅剩 ${stock} 件 — 即将售罄` : `Only ${stock} left — selling fast`}
      </p>
    );
  }

  return (
    <p className="text-sm font-body text-pa-green-lt">
      {lang === 'zh' ? '有货，可立即发货' : 'In Stock — Ready to Ship'}
    </p>
  );
}
