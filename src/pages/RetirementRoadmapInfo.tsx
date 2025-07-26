import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/ui/Logo';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Calendar, DollarSign, Shield, Star, Clock, Users, TrendingUp, Award } from 'lucide-react';
import { withTrademarks } from '@/utils/trademark';
import { useEventTracking } from '@/hooks/useEventTracking';

export default function RetirementRoadmapInfo() {
  const navigate = useNavigate();
  const { trackFeatureUsed, trackLeadConverted } = useEventTracking();

  const handleScheduleReview = () => {
    trackFeatureUsed('schedule_consultation', { source: 'roadmap_info' });
    window.open('https://calendly.com/tonygomes/talk-with-tony', '_blank');
  };

  const handlePurchaseRoadmap = () => {
    trackLeadConverted({ source: 'roadmap_info', price: 497, type: 'roadmap_purchase_intent' });
    // TODO: Implement Stripe checkout integration
    console.log('Roadmap purchase initiated');
    alert('Stripe checkout integration needed for roadmap purchase');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo variant="tree" onClick={() => navigate('/')} />
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
              <span className="ml-2 text-foreground font-semibold">4.8/5 rating</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">Trusted by 200+ families</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Your Customized Retirement Roadmap
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Get your personalized retirement strategy for a transparent, one-time fee. No ongoing obligations. No hidden costs. Just actionable guidance from CFP® professionals.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Fiduciary Duty</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-success/10 px-4 py-2 rounded-full border border-success/20">
              <Award className="h-4 w-4 text-success" />
              <span className="text-sm font-medium">CFP® Professional</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Advertising-free environment. Your data is secure and never sold to third parties.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6"
              onClick={handleScheduleReview}
            >
              <Calendar className="h-5 w-5 mr-2" />
              Schedule Complimentary Consultation
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-6"
              onClick={handlePurchaseRoadmap}
            >
              <DollarSign className="h-5 w-5 mr-2" />
              Purchase Roadmap ($497)
            </Button>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="bg-card/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What's Included in Your Roadmap
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A comprehensive, personalized strategy document with specific action items and implementation timeline
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: <TrendingUp className="h-8 w-8 text-primary" />,
                title: "Tax-Efficient Withdrawal Strategy",
                description: "Optimal sequence for withdrawing from different account types to minimize taxes"
              },
              {
                icon: <Calendar className="h-8 w-8 text-primary" />,
                title: "Social Security Optimization",
                description: "Precise timing strategy to maximize your lifetime Social Security benefits"
              },
              {
                icon: <Shield className="h-8 w-8 text-primary" />,
                title: "Healthcare Cost Planning",
                description: "Projections and strategies for Medicare, long-term care, and health savings"
              },
              {
                icon: <Users className="h-8 w-8 text-primary" />,
                title: "Legacy & Estate Planning",
                description: "Strategies to protect and transfer wealth efficiently to your beneficiaries"
              },
              {
                icon: <DollarSign className="h-8 w-8 text-primary" />,
                title: "Income Gap Analysis",
                description: "Detailed assessment of retirement income needs vs. projected resources"
              },
              {
                icon: <Clock className="h-8 w-8 text-primary" />,
                title: "90-Day Action Plan",
                description: "Prioritized implementation steps with specific deadlines and milestones"
              }
            ].map((feature, index) => (
              <Card key={index} className="border-primary/20">
                <CardHeader className="text-center">
                  {feature.icon}
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Options */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your Path
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Get expert guidance at a transparent, one-time fee—or explore our complimentary consultation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Complimentary Consultation */}
          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Complimentary Consultation</CardTitle>
              <CardDescription className="text-lg">
                No cost, no obligation review
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">FREE</div>
                <div className="text-sm text-muted-foreground">45-minute session</div>
              </div>

              <div className="space-y-3">
                {[
                  'Retirement readiness assessment',
                  'Current strategy review',
                  'Preliminary recommendations',
                  'Discussion of full roadmap option',
                  'No sales pressure'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                className="w-full"
                onClick={handleScheduleReview}
              >
                Schedule Consultation
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Perfect for exploring whether our approach is right for you
              </p>
            </CardContent>
          </Card>

          {/* Customized Roadmap */}
          <Card className="border-2 border-primary bg-primary/5">
            <CardHeader className="text-center">
              <div className="bg-primary p-3 rounded-full w-fit mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Customized Roadmap</CardTitle>
              <CardDescription className="text-lg">
                Complete implementation guide
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">$497</div>
                <div className="text-sm text-muted-foreground">One-time fee</div>
              </div>

              <div className="space-y-3">
                {[
                  'Comprehensive 30+ page roadmap',
                  'Tax-efficient withdrawal strategy',
                  'Social Security optimization',
                  'Healthcare & long-term care planning',
                  'Estate planning recommendations',
                  '90-day implementation plan',
                  'Priority action checklist',
                  '60-day email support'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                className="w-full bg-primary hover:bg-primary/90"
                onClick={handlePurchaseRoadmap}
              >
                Get My Roadmap
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Delivered within 10 business days
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-card/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Why Families Choose Our Roadmap
            </h2>
            <div className="max-w-4xl mx-auto space-y-6">
              <p className="text-lg text-muted-foreground">
                {withTrademarks("Get Boutique Family Office-level strategy without the $5M+ minimums typically required.")}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Shield className="h-12 w-12 mx-auto text-primary mb-4" />
                    <h3 className="font-semibold mb-2">Fiduciary Standard</h3>
                    <p className="text-sm text-muted-foreground">
                      {withTrademarks("Always acting in your best interest—no commissions, no conflicts")}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <Star className="h-12 w-12 mx-auto text-primary mb-4" />
                    <h3 className="font-semibold mb-2">Expert Team</h3>
                    <p className="text-sm text-muted-foreground">
                      CFP®, CPA, and estate planning professionals with 20+ years experience
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <DollarSign className="h-12 w-12 mx-auto text-primary mb-4" />
                    <h3 className="font-semibold mb-2">Transparent Pricing</h3>
                    <p className="text-sm text-muted-foreground">
                      One-time fee, no ongoing obligations or hidden costs
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Ready to Secure Your Retirement?
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the option that's right for you—complimentary consultation to explore, or dive straight into your customized roadmap.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
              onClick={handleScheduleReview}
            >
              Schedule Free Consultation
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-6"
              onClick={handlePurchaseRoadmap}
            >
              Purchase Roadmap Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/30 py-8">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2024 BFO. Investment advisory services offered through registered investment advisors.</p>
          <p className="mt-2">
            Results not guaranteed. Past performance does not indicate future results.
          </p>
        </div>
      </footer>
    </div>
  );
}