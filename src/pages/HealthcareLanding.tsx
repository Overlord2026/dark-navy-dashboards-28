import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Shield, FileText, Users, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HealthcareLanding() {
  return (
    <div className="min-h-screen bg-[hsl(var(--bfo-bg))] text-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 text-[var(--bfo-gold)]">
            Healthcare Solutions
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Comprehensive healthcare management tools for providers, patients, and families. Streamline care coordination and improve outcomes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild className="btn-gold text-lg px-8 py-3">
              <Link to="/demos/healthcare">
                <Heart className="mr-2 h-5 w-5" />
                60-sec Demo
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-[var(--bfo-gold)] text-[var(--bfo-gold)] hover:bg-[var(--bfo-gold)] hover:text-black text-lg px-8 py-3">
              <Link to="/healthcare/tools">
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
            Healthcare Management Made Simple
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bfo-card">
              <CardHeader>
                <CardTitle className="flex items-center text-[var(--bfo-gold)]">
                  <FileText className="mr-3 h-6 w-6" />
                  Health Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">
                  Secure, compliant health record management with easy sharing between providers and family members.
                </p>
              </CardContent>
            </Card>

            <Card className="bfo-card">
              <CardHeader>
                <CardTitle className="flex items-center text-[var(--bfo-gold)]">
                  <Users className="mr-3 h-6 w-6" />
                  Care Coordination
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">
                  Connect your care team - doctors, specialists, family members, and caregivers in one platform.
                </p>
              </CardContent>
            </Card>

            <Card className="bfo-card">
              <CardHeader>
                <CardTitle className="flex items-center text-[var(--bfo-gold)]">
                  <Shield className="mr-3 h-6 w-6" />
                  HIPAA Compliant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">
                  Bank-level security with full HIPAA compliance. Your health information stays private and secure.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-4 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-[var(--bfo-gold)]">
            Built for Your Healthcare Journey
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bfo-card">
              <CardHeader>
                <CardTitle className="text-[var(--bfo-gold)]">For Families</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-[var(--bfo-gold)] mr-2" />
                  <span className="text-white/80">Track medications and appointments</span>
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-[var(--bfo-gold)] mr-2" />
                  <span className="text-white/80">Organize medical records</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-[var(--bfo-gold)] mr-2" />
                  <span className="text-white/80">Coordinate care for elderly parents</span>
                </div>
                <div className="flex items-center">
                  <Heart className="h-4 w-4 text-[var(--bfo-gold)] mr-2" />
                  <span className="text-white/80">Emergency health information access</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bfo-card">
              <CardHeader>
                <CardTitle className="text-[var(--bfo-gold)]">For Providers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-[var(--bfo-gold)] mr-2" />
                  <span className="text-white/80">Secure patient communication</span>
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-[var(--bfo-gold)] mr-2" />
                  <span className="text-white/80">Streamlined documentation</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-[var(--bfo-gold)] mr-2" />
                  <span className="text-white/80">Care team collaboration</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-[var(--bfo-gold)] mr-2" />
                  <span className="text-white/80">Appointment and follow-up management</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-[var(--bfo-gold)]">
            Better Healthcare Outcomes
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--bfo-gold)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Improved Care</h3>
              <p className="text-white/70 text-sm">Better coordination leads to improved health outcomes and patient satisfaction.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--bfo-gold)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Time Savings</h3>
              <p className="text-white/70 text-sm">Reduce administrative burden with automated workflows and smart scheduling.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--bfo-gold)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Peace of Mind</h3>
              <p className="text-white/70 text-sm">Know your health information is secure and accessible when you need it most.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--bfo-gold)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Connected Care</h3>
              <p className="text-white/70 text-sm">Keep everyone involved in your care connected and informed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-black/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-[var(--bfo-gold)]">
            Take Control of Your Healthcare
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join thousands of families and providers using our platform to improve healthcare coordination and outcomes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-gold text-lg px-8 py-3">
              <Link to="/healthcare/onboarding">
                Get Started Free
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-3">
              <Link to="/learn/healthcare">
                Learn More
              </Link>
            </Button>
          </div>
          
          <p className="text-white/60 text-sm mt-6">
            HIPAA Compliant • Free to start • Enterprise solutions available
          </p>
        </div>
      </section>
    </div>
  );
}