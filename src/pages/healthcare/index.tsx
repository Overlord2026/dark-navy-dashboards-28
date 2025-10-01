import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { GoldButton } from '@/components/ui/brandButtons';
import HeaderSpacer from '@/components/layout/HeaderSpacer';

const HealthcareIndex = () => {
  const navigate = useNavigate();

  const healthcareServices = [
    {
      icon: Heart,
      title: 'Providers/Clinics',
      description: 'Connect with healthcare providers, medical clinics, and specialized treatment centers for comprehensive care.',
      action: () => navigate('/healthcare/providers'),
      buttonText: 'Find Providers'
    },
    {
      icon: Users,
      title: 'Coaches',
      description: 'Work with certified health and wellness coaches to achieve your fitness and lifestyle goals.',
      action: () => navigate('/healthcare/coaches'),
      buttonText: 'Find Coaches'
    },
    {
      icon: BookOpen,
      title: 'Guides',
      description: 'Access comprehensive health guides, resources, and educational materials for informed decisions.',
      action: () => navigate('/healthcare/guides'),
      buttonText: 'Browse Guides'
    }
  ];

  return (
    <div className="min-h-screen bg-bfo-black">
      <HeaderSpacer />
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            Your <span className="text-bfo-gold">Healthcare</span> Journey
          </h1>
          <p className="text-white/80 text-xl max-w-4xl mx-auto">
            Discover comprehensive healthcare solutions tailored to your needs. 
            Connect with providers, coaches, and access educational resources to optimize your health and wellbeing.
          </p>
        </div>

        {/* Services Cards */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {healthcareServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card 
                  key={index} 
                  className="bfo-card border border-bfo-gold bg-bfo-black hover:border-bfo-gold/80 transition-all duration-300 group"
                >
                  <CardContent className="p-8 text-center">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-bfo-gold rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-bfo-black" />
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-white mb-4">
                      {service.title}
                    </h2>

                    {/* Description */}
                    <p className="text-white/80 mb-8 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Action Button */}
                    <GoldButton 
                      onClick={service.action}
                      className="w-full"
                    >
                      {service.buttonText}
                    </GoldButton>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="text-center mt-16">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-6">
              Comprehensive Healthcare Solutions
            </h3>
            <p className="text-white/70 text-lg leading-relaxed">
              Our healthcare platform connects you with verified professionals and resources 
              to support your journey toward optimal health. Whether you need medical care, 
              wellness coaching, or educational materials, we're here to help you make 
              informed decisions about your health.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthcareIndex;