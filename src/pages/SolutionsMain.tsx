import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Target, Shield, Zap } from 'lucide-react';

export default function SolutionsLanding() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Comprehensive <span className="text-[#D4AF37]">Solutions</span> for Modern Families
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
            Integrated financial services, healthcare coordination, and lifestyle management
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="btn-gold px-8 py-3 text-lg">
              60-Second Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black px-8 py-3 text-lg">
              Explore Solutions
            </Button>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Solution Portfolio</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bfo-card text-center">
              <Target className="h-12 w-12 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Financial Planning</h3>
              <p className="text-white/70">Comprehensive wealth management and retirement planning solutions</p>
            </Card>
            
            <Card className="bfo-card text-center">
              <Shield className="h-12 w-12 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Healthcare Coordination</h3>
              <p className="text-white/70">Integrated healthcare planning and advocacy services</p>
            </Card>
            
            <Card className="bfo-card text-center">
              <Zap className="h-12 w-12 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Lifestyle Management</h3>
              <p className="text-white/70">Concierge services and family office administration</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Solutions */}
      <section className="py-16 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Solutions</h2>
          <div className="space-y-8">
            <Card className="bfo-card">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-3">Family Office as a Service</h3>
                  <p className="text-white/80 mb-4">
                    Complete family office infrastructure without the overhead. Access institutional-grade 
                    services designed for high-net-worth families.
                  </p>
                  <Button className="btn-gold">Learn More</Button>
                </div>
                <div className="w-32 h-32 bg-[#D4AF37]/20 rounded-lg flex items-center justify-center">
                  <Shield className="h-16 w-16 text-[#D4AF37]" />
                </div>
              </div>
            </Card>

            <Card className="bfo-card">
              <div className="flex flex-col md:flex-row-reverse items-center gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-3">Integrated Healthcare Platform</h3>
                  <p className="text-white/80 mb-4">
                    Healthcare advocacy, medical records management, and coordination with top specialists 
                    nationwide.
                  </p>
                  <Button className="btn-gold">Explore Healthcare</Button>
                </div>
                <div className="w-32 h-32 bg-[#D4AF37]/20 rounded-lg flex items-center justify-center">
                  <Target className="h-16 w-16 text-[#D4AF37]" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Elevate Your Family's Future?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Schedule a consultation to discuss your family's unique needs and goals.
          </p>
          <Button className="btn-gold px-8 py-3 text-lg">
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}