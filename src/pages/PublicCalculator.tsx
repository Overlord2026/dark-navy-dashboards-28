import React, { useState } from 'react';
import { PublicValueCalculator } from '@/components/PublicValueCalculator';
import { SubscriptionComparison } from '@/components/SubscriptionComparison';
import { EducationalResources } from '@/components/EducationalResources';
import { PremiumFeaturePreview } from '@/components/PremiumFeaturePreview';
import { ValueModal } from '@/components/ValueModal';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';
import { Calculator, UserPlus, Star, Shield, TrendingUp } from 'lucide-react';

export default function PublicCalculator() {
  const navigate = useNavigate();
  const [showValueModal, setShowValueModal] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo variant="tree" onClick={() => navigate('/')} />
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/auth')}
              size="sm"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => navigate('/auth')}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="space-y-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              A Boutique Family Office—Now for Every Family
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Unlock holistic planning, proactive tax strategy, legacy management, and private investments—once reserved for the ultra-wealthy. All delivered with transparent, value-driven pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6"
                 onClick={() => window.open('https://calendly.com/tonygomes/talk-with-tony', '_blank')}
              >
                Book My Complimentary Family Office Review
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-6"
                onClick={() => setShowValueModal(true)}
              >
                Try the Fee Calculator Now
              </Button>
            </div>
          </div>
        </section>

        {/* What You Get Section */}
        <section className="bg-card/30 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Everything You Need. All in One Place.
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Experience a single platform for managing your investments, taxes, retirement income, estate, and even healthcare. Discover how our holistic, fiduciary approach can simplify and elevate your family's financial life.
              </p>
            </div>
            <SubscriptionComparison />
          </div>
        </section>

        {/* Why Families Choose Us */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Why Families Choose Us
            </h2>
            <div className="max-w-4xl mx-auto space-y-6">
              <p className="text-lg text-muted-foreground">
                Our clients receive proactive tax and retirement income planning, digital legacy management, and transparent, value-driven pricing—typically for the same or less than just investment management at traditional firms.
              </p>
              <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full border border-primary/20">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">Fiduciary. No commissions. No conflicts. Your interests first.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Find Out What You're Really Paying
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Use our fee comparison calculator to see how your current advisory fees stack up—and how much more you could be getting for your money with a true family office approach.
            </p>
          </div>
          <PublicValueCalculator />
        </section>

        {/* Educational Resources */}
        <section className="bg-card/30 py-16">
          <div className="container mx-auto px-4">
            <EducationalResources />
          </div>
        </section>

        {/* Premium Features Preview */}
        <section className="container mx-auto px-4 py-16">
          <PremiumFeaturePreview />
        </section>

        {/* Final CTA */}
        <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Ready to Take the Next Step?
              </h2>
              <p className="text-lg text-muted-foreground">
                You don't need to be a client to benefit. Explore our tools, download expert guides, and use the calculator. When you're ready, schedule a no-obligation call to discover your custom proposal—tailored to your needs, service preferences, and goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6"
                   onClick={() => window.open('https://calendly.com/tonygomes/talk-with-tony', '_blank')}
                >
                  Book My Complimentary Family Office Review
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  See All Features & Pricing
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/30 py-8">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2024 BFO. Actual pricing and services vary by client. Calculator for illustration only.</p>
          <p className="mt-2">
            For a custom proposal, please{' '}
            <button 
              onClick={() => window.open('https://calendly.com/tonygomes/talk-with-tony', '_blank')}
              className="text-primary hover:underline"
            >
              schedule a review
            </button>
            .
          </p>
        </div>
      </footer>

      {/* Value Modal */}
      <ValueModal open={showValueModal} onClose={() => setShowValueModal(false)} />
    </div>
  );
}