import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PricingBadge from '@/components/pricing/PricingBadge';
import { 
  Check, X, Shield, ArrowRight, Calculator, FileText, Clock, 
  TrendingUp, DollarSign, Users, AlertTriangle, CheckCircle2,
  Award, Building, Database, BarChart3, Zap, Lock
} from 'lucide-react';

const Slide = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`min-h-screen w-full flex flex-col justify-center items-center p-8 bg-gradient-to-br from-surface via-navy to-cardBg ${className}`}>
    {children}
  </div>
);

const ToolIcon = ({ type }: { type: string }) => {
  const icons = {
    portal: <Lock className="h-8 w-8 text-gold" />,
    tax: <Calculator className="h-8 w-8 text-aqua" />,
    roadmap: <TrendingUp className="h-8 w-8 text-success" />,
    ai: <Zap className="h-8 w-8 text-gold" />,
    crm: <Users className="h-8 w-8 text-aqua" />,
    estate: <FileText className="h-8 w-8 text-success" />,
    compliance: <Shield className="h-8 w-8 text-gold" />,
    analytics: <BarChart3 className="h-8 w-8 text-aqua" />
  };
  return icons[type as keyof typeof icons] || <FileText className="h-8 w-8 text-gold" />;
};

export default function CPAPersonaDeck() {
  return (
    <div className="deck-container font-body text-textPrimary">
      {/* Slide 1: CPA Pain Points & Industry Context */}
      <Slide className="text-center">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-6">
            <h1 className="text-6xl font-bold text-textPrimary leading-tight">
              <span className="text-gold">CPA Practice Transformation</span><br />
              From Overwhelmed to Optimized
            </h1>
            <p className="text-2xl text-textSecondary max-w-4xl mx-auto leading-relaxed">
              Stop juggling multiple systems and start delivering strategic value to your clients
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
            {/* Left: Current Pain Points */}
            <div className="bg-red-950/20 rounded-2xl p-8 border border-red-500/30">
              <h3 className="text-2xl font-bold text-red-400 mb-6 flex items-center">
                <AlertTriangle className="h-6 w-6 mr-3" />
                Current CPA Challenges
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Clock className="h-6 w-6 text-red-400 mt-1" />
                  <div>
                    <span className="text-lg font-semibold block">Seasonal Workload Spikes</span>
                    <span className="text-sm text-textSecondary">80+ hour weeks during tax season</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Database className="h-6 w-6 text-red-400 mt-1" />
                  <div>
                    <span className="text-lg font-semibold block">Client Data Chaos</span>
                    <span className="text-sm text-textSecondary">Scattered documents, multiple systems</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <DollarSign className="h-6 w-6 text-red-400 mt-1" />
                  <div>
                    <span className="text-lg font-semibold block">Limited Cross-Sell Services</span>
                    <span className="text-sm text-textSecondary">Stuck in compliance-only mode</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-red-400 mt-1" />
                  <div>
                    <span className="text-lg font-semibold block">Compliance Burden</span>
                    <span className="text-sm text-textSecondary">IRS/state regs, retention rules</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Industry Context */}
            <div className="bg-cardBg/50 rounded-2xl p-8 border border-border">
              <h3 className="text-2xl font-bold text-gold mb-6">Industry Reality</h3>
              <div className="space-y-6">
                <div className="bg-surface/30 rounded-lg p-4">
                  <div className="text-3xl font-bold text-gold">73%</div>
                  <div className="text-sm text-textSecondary">of CPAs work 50+ hours during peak season</div>
                </div>
                <div className="bg-surface/30 rounded-lg p-4">
                  <div className="text-3xl font-bold text-aqua">$150K</div>
                  <div className="text-sm text-textSecondary">average lost revenue per year from missed advisory opportunities</div>
                </div>
                <div className="bg-surface/30 rounded-lg p-4">
                  <div className="text-3xl font-bold text-success">45%</div>
                  <div className="text-sm text-textSecondary">client retention improvement with integrated wealth planning</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Slide>

      {/* Slide 2: Platform Capabilities for CPAs */}
      <Slide>
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold text-textPrimary">
              Everything CPAs need to <span className="text-gold">scale and serve</span>
            </h1>
            <p className="text-xl text-textSecondary">Integrated tools that transform your practice from reactive to strategic</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-cardBg/50 border-border p-6 hover:border-gold/50 transition-colors">
              <div className="flex items-center space-x-4 mb-4">
                <ToolIcon type="portal" />
                <h3 className="text-xl font-bold">Secure Client Portal</h3>
              </div>
              <p className="text-textSecondary">Encrypted document vault with permission-based access and audit trails</p>
            </Card>

            <Card className="bg-cardBg/50 border-border p-6 hover:border-aqua/50 transition-colors">
              <div className="flex items-center space-x-4 mb-4">
                <ToolIcon type="tax" />
                <h3 className="text-xl font-bold">Advanced Tax Planning</h3>
              </div>
              <p className="text-textSecondary">Multi-year forecasting, Roth conversions, state residency optimization</p>
            </Card>

            <Card className="bg-cardBg/50 border-border p-6 hover:border-success/50 transition-colors">
              <div className="flex items-center space-x-4 mb-4">
                <ToolIcon type="roadmap" />
                <h3 className="text-xl font-bold">SWAG™ Retirement Roadmap</h3>
              </div>
              <p className="text-textSecondary">Integrated wealth planning for client advisory services</p>
            </Card>

            <Card className="bg-cardBg/50 border-border p-6 hover:border-gold/50 transition-colors">
              <div className="flex items-center space-x-4 mb-4">
                <ToolIcon type="ai" />
                <h3 className="text-xl font-bold">Linda AI Assistant</h3>
              </div>
              <p className="text-textSecondary">Voice/SMS automation for scheduling and client follow-ups</p>
            </Card>

            <Card className="bg-cardBg/50 border-border p-6 hover:border-aqua/50 transition-colors">
              <div className="flex items-center space-x-4 mb-4">
                <ToolIcon type="crm" />
                <h3 className="text-xl font-bold">Lead-to-Sales CRM</h3>
              </div>
              <p className="text-textSecondary">ROI analytics and smart cadences for practice growth</p>
            </Card>

            <Card className="bg-cardBg/50 border-border p-6 hover:border-success/50 transition-colors">
              <div className="flex items-center space-x-4 mb-4">
                <ToolIcon type="estate" />
                <h3 className="text-xl font-bold">Estate Planning Suite</h3>
              </div>
              <p className="text-textSecondary">Cross-service opportunities with trust and will automation</p>
            </Card>
          </div>
        </div>
      </Slide>

      {/* Slide 3: CPA Workflow Example */}
      <Slide>
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold text-textPrimary">
              From Lead to <span className="text-gold">Strategic Advisory</span> — Fully Automated
            </h1>
          </div>

          <div className="relative">
            <div className="flex flex-wrap justify-center items-center gap-4">
              {/* Flow steps */}
              <div className="flex flex-col items-center space-y-2 bg-blue-950/30 rounded-xl p-6 border border-blue-400/30">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                <h3 className="font-bold text-blue-400">Lead Capture</h3>
                <p className="text-sm text-center">Ad/referral with UTM tracking</p>
              </div>

              <ArrowRight className="h-6 w-6 text-textSecondary" />

              <div className="flex flex-col items-center space-y-2 bg-blue-950/30 rounded-xl p-6 border border-blue-400/30">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                <h3 className="font-bold text-blue-400">Profile Creation</h3>
                <p className="text-sm text-center">Automated client onboarding</p>
              </div>

              <ArrowRight className="h-6 w-6 text-textSecondary" />

              <div className="flex flex-col items-center space-y-2 bg-green-950/30 rounded-xl p-6 border border-green-400/30">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                <h3 className="font-bold text-green-400">Document Request</h3>
                <p className="text-sm text-center">Secure portal templates</p>
              </div>

              <ArrowRight className="h-6 w-6 text-textSecondary" />

              <div className="flex flex-col items-center space-y-2 bg-green-950/30 rounded-xl p-6 border border-green-400/30">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">4</div>
                <h3 className="font-bold text-green-400">AI Meeting Summary</h3>
                <p className="text-sm text-center">Auto task creation</p>
              </div>

              <ArrowRight className="h-6 w-6 text-textSecondary" />

              <div className="flex flex-col items-center space-y-2 bg-yellow-950/30 rounded-xl p-6 border border-yellow-400/30">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">5</div>
                <h3 className="font-bold text-yellow-400">Tax Strategy</h3>
                <p className="text-sm text-center">Multi-year planning reports</p>
              </div>

              <ArrowRight className="h-6 w-6 text-textSecondary" />

              <div className="flex flex-col items-center space-y-2 bg-yellow-950/30 rounded-xl p-6 border border-yellow-400/30">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">6</div>
                <h3 className="font-bold text-yellow-400">Compliance Storage</h3>
                <p className="text-sm text-center">Audit-ready archives</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gold/20 to-aqua/20 rounded-2xl p-8 border border-gold/30">
            <h3 className="text-2xl font-bold text-center mb-6">Key Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gold">2 hours → 20 min</div>
                <div className="text-sm text-textSecondary">Client onboarding time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-aqua">$75K+</div>
                <div className="text-sm text-textSecondary">Additional advisory revenue</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-success">100%</div>
                <div className="text-sm text-textSecondary">Compliance automation</div>
              </div>
            </div>
          </div>
        </div>
      </Slide>

      {/* Slide 4: ROI & TCO Comparison */}
      <Slide>
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold text-textPrimary">
              Stop paying <span className="text-gold">multiple vendors</span> for less
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current Costs */}
            <div className="bg-red-950/20 rounded-2xl p-8 border border-red-500/30">
              <h3 className="text-2xl font-bold text-red-400 mb-6">Current Separate Tools</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-surface/20 rounded-lg">
                  <span>Thomson Reuters Onvio</span>
                  <span className="font-bold">$89/mo</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-surface/20 rounded-lg">
                  <span>Intuit ProConnect</span>
                  <span className="font-bold">$55/mo</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-surface/20 rounded-lg">
                  <span>Xero Practice Manager</span>
                  <span className="font-bold">$70/mo</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-surface/20 rounded-lg">
                  <span>Document Storage</span>
                  <span className="font-bold">$25/mo</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-surface/20 rounded-lg">
                  <span>CRM System</span>
                  <span className="font-bold">$45/mo</span>
                </div>
                <div className="border-t border-red-500/30 pt-4 mt-4">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total Monthly Cost:</span>
                    <span className="text-red-400">$284/mo</span>
                  </div>
                  <div className="text-center mt-2 text-red-400">
                    <span className="text-2xl font-bold">$3,408/year</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Our Solution */}
            <div className="bg-success/20 rounded-2xl p-8 border border-success/30">
              <h3 className="text-2xl font-bold text-success mb-6">Our Integrated Platform</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-surface/20 rounded-lg">
                  <div>
                    <PricingBadge planKey="pro" />
                    <span className="text-sm text-textSecondary">All tools included</span>
                  </div>
                  <span className="font-bold">$99/mo</span>
                </div>
                <div className="space-y-2 mt-6">
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-success" />
                    <span className="text-sm">Secure client portal & document vault</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-success" />
                    <span className="text-sm">Advanced tax planning tools</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-success" />
                    <span className="text-sm">SWAG™ Retirement Roadmap</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-success" />
                    <span className="text-sm">Linda AI automation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-success" />
                    <span className="text-sm">CRM with ROI analytics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-success" />
                    <span className="text-sm">Full compliance automation</span>
                  </div>
                </div>
                <div className="border-t border-success/30 pt-4 mt-6">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total Monthly Cost:</span>
                    <span className="text-success">$99/mo</span>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-2xl font-bold text-success">$1,188/year</span>
                    <div className="text-lg font-bold text-gold mt-2">
                      Save $2,220/year (65%)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Slide>

      {/* Slide 5: Case Study Example */}
      <Slide className="bg-gradient-to-br from-surface via-cardBg to-navy">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold text-textPrimary">
              Real Results: <span className="text-gold">Peterson & Associates CPA</span>
            </h1>
            <p className="text-xl text-textSecondary">How a 250-client firm transformed their practice in 6 months</p>
          </div>

          <div className="bg-cardBg/50 rounded-2xl p-8 border border-border">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Before */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-red-400">Before</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-red-950/20 rounded-lg p-4 border border-red-500/30">
                    <div className="text-2xl font-bold text-red-400">2 hours</div>
                    <div className="text-sm text-textSecondary">Average client onboarding time</div>
                  </div>
                  <div className="bg-red-950/20 rounded-lg p-4 border border-red-500/30">
                    <div className="text-2xl font-bold text-red-400">$284/mo</div>
                    <div className="text-sm text-textSecondary">Software subscription costs</div>
                  </div>
                  <div className="bg-red-950/20 rounded-lg p-4 border border-red-500/30">
                    <div className="text-2xl font-bold text-red-400">15%</div>
                    <div className="text-sm text-textSecondary">Clients receiving advisory services</div>
                  </div>
                  <div className="bg-red-950/20 rounded-lg p-4 border border-red-500/30">
                    <div className="text-2xl font-bold text-red-400">6 hours/week</div>
                    <div className="text-sm text-textSecondary">Lost to administrative tasks</div>
                  </div>
                </div>
              </div>

              {/* After */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <h3 className="text-2xl font-bold text-success">After</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-success/20 rounded-lg p-4 border border-success/30">
                    <div className="text-2xl font-bold text-success">20 minutes</div>
                    <div className="text-sm text-textSecondary">Average client onboarding time</div>
                  </div>
                  <div className="bg-success/20 rounded-lg p-4 border border-success/30">
                    <div className="text-2xl font-bold text-success">$99/mo</div>
                    <div className="text-sm text-textSecondary">Software subscription costs</div>
                  </div>
                  <div className="bg-success/20 rounded-lg p-4 border border-success/30">
                    <div className="text-2xl font-bold text-success">65%</div>
                    <div className="text-sm text-textSecondary">Clients receiving advisory services</div>
                  </div>
                  <div className="bg-success/20 rounded-lg p-4 border border-success/30">
                    <div className="text-2xl font-bold text-success">2 hours/week</div>
                    <div className="text-sm text-textSecondary">Freed up for strategic work</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="mt-8 pt-8 border-t border-border">
              <h4 className="text-xl font-bold text-center mb-6">6-Month Results</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gold/20 rounded-lg border border-gold/30">
                  <div className="text-3xl font-bold text-gold">$75K</div>
                  <div className="text-sm text-textSecondary">New advisory revenue</div>
                </div>
                <div className="text-center p-4 bg-aqua/20 rounded-lg border border-aqua/30">
                  <div className="text-3xl font-bold text-aqua">92%</div>
                  <div className="text-sm text-textSecondary">Client satisfaction score</div>
                </div>
                <div className="text-center p-4 bg-success/20 rounded-lg border border-success/30">
                  <div className="text-3xl font-bold text-success">4 hours</div>
                  <div className="text-sm text-textSecondary">Daily time savings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Slide>

      {/* Slide 6: CPA Pricing & Bundles */}
      <Slide>
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold text-textPrimary">
              Choose your <span className="text-gold">CPA growth plan</span>
            </h1>
            <p className="text-xl text-textSecondary">Designed specifically for accounting practices</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-cardBg/50 border-border p-6 relative">
              <CardHeader className="text-center">
                <h3 className="text-2xl font-bold">Basic</h3>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-textPrimary">$49<span className="text-sm text-textSecondary">/mo</span></div>
                </div>
                <p className="text-textSecondary">Essential tools for client management</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-success" />
                  <span className="text-sm">Secure client portal</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-success" />
                  <span className="text-sm">Document vault</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-success" />
                  <span className="text-sm">CE tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <X className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-textSecondary">Tax optimization workflows</span>
                </div>
                <div className="flex items-center space-x-2">
                  <X className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-textSecondary">Linda AI automation</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-b from-gold/20 to-gold/10 border-gold p-6 relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gold text-navy">Most Popular</Badge>
              <CardHeader className="text-center">
                <h3 className="text-2xl font-bold">Pro</h3>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-textPrimary">$99<span className="text-sm text-textSecondary">/mo</span></div>
                </div>
                <p className="text-textSecondary">Complete practice automation</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-success" />
                  <span className="text-sm">Everything in Basic</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-success" />
                  <span className="text-sm">Tax optimization workflows</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-success" />
                  <span className="text-sm">Workflow automation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-success" />
                  <span className="text-sm">Linda AI assistant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-success" />
                  <span className="text-sm">CRM with ROI analytics</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-cardBg/50 border-border p-6">
              <CardHeader className="text-center">
                <h3 className="text-2xl font-bold">Premium</h3>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-textPrimary">$159<span className="text-sm text-textSecondary">/mo</span></div>
                </div>
                <p className="text-textSecondary">Full advisory practice suite</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-success" />
                  <span className="text-sm">Everything in Pro</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-success" />
                  <span className="text-sm">SWAG™ Retirement Roadmap</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-success" />
                  <span className="text-sm">Estate Planning Suite</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-success" />
                  <span className="text-sm">White-label portal</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-success" />
                  <span className="text-sm">Priority support</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <div className="bg-success/20 rounded-xl p-4 border border-success/30 inline-block">
              <p className="text-success font-bold">All plans include free migration assistance and 30-day money-back guarantee</p>
            </div>
          </div>
        </div>
      </Slide>

      {/* Slide 7: Compliance & Security */}
      <Slide className="text-center">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-textPrimary">
              <span className="text-gold">Compliance-first</span> platform design
            </h1>
            <p className="text-xl text-textSecondary">Built for CPA practices with regulatory requirements in mind</p>
          </div>

          <div className="relative">
            <div className="bg-cardBg/50 rounded-2xl p-12 border border-border">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <Shield className="h-32 w-32 text-gold" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CheckCircle2 className="h-16 w-16 text-success" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gold">Regulatory Compliance</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Check className="h-6 w-6 text-success" />
                      <span className="text-lg">IRS Publication 4557 safeguards</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="h-6 w-6 text-success" />
                      <span className="text-lg">State-specific requirements built-in</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="h-6 w-6 text-success" />
                      <span className="text-lg">Automatic record retention policies</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="h-6 w-6 text-success" />
                      <span className="text-lg">AICPA standards alignment</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-aqua">Security & Privacy</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Check className="h-6 w-6 text-success" />
                      <span className="text-lg">SOC 2 Type II certified</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="h-6 w-6 text-success" />
                      <span className="text-lg">GDPR & CCPA data privacy</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="h-6 w-6 text-success" />
                      <span className="text-lg">End-to-end encryption</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="h-6 w-6 text-success" />
                      <span className="text-lg">Audit-ready activity logs</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 bg-surface/30 rounded-xl">
                <h4 className="text-xl font-bold text-center mb-4">Built-in Audit Trail</h4>
                <p className="text-textSecondary text-center leading-relaxed">
                  Every client communication, document access, and system action is automatically logged with timestamps, 
                  user identification, and IP addresses. Generate compliance reports in seconds, not hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Slide>
    </div>
  );
}