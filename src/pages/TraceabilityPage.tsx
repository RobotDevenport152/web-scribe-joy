import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { CertificationBadges } from '@/components/traceability/CertificationBadges';
import { MapPin, Calendar, Scissors, Droplets, Wind, Sparkles, ShieldCheck, Package } from 'lucide-react';

const PROCESS_STEPS = [
  { icon: Scissors, labelZh: '剪获', labelEn: 'Shearing', descZh: '每年只剪一次，确保纤维最佳长度', descEn: 'Once a year for optimal fiber length' },
  { icon: Droplets, labelZh: '洗涤', labelEn: 'Scouring', descZh: '独创"5缸6洗净洗工艺"', descEn: 'Proprietary 5-tank 6-wash process' },
  { icon: Wind, labelZh: '精梳', labelEn: 'Combing', descZh: '行业领先梳理系统', descEn: 'Advanced carding system' },
  { icon: Sparkles, labelZh: '絮片', labelEn: 'Felting', descZh: '高密度针刺定型', descEn: 'High-density needle-punching' },
  { icon: ShieldCheck, labelZh: '灭菌', labelEn: 'Sterilizing', descZh: '物理高温+臭氧+环氧乙烷', descEn: 'Heat + ozone + ethylene oxide' },
  { icon: Package, labelZh: '成品', labelEn: 'Finished', descZh: '丝光、碳化精制', descEn: 'Mercerizing and carbonizing' },
];

export default function TraceabilityPage() {
  const { batchCode } = useParams<{ batchCode: string }>();
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const { data: batch, isLoading, error } = useQuery({
    queryKey: ['trace', batchCode],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fiber_batches')
        .select(`*, grower:growers(farm_name, region, cover_image_url, description, alpaca_count)`)
        .eq('batch_code', batchCode!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!batchCode,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4 max-w-3xl space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-40" />
          <Skeleton className="h-60" />
        </div>
      </div>
    );
  }

  if (error || !batch) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl text-foreground mb-2">
            {lang === 'zh' ? '未找到该批次' : 'Batch Not Found'}
          </h1>
          <p className="text-muted-foreground font-body mb-4">{batchCode}</p>
          <Link to="/" className="text-accent underline font-body">{lang === 'zh' ? '返回首页' : 'Back to Home'}</Link>
        </div>
      </div>
    );
  }

  const grower = batch.grower as { farm_name: string; region: string; cover_image_url: string | null; description: string | null; alpaca_count: number | null } | null;

  // Determine which process steps are completed based on status
  const statusOrder = ['raw', 'scoured', 'combed', 'ready'];
  const currentIdx = statusOrder.indexOf(batch.processing_status || 'raw');

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-accent font-body text-sm tracking-widest uppercase mb-2">
            {lang === 'zh' ? '纤维溯源' : 'Fiber Traceability'}
          </p>
          <h1 className="font-display text-3xl text-foreground mb-1">{batch.batch_code}</h1>
          <div className="gold-line w-16 mb-8" />
        </motion.div>

        {/* Batch Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-sm p-6 mb-8"
        >
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3 text-sm font-body">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" />
                <span className="text-muted-foreground">{lang === 'zh' ? '收获日期' : 'Harvest Date'}:</span>
                <span className="text-foreground">{batch.harvest_date}</span>
              </div>
              {batch.weight_kg && (
                <div>
                  <span className="text-muted-foreground">{lang === 'zh' ? '重量' : 'Weight'}: </span>
                  <span className="text-foreground">{batch.weight_kg} kg</span>
                </div>
              )}
              {batch.micron_avg && (
                <div>
                  <span className="text-muted-foreground">{lang === 'zh' ? '平均微米数' : 'Avg Micron'}: </span>
                  <span className="text-foreground">{batch.micron_avg}μm</span>
                </div>
              )}
              {batch.grade && (
                <div>
                  <span className="text-muted-foreground">{lang === 'zh' ? '等级' : 'Grade'}: </span>
                  <span className="text-foreground capitalize">{batch.grade}</span>
                </div>
              )}
              {batch.region && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span className="text-foreground">{batch.region}</span>
                </div>
              )}
            </div>

            {grower && (
              <div>
                {grower.cover_image_url && (
                  <img src={grower.cover_image_url} alt={grower.farm_name} className="w-full h-32 object-cover rounded-sm mb-3" loading="lazy" />
                )}
                <p className="font-medium text-foreground">{grower.farm_name}</p>
                <p className="text-xs text-muted-foreground">{grower.region}</p>
                {grower.description && <p className="text-xs text-muted-foreground mt-2">{grower.description}</p>}
              </div>
            )}
          </div>
        </motion.div>

        {/* Process Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="font-display text-xl text-foreground mb-6">
            {lang === 'zh' ? '加工溯源链' : 'Processing Chain'}
          </h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-6">
              {PROCESS_STEPS.map((ps, idx) => {
                const completed = idx <= currentIdx + 1; // map 6 steps to 4 statuses roughly
                const Icon = ps.icon;
                return (
                  <motion.div
                    key={ps.labelEn}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="flex items-start gap-4 relative"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                      completed ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="pt-1.5">
                      <p className={`font-body font-medium text-sm ${completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {lang === 'zh' ? ps.labelZh : ps.labelEn}
                      </p>
                      <p className="text-xs text-muted-foreground">{lang === 'zh' ? ps.descZh : ps.descEn}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <CertificationBadges certifications={['NZ Made', 'FernMark', 'IAA Alpaca Mark', 'NZ Grown']} />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center py-8"
        >
          <Link
            to="/shop"
            className="inline-block px-8 py-3 bg-accent text-accent-foreground rounded-sm font-body hover:bg-accent/90 transition-colors"
          >
            {lang === 'zh' ? '购买此批次产品' : 'Shop Products from This Batch'}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
