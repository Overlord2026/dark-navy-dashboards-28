import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TreePine, Users, Briefcase, Phone, Building2, ArrowRight } from 'lucide-react';
import { getLogoConfig } from '@/assets/logos';
import { useNavigate } from 'react-router-dom';

export function FamilyOfficeMarketplacePage() {
  const navigate = useNavigate();
  const treeLogoConfig = getLogoConfig('tree');

  const marketplaceFeatures = [
    {
      icon: <TreePine className="w-8 h-8 text-gold" />,
      title: "Elite Family Offices",
      description: "Connect with top-tier single and multi-family offices",
      action: "Browse Offices"
    },
    {
      icon: <Users className="w-8 h-8 text-emerald" />,
      title: "Professional Network",
      description: "Access vetted advisors, CPAs, attorneys, and wealth managers",
      action: "View Professionals"
    },
    {
      icon: <Briefcase className="w-8 h-8 text-gold" />,
      title: "Investment Opportunities",
      description: "Exclusive deals and co-investment opportunities",
      action: "See Deals"
    },
    {
      icon: <Building2 className="w-8 h-8 text-emerald" />,
      title: "Family Office Services",
      description: "Complete suite of family office management services",
      action: "Explore Services"
    }
  ];

  const handleGetStarted = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-navy via-navy to-slate-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <img 
            src={treeLogoConfig.src}
            alt={treeLogoConfig.alt}
            className="h-16 w-auto mb-6 mx-auto"
          />
          
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Family Office{' '}
            <span className="bg-gradient-to-r from-emerald to-green-400 bg-clip-text text-transparent">
              Marketplace
            </span>
          </h1>
          
          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            The exclusive platform connecting ultra-high-net-worth families with premier wealth management professionals and co-investment opportunities.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {marketplaceFeatures.map((feature, index) => (
            <Card key={index} className="group bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-gradient-to-br from-white/10 to-white/5 group-hover:from-white/20 group-hover:to-white/10 transition-all duration-300">
                    {feature.icon}
                  </div>
                </div>
                <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-300 mb-4 text-sm">
                  {feature.description}
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="group-hover:bg-gold/20 group-hover:border-gold group-hover:text-gold transition-colors"
                >
                  {feature.action}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-gold/10 to-emerald/10 rounded-2xl p-12 border border-gold/20">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Join the Elite Network?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Access exclusive opportunities and connect with the world's most prestigious family offices and wealth management professionals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-gradient-to-r from-gold to-yellow-400 hover:from-yellow-400 hover:to-gold text-navy font-bold text-lg px-8 py-4 rounded-lg shadow-gold hover:shadow-xl transition-all duration-300"
            >
              <TreePine className="w-5 h-5 mr-2" />
              Get Started
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="border-emerald text-emerald hover:bg-emerald hover:text-white font-bold text-lg px-8 py-4 rounded-lg transition-all duration-300"
            >
              <Phone className="w-5 h-5 mr-2" />
              Schedule Call
            </Button>
          </div>
          
          <p className="text-sm text-gray-400 mt-6">
            * Invitation-only marketplace. Minimum investable assets required.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-gold mb-2">500+</div>
            <div className="text-gray-300">Family Offices</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald mb-2">$2.5T+</div>
            <div className="text-gray-300">Assets Under Management</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gold mb-2">50+</div>
            <div className="text-gray-300">Countries Represented</div>
          </div>
        </div>
      </div>
    </div>
  );
}