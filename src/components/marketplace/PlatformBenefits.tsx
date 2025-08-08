import React from 'react';
import { Shield, Users, TrendingUp, Lock, Clock, Star } from 'lucide-react';

export const PlatformBenefits: React.FC = () => {
  const benefits = [
    {
      icon: Shield,
      title: 'Fiduciary-Driven Platform',
      description: 'Built with fiduciary responsibility at its core, ensuring every tool and recommendation serves your clients\' best interests.',
      gradient: 'from-emerald to-emerald/80'
    },
    {
      icon: Lock,
      title: 'Bank-Level Security',
      description: 'Advanced encryption, multi-factor authentication, and compliance with the highest financial industry standards.',
      gradient: 'from-gold to-gold/80'
    },
    {
      icon: Users,
      title: 'Collaborative Ecosystem',
      description: 'Connect with vetted professionals across disciplines to serve your clients comprehensively.',
      gradient: 'from-emerald to-emerald/80'
    },
    {
      icon: TrendingUp,
      title: 'Growth-Focused Tools',
      description: 'Lead generation, practice management, and revenue optimization tools designed for sustainable growth.',
      gradient: 'from-gold to-gold/80'
    },
    {
      icon: Clock,
      title: 'Time-Saving Automation',
      description: 'Streamline compliance, documentation, and client communications with intelligent automation.',
      gradient: 'from-emerald to-emerald/80'
    },
    {
      icon: Star,
      title: 'Premium Client Experience',
      description: 'Deliver a white-glove experience with branded portals and premium tools that wow your clients.',
      gradient: 'from-gold to-gold/80'
    }
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h3 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-6">
          Why Choose Our Platform?
        </h3>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          More than just software—a comprehensive ecosystem designed to elevate your practice and serve your clients at the highest level.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="group bg-card/50 backdrop-blur-sm border border-border rounded-xl p-8 hover:border-gold/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            {/* Icon */}
            <div className={`w-16 h-16 bg-gradient-to-br ${benefit.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
              <benefit.icon className="w-8 h-8 text-white" />
            </div>

            {/* Content */}
            <h4 className="font-serif text-xl font-bold text-foreground mb-4 group-hover:text-gold transition-colors duration-300">
              {benefit.title}
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              {benefit.description}
            </p>

            {/* Hover Effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gold/5 to-emerald/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
};