import React, { useState } from 'react';
import { AgencyDirectory } from '@/components/agencies/AgencyDirectory';
import { AgencyProfile } from '@/components/agencies/AgencyProfile';
import { CampaignBookingModal } from '@/components/agencies/CampaignBookingModal';
import { useToast } from '@/hooks/use-toast';

export const AgenciesPage: React.FC = () => {
  const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingAgencyId, setBookingAgencyId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleBookCampaign = (agencyId: string) => {
    setBookingAgencyId(agencyId);
    setShowBookingModal(true);
  };

  const handleViewDetails = (agencyId: string) => {
    setSelectedAgencyId(agencyId);
  };

  const handleBackToDirectory = () => {
    setSelectedAgencyId(null);
  };

  const handleCampaignBooked = () => {
    setShowBookingModal(false);
    setBookingAgencyId(null);
    toast({
      title: "Campaign Booked!",
      description: "Your campaign has been successfully booked. The agency will contact you soon."
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {selectedAgencyId ? (
        <AgencyProfile
          agencyId={selectedAgencyId}
          onBookCampaign={handleBookCampaign}
          onBack={handleBackToDirectory}
        />
      ) : (
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gold-primary to-blue-primary bg-clip-text text-transparent">
              Marketing Agency Marketplace
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Connect with top-rated marketing agencies that specialize in financial advisor lead generation. 
              Compare performance metrics, read reviews, and book campaigns that drive results.
            </p>
          </div>

          <AgencyDirectory
            onBookCampaign={handleBookCampaign}
            onViewDetails={handleViewDetails}
          />
        </div>
      )}

      {showBookingModal && bookingAgencyId && (
        <CampaignBookingModal
          agencyId={bookingAgencyId}
          onClose={() => setShowBookingModal(false)}
          onSuccess={handleCampaignBooked}
        />
      )}
    </div>
  );
};