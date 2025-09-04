import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import { InquiryModal } from '@/components/marketplace/InquiryModal';
import { VoiceDrawer } from '@/components/voice/VoiceDrawer';
import { GoldButton, GoldOutlineButton } from '@/components/ui/brandButtons';
import { Badge } from '@/components/ui/badge';
import { LegacyReceiptChip } from '@/components/families/ReceiptChip';
import { useToast } from '@/hooks/use-toast';
import { 
  Star, 
  MapPin, 
  ArrowLeft, 
  Mail, 
  Mic,
  Clock,
  Award,
  FileText,
  Calculator,
  Shield,
  TrendingUp
} from 'lucide-react';

interface CPA {
  id: string;
  name: string;
  firm: string;
  specialties: string[];
  rating: number;
  years_experience: number;
  location: string;
  description: string;
  certifications: string[];
  fee_range: string;
  availability: string;
  education: string[];
  sample_projects: string[];
  approach: string;
}

const DEMO_CPA: CPA = {
  id: 'cpa-1',
  name: 'Sarah Mitchell',
  firm: 'Mitchell & Associates CPA',
  specialties: ['Tax Planning', 'Estate Planning', 'Business Consulting'],
  rating: 4.9,
  years_experience: 15,
  location: 'New York, NY',
  description: 'Expert in high-net-worth tax strategies and generational wealth planning. Sarah has helped over 200 family offices optimize their tax structures while ensuring compliance with evolving regulations.',
  certifications: ['CPA', 'CFP', 'PFS'],
  fee_range: '$300-500/hour',
  availability: 'Available',
  education: ['MBA Finance - Wharton', 'MS Taxation - NYU', 'BS Accounting - Columbia'],
  sample_projects: [
    'Tax planning for $50M+ family office',
    'International trust structure optimization',
    'Estate tax minimization through charitable planning',
    'Business succession planning for family enterprise'
  ],
  approach: 'I focus on proactive tax planning that aligns with your family\'s long-term wealth goals. My approach combines technical expertise with practical strategies that protect and grow generational wealth.'
};

export default function CPADetail() {
  const { id } = useParams<{ id: string }>();
  const [cpa, setCpa] = useState<CPA | null>(null);
  const [loading, setLoading] = useState(true);
  const [inquiryModal, setInquiryModal] = useState({ isOpen: false });
  const [voiceDrawer, setVoiceDrawer] = useState({ isOpen: false });
  const [lastReceiptHash, setLastReceiptHash] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading CPA data
    setTimeout(() => {
      setCpa(DEMO_CPA);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleInquirySubmit = async (data: any) => {
    try {
      // Simulate inquiry submission and receipt generation
      const receiptHash = `sha256:cpa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setLastReceiptHash(receiptHash);
      
      toast({
        title: "Inquiry Sent",
        description: `Your inquiry has been sent to ${cpa?.name}`,
      });
      
      setInquiryModal({ isOpen: false });
      return { receiptHash };
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send inquiry",
        variant: "destructive"
      });
      return {};
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bfo-purple via-bfo-purple/90 to-black">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-lg">Loading CPA details...</div>
        </div>
      </div>
    );
  }

  if (!cpa) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bfo-purple via-bfo-purple/90 to-black">
        <div className="container mx-auto px-6 pt-24">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">CPA Not Found</h1>
            <Link to="/marketplace/cpa">
              <GoldButton>Back to CPA Directory</GoldButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bfo-purple via-bfo-purple/90 to-black">
      
      
      <div className="container mx-auto px-6 pt-24 pb-12">
        {/* Back Navigation */}
        <Link 
          to="/marketplace/cpa" 
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to CPA Directory
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Header */}
            <div className="bfo-card border border-bfo-gold">
              <div className="p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-white mb-2">{cpa.name}</h1>
                    <p className="text-bfo-gold text-xl mb-4">{cpa.firm}</p>
                    
                    <div className="flex items-center gap-4 mb-4 text-white/60">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {cpa.years_experience} years experience
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {cpa.location}
                      </div>
                    </div>

                    {cpa.rating && (
                      <div className="flex items-center gap-2 mb-4">
                        <Star className="h-4 w-4 fill-current text-bfo-gold" />
                        <span className="font-medium text-white">{cpa.rating} rating</span>
                      </div>
                    )}

                    {/* Receipt Display */}
                    {lastReceiptHash && (
                      <div className="mt-4 p-3 bg-bfo-purple/10 border border-bfo-gold/20 rounded">
                        <p className="text-sm text-white/70 mb-2">Last inquiry receipt:</p>
                        <LegacyReceiptChip hash={lastReceiptHash} anchored={false} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Certifications */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {cpa.certifications.map((cert) => (
                    <Badge key={cert} className="bg-bfo-gold/20 text-bfo-gold border-bfo-gold/30">
                      <Award className="h-3 w-3 mr-1" />
                      {cert}
                    </Badge>
                  ))}
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2">
                  {cpa.specialties.map((specialty) => (
                    <Badge key={specialty} variant="outline" className="border-white/20 text-white/80">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* About */}
            <div className="bfo-card border border-bfo-gold/20">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">About</h2>
                <p className="text-white/80 leading-relaxed mb-6">{cpa.description}</p>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Approach</h3>
                  <p className="text-white/80 leading-relaxed">{cpa.approach}</p>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="bfo-card border border-bfo-gold/20">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Education</h2>
                <div className="space-y-2">
                  {cpa.education.map((edu, index) => (
                    <div key={index} className="flex items-center gap-2 text-white/80">
                      <FileText className="h-4 w-4 text-bfo-gold" />
                      {edu}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sample Projects */}
            <div className="bfo-card border border-bfo-gold/20">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Sample Projects</h2>
                <div className="space-y-3">
                  {cpa.sample_projects.map((project, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                      <Calculator className="h-5 w-5 text-bfo-gold mt-0.5 flex-shrink-0" />
                      <span className="text-white/80">{project}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bfo-card border border-bfo-gold p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Get Started</h3>
              
              <div className="space-y-3">
                <GoldButton 
                  onClick={() => setInquiryModal({ isOpen: true })}
                  className="w-full"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Inquiry
                </GoldButton>
                
                <GoldOutlineButton 
                  onClick={() => setVoiceDrawer({ isOpen: true })}
                  className="w-full"
                >
                  <Mic className="h-4 w-4 mr-2" />
                  Voice Consultation
                </GoldOutlineButton>
              </div>
            </div>

            {/* Pricing & Availability */}
            <div className="bfo-card border border-bfo-gold/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Engagement Details</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-white/60 text-sm mb-1">Fee Range</div>
                  <div className="text-white font-medium">{cpa.fee_range}</div>
                </div>
                
                <div>
                  <div className="text-white/60 text-sm mb-1">Availability</div>
                  <div className={`inline-flex items-center px-2 py-1 rounded text-sm ${
                    cpa.availability === 'Available' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {cpa.availability}
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="bfo-card border border-bfo-gold/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Trust & Security</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-white/80">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span className="text-sm">Background Verified</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <FileText className="h-4 w-4 text-green-400" />
                  <span className="text-sm">Licensed CPA</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-sm">15+ Years Experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={inquiryModal.isOpen}
        onClose={() => setInquiryModal({ isOpen: false })}
        onSubmit={handleInquirySubmit}
      />

      {/* Voice Drawer */}
      <VoiceDrawer
        open={voiceDrawer.isOpen}
        onClose={() => setVoiceDrawer({ isOpen: false })}
        persona="advisor"
      />
    </div>
  );
}