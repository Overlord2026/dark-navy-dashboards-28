import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, TrendingUp, Scale, Calculator, Users, Star, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProsOverview() {
  const navigate = useNavigate();

  const proTypes = [
    {
      id: 'advisor',
      title: 'Financial Advisors',
      description: 'Comprehensive wealth management and advisory services',
      icon: TrendingUp,
      features: [
        'Client relationship management',
        'Portfolio analysis and reporting',
        'Financial planning tools',
        'Compliance and documentation',
        'Lead generation and marketing'
      ],
      stats: {
        clients: '10K+',
        aum: '$2.5B+',
        tools: '50+'
      },
      color: 'bg-gradient-to-br from-blue-500/20 to-indigo-600/20',
      borderColor: 'border-blue-500/30',
      buttonText: 'Join as Advisor',
      route: '/pros/advisors'
    },
    {
      id: 'cpa',
      title: 'CPAs & Tax Professionals',
      description: 'Advanced tax planning and accounting services',
      icon: Calculator,
      features: [
        'Tax optimization strategies',
        'Multi-entity tax planning',
        'Client collaboration tools',
        'Research and compliance',
        'Practice management'
      ],
      stats: {
        clients: '5K+',
        savings: '$250M+',
        strategies: '100+'
      },
      color: 'bg-gradient-to-br from-green-500/20 to-emerald-600/20',
      borderColor: 'border-green-500/30',
      buttonText: 'Join as CPA',
      route: '/pros/cpa'
    },
    {
      id: 'attorney',
      title: 'Estate Planning Attorneys',
      description: 'Sophisticated estate and legal planning services',
      icon: Scale,
      features: [
        'Estate plan generation',
        'Trust and entity structuring',
        'Client workflow management',
        'Document automation',
        'Continuing education'
      ],
      stats: {
        clients: '3K+',
        estates: '$1.8B+',
        documents: '25K+'
      },
      color: 'bg-gradient-to-br from-purple-500/20 to-violet-600/20',
      borderColor: 'border-purple-500/30',
      buttonText: 'Join as Attorney',
      route: '/pros/attorneys'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-luxury-navy/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Professional <span className="text-brand-gold">Marketplace</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the premier network of financial professionals serving high-net-worth families and individuals.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-brand-gold" />
              <span>18K+ Professionals</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-brand-gold" />
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-brand-gold" />
              <span>Fully Vetted</span>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Types Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Choose Your Professional Path</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select your area of expertise and join thousands of professionals growing their practice
            </p>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {proTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Card 
                  key={type.id} 
                  className={`${type.color} ${type.borderColor} border-2 hover:scale-105 transition-all duration-300 cursor-pointer`}
                  onClick={() => navigate(type.route)}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-4 rounded-full bg-brand-gold/20">
                      <Icon className="h-12 w-12 text-brand-gold" />
                    </div>
                    <CardTitle className="text-xl text-foreground">{type.title}</CardTitle>
                    <p className="text-muted-foreground text-sm">{type.description}</p>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-6 p-3 bg-background/50 rounded-lg">
                      <div className="text-center">
                        <div className="text-lg font-bold text-brand-gold">{type.stats.clients || type.stats.aum || type.stats.estates}</div>
                        <div className="text-xs text-muted-foreground">
                          {type.stats.clients ? 'Clients' : type.stats.aum ? 'AUM' : 'Estates'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-brand-gold">{type.stats.aum || type.stats.savings || type.stats.documents}</div>
                        <div className="text-xs text-muted-foreground">
                          {type.stats.aum ? 'AUM' : type.stats.savings ? 'Tax Savings' : 'Documents'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-brand-gold">{type.stats.tools || type.stats.strategies || type.stats.documents}</div>
                        <div className="text-xs text-muted-foreground">
                          {type.stats.tools ? 'Tools' : type.stats.strategies ? 'Strategies' : 'Generated'}
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 mb-6">
                      {type.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 bg-brand-gold rounded-full flex-shrink-0" />
                          <span className="text-xs text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-black"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(type.route);
                      }}
                    >
                      {type.buttonText}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-muted/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Why Join Our Platform?</h2>
            <p className="text-muted-foreground">Everything you need to grow and manage your professional practice</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-brand-gold mx-auto mb-4" />
                <CardTitle>Quality Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect with pre-qualified, high-net-worth families actively seeking professional services.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border text-center">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-brand-gold mx-auto mb-4" />
                <CardTitle>Advanced Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access sophisticated software and tools designed specifically for your professional needs.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-brand-gold mx-auto mb-4" />
                <CardTitle>Compliance Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Stay compliant with built-in regulatory support and documentation management.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Ready to Grow Your Practice?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of professionals who have already transformed their practice with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-brand-gold hover:bg-brand-gold/90 text-brand-black"
              onClick={() => navigate('/pros/advisors')}
            >
              Apply Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-brand-gold text-brand-gold hover:bg-brand-gold/10"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}