import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Calculator, 
  Scale, 
  Shield, 
  Building, 
  Banknote,
  ArrowRight,
  Users,
  Crown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ProfessionalCategories() {
  const navigate = useNavigate();

  const categories = [
    {
      id: 'wealth-advisors',
      title: 'Wealth Advisors',
      icon: TrendingUp,
      description: 'Fee-only fiduciary advisors specializing in complex portfolios',
      count: '150+',
      avgFee: '$5,000/year',
      minAUM: '$5M+',
      specialties: ['Portfolio Management', 'Tax Optimization', 'Estate Planning'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'tax-specialists',
      title: 'Tax Specialists & CPAs',
      icon: Calculator,
      description: 'High-net-worth tax planning and multi-jurisdiction expertise',
      count: '85+',
      avgFee: '$450/hour',
      minAUM: '$2M+',
      specialties: ['Multi-State Tax', 'International Tax', 'Estate Tax Planning'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'estate-attorneys',
      title: 'Estate Attorneys',
      icon: Scale,
      description: 'Specialized legal counsel for complex estate structures',
      count: '75+',
      avgFee: '$650/hour',
      minAUM: '$10M+',
      specialties: ['Trust & Estates', 'Tax Law', 'Business Succession'],
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 'insurance-specialists',
      title: 'Insurance Specialists',
      icon: Shield,
      description: 'Advanced life insurance and risk management strategies',
      count: '60+',
      avgFee: 'Commission',
      minAUM: '$3M+',
      specialties: ['Life Insurance', 'Captive Insurance', 'Risk Assessment'],
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'family-office',
      title: 'Family Office Services',
      icon: Building,
      description: 'Multi-family offices and single family office solutions',
      count: '25+',
      avgFee: '$150K/year',
      minAUM: '$25M+',
      specialties: ['Governance', 'Investment Committee', 'Next-Gen Planning'],
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'private-banking',
      title: 'Private Banking',
      icon: Banknote,
      description: 'Exclusive banking solutions and credit facilities',
      count: '40+',
      avgFee: 'Relationship',
      minAUM: '$5M+',
      specialties: ['Lending', 'Cash Management', 'International Banking'],
      color: 'from-indigo-500 to-blue-500'
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Crown className="w-4 h-4 mr-2 text-yellow-500" />
            Elite Professional Network
          </Badge>
          <h2 className="text-4xl font-bold mb-6">
            Connect with Specialized Professionals
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our carefully vetted network includes only the most qualified professionals 
            who understand the unique challenges of managing substantial wealth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={category.id} 
                className="group cursor-pointer hover-scale transition-all duration-300 hover:shadow-xl border-border/50 bg-gradient-to-br from-background to-muted/30"
                onClick={() => navigate(`/marketplace/${category.id}`)}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} p-2.5 text-white`}>
                      <IconComponent className="w-full h-full" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {category.count} available
                    </Badge>
                  </div>
                  
                  <div>
                    <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                      {category.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Pricing Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Typical Fee</div>
                      <div className="font-medium">{category.avgFee}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Min. Assets</div>
                      <div className="font-medium">{category.minAUM}</div>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Key Specialties</div>
                    <div className="flex flex-wrap gap-1">
                      {category.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Browse Professionals
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}