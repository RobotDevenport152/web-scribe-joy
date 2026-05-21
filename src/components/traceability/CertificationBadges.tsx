import { useTranslation } from 'react-i18next';
import { ShieldCheck, Leaf, Award, Globe } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const CERT_CONFIG: Record<string, {
  icon: typeof ShieldCheck;
  color: string;
  descZh: string;
  descEn: string;
}> = {
  'NZ Made': {
    icon: ShieldCheck,
    color: 'text-green-600 bg-green-50 border-green-200',
    descZh: '100%新西兰制造，证书号803724',
    descEn: '100% Made in New Zealand, Cert #803724',
  },
  'FernMark': {
    icon: Leaf,
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    descZh: '新西兰政府银蕨认证 NZFM101008',
    descEn: 'NZ Government FernMark NZFM101008',
  },
  'IAA Alpaca Mark': {
    icon: Award,
    color: 'text-amber-700 bg-amber-50 border-amber-200',
    descZh: '国际羊驼协会成员，证书号02-041',
    descEn: 'International Alpaca Association, Cert 02-041',
  },
  'NZ Grown': {
    icon: Globe,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    descZh: '新西兰种植认证，100%本地原料',
    descEn: 'NZ Grown certified, 100% local fiber',
  },
};

interface Props {
  certifications: string[];
}

export function CertificationBadges({ certifications }: Props) {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <div className="flex flex-wrap gap-2">
      {certifications.map((cert) => {
        const config = CERT_CONFIG[cert];
        if (!config) {
          return (
            <span key={cert} className="px-3 py-1 text-xs rounded-sm border border-border text-muted-foreground font-body">
              {cert}
            </span>
          );
        }
        const Icon = config.icon;
        return (
          <Tooltip key={cert}>
            <TooltipTrigger asChild>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-sm border font-body cursor-default ${config.color}`}>
                <Icon className="w-3.5 h-3.5" />
                {cert}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{lang === 'zh' ? config.descZh : config.descEn}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
