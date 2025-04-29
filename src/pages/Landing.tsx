
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { Leaf, Sunrise, Crown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { HeroSection } from '@/components/landing/HeroSection';
import { SegmentCards } from '@/components/landing/SegmentCards';
import { AdvisorPrompt } from '@/components/landing/AdvisorPrompt';
import { AnimatedBackground } from '@/components/landing/AnimatedBackground';
import { Footer } from '@/components/landing/Footer';

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

  if (isMobile) {
    return (
      <div className="flex flex-col items-center min-h-screen bg-[#0A1F44] text-white">
        <div className="w-full px-4 py-8 mt-32">
          <HeroSection isMobile={true} />

          <div className="mt-16">
            <SegmentCards 
              segments={segments} 
              onSegmentClick={handleSegmentClick} 
              isMobile={true} 
            />
          </div>
          
          <AdvisorPrompt isMobile={true} />
        </div>
        
        <Footer isMobile={true} />
      </div>
    );
  }

  return (
    <ThreeColumnLayout 
      hideLeftSidebar
      hideRightSidebar
      hideHeader
    >
      <div className="flex flex-col items-center min-h-screen bg-[#0A1F44] text-white">
        <div className="w-full max-w-7xl px-4 py-12 md:py-20 mt-32">
          <HeroSection isMobile={false} />

          <div className="mt-16">
            <SegmentCards 
              segments={segments} 
              onSegmentClick={handleSegmentClick} 
              isMobile={false} 
            />
          </div>
          
          <AdvisorPrompt isMobile={false} />
        </div>
        
        <Footer />
        <AnimatedBackground />
      </div>
    </ThreeColumnLayout>
  );
}
