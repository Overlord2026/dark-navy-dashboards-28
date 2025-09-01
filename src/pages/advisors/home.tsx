import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, BarChart3, Shield, Calendar, FileText, TrendingUp } from 'lucide-react';

export default function AdvisorHome() {
  return (
    <div className="min-h-screen bg-black text-white pt-[var(--header-stack)] scroll-mt-[var(--header-stack)]">
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-[#D4AF37]">Welcome to Your Practice Dashboard</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Professional-grade tools to grow your practice and deliver exceptional client service
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-black border border-[#D4AF37]">
            <CardHeader>
              <CardTitle className="text-[#D4AF37] flex items-center gap-2">
                <Users className="h-5 w-5" />
                Client Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">Manage client relationships and communications in one place.</p>
              <Link to="/advisors/clients">
                <Button className="w-full bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90">
                  View Clients
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-black border border-[#D4AF37]">
            <CardHeader>
              <CardTitle className="text-[#D4AF37] flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Practice Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">Track business metrics and identify growth opportunities.</p>
              <Link to="/advisors/analytics">
                <Button className="w-full bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90">
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-black border border-[#D4AF37]">
            <CardHeader>
              <CardTitle className="text-[#D4AF37] flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Meetings & Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">Schedule client meetings and manage your daily workflow.</p>
              <Link to="/advisors/meetings">
                <Button className="w-full bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90">
                  View Schedule
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Professional Tools Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#D4AF37]">Professional Tools</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-black border border-[#D4AF37]/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#D4AF37]" />
                  Financial Planning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">
                  Create comprehensive financial plans with advanced modeling tools.
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
                  Compliance Suite
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">
                  Stay compliant with automated tracking and regulatory reporting.
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
                  Investment Research
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">
                  Access institutional-grade research and due diligence tools.
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
                  Prospect Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">
                  Manage leads and prospects through your sales process.
                </p>
                <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
                  Explore Tool
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-black border border-[#D4AF37]/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#D4AF37]" />
                  Performance Reporting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">
                  Generate client reports and performance summaries automatically.
                </p>
                <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
                  Explore Tool
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-black border border-[#D4AF37]/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#D4AF37]" />
                  Document Center
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">
                  Secure document storage and client collaboration platform.
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