import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { TeamDashboard } from "@/components/professional-team/TeamDashboard";
import { MarketplaceDashboard } from "@/components/professional-team/MarketplaceDashboard";
import { ProfessionalProfile } from "@/components/professional-team/ProfessionalProfile";
import { EnhancedProfessional } from "@/types/professionalTeam";

type ViewMode = 'team' | 'marketplace' | 'profile';

export default function YourTeam() {
  const [currentView, setCurrentView] = useState<ViewMode>('team');
  const [selectedProfessional, setSelectedProfessional] = useState<EnhancedProfessional | null>(null);

  const handleViewMarketplace = () => {
    setCurrentView('marketplace');
  };

  const handleViewTeam = () => {
    setCurrentView('team');
  };

  const handleViewProfile = (professional: EnhancedProfessional) => {
    setSelectedProfessional(professional);
    setCurrentView('profile');
  };

  const handleAddProfessional = () => {
    setCurrentView('marketplace');
  };

  const handleBackFromProfile = () => {
    setSelectedProfessional(null);
    setCurrentView('marketplace');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'team':
        return (
          <TeamDashboard
            onAddProfessional={handleAddProfessional}
            onViewMarketplace={handleViewMarketplace}
          />
        );
      case 'marketplace':
        return (
          <MarketplaceDashboard
            onViewTeam={handleViewTeam}
            onViewProfile={handleViewProfile}
          />
        );
      case 'profile':
        return selectedProfessional ? (
          <ProfessionalProfile
            professional={selectedProfessional}
            onBack={handleBackFromProfile}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <ThreeColumnLayout title="Your Professional Team">
      <div className="px-4 py-6 max-w-7xl mx-auto">
        {renderContent()}
      </div>
    </ThreeColumnLayout>
  );
}