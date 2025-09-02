import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BrandHeader } from '@/components/layout/BrandHeader';
import { InquiryModal } from '@/components/marketplace/InquiryModal';
import { VoiceDrawer } from '@/components/voice/VoiceDrawer';
import { GoldButton, GoldOutlineButton } from '@/components/ui/brandButtons';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  FileText, 
  Shield, 
  Clock, 
  Star,
  TrendingUp,
  Users,
  Award,
  Mic
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
}

const DEMO_CPAS: CPA[] = [
  {
    id: 'cpa-1',
    name: 'Sarah Mitchell',
    firm: 'Mitchell & Associates CPA',
    specialties: ['Tax Planning', 'Estate Planning', 'Business Consulting'],
    rating: 4.9,
    years_experience: 15,
    location: 'New York, NY',
    description: 'Expert in high-net-worth tax strategies and multi-generational wealth planning.',
    certifications: ['CPA', 'CFP', 'PFS'],
    fee_range: '$300-500/hour',
    availability: 'Available'
  },
  {
    id: 'cpa-2', 
    name: 'Michael Chen',
    firm: 'Chen Tax Advisory',
    specialties: ['International Tax', 'Corporate Tax', 'M&A Advisory'],
    rating: 4.8,
    years_experience: 12,
    location: 'San Francisco, CA',
    description: 'Specializes in complex international tax structures and cross-border transactions.',
    certifications: ['CPA', 'MST'],
    fee_range: '$400-600/hour',
    availability: 'Limited'
  },
  {
    id: 'cpa-3',
    name: 'Jennifer Rodriguez',
    firm: 'Family Wealth CPA Group',
    specialties: ['Family Office Tax', 'Trust & Estate', 'Succession Planning'],
    rating: 4.9,
    years_experience: 18,
    location: 'Chicago, IL',
    description: 'Focused on family office taxation and generational wealth transfer strategies.',
    certifications: ['CPA', 'TEP', 'CGMA'],
    fee_range: '$350-550/hour',
    availability: 'Available'
  }
];

export default function CPAIndex() {
  const [cpas, setCpas] = useState<CPA[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [inquiryModal, setInquiryModal] = useState({ isOpen: false, cpa: null as CPA | null });
  const [voiceDrawer, setVoiceDrawer] = useState({ isOpen: false });

  useEffect(() => {
    // Simulate loading CPA data
    setTimeout(() => {
      setCpas(DEMO_CPAS);
      setLoading(false);
    }, 500);
  }, []);

  const allSpecialties = Array.from(new Set(cpas.flatMap(cpa => cpa.specialties)));
  const filteredCpas = selectedSpecialty 
    ? cpas.filter(cpa => cpa.specialties.includes(selectedSpecialty))
    : cpas;

  const handleInquiry = (cpa: CPA) => {
    setInquiryModal({ isOpen: true, cpa });
  };

  const handleInquirySubmit = async (data: any) => {
    // Handle inquiry submission
    console.log('CPA inquiry submitted:', data);
    setInquiryModal({ isOpen: false, cpa: null });
    return { receiptHash: `cpa_${Date.now()}` };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bfo-purple via-bfo-purple/90 to-black">
        <BrandHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-lg">Loading CPAs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bfo-purple via-bfo-purple/90 to-black">
      <BrandHeader />
      
      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-24 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Find Your <span className="text-bfo-gold">CPA</span>
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
            Connect with certified public accountants specializing in family office taxation, 
            estate planning, and high-net-worth financial strategies.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <GoldButton
              onClick={() => setVoiceDrawer({ isOpen: true })}
              className="flex items-center gap-2"
            >
              <Mic className="h-4 w-4" />
              Find CPA by Voice
            </GoldButton>
            <GoldOutlineButton>
              Browse All CPAs
            </GoldOutlineButton>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-bfo-gold mb-2">{cpas.length}+</div>
            <div className="text-white/60">Verified CPAs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-bfo-gold mb-2">4.8</div>
            <div className="text-white/60">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-bfo-gold mb-2">15+</div>
            <div className="text-white/60">Years Average Experience</div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-6 mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedSpecialty('')}
            className={`px-4 py-2 rounded-full border transition-colors ${
              !selectedSpecialty 
                ? 'bg-bfo-gold text-black border-bfo-gold' 
                : 'border-white/20 text-white/60 hover:border-white/40'
            }`}
          >
            All Specialties
          </button>
          {allSpecialties.map((specialty) => (
            <button
              key={specialty}
              onClick={() => setSelectedSpecialty(specialty)}
              className={`px-4 py-2 rounded-full border transition-colors ${
                selectedSpecialty === specialty
                  ? 'bg-bfo-gold text-black border-bfo-gold'
                  : 'border-white/20 text-white/60 hover:border-white/40'
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>
      </section>

      {/* CPA Grid */}
      <section className="container mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredCpas.map((cpa) => (
            <div key={cpa.id} className="bfo-card border border-bfo-gold/20 hover:border-bfo-gold/40 transition-colors">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">{cpa.name}</h3>
                    <p className="text-bfo-gold text-sm">{cpa.firm}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-bfo-gold text-bfo-gold" />
                    <span className="text-white text-sm">{cpa.rating}</span>
                  </div>
                </div>

                {/* Experience & Location */}
                <div className="flex items-center gap-4 mb-4 text-sm text-white/60">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {cpa.years_experience} years
                  </div>
                  <div>{cpa.location}</div>
                </div>

                {/* Description */}
                <p className="text-white/70 text-sm mb-4 line-clamp-2">
                  {cpa.description}
                </p>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {cpa.specialties.map((specialty) => (
                    <Badge key={specialty} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>

                {/* Certifications */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {cpa.certifications.map((cert) => (
                    <Badge key={cert} className="bg-bfo-gold/20 text-bfo-gold border-bfo-gold/30 text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>

                {/* Fee Range & Availability */}
                <div className="flex items-center justify-between mb-4 text-sm">
                  <span className="text-white/60">{cpa.fee_range}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    cpa.availability === 'Available' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {cpa.availability}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link to={`/marketplace/cpa/${cpa.id}`} className="flex-1">
                    <GoldOutlineButton className="w-full">
                      View Profile
                    </GoldOutlineButton>
                  </Link>
                  <GoldButton 
                    onClick={() => handleInquiry(cpa)}
                    className="flex-1"
                  >
                    Contact
                  </GoldButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={inquiryModal.isOpen}
        onClose={() => setInquiryModal({ isOpen: false, cpa: null })}
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