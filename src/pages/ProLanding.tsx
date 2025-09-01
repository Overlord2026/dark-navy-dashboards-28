import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Shield, TrendingUp } from 'lucide-react';

interface ProLandingProps {
  title: string;
}

export default function ProLanding({ title }: ProLandingProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-[#D4AF37]">{title}</span> Solutions
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
            Professional tools and services designed for modern practices
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="btn-gold px-8 py-3 text-lg">
              60-Second Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black px-8 py-3 text-lg">
              Explore Tools
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Professional Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bfo-card text-center">
              <Users className="h-12 w-12 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Client Management</h3>
              <p className="text-white/70">Comprehensive client relationship tools</p>
            </Card>
            
            <Card className="bfo-card text-center">
              <Shield className="h-12 w-12 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Compliance Tools</h3>
              <p className="text-white/70">Stay compliant with automated tracking</p>
            </Card>
            
            <Card className="bfo-card text-center">
              <TrendingUp className="h-12 w-12 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Business Analytics</h3>
              <p className="text-white/70">Insights to grow your practice</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join thousands of professionals already using our platform.
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