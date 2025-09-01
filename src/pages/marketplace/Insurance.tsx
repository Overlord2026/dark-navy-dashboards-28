import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, FileText, ClipboardCheck, Star, Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { GoldButton, GoldOutlineButton } from '@/components/ui/brandButtons';
import { InquiryModal } from '@/components/marketplace/InquiryModal';
import { useProfessionalNetwork, type Professional } from '@/hooks/useProfessionalNetwork';
import { toast } from 'sonner';

type InsuranceTab = 'pc' | 'life' | 'medicare';

interface InsuranceProfessional extends Professional {
  tags?: string[];
  insurance_license_types?: string[];
}

const INSURANCE_TABS = [
  { id: 'pc' as InsuranceTab, label: 'P&C', description: 'Property & Casualty' },
  { id: 'life' as InsuranceTab, label: 'Life/Annuity', description: 'Life Insurance & Annuities' },
  { id: 'medicare' as InsuranceTab, label: 'Medicare/LTC', description: 'Medicare & Long-Term Care' }
];

const Insurance = () => {
  const navigate = useNavigate();
  const { professionals, loading, fetchProfessionals } = useProfessionalNetwork();
  const [activeTab, setActiveTab] = useState<InsuranceTab>('pc');
  const [selectedProfessional, setSelectedProfessional] = useState<InsuranceProfessional | null>(null);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryLoading, setInquiryLoading] = useState(false);

  // Mock insurance professionals data (extending the existing professionals)
  const insuranceProfessionals: InsuranceProfessional[] = [
    {
      id: '1',
      professional_type: 'financial_advisor',
      firm_name: 'Progressive Insurance Group',
      first_name: 'Sarah',
      last_name: 'Johnson',
      email: 'sarah@progressive-group.com',
      phone: '555-0123',
      license_number: 'INS12345',
      license_state: 'CA',
      specialties: ['Auto Insurance', 'Home Insurance', 'Business Insurance'],
      bio: 'Experienced P&C agent with 12+ years helping families and businesses protect their assets.',
      years_experience: 12,
      credentials: ['CPCU', 'CIC'],
      hourly_rate: 150,
      availability_status: 'available',
      rating: 4.9,
      review_count: 78,
      is_verified: true,
      compliance_status: 'approved',
      onboarding_completed: true,
      white_label_enabled: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tags: ['pc', 'auto', 'home', 'business'],
      insurance_license_types: ['Property', 'Casualty', 'Auto']
    },
    {
      id: '2',
      professional_type: 'financial_advisor',
      firm_name: 'Lifetime Benefits Solutions',
      first_name: 'Michael',
      last_name: 'Chen',
      email: 'michael@lifetime-benefits.com',
      phone: '555-0234',
      license_number: 'LIFE6789',
      license_state: 'NY',
      specialties: ['Life Insurance', 'Annuities', 'Retirement Planning'],
      bio: 'Certified Financial Planner specializing in life insurance and retirement income strategies.',
      years_experience: 15,
      credentials: ['CFP', 'CLU', 'ChFC'],
      hourly_rate: 200,
      availability_status: 'available',
      rating: 4.8,
      review_count: 65,
      is_verified: true,
      compliance_status: 'approved',
      onboarding_completed: true,
      white_label_enabled: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tags: ['life', 'annuity', 'retirement'],
      insurance_license_types: ['Life', 'Variable Annuity']
    },
    {
      id: '3',
      professional_type: 'financial_advisor',
      firm_name: 'Senior Care Insurance',
      first_name: 'Patricia',
      last_name: 'Williams',
      email: 'patricia@seniorcare-ins.com',
      phone: '555-0345',
      license_number: 'MED4567',
      license_state: 'FL',
      specialties: ['Medicare Supplement', 'Long-Term Care', 'Medigap'],
      bio: 'Medicare specialist helping seniors navigate healthcare insurance options for 10+ years.',
      years_experience: 10,
      credentials: ['AHIP', 'LTCP'],
      hourly_rate: 125,
      availability_status: 'available',
      rating: 4.7,
      review_count: 52,
      is_verified: true,
      compliance_status: 'approved',
      onboarding_completed: true,
      white_label_enabled: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tags: ['medicare', 'ltc', 'senior'],
      insurance_license_types: ['Health', 'Long-Term Care']
    }
  ];

  const filteredProfessionals = insuranceProfessionals.filter(prof => 
    prof.tags?.includes(activeTab)
  );

  const handleInquirySubmit = async (data: any) => {
    setInquiryLoading(true);
    try {
      // Mock submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Inquiry sent successfully!');
      setIsInquiryModalOpen(false);
      return { receiptHash: 'mock-hash-123' };
    } catch (error) {
      toast.error('Failed to send inquiry');
      throw error;
    } finally {
      setInquiryLoading(false);
    }
  };

  const handleFileFNOL = () => {
    navigate('/insurance/fnol');
  };

  const handleBindPolicy = () => {
    navigate('/insurance/bind');
  };

  return (
    <div className="min-h-screen bg-bfo-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Insurance Marketplace
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Connect with licensed insurance professionals for all your coverage needs
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-bfo-purple rounded-lg p-1 border border-bfo-gold/20">
            {INSURANCE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-bfo-gold text-bfo-black shadow-md'
                    : 'text-white hover:bg-bfo-gold/10'
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold">{tab.label}</div>
                  <div className="text-xs opacity-80">{tab.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <GoldButton onClick={handleFileFNOL} className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            File FNOL
          </GoldButton>
          <GoldOutlineButton onClick={handleBindPolicy} className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            Bind Policy
          </GoldOutlineButton>
        </div>

        {/* Professionals Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-white/60">Loading insurance professionals...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfessionals.map((professional) => (
              <Card key={professional.id} className="bfo-card border border-bfo-gold bg-bfo-black hover:border-bfo-gold/60 transition-colors">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {professional.first_name} {professional.last_name}
                      </h3>
                      <p className="text-bfo-gold font-medium">{professional.firm_name}</p>
                    </div>
                    <Shield className="h-6 w-6 text-bfo-gold flex-shrink-0 ml-2" />
                  </div>

                  {/* Rating & Experience */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-bfo-gold fill-current" />
                      <span className="text-white font-medium">{professional.rating}</span>
                      <span className="text-white/60">({professional.review_count})</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/60">
                      <Clock className="h-4 w-4" />
                      <span>{professional.years_experience}+ years</span>
                    </div>
                  </div>

                  {/* Location & License */}
                  <div className="flex items-center gap-1 mb-4 text-white/60">
                    <MapPin className="h-4 w-4" />
                    <span>{professional.license_state} Licensed</span>
                  </div>

                  {/* Specialties */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {professional.specialties?.slice(0, 3).map((specialty, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-bfo-purple text-bfo-gold text-xs rounded border border-bfo-gold/20"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-white/80 text-sm mb-6 line-clamp-3">
                    {professional.bio}
                  </p>

                  {/* Actions */}
                  <div className="space-y-2">
                    <GoldButton
                      onClick={() => {
                        setSelectedProfessional(professional);
                        setIsInquiryModalOpen(true);
                      }}
                      className="w-full"
                    >
                      Contact Agent
                    </GoldButton>
                    <div className="text-center">
                      <span className="text-white/60 text-sm">
                        Rate: ${professional.hourly_rate}/hr
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredProfessionals.length === 0 && !loading && (
          <div className="text-center py-12">
            <Shield className="h-16 w-16 text-bfo-gold mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No professionals found
            </h3>
            <p className="text-white/60">
              Try selecting a different insurance category or check back later.
            </p>
          </div>
        )}

        {/* Inquiry Modal */}
        <InquiryModal
          isOpen={isInquiryModalOpen}
          onClose={() => setIsInquiryModalOpen(false)}
          onSubmit={handleInquirySubmit}
          advisorName={selectedProfessional ? `${selectedProfessional.first_name} ${selectedProfessional.last_name}` : ''}
          loading={inquiryLoading}
        />
      </div>
    </div>
  );
};

export default Insurance;