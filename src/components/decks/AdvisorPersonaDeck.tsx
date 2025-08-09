import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Check, X, Shield, ArrowRight, Target, BarChart3, Brain, 
  Phone, FileText, Users, Zap, AlertTriangle, CheckCircle2,
  TrendingUp, DollarSign, Clock, Award
} from 'lucide-react';

const Slide = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`min-h-screen w-full flex flex-col justify-center items-center p-8 bg-gradient-to-br from-surface via-navy to-cardBg ${className}`}>
    {children}
  </div>
);

const ToolIcon = ({ type }: { type: string }) => {
  const icons = {
    score: <Target className="h-8 w-8 text-gold" />,
    crm: <Users className="h-8 w-8 text-aqua" />,
    roi: <BarChart3 className="h-8 w-8 text-success" />,
    compliance: <Shield className="h-8 w-8 text-gold" />,
    ai: <Brain className="h-8 w-8 text-aqua" />,
    roadmap: <TrendingUp className="h-8 w-8 text-success" />,
    estate: <FileText className="h-8 w-8 text-gold" />,
    twilio: <Phone className="h-8 w-8 text-aqua" />,
    vault: <CheckCircle2 className="h-8 w-8 text-success" />
  };
  return icons[type as keyof typeof icons] || <FileText className="h-8 w-8 text-gold" />;
};

export default function AdvisorPersonaDeck() {
  return (
    <div className="deck-container font-body text-textPrimary">
      {/* Slide 1: Hook & Pain Points */}
      <Slide className="text-center">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-6">
            <h1 className="text-6xl font-bold text-textPrimary leading-tight">
              Stop juggling tools.<br />
              <span className="text-gold">Start growing your book of business.</span>
            </h1>
            <p className="text-2xl text-textSecondary max-w-4xl mx-auto leading-relaxed">
              Advisors lose 30% of their opportunities to disconnected systems and missed follow-ups. We fix that.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
            {/* Left: Messy Systems */}
            <div className="bg-red-950/20 rounded-2xl p-8 border border-red-500/30">
              <h3 className="text-2xl font-bold text-red-400 mb-6">Current Pain Points</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                  <span className="text-lg">Wasted hours on manual follow-up</span>
                </div>
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                  <span className="text-lg">Leads slipping through the cracks</span>
                </div>
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                  <span className="text-lg">Paying for 4–5 separate subscriptions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                  <span className="text-lg">Compliance headaches and audit risk</span>
                </div>
              </div>
            </div>

            {/* Right: Clean Solution */}
            <div className="bg-cardBg/50 rounded-2xl p-8 border border-border">
              <h3 className="text-2xl font-bold text-gold mb-6">Our Platform</h3>
              <img 
                src="/api/placeholder/500/300" 
                alt="Clean Dashboard Screenshot" 
                className="w-full rounded-xl shadow-xl"
              />
              <p className="text-center text-textSecondary mt-4">Single dashboard. All your tools.</p>
            </div>
          </div>
        </div>
      </Slide>

      {/* Slide 2: Core Advisor Tools */}
      <Slide>
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold text-textPrimary">
              Everything you need to <span className="text-gold">win more clients</span>, in one place.
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-cardBg/50 border-border p-6 hover:border-gold/50 transition-colors">
              <div className="flex items-center space-x-4 mb-4">
                <ToolIcon type="score" />
                <h3 className="text-2xl font-bold">SWAG Lead Score™</h3>
              </div>
              <p className="text-textSecondary text-lg">Auto-scoring leads 0–100, gold/silver/bronze tiers</p>
            </Card>

            <Card className="bg-cardBg/50 border-border p-6 hover:border-aqua/50 transition-colors">
              <div className="flex items-center space-x-4 mb-4">
                <ToolIcon type="crm" />
                <h3 className="text-2xl font-bold">CRM Pipeline + Smart Cadences</h3>
              </div>
              <p className="text-textSecondary text-lg">Call, SMS, email, tasks all in one</p>
            </Card>

            <Card className="bg-cardBg/50 border-border p-6 hover:border-success/50 transition-colors">
              <div className="flex items-center space-x-4 mb-4">
                <ToolIcon type="roi" />
                <h3 className="text-2xl font-bold">ROI Dashboard</h3>
              </div>
              <p className="text-textSecondary text-lg">Campaign cost per lead, conversion rate, time-to-close</p>
            </Card>

            <Card className="bg-cardBg/50 border-border p-6 hover:border-gold/50 transition-colors">
              <div className="flex items-center space-x-4 mb-4">
                <ToolIcon type="compliance" />
                <h3 className="text-2xl font-bold">Compliance Overlay</h3>
              </div>
              <p className="text-textSecondary text-lg">FINRA/DOL keyword flagging & activity logs</p>
            </Card>
          </div>
        </div>
      </Slide>

      {/* Slide 3: Cross-Persona Power Stack */}
      <Slide>
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold text-textPrimary">
              Your entire practice, powered by <span className="text-aqua">AI & automation</span>.
            </h1>
          </div>

          <div className="relative">
            <div className="space-y-4">
              {/* Stack layers */}
              <div className="bg-gradient-to-r from-aqua/20 to-aqua/10 rounded-xl p-6 border border-aqua/30 transform rotate-1">
                <div className="flex items-center space-x-4">
                  <ToolIcon type="ai" />
                  <div>
                    <h3 className="text-xl font-bold">Linda AI Voice/SMS Assistant</h3>
                    <p className="text-textSecondary">Call notes, instant SMS summaries, auto follow-up</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-success/20 to-success/10 rounded-xl p-6 border border-success/30 transform -rotate-1">
                <div className="flex items-center space-x-4">
                  <ToolIcon type="roadmap" />
                  <div>
                    <h3 className="text-xl font-bold">SWAG™ Retirement Roadmap</h3>
                    <p className="text-textSecondary">Monte Carlo, scenario modeling, PDF export</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gold/20 to-gold/10 rounded-xl p-6 border border-gold/30 transform rotate-1">
                <div className="flex items-center space-x-4">
                  <ToolIcon type="estate" />
                  <div>
                    <h3 className="text-xl font-bold">Estate Planning Suite</h3>
                    <p className="text-textSecondary">Trust/will automation, advanced calculators, secure vault</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-aqua/20 to-aqua/10 rounded-xl p-6 border border-aqua/30 transform -rotate-1">
                <div className="flex items-center space-x-4">
                  <ToolIcon type="twilio" />
                  <div>
                    <h3 className="text-xl font-bold">Twilio Lead-to-Sales Engine</h3>
                    <p className="text-textSecondary">Calls/SMS/voice from lead to closed sale</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-success/20 to-success/10 rounded-xl p-6 border border-success/30 transform rotate-1">
                <div className="flex items-center space-x-4">
                  <ToolIcon type="vault" />
                  <div>
                    <h3 className="text-xl font-bold">Family Vault & Property Manager</h3>
                    <p className="text-textSecondary">Household asset tracking</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Slide>

      {/* Slide 4: Workflow Example */}
      <Slide>
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold text-textPrimary">
              From ad click to closed client — <span className="text-gold">fully automated</span>.
            </h1>
          </div>

          <div className="relative">
            <div className="flex flex-wrap justify-center items-center gap-4">
              {/* Flow steps */}
              <div className="flex flex-col items-center space-y-2 bg-blue-950/30 rounded-xl p-6 border border-blue-400/30">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                <h3 className="font-bold text-blue-400">Marketing</h3>
                <p className="text-sm text-center">Facebook Ad or LinkedIn Campaign</p>
              </div>

              <ArrowRight className="h-6 w-6 text-textSecondary" />

              <div className="flex flex-col items-center space-y-2 bg-blue-950/30 rounded-xl p-6 border border-blue-400/30">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                <h3 className="font-bold text-blue-400">Lead Scoring</h3>
                <p className="text-sm text-center">Auto-scores via SWAG Lead Score™</p>
              </div>

              <ArrowRight className="h-6 w-6 text-textSecondary" />

              <div className="flex flex-col items-center space-y-2 bg-green-950/30 rounded-xl p-6 border border-green-400/30">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                <h3 className="font-bold text-green-400">Assignment</h3>
                <p className="text-sm text-center">Auto-assigned to best-fit advisor</p>
              </div>

              <ArrowRight className="h-6 w-6 text-textSecondary" />

              <div className="flex flex-col items-center space-y-2 bg-green-950/30 rounded-xl p-6 border border-green-400/30">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">4</div>
                <h3 className="font-bold text-green-400">AI Engagement</h3>
                <p className="text-sm text-center">Linda AI calls, records, sends follow-up SMS</p>
              </div>

              <ArrowRight className="h-6 w-6 text-textSecondary" />

              <div className="flex flex-col items-center space-y-2 bg-green-950/30 rounded-xl p-6 border border-green-400/30">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">5</div>
                <h3 className="font-bold text-green-400">Proposal</h3>
                <p className="text-sm text-center">Sent from CRM</p>
              </div>

              <ArrowRight className="h-6 w-6 text-textSecondary" />

              <div className="flex flex-col items-center space-y-2 bg-yellow-950/30 rounded-xl p-6 border border-yellow-400/30">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">6</div>
                <h3 className="font-bold text-yellow-400">Onboarding</h3>
                <p className="text-sm text-center">Client onboarded + portal access</p>
              </div>

              <ArrowRight className="h-6 w-6 text-textSecondary" />

              <div className="flex flex-col items-center space-y-2 bg-yellow-950/30 rounded-xl p-6 border border-yellow-400/30">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">7</div>
                <h3 className="font-bold text-yellow-400">Delivery</h3>
                <p className="text-sm text-center">SWAG Retirement Plan delivered</p>
              </div>
            </div>
          </div>
        </div>
      </Slide>

      {/* Slide 5: Compliance-First Advantage */}
      <Slide className="text-center">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-textPrimary">
              Built for <span className="text-gold">regulated industries</span>.
            </h1>
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
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Check className="h-6 w-6 text-success" />
                    <span className="text-lg">FINRA + SEC Investment Advisor Act compliance baked in</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-6 w-6 text-success" />
                    <span className="text-lg">DOL Fiduciary standards met</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Check className="h-6 w-6 text-success" />
                    <span className="text-lg">GDPR + CCPA data privacy compliance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-6 w-6 text-success" />
                    <span className="text-lg">Audit-ready logs for all client communications & documents</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-surface/30 rounded-xl">
                <p className="text-textSecondary italic">
                  "Your tech stack should protect your license, not risk it."
                </p>
              </div>
            </div>
          </div>
        </div>
      </Slide>

      {/* Slide 6: Pricing & Annual Discount */}
      <Slide>
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold text-textPrimary">
              Start <span className="text-gold">closing more deals</span> today.
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-cardBg/50 border-border p-6">
              <CardHeader className="text-center">
                <h3 className="text-2xl font-bold">Basic</h3>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-textPrimary">$59<span className="text-sm text-textSecondary">/mo</span></div>
                  <div className="text-lg text-success">$600<span className="text-sm text-textSecondary">/year</span></div>
                </div>
                <p className="text-textSecondary">New advisors, basic CRM & SWAG Score</p>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-b from-gold/20 to-gold/10 border-gold p-6 relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gold text-navy">Most Popular</Badge>
              <CardHeader className="text-center">
                <h3 className="text-2xl font-bold">Pro</h3>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-textPrimary">$119<span className="text-sm text-textSecondary">/mo</span></div>
                  <div className="text-lg text-success">$1,200<span className="text-sm text-textSecondary">/year</span></div>
                </div>
                <p className="text-textSecondary">Growth-focused practices, Smart Cadences, ROI Dashboard</p>
              </CardHeader>
            </Card>

            <Card className="bg-cardBg/50 border-border p-6">
              <CardHeader className="text-center">
                <h3 className="text-2xl font-bold">Premium</h3>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-textPrimary">$199<span className="text-sm text-textSecondary">/mo</span></div>
                  <div className="text-lg text-success">$2,000<span className="text-sm text-textSecondary">/year</span></div>
                </div>
                <p className="text-textSecondary">Full AI + automation stack, Estate & SWAG tools</p>
              </CardHeader>
            </Card>
          </div>

          <div className="text-center">
            <div className="bg-success/20 rounded-xl p-4 border border-success/30 inline-block">
              <p className="text-success font-bold">Annual plans include 2 months free — save up to $398/year.</p>
            </div>
          </div>
        </div>
      </Slide>

      {/* Slide 7: TCO vs Competitors */}
      <Slide>
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold text-textPrimary">
              Why pay <span className="text-gold">more for less</span>?
            </h1>
          </div>

          <div className="bg-cardBg/50 rounded-2xl p-8 border border-border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-bold">Platform</th>
                    <th className="text-left p-4 font-bold">Monthly Cost</th>
                    <th className="text-left p-4 font-bold">Tools Included</th>
                    <th className="text-left p-4 font-bold">Compliance</th>
                    <th className="text-left p-4 font-bold">AI/Automation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border bg-gold/10">
                    <td className="p-4 font-bold text-gold">Ours</td>
                    <td className="p-4 text-gold font-bold">$119</td>
                    <td className="p-4 text-gold font-bold">12+</td>
                    <td className="p-4"><Check className="h-5 w-5 text-success" /></td>
                    <td className="p-4"><Check className="h-5 w-5 text-success" /></td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4">Zocks</td>
                    <td className="p-4">$250+</td>
                    <td className="p-4">4</td>
                    <td className="p-4"><X className="h-5 w-5 text-red-400" /></td>
                    <td className="p-4"><X className="h-5 w-5 text-red-400" /></td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4">Jump</td>
                    <td className="p-4">$300+</td>
                    <td className="p-4">5</td>
                    <td className="p-4"><X className="h-5 w-5 text-red-400" /></td>
                    <td className="p-4"><X className="h-5 w-5 text-red-400" /></td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4">Redtail CRM</td>
                    <td className="p-4">$99</td>
                    <td className="p-4">1</td>
                    <td className="p-4"><Check className="h-5 w-5 text-success" /></td>
                    <td className="p-4"><X className="h-5 w-5 text-red-400" /></td>
                  </tr>
                  <tr>
                    <td className="p-4">MoneyGuidePro</td>
                    <td className="p-4">$150</td>
                    <td className="p-4">1</td>
                    <td className="p-4"><X className="h-5 w-5 text-red-400" /></td>
                    <td className="p-4"><X className="h-5 w-5 text-red-400" /></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 text-center">
              <div className="bg-success/20 rounded-xl p-6 border border-success/30">
                <p className="text-2xl font-bold text-success">
                  Total savings: $300–$500/month vs separate tools
                </p>
              </div>
            </div>
          </div>
        </div>
      </Slide>
    </div>
  );
}