import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Sunrise, Crown, CheckCircle2, ArrowRight, Shield, Lock } from 'lucide-react';
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
    navigate(`/auth?segment=${segmentId}`);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#0A1F44] text-white pt-[80px]">
      <main className="w-full max-w-7xl py-0 px-4 md:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Your Personalized Path to Lasting Prosperity</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-4">
            Choose the approach that best matches your financial journey
          </p>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full inline-flex items-center mb-8">
            <span className="font-medium">All plans include a 90-day free trial</span>
            <ArrowRight className="h-4 w-4 ml-2" />
          </div>
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
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Sign Up Securely <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                onClick={() => navigate('/auth?trial=true')}
                className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
              >
                Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Security Features Section */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Enterprise-Grade Security</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Your financial data deserves the highest level of protection. Our platform employs bank-level security measures.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-black/20 p-6 rounded-lg border border-gray-800">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-900/30">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Encryption</h3>
              <p className="text-gray-300">AES-256 bit encryption for all data, both in transit and at rest</p>
            </div>
            <div className="bg-black/20 p-6 rounded-lg border border-gray-800">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-900/30">
                <Lock className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multi-Factor Authentication</h3>
              <p className="text-gray-300">Secure your account with additional verification methods</p>
            </div>
            <div className="bg-black/20 p-6 rounded-lg border border-gray-800">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-900/30">
                <CheckCircle2 className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">SOC 2 Compliance</h3>
              <p className="text-gray-300">Adherence to rigorous security, availability, and confidentiality standards</p>
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
