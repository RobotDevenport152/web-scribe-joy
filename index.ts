import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  zh: {
    translation: {
      nav: {
        home: '首页',
        about: '关于我们',
        whyAlpaca: '为什么是羊驼',
        shop: '产品展示',
        certifications: '品牌资质',
        trace: '溯源查询',
        cart: '购物车',
        account: '我的账户',
        admin: '管理后台',
      },
      hero: {
        subtitle: '引领天然睡眠材料革命',
        title: '全球深睡新标准',
        tagline: '"Luxury in Your Dreams"',
        cta: '探索羊驼被',
        ctaTrace: '了解溯源',
        scroll: '滚动浏览',
      },
      brand: {
        title: '源自新西兰的奢华睡眠艺术',
        sectionLabel: '品牌传承',
        desc: '自2001年创立以来，太平洋羊驼深耕奢华睡眠领域二十余年。与新西兰800+牧场合作，掌控全球逾百吨优质羊驼纤维原料。',
        desc2: '拥有独家"5缸6洗净洗工艺"与物理高温、臭氧、环氧乙烷专业灭菌技术，每一床羊驼被都达到极致纯净的母婴级标准。',
        years: '年品牌积淀',
        farms: '合作牧场',
        market: '新西兰市占率',
        material: '吨原料掌控',
      },
      fiber: {
        sectionLabel: '会呼吸的软黄金',
        title: '大自然的馈赠',
        desc: '在古印加王朝，羊驼纤维被誉为"神之纤维"，专供王室使用。如今被Loro Piana、Max Mara等国际顶级奢侈品牌所青睐。',
        sleepBoost: '提升25%深度睡眠',
        sleepDesc: '打造最佳睡眠微环境：32-34°C，40-60%湿度',
        warm: '保暖：3倍于羊毛',
        warmDesc: '中空纤维结构如同保温瓶，保暖效果卓越。',
        light: '轻盈：若如云朵',
        lightDesc: '同等保暖下仅为羊毛被重量的30%。',
        moisture: '排潮：会呼吸的纤维',
        moistureDesc: '可吸收自身重量35%的水蒸气并迅速排出。',
        mite: '抑螨：天然屏障',
        miteDesc: '实验数据表明螨虫趋避率64.37%。',
        static: '阻电：洁净不吸尘',
        staticDesc: '光滑纤维鳞片防止静电积聚。',
      },
      process: {
        title: '国际领先的加工全流程',
        subtitle: '行业领先的加工工艺',
        steps: {
          shear: { title: '剪获', desc: '每年只剪一次，确保纤维最佳长度。' },
          wash: { title: '洗涤', desc: '独创"5缸6洗净洗工艺"。' },
          comb: { title: '精梳', desc: '行业领先的梳理系统，提升蓬松度与柔滑感。' },
          felt: { title: '絮片', desc: '高密度针刺定型，确保稳定性与轻盈性。' },
          sterilize: { title: '灭菌', desc: '物理高温+臭氧+环氧乙烷消毒。' },
          finish: { title: '处理', desc: '丝光、碳化技术精制。' },
        },
      },
      certs: {
        sectionLabel: '国际认证',
        title: '权威品牌资质',
        fernmark: { title: '银蕨认证', desc: '新西兰政府银蕨认证，证书号101008。' },
        nzmade: { title: 'NZ Made & Grown', desc: '100%新西兰制造，全程可溯源。' },
        iaa: { title: '国际羊驼协会成员', desc: '新西兰唯一的国际羊驼协会企业成员。' },
        hurun: { title: '胡润百富上榜', desc: '2023胡润至尚优品金奖得主。' },
      },
      footer: {
        brand: 'PACIFIC ALPACAS',
        tagline: '新西兰最大羊驼纤维供应商',
        contact: '联系我们',
        links: '快速链接',
        copyright: '© 2024 Pacific Alpacas. All rights reserved.',
      },
    },
  },
  en: {
    translation: {
      nav: {
        home: 'Home',
        about: 'About',
        whyAlpaca: 'Why Alpaca',
        shop: 'Shop',
        certifications: 'Certifications',
        trace: 'Traceability',
        cart: 'Cart',
        account: 'Account',
        admin: 'Admin',
      },
      hero: {
        subtitle: 'Leading the Natural Sleep Material Revolution',
        title: 'The Global Standard for Deep Sleep',
        tagline: '"Luxury in Your Dreams"',
        cta: 'Explore Duvets',
        ctaTrace: 'Learn Traceability',
        scroll: 'Scroll to explore',
      },
      brand: {
        title: 'The Art of Luxury Sleep from New Zealand',
        sectionLabel: 'Heritage',
        desc: 'Since 2001, Pacific Alpacas has been dedicated to luxury sleep for over two decades. Partnering with 800+ NZ farms, controlling over 100 tonnes of premium alpaca fiber worldwide.',
        desc2: 'With our exclusive "5-tank 6-wash" process and physical high-temperature, ozone, and ethylene oxide sterilization, every duvet meets the purest maternal-grade standard.',
        years: 'Years of Heritage',
        farms: 'Partner Farms',
        market: 'NZ Market Share',
        material: 'Tonnes Controlled',
      },
      fiber: {
        sectionLabel: 'The Breathing Soft Gold',
        title: "Nature's Gift",
        desc: 'In the ancient Inca Empire, alpaca fiber was known as "The Fiber of the Gods", reserved exclusively for royalty. Today it is cherished by Loro Piana, Max Mara, and other luxury brands.',
        sleepBoost: '25% More Deep Sleep',
        sleepDesc: 'Optimal micro-climate: 32-34°C, 40-60% humidity',
        warm: 'Warmth: 3× Wool',
        warmDesc: 'Hollow fiber structure acts like a thermos for superior insulation.',
        light: 'Lightweight: Cloud-like',
        lightDesc: 'Only 30% the weight of wool with equal warmth.',
        moisture: 'Moisture-wicking',
        moistureDesc: 'Absorbs 35% of its weight in vapor and releases it quickly.',
        mite: 'Anti-mite: Natural Barrier',
        miteDesc: 'Lab data shows 64.37% mite avoidance rate.',
        static: 'Anti-static: Clean & Dust-free',
        staticDesc: 'Smooth fiber scales prevent static buildup.',
      },
      process: {
        title: 'World-Class Processing',
        subtitle: 'Industry-leading craftsmanship',
        steps: {
          shear: { title: 'Shearing', desc: 'Once a year for optimal fiber length.' },
          wash: { title: 'Scouring', desc: 'Proprietary 5-tank 6-wash process.' },
          comb: { title: 'Combing', desc: 'Advanced carding for loft and smoothness.' },
          felt: { title: 'Felting', desc: 'High-density needle-punching for stability.' },
          sterilize: { title: 'Sterilizing', desc: 'Heat + ozone + ethylene oxide.' },
          finish: { title: 'Finishing', desc: 'Mercerizing and carbonizing refinement.' },
        },
      },
      certs: {
        sectionLabel: 'Certifications',
        title: 'Trusted Brand Credentials',
        fernmark: { title: 'FernMark', desc: 'NZ Government FernMark certification, No.101008.' },
        nzmade: { title: 'NZ Made & Grown', desc: '100% Made in New Zealand, fully traceable.' },
        iaa: { title: 'IAA Member', desc: "NZ's only corporate member of the International Alpaca Association." },
        hurun: { title: 'Hurun Best of the Best', desc: '2023 Hurun Best of the Best Gold Award winner.' },
      },
      footer: {
        brand: 'PACIFIC ALPACAS',
        tagline: "New Zealand's Largest Alpaca Fiber Supplier",
        contact: 'Contact Us',
        links: 'Quick Links',
        copyright: '© 2024 Pacific Alpacas. All rights reserved.',
      },
    },
  },
};

const getSavedLanguage = (): string => {
  try {
    const stored = localStorage.getItem('pa-ui');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed?.state?.language || 'zh';
    }
  } catch {}
  return 'zh';
};

i18n.use(initReactI18next).init({
  resources,
  lng: getSavedLanguage(),
  fallbackLng: 'zh',
  interpolation: { escapeValue: false },
});

export default i18n;
