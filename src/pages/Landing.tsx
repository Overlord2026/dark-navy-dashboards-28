
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Sunrise, Crown, Shield } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SegmentCards } from '@/components/landing/SegmentCards';
import { AdvisorPrompt } from '@/components/landing/AdvisorPrompt';
import { AnimatedBackground } from '@/components/landing/AnimatedBackground';
import { Footer } from '@/components/landing/Footer';
import { BrandedHeader } from '@/components/layout/BrandedHeader';
import { Button } from '@/components/ui/button';

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

  const handleSecureLogin = () => {
    navigate('/secure-login');
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#0A1F44] text-white pt-16">
      <BrandedHeader />
      <div className="w-full max-w-7xl py-0">
        <div className="mt-4 px-4">
          <SegmentCards 
            segments={segments} 
            onSegmentClick={handleSegmentClick} 
            isMobile={isMobile} 
          />
        </div>
        
        <div className={`${isMobile ? 'mt-8' : 'mb-12 mt-8'} text-center`}>
          <p className={`text-gray-${isMobile ? '400' : '300'} mb-2 text-sm`}>Already have an account?</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={handleSecureLogin}
              className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white font-medium flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Secure Login
            </Button>
            <AdvisorPrompt isMobile={isMobile} />
          </div>
        </div>
      </div>
      
      <Footer />
      <AnimatedBackground />
    </div>
  );
}
