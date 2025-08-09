import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, FileText, Users, BarChart3, ArrowRight, ExternalLink, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LandingNavigation } from '@/components/marketplace/LandingNavigation';
import { BrandedFooter } from '@/components/ui/BrandedFooter';

export const RealtorPersonaPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: 'Listings & Property Vault',
      description: 'Comprehensive property management, listing tools, and secure document storage for transactions.'
    },
    {
      icon: Users,
      title: 'Tenant Management Tools',
      description: 'Complete tenant management system, lease tracking, and communication portal for property managers.'
    },
    {
      icon: BarChart3,
      title: 'Client Portal & Analytics',
      description: 'Client engagement tools, market analytics, and performance tracking for real estate professionals.'
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
            <Badge className="bg-gold/20 text-gold border-gold/30 px-4 py-2">
              <Home className="w-4 h-4 mr-2" />
              Realtors
            </Badge>
            
            <div className="space-y-6">
              <h1 className="font-serif text-5xl lg:text-6xl font-bold text-foreground">
                Elevate Your Real Estate Practice
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Complete real estate management tools, client engagement platform, and property analytics 
                designed for modern real estate professionals and property managers.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/demo/realtor')}
                className="bg-gradient-to-r from-gold to-gold/90 hover:from-gold/90 hover:to-gold text-navy font-bold px-8 py-4 text-lg"
              >
                View Realtor Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/demo/realtor')}
                className="border-emerald text-emerald hover:bg-emerald/10 px-8 py-4 text-lg"
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
                <Card className="h-full bg-card/50 backdrop-blur-sm border border-border hover:border-gold/30 transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold/80 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
                      <feature.icon className="w-8 h-8 text-navy" />
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