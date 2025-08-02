import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  Award, 
  TrendingUp, 
  ArrowRight,
  Shield,
  GraduationCap,
  Target,
  Star,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function IMOFMOCategories() {
  const navigate = useNavigate();

  const imoFmoTypes = [
    {
      id: 'imo-organizations',
      title: 'Independent Marketing Organizations (IMOs)',
      icon: Building2,
      description: 'Full-service distribution platforms for life insurance and annuities',
      count: '45+',
      avgOverride: '85-120 bps',
      minProduction: '$500K+',
      specialties: ['Life Insurance', 'Annuities', 'Agent Training', 'Marketing Support'],
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Agent Recruiting & Onboarding',
        'Carrier Appointments',
        'Marketing Co-op Programs',
        'Compliance Oversight',
        'Technology Platform',
        'Advanced Training'
      ]
    },
    {
      id: 'fmo-organizations',
      title: 'Field Marketing Organizations (FMOs)',
      icon: Users,
      description: 'Specialized distribution for Medicare and health insurance products',
      count: '32+',
      avgOverride: '15-25%',
      minProduction: '$250K+',
      specialties: ['Medicare Advantage', 'Medicare Supplements', 'ACA Plans', 'Agent Support'],
      color: 'from-green-500 to-emerald-500',
      features: [
        'Medicare Specialization',
        'Lead Generation',
        'CRM Systems',
        'Enrollment Support',
        'Compliance Training',
        'Marketing Materials'
      ]
    },
    {
      id: 'hybrid-organizations',
      title: 'Hybrid IMO/FMO Platforms',
      icon: Target,
      description: 'Multi-product distribution covering life, health, and wealth management',
      count: '18+',
      avgOverride: 'Variable',
      minProduction: '$1M+',
      specialties: ['Full Product Suite', 'Wealth Management', 'Technology Integration', 'White-Label'],
      color: 'from-purple-500 to-violet-500',
      features: [
        'Multi-Product Platform',
        'RIA Integration',
        'Advanced Analytics',
        'Custom Technology',
        'Financial Planning Tools',
        'Investment Products'
      ]
    },
    {
      id: 'regional-organizations',
      title: 'Regional Distribution Partners',
      icon: Award,
      description: 'Territory-focused organizations with deep local market expertise',
      count: '67+',
      avgOverride: 'Competitive',
      minProduction: '$100K+',
      specialties: ['Local Market Focus', 'Community Relationships', 'Regional Carriers', 'Personal Service'],
      color: 'from-orange-500 to-red-500',
      features: [
        'Local Market Expertise',
        'Community Connections',
        'Personalized Support',
        'Regional Carrier Access',
        'Flexible Contracting',
        'Hands-on Training'
      ]
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Building2 className="w-4 h-4 mr-2 text-blue-500" />
            Distribution Network
          </Badge>
          <h2 className="text-4xl font-bold mb-6">
            IMO & FMO Partnership Opportunities
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect with leading Independent and Field Marketing Organizations 
            to expand your distribution reach and grow your agent network.
          </p>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {imoFmoTypes.map((org) => {
            const IconComponent = org.icon;
            return (
              <Card 
                key={org.id} 
                className="group cursor-pointer hover-scale transition-all duration-300 hover:shadow-xl border-border/50 bg-gradient-to-br from-background to-muted/30"
                onClick={() => navigate(`/marketplace/${org.id}`)}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${org.color} p-2.5 text-white`}>
                      <IconComponent className="w-full h-full" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {org.count} available
                    </Badge>
                  </div>
                  
                  <div>
                    <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                      {org.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {org.description}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Override & Production Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Typical Override</div>
                      <div className="font-medium">{org.avgOverride}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Min. Production</div>
                      <div className="font-medium">{org.minProduction}</div>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Key Specialties</div>
                    <div className="flex flex-wrap gap-1">
                      {org.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <div className="text-sm text-muted-foreground mb-3">Platform Features</div>
                    <div className="grid grid-cols-2 gap-2">
                      {org.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Explore Partners
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Vetted Partners</h3>
              <p className="text-sm text-muted-foreground">
                All IMO/FMO partners undergo thorough compliance and financial verification
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Growth Support</h3>
              <p className="text-sm text-muted-foreground">
                Access training, marketing support, and technology to grow your business
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Ongoing Education</h3>
              <p className="text-sm text-muted-foreground">
                Continuous training on products, compliance, and sales techniques
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}