import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Scissors, Droplets, Wind, Sparkles, ShieldCheck, Package, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const PROCESS_STEPS = [
  { icon: Scissors, labelZh: '剪获', labelEn: 'Shearing', descZh: '每年只剪一次，确保纤维最佳长度', descEn: 'Once a year for optimal fiber length' },
  { icon: Droplets, labelZh: '洗涤', labelEn: 'Scouring', descZh: '独创"5缸6洗净洗工艺"', descEn: 'Proprietary 5-tank 6-wash process' },
  { icon: Wind, labelZh: '精梳', labelEn: 'Combing', descZh: '行业领先梳理系统', descEn: 'Advanced carding system' },
  { icon: Sparkles, labelZh: '絮片', labelEn: 'Felting', descZh: '高密度针刺定型', descEn: 'High-density needle-punching' },
  { icon: ShieldCheck, labelZh: '灭菌', labelEn: 'Sterilizing', descZh: '物理高温+臭氧+环氧乙烷', descEn: 'Heat + ozone + ethylene oxide' },
  { icon: Package, labelZh: '成品', labelEn: 'Finished', descZh: '丝光、碳化精制', descEn: 'Mercerizing and carbonizing' },
];

const MOCK_BATCHES = [
  { code: 'PA-2025-001', farm: 'Canterbury Hills Farm', region: 'Canterbury', date: '2025-01-15', weight: 45.2, micron: 22.5, grade: 'A+', status: 'ready' },
  { code: 'PA-2025-002', farm: 'Waikato Valley Farm', region: 'Waikato', date: '2025-02-10', weight: 38.0, micron: 23.1, grade: 'A', status: 'combed' },
  { code: 'PA-2025-003', farm: 'Southland Heritage Farm', region: 'Southland', date: '2025-03-01', weight: 52.8, micron: 21.8, grade: 'A+', status: 'scoured' },
];

const STATUS_MAP: Record<string, number> = { raw: 0, scoured: 1, combed: 2, ready: 5 };

export default function TraceabilityPage() {
  const { locale } = useApp();
  const [searchCode, setSearchCode] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<typeof MOCK_BATCHES[0] | null>(null);

  const handleSearch = () => {
    const found = MOCK_BATCHES.find(b => b.code.toLowerCase() === searchCode.toLowerCase());
    setSelectedBatch(found || null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-gold text-xs tracking-[0.3em] uppercase font-body">
              {locale === 'zh' ? '纤维溯源' : 'Fiber Traceability'}
            </span>
            <h1 className="font-display text-4xl md:text-5xl mt-4 mb-4">
              {locale === 'zh' ? '每一根纤维都可追溯' : 'Every Fiber is Traceable'}
            </h1>
            <p className="text-muted-foreground font-body max-w-xl mx-auto">
              {locale === 'zh'
                ? '输入您产品标签上的批次编号，即可查看从牧场到成品的完整加工链。'
                : 'Enter the batch code from your product label to view the full processing chain from farm to product.'}
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-12">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={locale === 'zh' ? '输入批次编号 (如: PA-2025-001)' : 'Enter batch code (e.g. PA-2025-001)'}
                  value={searchCode}
                  onChange={e => setSearchCode(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-sm bg-background font-body text-sm focus:outline-none focus:border-gold transition-colors"
                />
              </div>
              <button onClick={handleSearch} className="px-6 py-3 bg-accent text-accent-foreground rounded-sm font-body text-sm hover:bg-accent/90 transition-colors">
                {locale === 'zh' ? '查询' : 'Search'}
              </button>
            </div>
            <p className="text-xs text-muted-foreground font-body mt-2 text-center">
              {locale === 'zh' ? '示例批次: PA-2025-001, PA-2025-002, PA-2025-003' : 'Sample batches: PA-2025-001, PA-2025-002, PA-2025-003'}
            </p>
          </div>

          {/* Batch Result */}
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
                  <div className="bg-background rounded-sm p-3 text-center">
                    <p className="text-xs text-muted-foreground font-body">{locale === 'zh' ? '牧场' : 'Farm'}</p>
                    <p className="font-body font-semibold text-sm mt-1">{selectedBatch.farm}</p>
                  </div>
                  <div className="bg-background rounded-sm p-3 text-center">
                    <p className="text-xs text-muted-foreground font-body">{locale === 'zh' ? '重量' : 'Weight'}</p>
                    <p className="font-body font-semibold text-sm mt-1">{selectedBatch.weight} kg</p>
                  </div>
                  <div className="bg-background rounded-sm p-3 text-center">
                    <p className="text-xs text-muted-foreground font-body">{locale === 'zh' ? '微米数' : 'Micron'}</p>
                    <p className="font-body font-semibold text-sm mt-1">{selectedBatch.micron}μm</p>
                  </div>
                  <div className="bg-background rounded-sm p-3 text-center">
                    <p className="text-xs text-muted-foreground font-body">{locale === 'zh' ? '等级' : 'Grade'}</p>
                    <p className="font-body font-semibold text-sm mt-1 text-gold">{selectedBatch.grade}</p>
                  </div>
                </div>

                {/* Process Timeline */}
                <h3 className="font-display text-lg mb-4">{locale === 'zh' ? '加工溯源链' : 'Processing Chain'}</h3>
                <div className="relative">
                  <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
                  {PROCESS_STEPS.map((ps, idx) => {
                    const completed = idx <= (STATUS_MAP[selectedBatch.status] || 0);
                    const Icon = ps.icon;
                    return (
                      <motion.div
                        key={ps.labelEn}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-4 mb-4 relative"
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 flex-shrink-0 ${
                          completed ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className={`font-body font-semibold text-sm ${completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {locale === 'zh' ? ps.labelZh : ps.labelEn}
                          </p>
                          <p className="text-xs text-muted-foreground font-body">
                            {locale === 'zh' ? ps.descZh : ps.descEn}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* All Batches */}
          <div className="max-w-3xl mx-auto">
            <h3 className="font-display text-xl mb-4">{locale === 'zh' ? '最新批次记录' : 'Recent Batches'}</h3>
            <div className="space-y-3">
              {MOCK_BATCHES.map(batch => (
                <button
                  key={batch.code}
                  onClick={() => { setSearchCode(batch.code); setSelectedBatch(batch); }}
                  className="w-full text-left bg-card rounded-lg border border-border p-4 hover:border-gold/30 transition-colors flex items-center justify-between"
                >
                  <div>
                    <p className="font-mono text-sm font-semibold">{batch.code}</p>
                    <p className="text-xs text-muted-foreground font-body">{batch.farm} · {batch.region}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-body">{batch.weight}kg · {batch.micron}μm</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 capitalize">{batch.status}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link to="/shop" className="inline-block px-8 py-3 bg-accent text-accent-foreground rounded-sm font-body hover:bg-accent/90 transition-colors">
              {locale === 'zh' ? '购买溯源产品' : 'Shop Traceable Products'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
