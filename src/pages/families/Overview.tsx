import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, TrendingUp, Heart, Users, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FamiliesOverview() {
  const navigate = useNavigate();

  const familyTypes = [
    {
      id: 'aspiring',
      title: 'Aspiring Families',
      description: 'Building wealth and securing your financial future',
      icon: TrendingUp,
      features: [
        'Goal-based financial planning',
        'Investment guidance and education',
        'Debt optimization strategies',
        'Emergency fund planning',
        'Career advancement resources'
      ],
      color: 'bg-gradient-to-br from-green-500/20 to-emerald-600/20',
      borderColor: 'border-green-500/30',
      buttonText: 'Start Your Journey',
      route: '/families/start/aspiring'
    },
    {
      id: 'retirees',
      title: 'Retiree Families',
      description: 'Protecting and enjoying your lifetime of hard work',
      icon: Shield,
      features: [
        'Retirement income optimization',
        'Healthcare planning and insurance',
        'Estate planning and legacy goals',
        'Tax-efficient withdrawal strategies',
        'Social Security maximization'
      ],
      color: 'bg-gradient-to-br from-blue-500/20 to-indigo-600/20',
      borderColor: 'border-blue-500/30',
      buttonText: 'Secure Your Future',
      route: '/families/start/retirees'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-luxury-navy/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Family Wealth <span className="text-brand-gold">Management</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you're building wealth or preserving it, we have tailored solutions for every stage of your family's financial journey.
          </p>
        </div>
      </section>

      {/* Family Types Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Choose Your Path</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select the category that best describes your family's current financial stage
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {familyTypes.map((type) => {
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
                    <CardTitle className="text-2xl text-foreground">{type.title}</CardTitle>
                    <p className="text-muted-foreground">{type.description}</p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      {type.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-brand-gold rounded-full flex-shrink-0" />
                          <span className="text-sm text-foreground">{feature}</span>
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

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">What You Get</h2>
            <p className="text-muted-foreground">Comprehensive tools and guidance for every family</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-brand-gold mx-auto mb-4" />
                <CardTitle>Expert Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access to certified financial advisors and specialists who understand your unique needs.
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
                  Sophisticated financial planning tools and calculators designed for real-world scenarios.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border text-center">
              <CardHeader>
                <Heart className="h-12 w-12 text-brand-gold mx-auto mb-4" />
                <CardTitle>Personalized Care</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Tailored recommendations and strategies that adapt to your family's changing needs.
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
            Ready to Transform Your Financial Future?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of families who have already started their journey to financial success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-brand-gold hover:bg-brand-gold/90 text-brand-black"
              onClick={() => navigate('/families/start/aspiring')}
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-brand-gold text-brand-gold hover:bg-brand-gold/10"
            >
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}