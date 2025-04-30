
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Sunrise, Crown, CheckCircle2, ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SegmentCards } from '@/components/landing/SegmentCards';
import { AdvisorPrompt } from '@/components/landing/AdvisorPrompt';
import { AnimatedBackground } from '@/components/landing/AnimatedBackground';
import { Footer } from '@/components/landing/Footer';
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
      benefits: [
        "Personalized growth strategies",
        "Automated investment allocation",
        "Expense tracking & optimization",
        "Education resources tailored to your needs"
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
      benefits: [
        "Retirement income calculator",
        "Healthcare expense planning",
        "Social security optimization",
        "Required minimum distribution management"
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
      benefits: [
        "Family office coordination",
        "Multi-generational wealth transfer",
        "Philanthropic impact planning",
        "Private banking services"
      ],
      icon: Crown,
      tagline: "Legacy-Focused",
      buttonText: "Manage My Legacy"
    },
  ];

  const handleSegmentClick = (segmentId: string) => {
    // Updated to navigate to auth with segment
    navigate(`/auth?segment=${segmentId}`);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#0A1F44] text-white pt-[80px]">
      <main className="w-full max-w-7xl py-0 px-4 md:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Your Personalized Path to Lasting Prosperity</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choose the approach that best matches your financial journey
          </p>
        </div>
        
        <div className="mt-4">
          <SegmentCards 
            segments={segments} 
            onSegmentClick={handleSegmentClick} 
            isMobile={isMobile} 
          />
        </div>
        
        <div className="mt-12 text-center">
          <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">90-Day Free Trial</h2>
            <p className="mb-6 text-gray-300">
              Get full access to all features with no commitment. Experience how our platform can transform your financial future.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                onClick={() => navigate("/auth")}
              >
                Sign Up Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <a href="#features">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </a>
            </div>
          </div>
        </div>
        
        <div id="features" className="mt-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Key Platform Benefits</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-black/20 p-6 rounded-lg">
              <CheckCircle2 className="h-8 w-8 text-green-400 mb-3" />
              <h3 className="text-xl font-semibold mb-2">Comprehensive Wealth View</h3>
              <p className="text-gray-300">See all your assets, liabilities, and investments in one intuitive dashboard</p>
            </div>
            <div className="bg-black/20 p-6 rounded-lg">
              <CheckCircle2 className="h-8 w-8 text-green-400 mb-3" />
              <h3 className="text-xl font-semibold mb-2">Personalized Strategies</h3>
              <p className="text-gray-300">Receive custom recommendations based on your financial profile and goals</p>
            </div>
            <div className="bg-black/20 p-6 rounded-lg">
              <CheckCircle2 className="h-8 w-8 text-green-400 mb-3" />
              <h3 className="text-xl font-semibold mb-2">Secure Document Vault</h3>
              <p className="text-gray-300">Store your important financial documents with bank-level encryption</p>
            </div>
          </div>
        </div>
        
        <AdvisorPrompt isMobile={isMobile} />
      </main>
      
      <Footer />
      <AnimatedBackground />
    </div>
  );
}
