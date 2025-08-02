import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bitcoin, Download, PlayCircle, ExternalLink, Shield, TrendingUp } from 'lucide-react';
import bitcoinCover from '@/assets/bitcoin-guide-cover.jpg';

export const BitcoinEducationCenter = () => {
  const educationalResources = [
    {
      title: "Bitcoin White Paper",
      description: "The original Bitcoin paper by Satoshi Nakamoto",
      type: "PDF",
      url: "#"
    },
    {
      title: "The Bitcoin Standard",
      description: "Comprehensive book on Bitcoin's economic principles",
      type: "Book",
      url: "#"
    },
    {
      title: "Bitcoin for Beginners",
      description: "Andreas Antonopoulos video series",
      type: "Video",
      url: "#"
    },
    {
      title: "Coin Metrics Research",
      description: "Professional Bitcoin market analysis",
      type: "Research",
      url: "#"
    }
  ];

  const vetted_custodians = [
    {
      name: "Coinbase Custody",
      description: "Institutional-grade custody with insurance coverage",
      aum: "$90B+",
      features: ["SOC 2 Type II", "Insurance", "Institutional"]
    },
    {
      name: "BitGo",
      description: "Multi-signature security and compliance solutions",
      aum: "$64B+", 
      features: ["Multi-sig", "Compliance", "Hot/Cold Storage"]
    },
    {
      name: "Fidelity Digital Assets",
      description: "Traditional finance meets digital assets",
      aum: "$15B+",
      features: ["Traditional Finance", "Regulated", "Research"]
    }
  ];

  const faqs = [
    {
      question: "Is Bitcoin suitable for retirement portfolios?",
      answer: "Bitcoin can serve as a small allocation (1-5%) for portfolio diversification, but should be considered high-risk and not suitable for conservative retirement income needs."
    },
    {
      question: "How is Bitcoin taxed?",
      answer: "Bitcoin is treated as property by the IRS. Capital gains taxes apply when selling, and proper record-keeping is essential for tax compliance."
    },
    {
      question: "What about Bitcoin volatility?",
      answer: "Bitcoin experiences significant price volatility. It should only represent a small portion of a diversified portfolio that you can afford to lose."
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
                <Bitcoin className="w-3 h-3 mr-1" />
                Educational Resource
              </Badge>
              <h1 className="text-3xl font-bold mb-4">Bitcoin & Blockchain Education</h1>
              <p className="text-lg text-muted-foreground mb-6">
                A balanced, educational approach to understanding Bitcoin and blockchain technology 
                for retirement and wealth management.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-gold-premium text-primary hover:bg-gold-dark">
                  <Download className="w-4 h-4 mr-2" />
                  Download Guide
                </Button>
                <Button variant="outline">
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Watch Introduction
                </Button>
              </div>
            </div>
            <div className="text-center">
              <img 
                src={bitcoinCover} 
                alt="Bitcoin Education Guide"
                className="rounded-lg shadow-lg max-w-xs mx-auto"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Educational Points */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center p-6">
          <Shield className="w-8 h-8 text-gold-dark mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Risk-First Education</h3>
          <p className="text-sm text-muted-foreground">
            Understanding volatility, regulatory risks, and proper position sizing before investing.
          </p>
        </Card>
        <Card className="text-center p-6">
          <TrendingUp className="w-8 h-8 text-gold-dark mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Portfolio Context</h3>
          <p className="text-sm text-muted-foreground">
            How Bitcoin fits (or doesn't) within a traditional retirement portfolio strategy.
          </p>
        </Card>
        <Card className="text-center p-6">
          <Bitcoin className="w-8 h-8 text-gold-dark mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Technology Foundation</h3>
          <p className="text-sm text-muted-foreground">
            Understanding the underlying blockchain technology and its potential applications.
          </p>
        </Card>
      </div>

      {/* Educational Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Reading & Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {educationalResources.map((resource, index) => (
              <div key={index} className="border rounded-lg p-4 hover:border-gold-premium/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-sm">{resource.title}</h4>
                  <Badge variant="outline" className="text-xs">{resource.type}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{resource.description}</p>
                <Button size="sm" variant="outline" className="text-xs">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Access Resource
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vetted Custodians */}
      <Card>
        <CardHeader>
          <CardTitle>Vetted Digital Asset Custodians</CardTitle>
          <p className="text-sm text-muted-foreground">
            If you decide to invest, these are institutional-grade custody solutions we've reviewed.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vetted_custodians.map((custodian, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{custodian.name}</h4>
                    <p className="text-sm text-muted-foreground">{custodian.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{custodian.aum}</div>
                    <div className="text-xs text-muted-foreground">Assets Under Custody</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {custodian.features.map((feature, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-2">{faq.question}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="p-6">
          <h4 className="font-semibold text-destructive mb-3">Important Disclaimer</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This educational content does not constitute investment advice. Bitcoin and cryptocurrencies 
            are highly volatile and speculative investments that may not be suitable for all investors. 
            Consult with a qualified financial advisor before making any investment decisions. Past 
            performance does not guarantee future results.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};