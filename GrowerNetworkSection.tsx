import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

const GROWER_DOTS = [
  // Northland
  { name: 'Northland-1', x: 116, y: 28 }, { name: 'Northland-2', x: 107, y: 46 },
  // Auckland / Waikato
  { name: 'Auckland', x: 111, y: 76 }, { name: 'Waikato-1', x: 103, y: 98 },
  { name: 'Waikato-2', x: 113, y: 110 }, { name: 'BayOfPlenty', x: 132, y: 104 },
  { name: 'Rotorua', x: 124, y: 118 },
  // Gisborne / Hawkes Bay
  { name: 'Gisborne', x: 151, y: 126 }, { name: 'HawkesBay', x: 142, y: 148 },
  // Manawatu / Whanganui
  { name: 'Whanganui', x: 105, y: 155 }, { name: 'Manawatu', x: 115, y: 162 },
  // Wellington / Wairarapa
  { name: 'Wellington', x: 117, y: 194 }, { name: 'Wairarapa', x: 131, y: 184 },
  // South Island – Nelson / Marlborough
  { name: 'Nelson', x: 99, y: 242 }, { name: 'Marlborough', x: 116, y: 250 },
  // West Coast
  { name: 'WestCoast-1', x: 75, y: 294 }, { name: 'WestCoast-2', x: 71, y: 314 },
  // Canterbury
  { name: 'Canterbury-1', x: 105, y: 286 }, { name: 'Canterbury-2', x: 97, y: 306 },
  { name: 'Christchurch', x: 110, y: 298 },
  // Mackenzie / North Otago
  { name: 'Mackenzie', x: 91, y: 322 }, { name: 'NorthOtago', x: 100, y: 332 },
  // Central Otago / Dunedin
  { name: 'CentralOtago', x: 88, y: 346 }, { name: 'Dunedin', x: 104, y: 356 },
  // Southland / Fiordland
  { name: 'Fiordland', x: 56, y: 376 }, { name: 'Southland-1', x: 80, y: 390 },
  { name: 'Southland-2', x: 68, y: 400 }, { name: 'Invercargill', x: 74, y: 416 },
];

const GrowerNetworkSection = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-accent mb-4 font-body">
            {lang === 'zh' ? '全球供应网络' : 'Global Supply Network'}
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
            {lang === 'zh' ? '来自新西兰 800 家牧场的承诺' : 'A Promise from 800 NZ Farms'}
          </h2>
          <div className="gold-line w-20 mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Full New Zealand SVG Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }} className="relative mx-auto"
          >
            <svg viewBox="0 0 220 490" className="w-full max-w-[260px] mx-auto" aria-label="New Zealand farm locations">
              {/* ─── North Island ─── */}
              <path
                d="M113,18 C119,15 128,18 134,26 C139,34 137,44 134,52
                   C139,58 143,66 141,76 C139,84 133,89 129,96
                   C135,102 139,112 137,122 C135,130 129,136 133,144
                   C139,152 147,156 149,164 C151,172 146,178 142,184
                   C146,190 148,198 146,206 C143,214 136,218 130,220
                   C123,222 116,218 112,212 C108,206 108,198 106,190
                   C104,182 98,175 96,166 C93,157 96,148 98,140
                   C100,132 103,124 101,116 C99,108 93,101 93,92
                   C93,83 97,76 99,68 C101,60 99,50 102,42
                   C105,33 108,21 113,18 Z"
                className="fill-secondary stroke-accent/40" strokeWidth="1.5"
              />
              {/* ─── Cook Strait ─── */}
              <text x="114" y="232" textAnchor="middle" fontSize="5" fill="currentColor" opacity="0.3" fontStyle="italic">Cook Strait</text>
              {/* ─── South Island ─── */}
              <path
                d="M116,238 C123,234 131,236 137,243 C143,250 142,260 138,268
                   C144,275 148,284 145,294 C142,302 136,308 132,316
                   C136,324 139,334 135,344 C131,352 122,356 118,364
                   C122,372 124,382 120,390 C116,398 108,402 102,406
                   C98,410 94,414 92,420 C88,427 84,433 79,436
                   C75,438 69,437 66,433 C62,428 63,421 65,415
                   C61,408 57,401 57,393 C57,385 61,377 59,369
                   C57,361 51,354 50,346 C48,338 51,328 55,320
                   C51,312 49,302 53,294 C57,286 65,282 69,274
                   C65,266 62,256 66,248 C70,240 79,236 86,237
                   C92,237 98,240 103,244 C107,241 111,239 116,238 Z"
                className="fill-secondary stroke-accent/40" strokeWidth="1.5"
              />
              {/* ─── Stewart Island ─── */}
              <path
                d="M74,446 C79,442 86,445 88,452 C90,459 85,465 80,466 C75,467 70,462 71,456 C71,451 72,448 74,446 Z"
                className="fill-secondary stroke-accent/40" strokeWidth="1"
              />

              {/* ─── Region labels ─── */}
              {[
                { x: 118, y: 14,  label: 'Northland' },
                { x: 120, y: 94,  label: 'Waikato' },
                { x: 148, y: 153, label: "Hawke's Bay" },
                { x: 118, y: 202, label: 'Wellington' },
                { x: 108, y: 301, label: 'Canterbury' },
                { x: 90,  y: 350, label: 'Central Otago' },
                { x: 76,  y: 424, label: 'Southland' },
              ].map(({ x, y, label }) => (
                <text key={label} x={x} y={y} textAnchor="middle" fontSize="5.5"
                  fill="hsl(43 85% 38%)" opacity="0.65">{label}</text>
              ))}

              {/* ─── Farm dots ─── */}
              {GROWER_DOTS.map((dot, idx) => (
                <motion.g key={dot.name}>
                  <motion.circle cx={dot.x} cy={dot.y} r="3.5"
                    fill="hsl(43 85% 38%)" opacity="0.85"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={inView ? { scale: 1, opacity: 0.85 } : {}}
                    transition={{ delay: 0.4 + idx * 0.04 }}
                  />
                  <motion.circle cx={dot.x} cy={dot.y} r="7"
                    fill="hsl(43 85% 38% / 0.15)"
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : {}}
                    transition={{ delay: 0.4 + idx * 0.04 }}
                  />
                </motion.g>
              ))}
            </svg>
          </motion.div>

          {/* Stats & CTA */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            <div className="grid grid-cols-2 gap-6 mb-10">
              {[
                { value: '800+', labelZh: '合作养殖户', labelEn: 'Partner Farms' },
                { value: '25', labelZh: '年深耕历史', labelEn: 'Years of Heritage' },
                { value: '100+', labelZh: '吨原料掌控', labelEn: 'Tonnes Controlled' },
                { value: '70%', labelZh: '新西兰市占率', labelEn: 'NZ Market Share' },
              ].map((stat, idx) => (
                <motion.div key={stat.labelEn}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="text-center py-4"
                >
                  <p className="font-display text-3xl text-accent">{stat.value}</p>
                  <p className="text-sm font-body text-muted-foreground mt-1">
                    {lang === 'zh' ? stat.labelZh : stat.labelEn}
                  </p>
                </motion.div>
              ))}
            </div>

            <p className="text-foreground/70 font-body text-sm leading-relaxed mb-6">
              {lang === 'zh'
                ? '每一批纤维均可追溯到具体农场。从北地到南地，遍布全新西兰的800+牧场网络是我们最坚实的护城河。'
                : 'Every fiber batch is traceable to its specific farm. Our network of 800+ farms across all of New Zealand is our deepest competitive moat.'}
            </p>

            <Link to="/trace/NZ-2024-COT-001"
              className="inline-flex items-center gap-2 px-6 py-3 border border-accent text-accent font-body text-sm hover:bg-accent hover:text-accent-foreground transition-colors rounded-sm"
            >
              <Search className="w-4 h-4" />
              {lang === 'zh' ? '查询溯源' : 'Trace Your Fiber'}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GrowerNetworkSection;
