import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  DollarSign, 
  Shield, 
  Heart, 
  FileText, 
  Calculator,
  Users,
  PieChart,
  ArrowRight
} from 'lucide-react';
import { withTrademarks } from '@/utils/trademark';
import { analyticsEvents } from '@/analytics/events';

interface ResultsCrossSellProps {
  results: {
    feeSavings: number;
    monthsCovered: number;
    longevityBoost: number;
  };
}

export const ResultsCrossSell: React.FC<ResultsCrossSellProps> = ({ results }) => {
  const servicePathCards = [
    {
      id: 'income-now',
      title: 'Income Now',
      description: 'Annuity-alternatives explainer (private credit / T-bills ladders)',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      route: '/demo?view=retirement&tab=income-now'
    },
    {
      id: 'income-later',
      title: 'Income Later (3–12 yrs)',
      description: 'Bridge strategies and sequence planning',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
      route: '/demo?view=retirement&tab=income-later'
    },
    {
      id: 'growth',
      title: 'Growth (12+ yrs)',
      description: 'Long-term wealth accumulation strategies',
      icon: PieChart,
      color: 'from-purple-500 to-violet-500',
      route: '/demo?view=retirement&tab=growth'
    },
    {
      id: 'legacy',
      title: 'Legacy',
      description: 'Estate planning and generational wealth transfer',
      icon: Shield,
      color: 'from-amber-500 to-orange-500',
      route: '/demo?view=retirement&tab=legacy'
    }
  ];

  const engagementCards = [
    {
      id: 'match-advisor',
      title: 'Match me with a fiduciary advisor',
      description: 'Connect with vetted professionals in our network',
      icon: Users,
      route: '/match'
    },
    {
      id: 'tax-planning',
      title: 'Talk taxes (Roth windows)',
      description: 'Optimize your tax strategy with expert guidance',
      icon: Calculator,
      route: '/demo?view=tax'
    },
    {
      id: 'secure-documents',
      title: 'Secure my documents',
      description: 'Family Legacy Vault for document management',
      icon: FileText,
      route: '/demo?view=vault'
    },
    {
      id: 'healthcare',
      title: 'Healthcare guidance',
      description: 'Longevity planning and health optimization',
      icon: Heart,
      route: '/demo?view=health'
    }
  ];

  const handleServiceClick = (serviceId: string, route: string) => {
    analyticsEvents.trackFeatureUsage('service_path_click', {
      service_id: serviceId,
      destination: route,
      source: 'calculator_results'
    });
  };

  const handleEngagementClick = (engagementId: string, route: string) => {
    analyticsEvents.trackFeatureUsage('engagement_click', {
      engagement_id: engagementId,
      destination: route,
      source: 'calculator_results'
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Results Summary */}
      <Card className="bg-gradient-to-r from-primary/5 via-blue-500/5 to-purple-500/5">
        <CardHeader>
          <CardTitle className="text-center">
            Your {formatCurrency(results.feeSavings)} in savings can unlock these services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {Math.round(results.monthsCovered)}
              </div>
              <div className="text-sm text-muted-foreground">
                Additional months of expenses covered
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {results.longevityBoost.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">
                Extra years of financial security
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                100%
              </div>
              <div className="text-sm text-muted-foreground">
                Fiduciary, fee-transparent approach
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Path Row */}
      <div>
        <h3 className="text-2xl font-bold mb-6 text-center">
          Choose Your {withTrademarks("SWAG GPS™")} Service Path
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {servicePathCards.map((service) => {
            const IconComponent = service.icon;
            return (
              <Link 
                key={service.id}
                to={service.route}
                onClick={() => handleServiceClick(service.id, service.route)}
                className="group"
              >
                <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-bold mb-2 group-hover:text-primary transition-colors">
                      {service.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {service.description}
                    </p>
                    <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Explore
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Engagement Row */}
      <div>
        <h3 className="text-2xl font-bold mb-6 text-center">
          Get Started with Professional Guidance
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {engagementCards.map((engagement) => {
            const IconComponent = engagement.icon;
            return (
              <Link 
                key={engagement.id}
                to={engagement.route}
                onClick={() => handleEngagementClick(engagement.id, engagement.route)}
                className="group"
              >
                <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 bg-card/50">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-bold mb-2 group-hover:text-primary transition-colors">
                      {engagement.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {engagement.description}
                    </p>
                    <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                      Connect
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer CTA */}
      <Card className="text-center bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10">
        <CardContent className="p-8">
          <h3 className="text-xl font-bold mb-4">
            Ready to Transform Your Financial Strategy?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Schedule a complimentary consultation to discuss your personalized {withTrademarks("SWAG GPS™")} roadmap 
            and see how our integrated approach can optimize both your wealth and health.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Schedule My Consultation
            </Button>
            <Link to="/retirement-analyzer">
              <Button variant="outline" size="lg">
                Try Full Retirement Analyzer
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};