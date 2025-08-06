import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Handshake, 
  TrendingUp, 
  CreditCard, 
  FileText, 
  Home, 
  Building, 
  User, 
  Upload,
  ChevronLeft,
  ChevronRight,
  Star,
  Shield,
  BookOpen,
  MessageCircle
} from 'lucide-react';

export function LendingTabWireframe() {
  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-50 bg-background border-b border-border p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-background rounded-full" />
            </div>
            <span className="text-sm text-muted-foreground">BFO Tree Logo</span>
          </div>
          <nav className="flex gap-6">
            <span className="text-muted-foreground">Dashboard</span>
            <span className="text-muted-foreground">Portfolio</span>
            <Badge variant="default" className="bg-primary text-primary-foreground">Lending</Badge>
            <span className="text-muted-foreground">Planning</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-8">
        {/* Hero Banner */}
        <Card className="p-8 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
              <Handshake className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Access Intelligent Lending Solutions</h1>
              <p className="text-primary-foreground/80">Discover the best rates and terms tailored to your portfolio</p>
            </div>
          </div>
        </Card>

        {/* Lending Summary Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Credit Available</h3>
            </div>
            <div className="text-2xl font-bold text-primary">$2.4M</div>
            <p className="text-sm text-muted-foreground">From linked accounts</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Recent Offers</h3>
            </div>
            <div className="text-2xl font-bold text-primary">3</div>
            <p className="text-sm text-muted-foreground">Active pre-approvals</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Rates Trend</h3>
            </div>
            <div className="text-2xl font-bold text-primary">6.25%</div>
            <div className="w-full h-8 bg-muted rounded mt-2 flex items-end gap-1 p-1">
              <div className="bg-primary/60 rounded-sm flex-1 h-2"></div>
              <div className="bg-primary/80 rounded-sm flex-1 h-4"></div>
              <div className="bg-primary rounded-sm flex-1 h-6"></div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Application Status</h3>
            </div>
            <Badge variant="outline" className="text-warning">In Review</Badge>
            <p className="text-sm text-muted-foreground mt-2">HELOC Application</p>
          </Card>
        </div>

        {/* Lending Marketplace */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Lending Marketplace</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><ChevronLeft className="w-4 h-4" /></Button>
              <Button variant="outline" size="sm"><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: "Wells Fargo", rate: "6.15%", type: "Partner Bank" },
              { name: "BFO Credit", rate: "5.95%", type: "BFO Partner", featured: true },
              { name: "Chase", rate: "6.35%", type: "Partner Bank" },
              { name: "Private Lender", rate: "5.75%", type: "Private Credit" }
            ].map((lender, i) => (
              <Card key={i} className={`p-4 ${lender.featured ? 'ring-2 ring-primary' : ''}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-muted rounded-full"></div>
                  <div>
                    <div className="font-medium text-sm">{lender.name}</div>
                    <div className="text-xs text-muted-foreground">{lender.type}</div>
                  </div>
                  {lender.featured && <Star className="w-4 h-4 text-primary ml-auto" />}
                </div>
                <div className="text-lg font-bold text-primary mb-2">{lender.rate}</div>
                <Button size="sm" className="w-full">Apply Now</Button>
              </Card>
            ))}
          </div>
        </Card>

        {/* Pre-Qualification Widget */}
        <Card className="p-6 bg-accent/50">
          <div className="text-center max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-2">Check Your Pre-Qualified Rate</h3>
            <p className="text-muted-foreground mb-4">Soft credit check - won't affect your credit score</p>
            <Button size="lg" className="w-full">
              <Shield className="w-4 h-4 mr-2" />
              Get Pre-Qualified
            </Button>
            <p className="text-xs text-muted-foreground mt-2">Powered by Plaid Integration</p>
          </div>
        </Card>

        {/* Loan Explorer */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Loan Explorer</h2>
          <div className="border-b border-border mb-6">
            <div className="flex gap-6 overflow-x-auto">
              {['Mortgages', 'HELOC', 'Personal Loans', 'Business Lending', 'Private Credit'].map((tab, i) => (
                <button
                  key={i}
                  className={`pb-3 px-1 border-b-2 whitespace-nowrap ${
                    i === 0 ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-4 mb-4">
              <Button variant="outline" size="sm">Amount: $500K+</Button>
              <Button variant="outline" size="sm">Term: 30 Years</Button>
              <Button variant="outline" size="sm">Type: Fixed</Button>
            </div>
            
            {[1, 2, 3].map((offer) => (
              <Card key={offer} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Home className="w-6 h-6 text-primary" />
                    <div>
                      <div className="font-medium">30-Year Fixed Mortgage</div>
                      <div className="text-sm text-muted-foreground">Wells Fargo • Up to $2M</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">6.25%</div>
                    <Button size="sm">View Details</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Application/Status Tracker */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Application Tracker</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">HELOC Application - Wells Fargo</span>
                  <span className="text-sm text-muted-foreground">60% Complete</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              {['Submitted', 'In Review', 'Offer', 'Docs', 'Funded'].map((step, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    i <= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {i + 1}
                  </div>
                  <span className="text-xs text-center">{step}</span>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Upload Documents
            </Button>
          </div>
        </Card>

        {/* Educational Resources */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Educational Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              'How to Choose a Loan',
              'Understanding Credit',
              'HELOC vs Refi',
              'Lending FAQs'
            ].map((title, i) => (
              <Card key={i} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <BookOpen className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-medium mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">Learn more about...</p>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button size="lg">
              <MessageCircle className="w-4 h-4 mr-2" />
              Speak to a Lending Concierge
            </Button>
          </div>
        </Card>

        {/* Compliance/Disclosure Strip */}
        <Card className="p-4 bg-muted/50">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              All rates and terms subject to credit approval. NMLS ID: 123456
            </p>
            <div className="flex items-center justify-center gap-4 text-xs">
              <a href="#" className="text-primary hover:underline">Full Lending Disclosure</a>
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              <a href="#" className="text-primary hover:underline">Terms of Service</a>
            </div>
          </div>
        </Card>
      </div>

      {/* Mobile Sticky Support Button */}
      <div className="fixed bottom-4 right-4 lg:hidden">
        <Button size="lg" className="rounded-full w-14 h-14">
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>

      {/* Gold Tree Watermark */}
      <div className="fixed bottom-4 left-4 opacity-10 pointer-events-none">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
          <div className="w-8 h-8 bg-background rounded-full" />
        </div>
      </div>
    </div>
  );
}