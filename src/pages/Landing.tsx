
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { ArrowRight, TreeDeciduous, Sunset, Crown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

export default function Landing() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const segments = [
    { 
      id: "aspiring", 
      label: "Aspiring Wealthy", 
      description: "Building your foundation for long-term financial success. Take control of your wealth journey today.", 
      icon: TreeDeciduous,
      tagline: "Growth-Focused",
      buttonText: "Get Started"
    },
    { 
      id: "preretirees", 
      label: "Pre-Retirees & Retirees", 
      description: "Protect what you've built and create a legacy that lasts. Optimize your wealth for the retirement you deserve.",
      icon: Sunset,
      tagline: "Security-Focused",
      buttonText: "Plan My Retirement"
    },
    { 
      id: "ultrahnw", 
      label: "Ultra-High Net Worth", 
      description: "Sophisticated strategies for complex wealth. Leverage our expertise to preserve and grow your significant assets.",
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
        <div className="w-full px-4 py-8">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-medium mb-3">Organize & Maximize</h1>
            <p className="text-sm text-gray-300 mb-4">Your personalized path to lasting prosperity.</p>
            <img 
              src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
              alt="Boutique Family Office" 
              className="h-14 w-auto mx-auto mb-4" 
            />
          </div>

          <div className="mt-8 space-y-6">
            {segments.map((seg) => {
              const Icon = seg.icon;
              return (
                <div
                  key={seg.id}
                  className="segment-card p-6 rounded-lg bg-black/20 hover:bg-black/30 border border-[#D4AF37]/30 cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 flex flex-col"
                  onClick={() => handleSegmentClick(seg.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <Icon className="text-[#D4AF37] h-10 w-10" />
                    <span className="text-xs font-medium bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-1 rounded-full">
                      {seg.tagline}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-[#D4AF37] mb-2">{seg.label}</h2>
                  <p className="text-gray-300 text-sm mb-4">{seg.description}</p>
                  <Button 
                    className="mt-auto w-full bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10"
                    onClick={() => handleSegmentClick(seg.id)}
                  >
                    {seg.buttonText} <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              );
            })}
          </div>
          
          <div className="mt-14 text-center">
            <p className="text-gray-400 mb-4">Are you a financial advisor?</p>
            <button 
              onClick={() => navigate('/advisor/login')}
              className="px-5 py-2.5 border border-[#D4AF37] text-[#D4AF37] rounded-md hover:bg-[#D4AF37]/10 transition-colors"
            >
              Access Advisor Portal
            </button>
          </div>
        </div>
        
        <footer className="w-full py-6 text-center border-t border-white/10 mt-auto">
          <p className="text-gray-400">© {new Date().getFullYear()} Boutique Family Office. All rights reserved.</p>
        </footer>
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
        <div className="w-full max-w-7xl px-4 py-12 md:py-20">
          <div className="landing-header text-center mb-20">
            <h1 className="text-3xl font-medium mb-2">Organize & Maximize</h1>
            <p className="text-gray-300 mb-6">Your personalized path to lasting prosperity.</p>
            <img 
              src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
              alt="Boutique Family Office" 
              className="h-14 w-auto mx-auto" 
            />
          </div>

          <div 
            className="landing-animated-bg grid grid-cols-1 md:grid-cols-3 gap-8 px-4 mb-24 relative py-6" 
          >
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="particles-container"></div>
            </div>
            
            {segments.map((seg) => {
              const Icon = seg.icon;
              return (
                <div
                  key={seg.id}
                  className="segment-card p-8 rounded-lg bg-black/20 hover:bg-black/30 border border-[#D4AF37]/30 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col relative z-10"
                >
                  <div className="flex items-start justify-between mb-4">
                    <Icon className="text-[#D4AF37] h-10 w-10" />
                    <span className="text-xs font-medium bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-full">
                      {seg.tagline}
                    </span>
                  </div>
                  <h2 className="text-2xl font-semibold text-[#D4AF37] mb-3">{seg.label}</h2>
                  <p className="text-gray-300 mb-6">{seg.description}</p>
                  <Button 
                    className="mt-auto w-full bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 font-medium"
                    onClick={() => handleSegmentClick(seg.id)}
                  >
                    {seg.buttonText} <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              );
            })}
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-gray-300 mb-6 text-lg">Are you a financial advisor?</p>
            <Button 
              variant="outline"
              className="px-6 py-3 text-lg border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10"
              onClick={() => navigate('/advisor/login')}
            >
              Access Advisor Portal
            </Button>
          </div>
        </div>
        
        <footer className="w-full py-8 text-center border-t border-white/10 mt-auto">
          <p className="text-gray-400">© {new Date().getFullYear()} Boutique Family Office. All rights reserved.</p>
        </footer>

        {/* Add custom CSS for the animated particles effect */}
        <style>
          {`
            .landing-animated-bg {
              background-image: radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.1) 0%, rgba(10, 31, 68, 0) 70%);
              position: relative;
            }
            
            .particles-container {
              position: absolute;
              width: 100%;
              height: 100%;
              background-image: 
                radial-gradient(circle at 10% 20%, rgba(212, 175, 55, 0.03) 0%, transparent 20%),
                radial-gradient(circle at 80% 40%, rgba(212, 175, 55, 0.03) 0%, transparent 20%),
                radial-gradient(circle at 30% 70%, rgba(212, 175, 55, 0.03) 0%, transparent 20%),
                radial-gradient(circle at 70% 90%, rgba(212, 175, 55, 0.03) 0%, transparent 20%);
              animation: shiftBackground 20s ease-in-out infinite;
            }
            
            @keyframes shiftBackground {
              0% { background-position: 0% 0%; }
              25% { background-position: 10% 5%; }
              50% { background-position: 5% 10%; }
              75% { background-position: -5% 5%; }
              100% { background-position: 0% 0%; }
            }
            
            .segment-card:hover {
              transform: translateY(-4px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }
          `}
        </style>
      </div>
    </ThreeColumnLayout>
  );
}
