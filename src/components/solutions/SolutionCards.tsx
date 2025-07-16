import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FeatureGate } from "@/components/subscription/FeatureGate";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  Calculator, 
  Shield, 
  Banknote, 
  FileText, 
  Diamond, 
  Heart, 
  Lock 
} from "lucide-react";

interface SolutionCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  route?: string;
  isPremium: boolean;
  category: 'basic' | 'advanced' | 'premium';
}

const solutionCards: SolutionCard[] = [
  {
    id: 'investment-solutions',
    title: 'Investment Solutions',
    description: 'Optimize your portfolio with our intelligent allocation models and access to private market opportunities.',
    icon: TrendingUp,
    route: '/investments',
    isPremium: false,
    category: 'basic'
  },
  {
    id: 'advanced-tax-planning',
    title: 'Advanced Tax Planning',
    description: 'Lower your lifetime taxes and keep more of your wealth with our proactive tax strategies.',
    icon: Calculator,
    route: '/tax-planning',
    isPremium: true,
    category: 'advanced'
  },
  {
    id: 'insurance-risk-management',
    title: 'Insurance & Risk Management',
    description: 'Protect your family and assets with comprehensive insurance strategies and risk management.',
    icon: Shield,
    route: '/client-insurance',
    isPremium: false,
    category: 'basic'
  },
  {
    id: 'lending-solutions',
    title: 'Lending Solutions',
    description: 'Access capital when you need it with our lending and credit optimization strategies.',
    icon: Banknote,
    route: '/client-lending',
    isPremium: false,
    category: 'basic'
  },
  {
    id: 'estate-planning',
    title: 'Estate Planning & Family Legacy Box™',
    description: 'Preserve and transfer your wealth efficiently to future generations with our comprehensive estate planning.',
    icon: FileText,
    route: '/estate-planning',
    isPremium: false,
    category: 'basic'
  },
  {
    id: 'private-market-alpha',
    title: 'Private Market Alpha',
    description: 'Access exclusive private market opportunities and alternative investments for enhanced returns.',
    icon: Diamond,
    route: '/investments?section=private-markets',
    isPremium: true,
    category: 'premium'
  },
  {
    id: 'healthcare-optimization',
    title: 'Healthcare Optimization',
    description: 'Optimize your healthcare costs and maximize HSA benefits with our specialized health planning.',
    icon: Heart,
    route: '/health-dashboard',
    isPremium: true,
    category: 'advanced'
  },
  {
    id: 'secure-family-vault',
    title: 'Secure Family Vault',
    description: 'Store and organize your important documents with bank-level security and family access controls.',
    icon: Lock,
    route: '/document-management',
    isPremium: true,
    category: 'premium'
  }
];

export const SolutionCards: React.FC = () => {
  const navigate = useNavigate();

  const handleLearnMore = (solution: SolutionCard) => {
    if (solution.route) {
      navigate(solution.route);
    }
  };

  const handleBookCall = () => {
    // Navigate to booking or contact page
    navigate('/contact');
  };

  const renderSolutionCard = (solution: SolutionCard) => {
    const IconComponent = solution.icon;
    
    const cardContent = (
      <Card className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-border relative group h-full flex flex-col">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
            <IconComponent className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-foreground">{solution.title}</h3>
              {solution.isPremium && (
                <Badge variant="secondary" className="text-xs px-2 py-1">
                  Premium
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-6 flex-1 leading-relaxed">
          {solution.description}
        </p>
        
        <div className="flex gap-3 mt-auto">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleLearnMore(solution)}
            className="flex-1"
          >
            Learn More
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleBookCall}
            className="flex-1"
          >
            Book a Review
          </Button>
        </div>
      </Card>
    );

    if (solution.isPremium) {
      return (
        <FeatureGate
          key={solution.id}
          featureId={solution.id}
          featureName={solution.title}
          requiredPlans={solution.category === 'premium' ? ['elite'] : ['premium']}
        >
          {cardContent}
        </FeatureGate>
      );
    }

    return <div key={solution.id}>{cardContent}</div>;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {solutionCards.map(renderSolutionCard)}
    </div>
  );
};