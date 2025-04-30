import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Sunrise, Crown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SegmentCards } from '@/components/landing/SegmentCards';
import { AdvisorPrompt } from '@/components/landing/AdvisorPrompt';
import { AnimatedBackground } from '@/components/landing/AnimatedBackground';
import { Footer } from '@/components/landing/Footer';
import { BrandedBanner } from '@/components/landing/BrandedBanner';

export default function Landing() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const segments = [
    { 
      id: "aspiring", 
      label: "Aspiring Wealthy", 
      description: "Build your financial foundations and accelerate growth.", 
      bulletPoints: [
        "Set clear, achievable goals",
        "Launch an investment portfolio",
        "Optimize your tax strategy",
      ],
      icon: Leaf,
      tagline: "Growth-Focused",
      buttonText: "Get Started"
    },
    { 
      id: "preretirees", 
      label: "Pre-Retirees & Retirees", 
      description: "Secure your lifestyle and enjoy peace of mind.",
      bulletPoints: [
        "Create a sustainable income plan",
        "Protect your assets from market swings",
        "Plan your estate and legacy",
      ],
      icon: Sunrise,
      tagline: "Security-Focused",
      buttonText: "Plan My Retirement"
    },
    { 
      id: "ultrahnw", 
      label: "Ultra-High Net Worth", 
      description: "Access exclusive strategies for preserving and growing significant wealth.",
      bulletPoints: [
        "Advanced trust & estate planning",
        "Bespoke tax minimization",
        "Private market & alternative investments",
      ],
      icon: Crown,
      tagline: "Legacy-Focused",
      buttonText: "Manage My Legacy"
    },
  ];

  const handleSegmentClick = (segmentId: string) => {
    // Navigate directly to the dashboard with the correct segment parameter
    navigate(`/dashboard?segment=${segmentId}`);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#0A1F44] text-white">
      <BrandedBanner />
      <div className="w-full max-w-7xl py-0">
        <div className="mt-4 px-4">
          <SegmentCards 
            segments={segments} 
            onSegmentClick={handleSegmentClick} 
            isMobile={isMobile} 
          />
        </div>
        
        <AdvisorPrompt isMobile={isMobile} />
      </div>
      
      <Footer />
      <AnimatedBackground />
    </div>
  );
}
