import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, BarChart3, Shield, Target, Download, PlayCircle } from 'lucide-react';
import allocationCover from '@/assets/allocation-models-cover.jpg';

export const IntelligentAllocationModels = () => {
  const [selectedModel, setSelectedModel] = useState('conservative');

  const partners = [
    {
      name: "Dimensional Fund Advisors",
      logo: "DFA",
      aum: "$690B",
      specialty: "Factor-based investing",
      description: "Academic research-driven systematic investing strategies"
    },
    {
      name: "Alpha Architect",
      logo: "AA", 
      aum: "$3.2B",
      specialty: "Quantitative value & momentum",
      description: "Evidence-based systematic factor investing"
    },
    {
      name: "BlackRock",
      logo: "BR",
      aum: "$9.1T", 
      specialty: "Index & factor ETFs",
      description: "Low-cost broad market and factor exposure"
    },
    {
      name: "Advanced Wealth Management", 
      logo: "AWM",
      aum: "$2.1B",
      specialty: "Direct indexing",
      description: "Tax-optimized separately managed accounts"
    }
  ];

  const models = {
    conservative: {
      name: "Conservative Growth",
      description: "Capital preservation with modest growth potential",
      allocation: {
        "US Stocks": 25,
        "International Stocks": 15,
        "Bonds": 45,
        "REITs": 5,
        "Private Markets": 10
      },
      expectedReturn: "6-8%",
      volatility: "Low (8-12%)",
      riskLevel: "Conservative"
    },
    moderate: {
      name: "Balanced Growth", 
      description: "Balanced approach for long-term growth",
      allocation: {
        "US Stocks": 40,
        "International Stocks": 20,
        "Bonds": 25,
        "REITs": 5,
        "Private Markets": 10
      },
      expectedReturn: "7-10%",
      volatility: "Moderate (12-16%)",
      riskLevel: "Moderate"
    },
    aggressive: {
      name: "Growth Focused",
      description: "Maximum growth potential for long-term investors",
      allocation: {
        "US Stocks": 50,
        "International Stocks": 25,
        "Bonds": 10,
        "REITs": 5,
        "Private Markets": 10
      },
      expectedReturn: "8-12%",
      volatility: "High (16-20%)",
      riskLevel: "Aggressive"
    }
  };

  const features = [
    {
      title: "Factor-Based Construction",
      description: "Systematic exposure to value, momentum, quality, and size factors",
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      title: "Tax Optimization",
      description: "Direct indexing and tax-loss harvesting for after-tax returns",
      icon: <Target className="w-5 h-5" />
    },
    {
      title: "Risk Management",
      description: "Dynamic rebalancing and correlation-based diversification",
      icon: <Shield className="w-5 h-5" />
    },
    {
      title: "Performance Tracking",
      description: "Real-time monitoring and benchmark comparison",
      icon: <BarChart3 className="w-5 h-5" />
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-primary/10 to-gold-premium/10 border-gold-premium/20">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="mb-4 bg-gold-premium text-primary">
                <BarChart3 className="w-3 h-3 mr-1" />
                Institutional Models
              </Badge>
              <h1 className="text-3xl font-bold mb-4">Intelligent Allocation Models</h1>
              <p className="text-lg text-muted-foreground mb-6">
                Evidence-based portfolio models designed with institutional partners 
                for long-term outperformance and risk management.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-gold-premium text-primary hover:bg-gold-dark">
                  <Download className="w-4 h-4 mr-2" />
                  Download Model Guide
                </Button>
                <Button variant="outline">
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="text-center">
              <img 
                src={allocationCover} 
                alt="Allocation Models Guide"
                className="rounded-lg shadow-lg max-w-xs mx-auto"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="text-center p-6">
            <div className="text-gold-dark mb-3 flex justify-center">
              {feature.icon}
            </div>
            <h3 className="font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </Card>
        ))}
      </div>

      {/* Partner Logos */}
      <Card>
        <CardHeader>
          <CardTitle>Institutional Partners</CardTitle>
          <p className="text-sm text-muted-foreground">
            Our models leverage best-in-class institutional partners for implementation.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {partners.map((partner, index) => (
              <Card key={index} className="p-4 text-center hover:border-gold-premium/50 transition-colors">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-3">
                  {partner.logo}
                </div>
                <h4 className="font-semibold text-sm mb-1">{partner.name}</h4>
                <p className="text-xs text-muted-foreground mb-2">{partner.specialty}</p>
                <div className="text-xs font-semibold text-gold-dark">{partner.aum} AUM</div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Model Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Sample Portfolio Models</CardTitle>
          <p className="text-sm text-muted-foreground">
            Select a risk profile to view sample allocation and expected characteristics.
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedModel} onValueChange={setSelectedModel} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="conservative">Conservative</TabsTrigger>
              <TabsTrigger value="moderate">Moderate</TabsTrigger>
              <TabsTrigger value="aggressive">Aggressive</TabsTrigger>
            </TabsList>

            {Object.entries(models).map(([key, model]) => (
              <TabsContent key={key} value={key}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Allocation Chart */}
                  <Card className="p-6">
                    <h4 className="font-semibold mb-4">{model.name} Allocation</h4>
                    <div className="space-y-3">
                      {Object.entries(model.allocation).map(([asset, percentage]) => (
                        <div key={asset} className="flex items-center justify-between">
                          <span className="text-sm">{asset}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gold-premium transition-all" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold w-8">{percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Model Characteristics */}
                  <Card className="p-6">
                    <h4 className="font-semibold mb-4">Expected Characteristics</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Expected Return (Annual)</span>
                          <span className="font-semibold text-success">{model.expectedReturn}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Volatility Range</span>
                          <span className="font-semibold">{model.volatility}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Risk Level</span>
                          <Badge variant="outline">{model.riskLevel}</Badge>
                        </div>
                      </div>
                      <div className="pt-3 border-t">
                        <p className="text-xs text-muted-foreground">{model.description}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Implementation CTA */}
      <Card className="bg-gradient-to-r from-gold-premium/10 to-primary/10 border-gold-premium/20">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-bold mb-4">Ready to Implement?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            These models require careful implementation and ongoing management. 
            Speak with a fiduciary advisor to determine the right approach for your situation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-gold-premium text-primary hover:bg-gold-dark">
              Schedule Strategy Session
            </Button>
            <Button size="lg" variant="outline">
              Download Full Research
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="p-6">
          <h4 className="font-semibold text-destructive mb-3">Important Disclosure</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Model portfolios are for educational purposes only and do not constitute investment advice. 
            Past performance does not guarantee future results. All investments carry risk of loss. 
            Partner names are shown for educational purposes - we maintain editorial independence and 
            fiduciary responsibility. Speak to a qualified advisor before implementing any investment strategy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};