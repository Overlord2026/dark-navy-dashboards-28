import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import PricingBadge from '@/components/pricing/PricingBadge';
import { 
  Scale, 
  Shield, 
  FileText, 
  Users, 
  DollarSign, 
  CheckCircle, 
  ArrowRight,
  Building,
  Clock,
  TrendingUp
} from 'lucide-react';

export const AttorneyPersonaDeck = () => {
  const slides = [
    {
      id: 1,
      title: "Attorney Pain Points & Market Context",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-destructive/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-destructive" />
                  <CardTitle className="text-sm">Client Expectations</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Increasing demand for digital engagement, secure portals, and real-time communication
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-orange-500/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-orange-500" />
                  <CardTitle className="text-sm">Compliance Burden</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Rising requirements for document retention, communication logging, and audit trails
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-yellow-500/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-yellow-500" />
                  <CardTitle className="text-sm">Fragmented Tools</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Separate CRM, document automation, compliance tracking, and billing systems
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Market Reality</h3>
            <p className="text-sm text-muted-foreground">
              Legal practices need integrated solutions that maintain compliance while delivering 
              modern client experiences and operational efficiency.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Platform Capabilities for Attorneys",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" />
                  <CardTitle className="text-sm">Legal CRM</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Client intake, matter tracking, secure messaging, and billing integration
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle className="text-sm">Estate Planning Suite</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Advanced calculators, workflow automation, and document generation
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <CardTitle className="text-sm">SWAG™ Retirement Roadmap</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Integrated legal/financial planning for HNW clients
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <CardTitle className="text-sm">Linda AI Assistant</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Voice/SMS scheduling, meeting summaries, and automated follow-up
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="border-secondary/20">
            <CardHeader>
              <CardTitle className="text-lg">Additional Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Automated profile creation from referral/intake data
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Document Vault with privilege protection
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Comprehensive audit trails for all communications
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 3,
      title: "Attorney Workflow Example",
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-center mb-6">
            <Badge variant="outline" className="text-lg px-4 py-2">
              End-to-End Client Journey
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {[
              { step: 1, title: "Client Referral", desc: "Referral form or campaign capture" },
              { step: 2, title: "Auto Profile", desc: "Automated intake & matter tagging" },
              { step: 3, title: "Portal Invite", desc: "Secure portal with document checklist" },
              { step: 4, title: "AI Scheduling", desc: "Linda AI books consultation" },
              { step: 5, title: "Estate Planning", desc: "Suite engagement & automation" },
              { step: 6, title: "SWAG™ Integration", desc: "Financial planning crossover" },
              { step: 7, title: "Compliance Archive", desc: "Automated documentation" }
            ].map((item, index) => (
              <div key={item.step} className="text-center">
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mx-auto mb-2">
                  {item.step}
                </div>
                <h4 className="font-semibold text-xs mb-1">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
                {index < 6 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground mx-auto mt-2" />
                )}
              </div>
            ))}
          </div>
          
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="font-semibold mb-2">Result: Streamlined Practice</h3>
                <p className="text-sm text-muted-foreground">
                  From initial contact to compliance archiving, our platform automates your entire 
                  client lifecycle while maintaining the highest security and regulatory standards.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 4,
      title: "ROI & TCO Comparison",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-destructive" />
                  Current Cost Structure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Clio (Case Management)</span>
                    <span className="text-sm font-semibold">$89/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Estate Planning Software</span>
                    <span className="text-sm font-semibold">$129/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Compliance Tools</span>
                    <span className="text-sm font-semibold">$79/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Document Storage</span>
                    <span className="text-sm font-semibold">$39/mo</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total Monthly Cost</span>
                    <span className="text-destructive">$336/mo</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-green-500/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Our Platform
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <PricingBadge planKey="advisor_premium" />
                    <span className="text-sm font-semibold">$199/mo</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Includes: Legal CRM, Estate Planning Suite, SWAG™ Roadmap, 
                    Linda AI, Document Vault, Compliance Tools
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-green-600">
                    <span>Monthly Savings</span>
                    <span>$137/mo</span>
                  </div>
                  <div className="flex justify-between font-bold text-green-600">
                    <span>Annual Savings</span>
                    <span>$1,644/year</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3">Competitive Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold">Clio</h4>
                  <p className="text-muted-foreground">Strong case management, lacks financial planning integration</p>
                </div>
                <div>
                  <h4 className="font-semibold">PracticePanther</h4>
                  <p className="text-muted-foreground">Solid automation, limited estate planning depth</p>
                </div>
                <div>
                  <h4 className="font-semibold">WealthCounsel</h4>
                  <p className="text-muted-foreground">Strong estate docs, lacks CRM integration</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 5,
      title: "Case Study Example",
      content: (
        <div className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl">Estate Planning Firm Success Story</CardTitle>
              <p className="text-muted-foreground">Mid-sized practice with 15 attorneys</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-green-100 text-green-800 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-3">
                    35%
                  </div>
                  <h3 className="font-semibold">Client Throughput</h3>
                  <p className="text-sm text-muted-foreground">Increased by 35% with automated workflows</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-16 h-16 flex items-center justify-center text-lg font-bold mx-auto mb-3">
                    2W→2D
                  </div>
                  <h3 className="font-semibold">Compliance Prep</h3>
                  <p className="text-sm text-muted-foreground">Audit preparation reduced from 2 weeks to 2 days</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-100 text-purple-800 rounded-full w-16 h-16 flex items-center justify-center text-lg font-bold mx-auto mb-3">
                    $750K
                  </div>
                  <h3 className="font-semibold">New Revenue</h3>
                  <p className="text-sm text-muted-foreground">Annual revenue from integrated financial planning</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Implementation Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Month 1-2: Setup & Training</h4>
                    <p className="text-sm text-muted-foreground">Platform configuration, data migration, team training</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Month 3-6: Process Optimization</h4>
                    <p className="text-sm text-muted-foreground">Workflow refinement, automation deployment</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Month 6+: Scale & Expand</h4>
                    <p className="text-sm text-muted-foreground">Full ROI realization, new service offerings</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 6,
      title: "Attorney Pricing & Bundles",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-lg">Basic</CardTitle>
                <div className="text-3xl font-bold">$69<span className="text-lg font-normal">/mo</span></div>
                <p className="text-sm text-muted-foreground">Perfect for solo practitioners</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Secure Client Portal
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    CLE Tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Document Vault
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Basic Compliance Tools
                  </li>
                </ul>
                <Button className="w-full mt-4" variant="outline">Get Started</Button>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-primary relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary">Most Popular</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-lg">Pro</CardTitle>
                <div className="text-3xl font-bold">$129<span className="text-lg font-normal">/mo</span></div>
                <p className="text-sm text-muted-foreground">For growing practices</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Everything in Basic
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Legal CRM
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Document Automation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Advanced Estate Planning
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Workflow Automation
                  </li>
                </ul>
                <Button className="w-full mt-4">Start Pro Trial</Button>
              </CardContent>
            </Card>
            
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-lg">Premium</CardTitle>
                <div className="text-3xl font-bold">$199<span className="text-lg font-normal">/mo</span></div>
                <p className="text-sm text-muted-foreground">Full-service firms</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Everything in Pro
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    SWAG™ Retirement Roadmap
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Linda AI Assistant
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    White-label Branding
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Advanced Analytics
                  </li>
                </ul>
                <Button className="w-full mt-4" variant="outline">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-secondary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="font-semibold mb-2">30-Day Free Trial</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Try any plan risk-free with full access to all features. No credit card required.
                </p>
                <Button>Start Your Free Trial</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 7,
      title: "Compliance & Security",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" />
                  Legal Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span><strong>ABA Model Rule 1.6</strong> - Client confidentiality protection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span><strong>State Bar Compliance</strong> - Meets all state requirements</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span><strong>SEC/FINRA Ready</strong> - For dual-licensed advisors</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span><strong>Automated Retention</strong> - Document lifecycle management</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-secondary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-secondary" />
                  Data Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span><strong>SOC 2 Type II</strong> - Certified secure cloud storage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span><strong>GDPR/CCPA</strong> - Privacy regulation compliant</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span><strong>End-to-End Encryption</strong> - All data in transit & at rest</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span><strong>Audit Trails</strong> - Complete activity logging</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Automated Compliance</h3>
                  <p className="text-sm text-muted-foreground">
                    Scheduled retention policies and destruction workflows
                  </p>
                </div>
                <div className="text-center">
                  <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Complete Audit Trails</h3>
                  <p className="text-sm text-muted-foreground">
                    Every action, communication, and document change logged
                  </p>
                </div>
                <div className="text-center">
                  <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Privilege Protection</h3>
                  <p className="text-sm text-muted-foreground">
                    Attorney-client privilege safeguards built into every feature
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Ready for Your Next Audit</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Our platform generates comprehensive compliance reports in minutes, not weeks. 
                All client communications, document access, and system activity are automatically 
                logged with timestamps and user attribution.
              </p>
              <Button>
                Schedule Compliance Demo
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }
  ];

  const [currentSlide, setCurrentSlide] = React.useState(0);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Attorney Persona Deck
        </h1>
        <p className="text-muted-foreground mt-2">
          Complete legal practice transformation platform
        </p>
      </div>

      <div className="mb-6">
        <div className="flex space-x-2 overflow-x-auto">
          {slides.map((slide, index) => (
            <Button
              key={slide.id}
              variant={currentSlide === index ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentSlide(index)}
              className="whitespace-nowrap"
            >
              {slide.id}. {slide.title}
            </Button>
          ))}
        </div>
      </div>

      <Card className="min-h-[600px]">
        <CardHeader>
          <CardTitle className="text-2xl">{slides[currentSlide].title}</CardTitle>
        </CardHeader>
        <CardContent>
          {slides[currentSlide].content}
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
          disabled={currentSlide === 0}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground flex items-center">
          Slide {currentSlide + 1} of {slides.length}
        </span>
        <Button
          variant="outline"
          onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
          disabled={currentSlide === slides.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
};