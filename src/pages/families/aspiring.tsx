import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, DollarSign, Home, GraduationCap, Baby, Briefcase } from 'lucide-react';

export default function AspiringFamiliesPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--bfo-navy))] text-white pt-[var(--header-stack)] scroll-mt-[var(--header-stack)]">
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-[hsl(var(--metallic-gold))]">Aspiring Families</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Build your wealth and secure your family's financial future
          </p>
        </div>

        {/* Demo Section */}
        <Card className="bg-black border border-[hsl(var(--metallic-gold))]">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--metallic-gold))] flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              60-Second Demo: Wealth Building Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-300">
              Get a personalized plan to achieve your family's financial goals and build generational wealth.
            </p>
            
            <Button className="w-full bg-[hsl(var(--metallic-gold))] text-black hover:bg-[hsl(var(--metallic-gold))]/90 font-medium">
              Start Wealth Assessment
            </Button>
          </CardContent>
        </Card>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-black border border-[hsl(var(--metallic-gold))]/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Home className="h-5 w-5 text-[hsl(var(--metallic-gold))]" />
                Home Ownership
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">
                Calculate how much you need to save for your dream home and optimize your mortgage strategy.
              </p>
              <Button variant="outline" className="border-[hsl(var(--metallic-gold))] text-[hsl(var(--metallic-gold))] hover:bg-[hsl(var(--metallic-gold))] hover:text-black">
                Explore Tool
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black border border-[hsl(var(--metallic-gold))]/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-[hsl(var(--metallic-gold))]" />
                Education Funding
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">
                Plan for your children's education with 529 plans and other tax-advantaged strategies.
              </p>
              <Button variant="outline" className="border-[hsl(var(--metallic-gold))] text-[hsl(var(--metallic-gold))] hover:bg-[hsl(var(--metallic-gold))] hover:text-black">
                Explore Tool
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black border border-[hsl(var(--metallic-gold))]/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-[hsl(var(--metallic-gold))]" />
                Career Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">
                Maximize your earning potential and optimize your career trajectory for wealth building.
              </p>
              <Button variant="outline" className="border-[hsl(var(--metallic-gold))] text-[hsl(var(--metallic-gold))] hover:bg-[hsl(var(--metallic-gold))] hover:text-black">
                Explore Tool
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black border border-[hsl(var(--metallic-gold))]/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-[hsl(var(--metallic-gold))]" />
                Investment Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">
                Build a diversified investment portfolio aligned with your risk tolerance and timeline.
              </p>
              <Button variant="outline" className="border-[hsl(var(--metallic-gold))] text-[hsl(var(--metallic-gold))] hover:bg-[hsl(var(--metallic-gold))] hover:text-black">
                Explore Tool
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black border border-[hsl(var(--metallic-gold))]/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Baby className="h-5 w-5 text-[hsl(var(--metallic-gold))]" />
                Family Planning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">
                Plan for the financial impact of growing your family and protect your loved ones.
              </p>
              <Button variant="outline" className="border-[hsl(var(--metallic-gold))] text-[hsl(var(--metallic-gold))] hover:bg-[hsl(var(--metallic-gold))] hover:text-black">
                Explore Tool
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black border border-[hsl(var(--metallic-gold))]/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[hsl(var(--metallic-gold))]" />
                Tax Optimization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">
                Minimize your tax burden and maximize your after-tax wealth accumulation.
              </p>
              <Button variant="outline" className="border-[hsl(var(--metallic-gold))] text-[hsl(var(--metallic-gold))] hover:bg-[hsl(var(--metallic-gold))] hover:text-black">
                Explore Tool
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}