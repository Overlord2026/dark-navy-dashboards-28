import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BrandHeader } from '@/components/layout/BrandHeader';
import { useToast } from '@/hooks/use-toast';
import { Star, MapPin, ArrowLeft, Mail, Mic } from 'lucide-react';
import { getAdvisor, type Pro } from '@/services/advisors';
import { AdvisorCard } from '@/components/marketplace/AdvisorCard';
import { InquiryModal } from '@/components/marketplace/InquiryModal';
import { VoiceDrawer } from '@/components/voice/VoiceDrawer';
import { recordInquiry } from '@/services/inquiries';
import { GoldButton, GoldOutlineButton } from '@/components/ui/brandButtons';

export default function AdvisorDetail() {
  const { id } = useParams<{ id: string }>();
  const [advisor, setAdvisor] = useState<Pro | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Modal states
  const [inquiryModal, setInquiryModal] = useState({ isOpen: false });
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [voiceDrawer, setVoiceDrawer] = useState({ isOpen: false });

  useEffect(() => {
    if (id) {
      loadAdvisor();
    }
  }, [id]);

  const loadAdvisor = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const advisorData = await getAdvisor(id);
      setAdvisor(advisorData);
    } catch (error) {
      console.error('Failed to load advisor:', error);
      toast({
        title: "Unable to load advisor profile",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--bfo-black))]">
        <BrandHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="bfo-card p-8 text-center">
            <p className="text-white">Loading advisor profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!advisor) {
    return (
      <div className="min-h-screen bg-bfo-black">
        <BrandHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="bfo-card border border-bfo-gold p-8 text-center">
            <p className="text-white mb-4">Coming soon</p>
            <GoldOutlineButton onClick={() => window.location.href = '/marketplace/advisors'}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Advisors
            </GoldOutlineButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--bfo-black))]">
      <BrandHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Back Navigation */}
          <GoldOutlineButton onClick={() => window.history.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Advisors
          </GoldOutlineButton>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Profile Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Section - Using AdvisorCard */}
              <AdvisorCard
                advisor={{
                  id: advisor.id,
                  name: advisor.name,
                  title: advisor.title,
                  city: advisor.location,
                  tags: advisor.tags,
                  avatar_url: advisor.avatar_url
                }}
                onContact={() => setInquiryModal({ isOpen: true })}
                onVoice={() => setVoiceDrawer({ isOpen: true })}
                showVoice={true}
              />

              {/* About Section */}
              <div className="bfo-card border border-bfo-gold p-6">
                <h3 className="text-xl font-semibold mb-4 text-white">About {advisor.name.split(' ')[0]}</h3>
                <p className="text-white/80 mb-4">
                  {`Experienced financial advisor with ${advisor.years_exp || 'several years'} of experience specializing in ${advisor.tags?.join(', ').toLowerCase() || 'wealth management'}.`}
                </p>
                
                {advisor.rating && (
                  <div className="flex items-center gap-2 text-bfo-gold">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-medium">{advisor.rating} rating</span>
                  </div>
                )}
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
                </div>
              </div>

              {/* Location Info */}
              {advisor.location && (
                <div className="bfo-card border border-bfo-gold/30 p-4">
                  <div className="flex items-center gap-2 text-white/80">
                    <MapPin className="h-4 w-4" />
                    <span>Based in {advisor.location}</span>
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
            advisorName={advisor.name}
            loading={inquiryLoading}
          />

          {/* Voice Drawer */}
          <VoiceDrawer
            persona="advisor"
            open={voiceDrawer.isOpen}
            onClose={() => setVoiceDrawer({ isOpen: false })}
          />
        </div>
      </div>
    </div>
  );
}