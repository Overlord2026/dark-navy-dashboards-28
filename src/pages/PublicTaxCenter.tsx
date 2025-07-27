import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Calculator, 
  Download, 
  Calendar, 
  BookOpen, 
  Users, 
  TrendingUp,
  FileText,
  CheckCircle,
  ArrowRight,
  Mail
} from "lucide-react";
import { TaxReadinessAssessment } from "@/components/tax-planning/TaxReadinessAssessment";
import { analytics } from "@/lib/analytics";

const educationalResources = [
  {
    id: 'tax-planning-guide',
    title: '2024 Tax Planning Guide',
    description: 'Complete guide to tax optimization strategies and year-end planning',
    type: 'PDF Guide',
    downloadUrl: '/downloads/tax-planning-guide-2024.pdf',
    featured: true
  },
  {
    id: 'deduction-checklist',
    title: 'Ultimate Deduction Checklist',
    description: 'Comprehensive list of tax deductions you might be missing',
    type: 'Checklist',
    downloadUrl: '/downloads/deduction-checklist.pdf'
  },
  {
    id: 'small-business-tax',
    title: 'Small Business Tax Strategies',
    description: 'Tax planning essentials for entrepreneurs and small business owners',
    type: 'Guide',
    downloadUrl: '/downloads/small-business-tax-guide.pdf'
  },
  {
    id: 'retirement-tax-planning',
    title: 'Retirement Tax Planning',
    description: 'Optimize your retirement accounts and minimize taxes in retirement',
    type: 'Guide',
    downloadUrl: '/downloads/retirement-tax-planning.pdf'
  }
];

const upcomingWebinars = [
  {
    id: 'year-end-strategies',
    title: 'Year-End Tax Strategies',
    date: '2024-12-15',
    time: '2:00 PM EST',
    presenter: 'Sarah Johnson, CPA',
    registrationUrl: 'https://calendly.com/tonygomes/webinar-tax-strategies'
  },
  {
    id: 'roth-conversions',
    title: 'Roth Conversion Masterclass',
    date: '2024-12-20',
    time: '1:00 PM EST',
    presenter: 'Michael Chen, CFP',
    registrationUrl: 'https://calendly.com/tonygomes/webinar-roth-conversions'
  }
];

export default function PublicTaxCenter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleDownload = (resourceId: string, title: string) => {
    analytics.track('tax_resource_download', {
      resource_id: resourceId,
      resource_title: title,
      source: 'public_tax_center'
    });
    
    // In production, trigger actual download
    console.log(`Download ${title}`);
  };

  const handleWebinarRegistration = (webinarId: string, title: string) => {
    analytics.track('webinar_registration_clicked', {
      webinar_id: webinarId,
      webinar_title: title,
      source: 'public_tax_center'
    });
    
    window.open("https://calendly.com/tonygomes/talk-with-tony", "_blank");
  };

  const handleNewsletterSignup = () => {
    if (!email) return;
    
    setSubscribed(true);
    analytics.track('newsletter_signup', {
      email,
      source: 'public_tax_center',
      list_type: 'tax_planning'
    });
  };

  const handleGetStarted = () => {
    analytics.track('cta_clicked', {
      cta_type: 'get_started',
      source: 'public_tax_center'
    });
    
    // In production, navigate to signup or consultation booking
    window.open("https://calendly.com/tonygomes/talk-with-tony", "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Master Your Tax Strategy
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Free resources, expert insights, and professional guidance to optimize your tax situation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={handleGetStarted}>
                <Calendar className="mr-2 h-5 w-5" />
                Schedule Free Consultation
              </Button>
              <Button size="lg" variant="outline">
                <Calculator className="mr-2 h-5 w-5" />
                Try Free Tax Calculator
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Tax Readiness Assessment */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Free Tax Readiness Assessment</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Take our 5-minute assessment to evaluate your tax preparation status and identify optimization opportunities
            </p>
          </div>
          <TaxReadinessAssessment />
        </section>

        {/* Educational Resources */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Free Tax Planning Resources</h2>
            <p className="text-muted-foreground">
              Download our expert-created guides and checklists to optimize your tax strategy
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {educationalResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <FileText className="h-8 w-8 text-primary" />
                    {resource.featured && (
                      <Badge className="bg-yellow-500 text-yellow-50">Featured</Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{resource.type}</Badge>
                    <Button 
                      size="sm"
                      onClick={() => handleDownload(resource.id, resource.title)}
                    >
                      <Download className="mr-1 h-3 w-3" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Upcoming Webinars */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Upcoming Webinars</h2>
            <p className="text-muted-foreground">
              Join our live sessions with tax experts to learn advanced strategies
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {upcomingWebinars.map((webinar) => (
              <Card key={webinar.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <Users className="h-6 w-6 text-primary mt-1" />
                    <div className="flex-1">
                      <CardTitle>{webinar.title}</CardTitle>
                      <CardDescription className="mt-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(webinar.date).toLocaleDateString()} at {webinar.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3" />
                            <span>Presented by {webinar.presenter}</span>
                          </div>
                        </div>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full"
                    onClick={() => handleWebinarRegistration(webinar.id, webinar.title)}
                  >
                    Register Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="bg-muted/50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated on Tax Changes</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Get weekly insights, tax law updates, and planning strategies delivered to your inbox
          </p>
          
          {!subscribed ? (
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleNewsletterSignup} disabled={!email}>
                <Mail className="mr-2 h-4 w-4" />
                Subscribe
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Thanks for subscribing! Check your email for confirmation.</span>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="text-center bg-primary/5 rounded-2xl p-8">
          <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Ready to Optimize Your Tax Strategy?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Connect with our network of verified tax professionals for personalized guidance and advanced planning strategies
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleGetStarted}>
              <Calendar className="mr-2 h-5 w-5" />
              Schedule Consultation
            </Button>
            <Button size="lg" variant="outline">
              <BookOpen className="mr-2 h-5 w-5" />
              Explore Premium Tools
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}