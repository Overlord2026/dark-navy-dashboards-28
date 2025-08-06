import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe, Shield, Users, Zap } from 'lucide-react';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

const GlobalCampaignHero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Global Banner */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-center">
        <div className="flex items-center justify-center gap-2 text-sm font-medium">
          <Globe className="h-4 w-4" />
          <span>{t('campaign.globalBanner')}</span>
          <span className="hidden sm:inline">🇺🇸 🇪🇸 🇫🇷 🇧🇷 🇨🇳 🇮🇳 🇦🇪</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">BFOCFO</span>
          <span className="text-sm text-muted-foreground">{t('vault.patentPending')}</span>
        </div>
        <LanguageSwitcher />
      </nav>

      {/* Hero Content */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            {t('campaign.hero.headline')}
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            {t('campaign.hero.subheadline')}
          </p>

          {/* Key Benefits */}
          <div className="grid md:grid-cols-4 gap-6 my-12">
            <div className="space-y-2">
              <Globe className="h-8 w-8 text-primary mx-auto" />
              <h3 className="font-semibold">{t('campaign.benefits.global')}</h3>
            </div>
            <div className="space-y-2">
              <Shield className="h-8 w-8 text-primary mx-auto" />
              <h3 className="font-semibold">{t('campaign.benefits.secure')}</h3>
            </div>
            <div className="space-y-2">
              <Users className="h-8 w-8 text-primary mx-auto" />
              <h3 className="font-semibold">{t('campaign.benefits.collaborative')}</h3>
            </div>
            <div className="space-y-2">
              <Zap className="h-8 w-8 text-primary mx-auto" />
              <h3 className="font-semibold">{t('campaign.benefits.ai')}</h3>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-4">
              {t('campaign.cta.getStarted')}
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              {t('campaign.cta.watchDemo')}
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-12">
            <p className="text-sm text-muted-foreground mb-4">
              {t('campaign.trust.fiduciary')}
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <span>🔒 {t('campaign.trust.bankGrade')}</span>
              <span>🌍 {t('campaign.trust.multiLanguage')}</span>
              <span>⚖️ {t('campaign.trust.compliant')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalCampaignHero;