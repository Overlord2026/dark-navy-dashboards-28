import React from 'react';
import { MarketplaceHero } from '@/components/marketplace/MarketplaceHero';
import { AdvisorDirectory } from '@/components/marketplace/AdvisorDirectory';
import { ProfessionalCategories } from '@/components/marketplace/ProfessionalCategories';
import { FeaturedServices } from '@/components/marketplace/FeaturedServices';
import { MarketplaceStats } from '@/components/marketplace/MarketplaceStats';

export default function MarketplaceHomepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Hero Section */}
      <MarketplaceHero />
      
      {/* Stats Section */}
      <MarketplaceStats />
      
      {/* Professional Categories */}
      <ProfessionalCategories />
      
      {/* Featured Services */}
      <FeaturedServices />
      
      {/* Advisor Directory */}
      <AdvisorDirectory />
    </div>
  );
}