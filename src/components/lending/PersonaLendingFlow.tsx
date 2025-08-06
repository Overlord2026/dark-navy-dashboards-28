import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Building, 
  UserCheck, 
  Sparkles, 
  Shield, 
  MessageCircle,
  TrendingUp,
  GraduationCap,
  Calendar,
  Award
} from 'lucide-react';
import { usePersona } from '@/hooks/usePersona';
import lendingBanner from '@/assets/lending-dashboard-banner.png';

interface LendingOffer {
  id: string;
  lender: string;
  rate: string;
  term: string;
  amount: string;
  type: string;
  featured?: boolean;
  exclusive?: boolean;
}

export function PersonaLendingFlow() {
  const { persona: currentPersona } = usePersona();

  const getPersonaConfig = () => {
    switch (currentPersona) {
      case 'hnw_client':
        return {
          badge: { icon: Crown, text: 'Premium Client', variant: 'default' as const },
          title: 'Exclusive Private Credit Solutions',
          subtitle: 'Access premium lending options tailored to your portfolio',
          primaryCTA: 'Talk to BFO Lending Concierge',
          offers: [
            { id: '1', lender: 'Private Credit Partners', rate: '5.25%', term: 'Flexible', amount: '$5M+', type: 'Private Credit', featured: true, exclusive: true },
            { id: '2', lender: 'Asset-Based Lending', rate: '4.95%', term: '12 months', amount: '$10M+', type: 'Securities-Based', exclusive: true },
            { id: '3', lender: 'BFO Premium', rate: '5.75%', term: '24 months', amount: '$2M+', type: 'Portfolio Line', featured: true }
          ]
        };
      
      case 'pre_retiree':
        return {
          badge: { icon: Calendar, text: 'Pre-Retirement', variant: 'secondary' as const },
          title: 'Retirement-Ready Lending Solutions',
          subtitle: 'Optimize your borrowing strategy as you approach retirement',
          primaryCTA: 'Schedule Retirement Lending Review',
          offers: [
            { id: '1', lender: 'Reverse Mortgage Co', rate: 'Variable', term: 'Life of Loan', amount: 'Up to 60% Home Value', type: 'Reverse Mortgage', featured: true },
            { id: '2', lender: 'HELOC Specialists', rate: '6.15%', term: '10 years', amount: 'Up to 80% LTV', type: 'HELOC' },
            { id: '3', lender: 'Bridge Lending', rate: '5.85%', term: '6 months', amount: '$500K+', type: 'Bridge Loan' }
          ]
        };
      
      case 'next_gen':
        return {
          badge: { icon: TrendingUp, text: 'Emerging Wealth', variant: 'outline' as const },
          title: 'Build Your Credit & Wealth',
          subtitle: 'Smart borrowing options to accelerate your financial growth',
          primaryCTA: 'Start with First-Time Borrower Guide',
          offers: [
            { id: '1', lender: 'First-Time Buyers', rate: '6.45%', term: '30 years', amount: 'Up to $1M', type: 'First Mortgage', featured: true },
            { id: '2', lender: 'Investment Property', rate: '6.85%', term: '30 years', amount: 'Up to $2M', type: 'Investment Loan' },
            { id: '3', lender: 'Personal Growth', rate: '8.25%', term: '5 years', amount: 'Up to $100K', type: 'Personal Loan' }
          ]
        };
      
      case 'family_office_admin':
        return {
          badge: { icon: UserCheck, text: 'Family Admin', variant: 'destructive' as const },
          title: 'Family Lending Management',
          subtitle: 'Coordinate lending across your entire family office',
          primaryCTA: 'Access Admin Dashboard',
          offers: [
            { id: '1', lender: 'Multi-Family Line', rate: '5.45%', term: 'Revolving', amount: '$25M+', type: 'Master Credit Line', featured: true },
            { id: '2', lender: 'Trust Lending', rate: '5.25%', term: 'Custom', amount: 'Based on Assets', type: 'Trust Facility' },
            { id: '3', lender: 'Business Suite', rate: '6.15%', term: '7 years', amount: '$5M+', type: 'Commercial Line' }
          ]
        };
      
      default:
        return {
          badge: { icon: Sparkles, text: 'Client', variant: 'outline' as const },
          title: 'Intelligent Lending Solutions',
          subtitle: 'Discover personalized lending options',
          primaryCTA: 'Explore Lending Options',
          offers: []
        };
    }
  };

  const config = getPersonaConfig();

  return (
    <div className="space-y-6">
      {/* Hero Banner with Generated Image */}
      <Card className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${lendingBanner})` }}
        />
        <div className="relative p-8 bg-gradient-to-r from-primary/90 to-primary/70 text-primary-foreground">
          <div className="flex items-center gap-4 mb-4">
            <config.badge.icon className="w-8 h-8" />
            <Badge variant={config.badge.variant} className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
              {config.badge.text}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold mb-2">{config.title}</h1>
          <p className="text-primary-foreground/90 mb-6">{config.subtitle}</p>
          <Button size="lg" variant="secondary">
            <MessageCircle className="w-4 h-4 mr-2" />
            {config.primaryCTA}
          </Button>
        </div>
      </Card>

      {/* Persona-Specific Features */}
      {currentPersona === 'hnw_client' && (
        <Card className="p-6 bg-accent/50 border-primary/20">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">VIP Priority Processing</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">24h</div>
              <div className="text-sm text-muted-foreground">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">$25M+</div>
              <div className="text-sm text-muted-foreground">Credit Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">Exclusive</div>
              <div className="text-sm text-muted-foreground">Private Offers</div>
            </div>
          </div>
        </Card>
      )}

      {currentPersona === 'next_gen' && (
        <Card className="p-6 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="w-6 h-6 text-green-600" />
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
              First-Time Borrower?
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            New to borrowing? We'll guide you through the entire process step-by-step.
          </p>
          <Button variant="outline" size="sm">
            <GraduationCap className="w-4 h-4 mr-2" />
            Watch Intro Video
          </Button>
        </Card>
      )}

      {currentPersona === 'family_office_admin' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Family Lending Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">12</div>
              <div className="text-sm text-muted-foreground">Active Loans</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">$45M</div>
              <div className="text-sm text-muted-foreground">Total Outstanding</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">5.8%</div>
              <div className="text-sm text-muted-foreground">Avg Interest Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">3</div>
              <div className="text-sm text-muted-foreground">Pending Reviews</div>
            </div>
          </div>
        </Card>
      )}

      {/* Personalized Offers */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Recommended for You</h3>
          {currentPersona === 'hnw_client' && (
            <Badge variant="default" className="bg-primary/20 text-primary">
              <Crown className="w-3 h-3 mr-1" />
              Premium Access
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {config.offers.map((offer) => (
            <Card key={offer.id} className={`p-4 relative ${offer.featured ? 'ring-2 ring-primary' : ''}`}>
              {offer.exclusive && (
                <Badge variant="default" className="absolute -top-2 -right-2 bg-primary text-primary-foreground">
                  <Crown className="w-3 h-3 mr-1" />
                  Exclusive
                </Badge>
              )}
              {offer.featured && !offer.exclusive && (
                <Badge variant="secondary" className="absolute -top-2 -right-2">
                  <Award className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">{offer.lender}</h4>
                  <p className="text-sm text-muted-foreground">{offer.type}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Rate:</span>
                    <span className="font-medium text-primary">{offer.rate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Term:</span>
                    <span className="font-medium">{offer.term}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Amount:</span>
                    <span className="font-medium">{offer.amount}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  variant={offer.featured ? 'default' : 'outline'}
                  size="sm"
                >
                  {currentPersona === 'hnw_client' ? 'Request Quote' : 'Apply Now'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Persona-Specific Call-to-Actions */}
      <Card className="p-6 bg-muted/50">
        <div className="text-center space-y-4">
          {currentPersona === 'pre_retiree' && (
            <>
              <h3 className="text-lg font-semibold">Ready for Your Next Chapter?</h3>
              <p className="text-muted-foreground">
                Let our retirement lending specialists help you optimize your borrowing strategy.
              </p>
              <Button size="lg">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Retirement Review
              </Button>
            </>
          )}
          
          {currentPersona === 'next_gen' && (
            <>
              <h3 className="text-lg font-semibold">Building Your Financial Future</h3>
              <p className="text-muted-foreground">
                Smart borrowing decisions today create wealth for tomorrow. Let's get started.
              </p>
              <div className="flex gap-3 justify-center">
                <Button size="lg">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Financial Education
                </Button>
                <Button variant="outline" size="lg">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat with Advisor
                </Button>
              </div>
            </>
          )}
          
          {currentPersona === 'family_office_admin' && (
            <>
              <h3 className="text-lg font-semibold">Family Office Management</h3>
              <p className="text-muted-foreground">
                Streamline lending operations across your entire family office.
              </p>
              <div className="flex gap-3 justify-center">
                <Button size="lg">
                  <Building className="w-4 h-4 mr-2" />
                  Admin Dashboard
                </Button>
                <Button variant="outline" size="lg">
                  <Shield className="w-4 h-4 mr-2" />
                  Compliance Center
                </Button>
              </div>
            </>
          )}
          
          {currentPersona === 'hnw_client' && (
            <>
              <h3 className="text-lg font-semibold">Concierge Lending Service</h3>
              <p className="text-muted-foreground">
                Your dedicated lending specialist is ready to assist with premium solutions.
              </p>
              <Button size="lg">
                <Crown className="w-4 h-4 mr-2" />
                Contact Your Concierge
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}