/**
 * Professional Advisor Platform Dashboard
 * Enterprise-grade dashboard matching the premium design from screenshots
 */

import React from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  Shield,
  Clock,
  Target,
  Star,
  Play
} from 'lucide-react';
import { ProfessionalMetricCard } from '../components/ProfessionalMetricCard';
import { ProfessionalFeatureCard } from '../components/ProfessionalFeatureCard';
import { ProfessionalTestimonial } from '../components/ProfessionalTestimonial';
import Breadcrumbs from '@/components/nav/Breadcrumbs';

export default function AdvisorPlatformDashboard() {
  return (
    <div className="min-h-screen bg-bfo-navy-dark p-4 space-y-8">
      {/* Breadcrumbs */}
      <div className="mb-4">
        <Breadcrumbs />
      </div>
      
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-white text-4xl font-bold">Advisor Platform</h1>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          Transform your prospect management and accelerate your sales process
        </p>
        <button className="bfo-btn-gold">
          Access Advisor Platform
        </button>
      </div>

      {/* Key Performance Metrics */}
      <div className="space-y-4">
        <h2 className="text-white text-2xl font-semibold mb-6">Key Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProfessionalMetricCard
            title="Conversion Rate"
            value="18.7%"
            change="3.2%"
            changeType="positive"
            subtitle="vs. last quarter"
            icon={TrendingUp}
          />
          <ProfessionalMetricCard
            title="New Clients"
            value="24"
            change="6"
            changeType="positive"
            subtitle="vs. last quarter"
            icon={Users}
          />
          <ProfessionalMetricCard
            title="AUM Growth"
            value="$42.5M"
            change="$12.3M"
            changeType="positive"
            subtitle="vs. last quarter"
            icon={DollarSign}
          />
        </div>
      </div>

      {/* Testimonial */}
      <ProfessionalTestimonial
        quote="With Advisor Lead Alchemy, what used to be hours of prospect management now takes just minutes. Our conversion rates have increased by 40%."
        author="Jack Csenge"
        title="CFP"
        company="Csenge Advisory Group"
      />

      {/* Trusted By */}
      <div className="text-center space-y-4">
        <p className="text-white/60">Trusted by leading advisory firms</p>
        <div className="flex justify-center items-center gap-8 text-white/40 text-sm">
          <span>LPL Financial</span>
          <span>Sanctuary</span>
          <span>Mission Wealth</span>
        </div>
      </div>

      {/* Advisor Advantages */}
      <div className="space-y-6">
        <h2 className="text-white text-2xl font-semibold">Advisor advantages</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProfessionalFeatureCard
            title="Streamlined prospect management"
            features={[
              "Track and manage prospects effortlessly",
              "Never let a valuable lead slip through the cracks"
            ]}
            icon={Users}
          />
          <ProfessionalFeatureCard
            title="Optimize your sales process"
            features={[
              "Reduce admin work by 85%",
              "Focus on building client relationships, not paperwork"
            ]}
            icon={Clock}
          />
          <ProfessionalFeatureCard
            title="Maintain compliance"
            features={[
              "Audit-friendly prospect tracking",
              "You control client data and retention"
            ]}
            icon={Shield}
          />
          <ProfessionalFeatureCard
            title="Future-proof your advisory practice"
            features={[
              "Advanced analytics for pipeline optimization",
              "Regular new features based on advisor feedback"
            ]}
            icon={Star}
          />
        </div>
      </div>

      {/* Video Demo Section */}
      <div className="bfo-card text-center space-y-6">
        <h2 className="text-white text-2xl font-semibold">
          See Advisor Lead Alchemy in action
        </h2>
        <p className="text-white/70">
          Watch our 60-second walkthrough to see how easy it is.
        </p>
        
        <div className="relative aspect-video bg-bfo-navy-light rounded-lg overflow-hidden max-w-2xl mx-auto">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-bfo-navy to-bfo-navy-light">
            <div className="text-center space-y-4">
              <button className="w-16 h-16 bg-bfo-gold rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                <Play className="w-8 h-8 text-bfo-navy ml-1" />
              </button>
              <p className="text-white/90 font-medium">
                See how Advisor Lead Alchemy transforms your prospecting workflow
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics Cards */}
      <div className="space-y-4">
        <h3 className="text-white text-xl font-semibold">Additional Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ProfessionalMetricCard
            title="Active Prospects"
            value="28"
            change="5%"
            changeType="positive"
            subtitle="this month"
            icon={Users}
          />
          <ProfessionalMetricCard
            title="Meetings Scheduled"
            value="15"
            change="20%"
            changeType="positive"
            subtitle="this month"
            icon={Calendar}
          />
          <ProfessionalMetricCard
            title="Conversions"
            value="8"
            change="12%"
            changeType="positive"
            subtitle="this month"
            icon={Target}
          />
          <ProfessionalMetricCard
            title="Total Ad Spend"
            value="$24,650.00"
            change="12.5%"
            changeType="positive"
            subtitle="vs. previous"
            icon={DollarSign}
          />
        </div>
      </div>
    </div>
  );
}