import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const MEDIA = [
  { name: 'CCTV', labelZh: '央视', labelEn: 'CCTV' },
  { name: '新华网', labelZh: '新华网', labelEn: 'Xinhua' },
  { name: '央视国际', labelZh: '央视国际', labelEn: 'CCTV Intl' },
  { name: '胡润百富', labelZh: '胡润百富', labelEn: 'Hurun Report' },
];

const NEWS = [
  {
    titleZh: '太平洋羊驼获2023胡润至尚优品金奖',
    titleEn: 'Pacific Alpacas Wins 2023 Hurun Best of the Best Gold Award',
    summaryZh: '新西兰Pacific Alpacas品牌斩获"软装家居"新秀奖，与瑞士瑞联、达索猎鹰等品牌同获殊荣。',
    summaryEn: 'Pacific Alpacas won the "Soft Furnishing" New Arrival Award alongside Swiss Re and Dassault Falcon.',
    date: '2023',
  },
  {
    titleZh: 'CCTV13专题报道太平洋羊驼品牌',
    titleEn: 'CCTV13 Features Pacific Alpacas Brand',
    summaryZh: '截至2025年，太平洋羊驼已受到30多家主流媒体广泛关注，网络传播量突破千万次。',
    summaryEn: 'By 2025, Pacific Alpacas has been covered by 30+ mainstream media with 10M+ online impressions.',
    date: '2024',
  },
  {
    titleZh: '太平洋羊驼成为中国女子橄榄球队官方合作伙伴',
    titleEn: 'Pacific Alpacas Becomes Official Partner of China Women\'s Rugby Team',
    summaryZh: '2024年10月正式成为中国女子橄榄球队官方合作伙伴和指定品牌，研究运动员深度睡眠与恢复。',
    summaryEn: 'Official partner since Oct 2024, researching athletes\' deep sleep and recovery performance.',
    date: '2024',
  },
];

const MediaCoverageSection = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-secondary/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-accent mb-4 font-body">
            {lang === 'zh' ? '媒体报道' : 'Media Coverage'}
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
            {lang === 'zh' ? '30+ 主流媒体广泛关注' : '30+ Mainstream Media Coverage'}
          </h2>
          <div className="gold-line w-20 mx-auto" />
        </motion.div>

        {/* Media Logos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-8 md:gap-16 mb-16 flex-wrap"
        >
          {MEDIA.map((m, idx) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="text-center"
            >
              <span className="font-display text-xl md:text-2xl text-foreground/60">
                {lang === 'zh' ? m.labelZh : m.labelEn}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* News Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {NEWS.map((news, idx) => (
            <motion.div
              key={news.titleEn}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className="bg-card border border-border rounded-sm p-6"
            >
              <span className="text-xs text-accent font-body">{news.date}</span>
              <h3 className="font-display text-base text-foreground mt-2 mb-3 leading-snug">
                {lang === 'zh' ? news.titleZh : news.titleEn}
              </h3>
              <p className="text-xs font-body text-muted-foreground leading-relaxed">
                {lang === 'zh' ? news.summaryZh : news.summaryEn}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MediaCoverageSection;
