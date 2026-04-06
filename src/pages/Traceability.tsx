import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Scissors, Droplets, Wind, Sparkles, ShieldCheck, Package, Search, Share2, Check } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const PROCESS_STEPS = [
  { icon: Scissors, labelZh: '剪获', labelEn: 'Shearing', descZh: '每年只剪一次，确保纤维最佳长度', descEn: 'Once a year for optimal fiber length' },
  { icon: Droplets, labelZh: '洗涤', labelEn: 'Scouring', descZh: '独创"5缸6洗净洗工艺"', descEn: 'Proprietary 5-tank 6-wash process' },
  { icon: Wind, labelZh: '精梳', labelEn: 'Combing', descZh: '行业领先梳理系统', descEn: 'Advanced carding system' },
  { icon: Sparkles, labelZh: '絮片', labelEn: 'Felting', descZh: '高密度针刺定型', descEn: 'High-density needle-punching' },
  { icon: ShieldCheck, labelZh: '灭菌', labelEn: 'Sterilizing', descZh: '物理高温+臭氧+环氧乙烷', descEn: 'Heat + ozone + ethylene oxide' },
  { icon: Package, labelZh: '成品', labelEn: 'Finished', descZh: '丝光、碳化精制', descEn: 'Mercerizing and carbonizing' },
];

interface BatchResult {
  code: string;
  farm: string;
  region: string;
  date: string;
  weight: number;
  micron: number;
  grade: string;
  status: string;
}

const STATUS_MAP: Record<string, number> = { raw: 0, scoured: 1, combed: 2, ready: 5 };

async function fetchBatch(code: string): Promise<BatchResult | null> {
  const { data, error } = await supabase
    .from('fiber_batches')
    .select('*, growers(farm_name)')
    .ilike('batch_code', code)
    .maybeSingle();

  if (error || !data) return null;

  return {
    code: data.batch_code,
    farm: (data.growers as any)?.farm_name || 'Unknown Farm',
    region: data.region || 'New Zealand',
    date: data.harvest_date || data.created_at || '',
    weight: Number(data.weight_kg) || 0,
    micron: Number(data.micron_avg) || 0,
    grade: data.grade || 'N/A',
    status: data.processing_status || 'raw',
  };
}

export default function TraceabilityPage() {
  const { locale } = useApp();
  const [urlParams] = useSearchParams();
  const initialCode = urlParams.get('code') || '';
  const [searchCode, setSearchCode] = useState(initialCode);
  const [selectedBatch, setSelectedBatch] = useState<BatchResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (initialCode) {
      fetchBatch(initialCode).then(result => {
        if (result) setSelectedBatch(result);
      });
    }
  }, [initialCode]);

  const handleSearch = async () => {
    setSearching(true);
    const result = await fetchBatch(searchCode.trim());
    setSearching(false);
    if (result) {
      setSelectedBatch(result);
    } else {
      setSelectedBatch(null);
      toast.error(locale === 'zh' ? '未找到该批次，请检查编号是否正确' : 'Batch not found. Please check the code.');
    }
  };

  const handleShare = (batch: BatchResult) => {
    const shareText = locale === 'zh'
      ? `我的太平洋羊驼被来自新西兰${batch.region}的 ${batch.farm}，微米数${batch.micron}μm，等级${batch.grade}。`
      : `My Pacific Alpacas duvet comes from ${batch.farm} in ${batch.region}, NZ. ${batch.micron}μm, Grade ${batch.grade}.`;
    const url = `${window.location.origin}/traceability?code=${batch.code}`;
    if (navigator.share) {
      navigator.share({ title: 'Pacific Alpacas', text: shareText, url });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${url}`).then(() => {
        setCopied(true);
        toast.success(locale === 'zh' ? '溯源链接已复制到剪贴板' : 'Trace link copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-gold text-xs tracking-[0.3em] uppercase font-body">{locale === 'zh' ? '纤维溯源' : 'Fiber Traceability'}</span>
            <h1 className="font-display text-4xl md:text-5xl mt-4 mb-4">{locale === 'zh' ? '每一根纤维都可追溯' : 'Every Fiber is Traceable'}</h1>
            <p className="text-muted-foreground font-body max-w-xl mx-auto">
              {locale === 'zh' ? '输入您产品标签上的批次编号，即可查看从牧场到成品的完整加工链。' : 'Enter the batch code from your product label to view the full processing chain.'}
            </p>
          </div>

          <div className="max-w-md mx-auto mb-12">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder={locale === 'zh' ? '输入批次编号 (如: PA-2025-001)' : 'Enter batch code (e.g. PA-2025-001)'} value={searchCode} onChange={e => setSearchCode(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-sm bg-background font-body text-sm focus:outline-none focus:border-gold transition-colors" />
              </div>
              <button onClick={handleSearch} className="px-6 py-3 bg-accent text-accent-foreground rounded-sm font-body text-sm hover:bg-accent/90 transition-colors">
                {locale === 'zh' ? '查询' : 'Search'}
              </button>
            </div>
          </div>

          {selectedBatch && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto mb-12">
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="font-display text-2xl font-semibold">{selectedBatch.code}</h2>
                    <div className="flex items-center gap-4 mt-2 text-sm font-body text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {selectedBatch.region}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {selectedBatch.date}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-body bg-green-100 text-green-800 capitalize">{selectedBatch.status}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: locale === 'zh' ? '牧场' : 'Farm', value: selectedBatch.farm },
                    { label: locale === 'zh' ? '重量' : 'Weight', value: `${selectedBatch.weight} kg` },
                    { label: locale === 'zh' ? '微米数' : 'Micron', value: `${selectedBatch.micron}μm` },
                    { label: locale === 'zh' ? '等级' : 'Grade', value: selectedBatch.grade },
                  ].map((item, i) => (
                    <div key={i} className="bg-background rounded-sm p-3 text-center">
                      <p className="text-xs text-muted-foreground font-body">{item.label}</p>
                      <p className="font-body font-semibold text-sm mt-1">{item.value}</p>
                    </div>
                  ))}
                </div>
                <h3 className="font-display text-lg mb-4">{locale === 'zh' ? '加工溯源链' : 'Processing Chain'}</h3>
                <div className="relative">
                  <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
                  {PROCESS_STEPS.map((ps, idx) => {
                    const completed = idx <= (STATUS_MAP[selectedBatch.status] || 0);
                    return (
                      <div key={idx} className="relative flex items-start gap-4 pb-6 last:pb-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${completed ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
                          <ps.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className={`font-body text-sm font-semibold ${completed ? '' : 'text-muted-foreground'}`}>{locale === 'zh' ? ps.labelZh : ps.labelEn}</p>
                          <p className="text-xs text-muted-foreground font-body">{locale === 'zh' ? ps.descZh : ps.descEn}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6">
                  <button onClick={() => handleShare(selectedBatch)} className="flex items-center gap-2 px-4 py-2 border border-border rounded-sm text-sm font-body hover:border-gold/50 transition-colors">
                    {copied ? <Check className="w-4 h-4 text-gold" /> : <Share2 className="w-4 h-4" />}
                    {locale === 'zh' ? '分享溯源故事' : 'Share Story'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl text-center mb-8">{locale === 'zh' ? '从牧场到枕边' : 'From Farm to Pillow'}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PROCESS_STEPS.map((step, idx) => (
                <div key={idx} className="bg-card rounded-lg border border-border p-5 text-center">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                    <step.icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-1">{locale === 'zh' ? step.labelZh : step.labelEn}</h3>
                  <p className="text-xs text-muted-foreground font-body">{locale === 'zh' ? step.descZh : step.descEn}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
