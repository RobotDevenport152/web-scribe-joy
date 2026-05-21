import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { MapPin, Calendar, Ruler, Award } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { CertificationBadges } from './CertificationBadges';

interface Props {
  batchId: string;
}

const GRADE_LABELS: Record<string, { zh: string; en: string }> = {
  baby: { zh: '幼驼级', en: 'Baby Alpaca' },
  royal: { zh: '皇家级', en: 'Royal Alpaca' },
  adult: { zh: '成驼级', en: 'Adult Alpaca' },
  suri: { zh: '苏利级', en: 'Suri Alpaca' },
};

const STATUS_COLORS: Record<string, string> = {
  raw: 'bg-muted text-muted-foreground',
  scoured: 'bg-blue-100 text-blue-800',
  combed: 'bg-amber-100 text-amber-800',
  ready: 'bg-green-100 text-green-800',
};

export function ProductTraceability({ batchId }: Props) {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const { data: batch, isLoading } = useQuery({
    queryKey: ['fiber-batch', batchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fiber_batches')
        .select(`*, grower:growers(farm_name, region, cover_image_url, description, alpaca_count)`)
        .eq('id', batchId)
        .single();
      if (error) throw error;
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="space-y-4 p-6 border border-border rounded-sm">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-20" />
      </div>
    );
  }

  if (!batch) return null;

  const grower = batch.grower as { farm_name: string; region: string; cover_image_url: string | null; description: string | null; alpaca_count: number | null } | null;
  const grade = batch.grade ? GRADE_LABELS[batch.grade] : null;

  return (
    <div className="border border-border rounded-sm overflow-hidden">
      <div className="bg-secondary/50 px-6 py-4 border-b border-border">
        <h3 className="font-display text-lg text-foreground flex items-center gap-2">
          <Award className="w-5 h-5 text-accent" />
          {lang === 'zh' ? '纤维溯源' : 'Fiber Traceability'}
        </h3>
      </div>

      <div className="p-6">
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Batch Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-body">
              <span className="text-muted-foreground">{lang === 'zh' ? '批次编号' : 'Batch Code'}:</span>
              <span className="font-mono text-foreground">{batch.batch_code}</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-body">
              <Calendar className="w-4 h-4 text-accent" />
              <span className="text-muted-foreground">{lang === 'zh' ? '收获日期' : 'Harvest Date'}:</span>
              <span className="text-foreground">{batch.harvest_date}</span>
            </div>
            {batch.micron_avg && (
              <div className="flex items-center gap-2 text-sm font-body">
                <Ruler className="w-4 h-4 text-accent" />
                <span className="text-muted-foreground">{lang === 'zh' ? '平均微米数' : 'Avg Micron'}:</span>
                <span className="text-foreground">{batch.micron_avg}μm</span>
              </div>
            )}
            {grade && (
              <div className="flex items-center gap-2 text-sm font-body">
                <span className="text-muted-foreground">{lang === 'zh' ? '纤维等级' : 'Grade'}:</span>
                <span className="text-foreground">{lang === 'zh' ? grade.zh : grade.en}</span>
              </div>
            )}
            {batch.processing_status && (
              <div className="flex items-center gap-2 text-sm font-body">
                <span className="text-muted-foreground">{lang === 'zh' ? '处理状态' : 'Status'}:</span>
                <span className={`px-2 py-0.5 rounded text-xs ${STATUS_COLORS[batch.processing_status] || ''}`}>
                  {batch.processing_status}
                </span>
              </div>
            )}
          </div>

          {/* Grower Info */}
          {grower && (
            <div className="space-y-3">
              {grower.cover_image_url && (
                <img src={grower.cover_image_url} alt={grower.farm_name} className="w-full h-32 object-cover rounded-sm" loading="lazy" />
              )}
              <div className="flex items-center gap-2 text-sm font-body">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="font-medium text-foreground">{grower.farm_name}</span>
                <span className="text-muted-foreground">· {grower.region}</span>
              </div>
              {grower.description && (
                <p className="text-xs text-muted-foreground leading-relaxed">{grower.description}</p>
              )}
              {grower.alpaca_count && (
                <p className="text-xs text-muted-foreground">
                  🦙 {grower.alpaca_count} {lang === 'zh' ? '头羊驼' : 'alpacas'}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <CertificationBadges certifications={['NZ Made', 'FernMark', 'IAA Alpaca Mark', 'NZ Grown']} />
        </div>
      </div>
    </div>
  );
}
