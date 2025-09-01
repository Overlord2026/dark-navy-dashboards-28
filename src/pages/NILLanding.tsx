import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Users, DollarSign, Shield, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NILLanding() {
  return (
    <div className="min-h-screen bg-[hsl(var(--bfo-bg))] text-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 text-[var(--bfo-gold)]">
            NIL Marketplace
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Connect student-athletes with brand opportunities. Secure, compliant, and transparent NIL deals for the next generation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild className="btn-gold text-lg px-8 py-3">
              <Link to="/demos/nil-search">
                <Trophy className="mr-2 h-5 w-5" />
                60-sec Demo
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-[var(--bfo-gold)] text-[var(--bfo-gold)] hover:bg-[var(--bfo-gold)] hover:text-black text-lg px-8 py-3">
              <Link to="/nil/marketplace">
                Explore Tools
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-[var(--bfo-gold)]">
            Why Athletes Choose Our Platform
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bfo-card">
              <CardHeader>
                <CardTitle className="flex items-center text-[var(--bfo-gold)]">
                  <Shield className="mr-3 h-6 w-6" />
                  Compliance First
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">
                  Built-in NCAA, state, and university compliance checking. Every deal is automatically vetted for eligibility.
                </p>
              </CardContent>
            </Card>

            <Card className="bfo-card">
              <CardHeader>
                <CardTitle className="flex items-center text-[var(--bfo-gold)]">
                  <Users className="mr-3 h-6 w-6" />
                  Quality Brands
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">
                  Connect with verified local and national brands looking for authentic athlete partnerships.
                </p>
              </CardContent>
            </Card>

            <Card className="bfo-card">
              <CardHeader>
                <CardTitle className="flex items-center text-[var(--bfo-gold)]">
                  <DollarSign className="mr-3 h-6 w-6" />
                  Fair Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">
                  Transparent pricing tools and market data to ensure you get fair compensation for your NIL value.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Athletes Success Stories */}
      <section className="py-16 px-4 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-[var(--bfo-gold)]">
            Success Stories
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bfo-card">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-[var(--bfo-gold)]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-white/70 text-sm">Basketball • SEC</span>
                </div>
                <p className="text-white/80 mb-4">
                  "Secured 3 local sponsorships in my first month. The compliance checking gave me confidence every deal was clean."
                </p>
                <p className="text-[var(--bfo-gold)] font-semibold">Sarah M.</p>
              </CardContent>
            </Card>

            <Card className="bfo-card">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-[var(--bfo-gold)]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-white/70 text-sm">Football • Big 10</span>
                </div>
                <p className="text-white/80 mb-4">
                  "The platform helped me understand my market value and negotiate better deals. Made $15K this semester."
                </p>
                <p className="text-[var(--bfo-gold)] font-semibold">Marcus T.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-[var(--bfo-gold)]">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--bfo-gold)] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Create Profile</h3>
              <p className="text-white/70 text-sm">Build your athlete profile with stats, achievements, and social media.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--bfo-gold)] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Get Discovered</h3>
              <p className="text-white/70 text-sm">Brands find you based on sport, location, following, and demographics.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--bfo-gold)] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Negotiate Deal</h3>
              <p className="text-white/70 text-sm">Use our tools to negotiate fair terms with automatic compliance checking.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--bfo-gold)] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Get Paid</h3>
              <p className="text-white/70 text-sm">Execute campaigns and receive secure payments through our platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-black/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-[var(--bfo-gold)]">
            Ready to Monetize Your NIL?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join thousands of student-athletes already earning from their Name, Image, and Likeness.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-gold text-lg px-8 py-3">
              <Link to="/nil/onboarding">
                Get Started Free
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-3">
              <Link to="/learn">
                Learn More
              </Link>
            </Button>
          </div>
          
          <p className="text-white/60 text-sm mt-6">
            Free to join • No upfront costs • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}