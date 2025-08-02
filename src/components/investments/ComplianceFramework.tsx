import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, FileText, AlertTriangle, ExternalLink, CheckCircle } from 'lucide-react';

export const ComplianceFramework = () => {
  const complianceItems = [
    {
      title: "Partner Due Diligence",
      description: "Comprehensive background checks, regulatory verification, and operational review",
      status: "active",
      details: "ADV review, reference checks, AUM verification, compliance history"
    },
    {
      title: "Investment Suitability",
      description: "Accredited investor verification and suitability assessment protocols",
      status: "active", 
      details: "Income/net worth verification, risk tolerance assessment, liquidity needs"
    },
    {
      title: "Disclosure Requirements",
      description: "Full fee transparency, conflict disclosure, and risk factor communication",
      status: "active",
      details: "Partnership fees, advisor compensation, material conflicts, regulatory risks"
    },
    {
      title: "Ongoing Monitoring", 
      description: "Continuous surveillance of partner performance and regulatory standing",
      status: "active",
      details: "Quarterly reviews, regulatory updates, performance monitoring, client feedback"
    }
  ];

  const disclosures = [
    {
      title: "Important Investment Disclosures",
      content: `Private market investments involve substantial risk and may not be suitable for all investors. 
      These investments are generally illiquid, speculative, and involve a high degree of risk. Past performance 
      is not indicative of future results. Investors may lose all or a substantial portion of their investment.`,
      type: "risk"
    },
    {
      title: "Partner Compensation Disclosure", 
      content: `Partners pay fees to appear on our marketplace. These fees do not influence our due diligence 
      process or recommendations. We maintain editorial independence and fiduciary responsibility to our clients.`,
      type: "compensation"
    },
    {
      title: "Advisor Compensation",
      content: `Our advisors are fee-only fiduciaries and do not receive commissions or compensation from 
      investment partners. Advisory fees are disclosed separately and charged directly by the client.`,
      type: "advisor"
    }
  ];

  return (
    <div className="space-y-8">
      <Card className="border-gold-premium/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-gold-dark" />
            Compliance & Due Diligence Framework
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {complianceItems.map((item, index) => (
              <Card key={index} className="border-l-4 border-l-success">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm">{item.title}</h4>
                    <Badge variant="outline" className="text-success border-success">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                  <p className="text-xs text-muted-foreground/80">{item.details}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Our Due Diligence Methodology
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              Our investment committee reviews each potential partner across 47 data points including 
              regulatory history, operational infrastructure, investment process, and track record verification.
            </p>
            <Button variant="outline" size="sm" className="text-xs">
              <ExternalLink className="w-3 h-3 mr-1" />
              View Full Methodology (PDF)
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Required Disclosures
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {disclosures.map((disclosure, index) => (
            <div key={index} className="border-l-4 border-l-muted pl-4">
              <h4 className="font-semibold text-sm mb-2">{disclosure.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{disclosure.content}</p>
            </div>
          ))}

          <div className="bg-destructive/5 p-4 rounded-lg border border-destructive/20">
            <h4 className="font-semibold text-sm mb-2 text-destructive">
              Accredited Investor Requirement
            </h4>
            <p className="text-xs text-muted-foreground">
              Access to private market investments is limited to accredited investors as defined by SEC regulations. 
              You must meet income or net worth thresholds and complete suitability verification before accessing 
              partner information or making investments.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};