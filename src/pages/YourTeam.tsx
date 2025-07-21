import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { CentralizedTeamDashboard } from "@/components/professional-team/CentralizedTeamDashboard";
import { MarketplaceDashboard } from "@/components/professional-team/MarketplaceDashboard";
import { ProfessionalProfile } from "@/components/professional-team/ProfessionalProfile";
import { EnhancedProfessional, TeamMember } from "@/types/professionalTeam";

type ViewMode = 'dashboard' | 'marketplace' | 'profile';

export default function YourTeam() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [selectedProfessional, setSelectedProfessional] = useState<EnhancedProfessional | TeamMember | null>(null);

  const handleViewMarketplace = () => {
    setCurrentView('marketplace');
  };

  const handleViewTeam = () => {
    setCurrentView('dashboard');
  };

  const handleViewProfile = (professional: EnhancedProfessional | TeamMember) => {
    setSelectedProfessional(professional);
    setCurrentView('profile');
  };

  const handleAddProfessional = () => {
    setCurrentView('marketplace');
  };

  const handleBackFromProfile = () => {
    setSelectedProfessional(null);
    setCurrentView('dashboard');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <CentralizedTeamDashboard
            onAddProfessional={handleAddProfessional}
            onViewMarketplace={handleViewMarketplace}
            onViewProfile={handleViewProfile}
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