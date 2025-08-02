import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Shield, FileText, BarChart3, Users, Award, CheckCircle, AlertTriangle } from 'lucide-react';

const researchSample = {
  partnerName: "Meridian Capital Partners",
  assetClass: "Private Equity",
  strategy: "Middle Market Buyout",
  overallScore: 87,
  lastUpdated: "2024-01-15",
  riskRating: "Moderate",
  categories: {
    performance: 92,
    operational: 85,
    compliance: 89,
    team: 84,
    market: 88
  },
  keyFindings: [
    {
      type: "positive",
      title: "Strong Track Record",
      description: "Fund III generated 15.3% net IRR over 5-year holding period, top quartile performance"
    },
    {
      type: "positive", 
      title: "Experienced Team",
      description: "Average of 18 years investment experience across senior team members"
    },
    {
      type: "caution",
      title: "Recent Staff Changes",
      description: "Two senior partners departed in past 12 months, monitoring succession planning"
    }
  ],
  complianceChecks: [
    { item: "SEC Registration Status", status: "passed", details: "Current registration verified" },
    { item: "Background Checks", status: "passed", details: "All principals cleared" },
    { item: "Regulatory History", status: "passed", details: "No material violations" },
    { item: "Reference Verification", status: "passed", details: "5 institutional references confirmed" }
  ]
};

export const ManagerResearch = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Manager Research & Due Diligence</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Access our institutional-quality research reports on private market managers. 
          Each report includes performance analysis, operational due diligence, and compliance verification.
        </p>
      </div>

      {/* Research Sample */}
      <Card className="border-gold-premium/30">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{researchSample.partnerName}</CardTitle>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="secondary">{researchSample.assetClass}</Badge>
                <Badge variant="outline">{researchSample.strategy}</Badge>
                <span className="text-sm text-muted-foreground">
                  Last Updated: {new Date(researchSample.lastUpdated).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gold-dark">{researchSample.overallScore}</div>
              <div className="text-sm text-muted-foreground">Overall Score</div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="operational">Operational</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Score Breakdown */}
              <div>
                <h3 className="font-semibold mb-4">Research Score Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {Object.entries(researchSample.categories).map(([category, score]) => (
                    <Card key={category} className="p-4 text-center">
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-gold-dark">{score}</div>
                        <div className="text-sm text-muted-foreground capitalize">{category}</div>
                        <Progress value={score} className="h-2" />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Key Findings */}
              <div>
                <h3 className="font-semibold mb-4">Key Research Findings</h3>
                <div className="space-y-3">
                  {researchSample.keyFindings.map((finding, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start gap-3">
                        {finding.type === 'positive' ? (
                          <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <h4 className="font-medium">{finding.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{finding.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-success" />
                    <h3 className="font-semibold">Historical Performance</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Net IRR (Fund III)</span>
                      <span className="font-semibold text-success">15.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Multiple (Fund III)</span>
                      <span className="font-semibold">2.1x</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vintage Year</span>
                      <span className="font-semibold">2018</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fund Size</span>
                      <span className="font-semibold">$850M</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-gold-dark" />
                    <h3 className="font-semibold">Benchmark Comparison</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">vs. Cambridge Associates PE Index</span>
                        <span className="text-sm font-semibold text-success">+320 bps</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Quartile Ranking</span>
                        <span className="text-sm font-semibold">1st Quartile</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Performance Analysis Summary</h3>
                <div className="prose prose-sm text-muted-foreground">
                  <p>
                    Meridian Capital Partners has demonstrated strong performance consistency across three fund vintages. 
                    Fund III, their most recent fully realized fund, achieved a net IRR of 15.3% and a 2.1x multiple, 
                    placing it in the first quartile of middle-market buyout funds.
                  </p>
                  <p className="mt-3">
                    The firm's investment approach focuses on operational value creation, with an average holding period 
                    of 4.2 years. Portfolio companies have shown revenue growth averaging 18% annually during the hold period.
                  </p>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Compliance Verification</h3>
                <div className="space-y-3">
                  {researchSample.complianceChecks.map((check, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-success" />
                          <div>
                            <h4 className="font-medium">{check.item}</h4>
                            <p className="text-sm text-muted-foreground">{check.details}</p>
                          </div>
                        </div>
                        <Badge className="bg-success/20 text-success">Passed</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-gold-dark" />
                  <h3 className="font-semibold">Regulatory Overview</h3>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">SEC Registration</div>
                      <div className="font-semibold">Investment Adviser (Current)</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Form ADV Last Filed</div>
                      <div className="font-semibold">March 2024</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Regulatory Examinations</div>
                      <div className="font-semibold">2022 (No Deficiencies)</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">FINRA CRD</div>
                      <div className="font-semibold">N/A (SEC Only)</div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="operational" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-gold-dark" />
                    <h3 className="font-semibold">Team Analysis</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Senior Team Size</span>
                      <span className="font-semibold">8 Partners</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Experience</span>
                      <span className="font-semibold">18 Years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Team Stability</span>
                      <span className="font-semibold">85% (5 years)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Investment Committee</span>
                      <span className="font-semibold">5 Members</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-5 h-5 text-gold-dark" />
                    <h3 className="font-semibold">Operational Capabilities</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Portfolio Support Team</span>
                      <span className="font-semibold">12 Professionals</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Operating Partners</span>
                      <span className="font-semibold">6 Partners</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Portfolio Companies</span>
                      <span className="font-semibold">23 Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ESG Integration</span>
                      <span className="font-semibold">Tier 2</span>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Operational Assessment</h3>
                <div className="prose prose-sm text-muted-foreground">
                  <p>
                    Meridian maintains a robust operational infrastructure with dedicated portfolio support professionals 
                    and operating partners who work directly with portfolio companies. The firm has implemented systematic 
                    value creation processes including quarterly business reviews and annual strategic planning sessions.
                  </p>
                  <p className="mt-3">
                    The investment team demonstrates strong sector expertise in healthcare and technology, with established 
                    relationships across both industries. Recent additions to the team include a former healthcare CEO 
                    and a technology operating partner.
                  </p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div className="text-sm text-muted-foreground">
              Research conducted by BFO Investment Committee
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Download Full Report
              </Button>
              <Button className="bg-gold-premium text-primary hover:bg-gold-dark">
                Request Introduction
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Research Process */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6">Our Research Process</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: "1",
              title: "Initial Screening",
              description: "Regulatory verification, background checks, and basic qualifications review"
            },
            {
              step: "2", 
              title: "Performance Analysis",
              description: "Historical returns, benchmark comparison, and risk-adjusted performance metrics"
            },
            {
              step: "3",
              title: "Operational Review",
              description: "Team assessment, investment process evaluation, and operational capabilities analysis"
            },
            {
              step: "4",
              title: "Final Rating",
              description: "Comprehensive scoring and recommendation based on all evaluation criteria"
            }
          ].map((step) => (
            <div key={step.step} className="text-center space-y-3">
              <div className="w-12 h-12 bg-gold-premium text-primary rounded-full flex items-center justify-center font-bold text-lg mx-auto">
                {step.step}
              </div>
              <h4 className="font-semibold">{step.title}</h4>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* CTA */}
      <Card className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground p-8 text-center">
        <h3 className="text-2xl font-bold mb-4">Access Full Research Library</h3>
        <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
          Get unlimited access to our research reports on 150+ private market managers, 
          updated quarterly with the latest performance and compliance data.
        </p>
        <Button size="lg" className="bg-gold-premium text-primary hover:bg-gold-dark font-semibold">
          Upgrade to Premium Research
        </Button>
      </Card>
    </div>
  );
};