import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useToast } from '@/hooks/use-toast';
import { Star, MapPin, ArrowLeft, Mail, Mic, Gavel } from 'lucide-react';
import { getAdvisor, type Pro } from '@/services/advisors';
import { AdvisorCard } from '@/components/marketplace/AdvisorCard';
import { InquiryModal } from '@/components/marketplace/InquiryModal';
import { VoiceDrawer } from '@/components/voice/VoiceDrawer';
import { recordInquiry } from '@/services/inquiries';
import { GoldButton, GoldOutlineButton } from '@/components/ui/brandButtons';

export default function AttorneyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [attorney, setAttorney] = useState<Pro | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Modal states
  const [inquiryModal, setInquiryModal] = useState({ isOpen: false });
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [voiceDrawer, setVoiceDrawer] = useState({ isOpen: false });

  useEffect(() => {
    if (id) {
      loadAttorney();
    }
  }, [id]);

  const loadAttorney = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const attorneyData = await getAdvisor(id);
      setAttorney(attorneyData);
    } catch (error) {
      console.error('Failed to load attorney:', error);
      toast({
        title: "Unable to load attorney profile",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle inquiry submission
  const handleInquirySubmit = async (data: {
    full_name: string;
    email: string;
    phone?: string;
    message?: string;
    consent_tos: boolean;
  }) => {
    if (!id) return { receiptHash: null };

    try {
      setInquiryLoading(true);
      
      const result = await recordInquiry({
        pro_id: id,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        consent_tos: data.consent_tos
      });

      console.log('Inquiry saved', result.id, 'pro_id:', result.pro_id, 'receipt:', result.receiptHash);
      
      toast({
        title: "Inquiry sent",
        description: result.receiptHash 
          ? "We'll follow up with you shortly! Receipt ✓" 
          : "We'll follow up with you shortly!"
      });

      setInquiryModal({ isOpen: false });
      return { receiptHash: result.receiptHash };
    } catch (error) {
      console.error('Failed to submit inquiry:', error);
      toast({
        title: "Failed to send inquiry",
        description: "Please try again later.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setInquiryLoading(false);
    }
  };

  const handleOpenEstateWorkbench = () => {
    navigate('/estate/workbench');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--bfo-black))]">
        <div className="container mx-auto px-4 py-8">
          <div className="bfo-card p-8 text-center">
            <p className="text-white">Loading attorney profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!attorney) {
    return (
      <div className="min-h-screen bg-bfo-black">
        <div className="container mx-auto px-4 py-8">
          <div className="bfo-card border border-bfo-gold p-8 text-center">
            <p className="text-white mb-4">Coming soon</p>
            <GoldOutlineButton onClick={() => navigate('/marketplace/attorneys')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Attorneys
            </GoldOutlineButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--bfo-black))]">
      
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Back Navigation */}
          <GoldOutlineButton onClick={() => window.history.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Attorneys
          </GoldOutlineButton>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Profile Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Section - Using AdvisorCard */}
              <AdvisorCard
                advisor={{
                  id: attorney.id,
                  name: attorney.name,
                  title: attorney.title,
                  city: attorney.location,
                  tags: attorney.tags,
                  avatar_url: attorney.avatar_url
                }}
                onContact={() => setInquiryModal({ isOpen: true })}
                onVoice={() => setVoiceDrawer({ isOpen: true })}
                showVoice={true}
              />

              {/* About Section */}
              <div className="bfo-card border border-bfo-gold p-6">
                <h3 className="text-xl font-semibold mb-4 text-white">About {attorney.name.split(' ')[0]}</h3>
                <p className="text-white/80 mb-4">
                  {`Experienced estate planning attorney with ${attorney.years_exp || 'several years'} of experience specializing in ${attorney.tags?.join(', ').toLowerCase() || 'estate planning and probate law'}.`}
                </p>
                
                {attorney.rating && (
                  <div className="flex items-center gap-2 text-bfo-gold">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-medium">{attorney.rating} rating</span>
                  </div>
                )}
              </div>

              {/* Estate Planning Services */}
              <div className="bfo-card border border-bfo-gold p-6">
                <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-bfo-gold" />
                  Estate Planning Services
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="text-white/80">• Wills & Trusts</div>
                  <div className="text-white/80">• Estate Administration</div>
                  <div className="text-white/80">• Tax Planning</div>
                  <div className="text-white/80">• Asset Protection</div>
                  <div className="text-white/80">• Healthcare Directives</div>
                  <div className="text-white/80">• Business Succession</div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bfo-card border border-bfo-gold p-6">
                <h3 className="text-xl font-semibold mb-4 text-white">Get Started</h3>
                <div className="space-y-3">
                  <GoldButton 
                    onClick={() => setInquiryModal({ isOpen: true })}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Send Message
                  </GoldButton>
                  
                  <GoldOutlineButton 
                    onClick={() => setVoiceDrawer({ isOpen: true })}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Mic className="h-4 w-4" />
                    Ask with Voice
                  </GoldOutlineButton>

                  <GoldButton 
                    onClick={handleOpenEstateWorkbench}
                    className="w-full flex items-center justify-center gap-2 bg-bfo-purple hover:bg-bfo-purple/80 border-bfo-purple"
                  >
                    <Gavel className="h-4 w-4" />
                    Open Estate Workbench
                  </GoldButton>
                </div>
              </div>

              {/* Location Info */}
              {attorney.location && (
                <div className="bfo-card border border-bfo-gold/30 p-4">
                  <div className="flex items-center gap-2 text-white/80">
                    <MapPin className="h-4 w-4" />
                    <span>Based in {attorney.location}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Inquiry Modal */}
          <InquiryModal
            isOpen={inquiryModal.isOpen}
            onClose={() => setInquiryModal({ isOpen: false })}
            onSubmit={handleInquirySubmit}
            advisorName={attorney.name}
            loading={inquiryLoading}
          />

          {/* Voice Drawer */}
          <VoiceDrawer
            persona="attorney"
            open={voiceDrawer.isOpen}
            onClose={() => setVoiceDrawer({ isOpen: false })}
          />
        </div>
      </div>
    </div>
  );
}