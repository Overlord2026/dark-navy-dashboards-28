import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Search, BookOpen, Wrench, TrendingUp, DollarSign } from 'lucide-react';
import { CatalogGrid } from '@/components/catalog/CatalogGrid';
import { EduPreview } from '@/components/education/EduPreview';
import { ToolsOverview } from '@/components/tools/ToolsOverview';
import PricingTable from '@/components/pricing/PricingTable';

export default function LandingNew() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-luxury-navy/5 to-background">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            Your Family Office <span className="text-brand-gold">Marketplace</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Connect with elite professionals, access curated solutions, and manage your family's wealth with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-brand-gold hover:bg-brand-gold/90 text-brand-black">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="border-brand-gold text-brand-gold hover:bg-brand-gold/10">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Personas Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Built for Every Family Office Role</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border hover:border-brand-gold/50 transition-colors">
              <CardHeader>
                <Users className="h-12 w-12 text-brand-gold mb-4" />
                <CardTitle>Family Members</CardTitle>
                <CardDescription>
                  Manage investments, plan for the future, and access trusted advisors
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-border hover:border-brand-gold/50 transition-colors">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-brand-gold mb-4" />
                <CardTitle>Advisors & Professionals</CardTitle>
                <CardDescription>
                  Connect with high-net-worth clients and showcase your expertise
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-border hover:border-brand-gold/50 transition-colors">
              <CardHeader>
                <Wrench className="h-12 w-12 text-brand-gold mb-4" />
                <CardTitle>Service Providers</CardTitle>
                <CardDescription>
                  Offer specialized solutions to the family office ecosystem
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Catalog Grid Section */}
      <CatalogGrid />

      {/* Education Preview Section */}
      <EduPreview />

      {/* Tools Overview Section */}
      <ToolsOverview />

      {/* Education Center Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Education Center</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-border">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-brand-gold mb-4" />
                <CardTitle>Learning Library</CardTitle>
                <CardDescription className="mb-4">
                  Access comprehensive guides, whitepapers, and educational content on wealth management topics.
                </CardDescription>
                <Button variant="outline" className="border-brand-gold text-brand-gold hover:bg-brand-gold/10">
                  Explore Library
                </Button>
              </CardHeader>
            </Card>
            
            <Card className="border-border">
              <CardHeader>
                <Users className="h-12 w-12 text-brand-gold mb-4" />
                <CardTitle>Expert Webinars</CardTitle>
                <CardDescription className="mb-4">
                  Join live sessions with industry experts covering market insights and best practices.
                </CardDescription>
                <Button variant="outline" className="border-brand-gold text-brand-gold hover:bg-brand-gold/10">
                  View Schedule
                </Button>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Tools Overview Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Powerful Tools</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border">
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-brand-gold mb-4" />
                <CardTitle>Portfolio Analytics</CardTitle>
                <CardContent className="px-0">
                  <p className="text-muted-foreground">
                    Advanced portfolio analysis and performance tracking tools for informed decision-making.
                  </p>
                </CardContent>
              </CardHeader>
            </Card>
            
            <Card className="border-border">
              <CardHeader>
                <DollarSign className="h-10 w-10 text-brand-gold mb-4" />
                <CardTitle>Tax Optimization</CardTitle>
                <CardContent className="px-0">
                  <p className="text-muted-foreground">
                    Sophisticated tax planning tools to minimize liability and maximize after-tax returns.
                  </p>
                </CardContent>
              </CardHeader>
            </Card>
            
            <Card className="border-border">
              <CardHeader>
                <Search className="h-10 w-10 text-brand-gold mb-4" />
                <CardTitle>Due Diligence</CardTitle>
                <CardContent className="px-0">
                  <p className="text-muted-foreground">
                    Comprehensive research and analysis tools for investment and advisor evaluation.
                  </p>
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-brand-gold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Connect</h3>
              <p className="text-muted-foreground">
                Join our exclusive network of families and professionals
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-brand-gold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Discover</h3>
              <p className="text-muted-foreground">
                Explore curated solutions and trusted service providers
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-brand-gold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Thrive</h3>
              <p className="text-muted-foreground">
                Access tools and expertise to grow and protect your wealth
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Table Section */}
      <PricingTable />

      {/* Pricing Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Membership Plans</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Family Access</CardTitle>
                <CardDescription>Essential tools for family members</CardDescription>
                <div className="text-3xl font-bold text-brand-gold mt-4">
                  Contact Us
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Portfolio tracking</li>
                  <li>• Educational resources</li>
                  <li>• Basic reporting</li>
                  <li>• Community access</li>
                </ul>
                <Button className="w-full mt-6 bg-brand-gold hover:bg-brand-gold/90 text-brand-black">
                  Get Started
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-brand-gold relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-brand-gold text-brand-black px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <CardHeader>
                <CardTitle>Professional</CardTitle>
                <CardDescription>Full access for advisors and professionals</CardDescription>
                <div className="text-3xl font-bold text-brand-gold mt-4">
                  Contact Us
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Everything in Family Access</li>
                  <li>• Client management tools</li>
                  <li>• Advanced analytics</li>
                  <li>• Marketing support</li>
                  <li>• Priority support</li>
                </ul>
                <Button className="w-full mt-6 bg-brand-gold hover:bg-brand-gold/90 text-brand-black">
                  Get Started
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>Custom solutions for large organizations</CardDescription>
                <div className="text-3xl font-bold text-brand-gold mt-4">
                  Custom
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Everything in Professional</li>
                  <li>• White-label options</li>
                  <li>• API access</li>
                  <li>• Dedicated support</li>
                  <li>• Custom integrations</li>
                </ul>
                <Button variant="outline" className="w-full mt-6 border-brand-gold text-brand-gold hover:bg-brand-gold/10">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Ready to Join the Family Office Marketplace?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Connect with the elite network of families and professionals shaping the future of wealth management.
          </p>
          <Button size="lg" className="bg-brand-gold hover:bg-brand-gold/90 text-brand-black">
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}