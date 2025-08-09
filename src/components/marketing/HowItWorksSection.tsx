import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, MessageSquare, PieChart, ArrowRight, Users, Calendar, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { analytics } from '@/lib/analytics';

export const HowItWorksSection: React.FC = () => {
  const navigate = useNavigate();

  const handleCTAClick = (step: string, route: string) => {
    analytics.track('how_it_works_cta_clicked', { step, route });
    navigate(route);
  };

  const steps = [
    {
      id: 'capture',
      icon: Target,
      title: 'Capture & Score',
      description: 'Leads flow in from ads/social. Our SWAG Lead Score™ and optional net‑worth verification prioritize who to call first.',
      cta: 'See the CRM',
      route: '/crm',
      gated: true
    },
    {
      id: 'meet',
      icon: MessageSquare,
      title: 'Meet & Summarize',
      description: 'Linda (voice/SMS) records meetings, summarizes, pulls objections and auto‑drafts follow‑ups.',
      cta: 'See Smart Cadences',
      route: '/settings/automation',
      gated: false
    },
    {
      id: 'plan',
      icon: PieChart,
      title: 'Plan & Retain',
      description: 'SWAG Retirement Roadmap, Estate & Tax tools keep clients engaged, with reports and portals you control.',
      cta: 'Try SWAG Preview',
      route: '/retirement-analyzer',
      gated: false
    }
  ];

  React.useEffect(() => {
    analytics.track('how_it_works_scrolled', {});
  }, []);

  return (
    <section id="how-it-works" className="py-24 bg-card/30 scroll-mt-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-6">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From first contact to long-term retention, our platform streamlines your entire client journey.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              {/* Arrow connector */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-20 -right-4 z-10">
                  <ArrowRight className="w-6 h-6 text-gold/40" />
                </div>
              )}

              <Card className="h-full bg-card/50 backdrop-blur-sm border border-border hover:border-gold/30 transition-all duration-300 hover:shadow-lg">
                <CardHeader className="text-center pb-4">
                  {/* Step number */}
                  <Badge className="w-8 h-8 rounded-full bg-gold text-navy font-bold text-sm mb-4 mx-auto">
                    {index + 1}
                  </Badge>
                  
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold/80 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-navy" />
                  </div>
                  
                  <CardTitle className="text-xl text-foreground">
                    {step.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="text-center space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                  
                  <Button
                    onClick={() => handleCTAClick(step.id, step.route)}
                    className="w-full bg-gradient-to-r from-emerald to-emerald/90 hover:from-emerald/90 hover:to-emerald text-white transition-all duration-300 touch-target"
                  >
                    {step.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  
                  {step.gated && (
                    <p className="text-xs text-muted-foreground/70">
                      *Login required
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional features row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald to-emerald/80 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2 text-foreground">Client Portal</h3>
            <p className="text-sm text-muted-foreground">Secure document vault and communication</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold/80 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-navy" />
            </div>
            <h3 className="font-semibold mb-2 text-foreground">Automated Scheduling</h3>
            <p className="text-sm text-muted-foreground">Linda AI handles meeting coordination</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald to-emerald/80 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2 text-foreground">Analytics & Reporting</h3>
            <p className="text-sm text-muted-foreground">Track performance and client engagement</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};