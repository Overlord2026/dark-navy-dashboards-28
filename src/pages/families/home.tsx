import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { TrendingUp, Calculator, FileText, Users, Shield, Zap } from 'lucide-react';

export default function FamilyHome() {
  return (
    <div className="min-h-screen bg-black text-white pt-[var(--header-stack)] scroll-mt-[var(--header-stack)]">
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-[#D4AF37]">Welcome to Your Family Office</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your personalized dashboard for wealth management, planning, and family financial coordination
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-black border border-[#D4AF37]">
            <CardHeader>
              <CardTitle className="text-[#D4AF37] flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Financial Planning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">Run scenarios and optimize your family's financial strategy.</p>
              <Link to="/tools/retirement-calculator">
                <Button className="w-full bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90">
                  Start Planning
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-black border border-[#D4AF37]">
            <CardHeader>
              <CardTitle className="text-[#D4AF37] flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Investment Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">Track performance and optimize your investment strategy.</p>
              <Link to="/tools/portfolio">
                <Button className="w-full bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90">
                  View Portfolio
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-black border border-[#D4AF37]">
            <CardHeader>
              <CardTitle className="text-[#D4AF37] flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document Vault
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">Secure storage for all your important family documents.</p>
              <Link to="/tools/documents">
                <Button className="w-full bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90">
                  Access Vault
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Family Tools Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#D4AF37]">Family-Focused Tools</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-black border border-[#D4AF37]/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#D4AF37]" />
                  Estate Planning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">
                  Protect your legacy with comprehensive estate planning tools and strategies.
                </p>
                <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
                  Explore Tool
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-black border border-[#D4AF37]/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#D4AF37]" />
                  Family Governance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">
                  Organize family meetings, decisions, and multi-generational planning.
                </p>
                <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
                  Explore Tool
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-black border border-[#D4AF37]/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[#D4AF37]" />
                  Tax Planning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">
                  Optimize your family's tax strategy with advanced planning tools.
                </p>
                <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
                  Explore Tool
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-black border border-[#D4AF37]/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-[#D4AF37]" />
                  Education Funding
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">
                  Plan and save for children's education with 529 plans and strategies.
                </p>
                <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
                  Explore Tool
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-black border border-[#D4AF37]/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#D4AF37]" />
                  Wealth Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">
                  Track family wealth across generations with detailed analytics.
                </p>
                <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
                  Explore Tool
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-black border border-[#D4AF37]/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#D4AF37]" />
                  Risk Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">
                  Comprehensive insurance and risk assessment for family protection.
                </p>
                <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
                  Explore Tool
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}