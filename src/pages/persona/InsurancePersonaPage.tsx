import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, FileText, Phone, Users, ArrowRight, ExternalLink, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LandingNavigation } from '@/components/marketplace/LandingNavigation';
import { BrandedFooter } from '@/components/ui/BrandedFooter';

export const InsurancePersonaPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: 'Policy Management & Client Comms',
      description: 'Complete policy tracking, client communication tools, and automated follow-up systems.'
    },
    {
      icon: Phone,
      title: 'Medicare Call Recording Compliance',
      description: 'TCPA-compliant call recording, storage, and management for Medicare and insurance sales.'
    },
    {
      icon: Users,
      title: 'Premium Marketing Tools',
      description: 'Lead generation, automated marketing campaigns, and client retention systems.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-background to-navy">
      <LandingNavigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <Badge className="bg-emerald/20 text-emerald border-emerald/30 px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Insurance / IMO / FMO
            </Badge>
            
            <div className="space-y-6">
              <h1 className="font-serif text-5xl lg:text-6xl font-bold text-foreground">
                Grow Your Insurance Practice
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Complete practice management tools, compliance solutions, and marketing automation 
                designed specifically for insurance agents and agencies.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/demo/insurance')}
                className="bg-gradient-to-r from-emerald to-emerald/90 hover:from-emerald/90 hover:to-emerald text-white px-8 py-4 text-lg"
              >
                View Insurance Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/demo/insurance')}
                className="border-gold text-gold hover:bg-gold/10 px-8 py-4 text-lg"
              >
                See Features
                <ExternalLink className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="h-full bg-card/50 backdrop-blur-sm border border-border hover:border-emerald/30 transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald to-emerald/80 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Secondary CTAs */}
      <section className="py-16">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline"
              onClick={() => navigate('/pricing')}
              className="border-gold text-gold hover:bg-gold/10"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              View Pricing
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate('/demo/request')}
              className="border-emerald text-emerald hover:bg-emerald/10"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Request a Demo
            </Button>
          </div>
        </div>
      </section>

      <BrandedFooter />
    </div>
  );
};