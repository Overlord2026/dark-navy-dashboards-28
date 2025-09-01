import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield, Heart, Car, Home, Users, Activity } from 'lucide-react';

const insuranceTypes = [
  {
    title: 'Life Insurance',
    href: '/pros/insurance/life',
    icon: Heart,
    description: 'Term, whole, universal, and variable life insurance products',
    color: 'text-red-400'
  },
  {
    title: 'Annuities',
    href: '/pros/insurance/annuity',
    icon: Shield,
    description: 'Fixed, variable, and indexed annuity products for retirement income',
    color: 'text-blue-400'
  },
  {
    title: 'Property & Casualty',
    href: '/pros/insurance/pc',
    icon: Car,
    description: 'Auto, home, commercial, and specialty P&C insurance',
    color: 'text-green-400'
  },
  {
    title: 'Medicare',
    href: '/pros/insurance/medicare',
    icon: Activity,
    description: 'Medicare supplements, Advantage plans, and prescription drug coverage',
    color: 'text-purple-400'
  },
  {
    title: 'Long-Term Care',
    href: '/pros/insurance/ltc',
    icon: Users,
    description: 'Traditional LTC, hybrid products, and care planning solutions',
    color: 'text-orange-400'
  }
];

export default function InsurancePersonaPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-[var(--header-stack)] scroll-mt-[var(--header-stack)]">
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-[#D4AF37]">Insurance Professionals</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Comprehensive tools for insurance agents, brokers, and agency management
          </p>
        </div>

        {/* Demo Section */}
        <Card className="bg-black border border-[#D4AF37]">
          <CardHeader>
            <CardTitle className="text-[#D4AF37] flex items-center gap-2">
              <Shield className="h-5 w-5" />
              60-Second Demo: Quote & Bind Workflow
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-300">
              Experience our streamlined quote-to-bind process with real-time underwriting and instant policy issuance.
            </p>
            
            <Button className="w-full bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-medium">
              Start Demo Quote
            </Button>
          </CardContent>
        </Card>

        {/* Insurance Types Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#D4AF37] text-center">Insurance Product Lines</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {insuranceTypes.map((type) => {
              const Icon = type.icon;
              
              return (
                <Link key={type.title} to={type.href}>
                  <Card className="bg-black border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-colors h-full">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Icon className={`h-5 w-5 ${type.color}`} />
                        {type.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400 text-sm">{type.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Tools Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-black border border-[#D4AF37]/30">
            <CardHeader>
              <CardTitle className="text-white">CRM & Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">
                Manage leads, prospects, and clients with integrated workflow automation.
              </p>
              <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
                Explore Tool
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black border border-[#D4AF37]/30">
            <CardHeader>
              <CardTitle className="text-white">Quoting Engine</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">
                Multi-carrier quoting with real-time rates and instant proposals.
              </p>
              <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
                Explore Tool
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black border border-[#D4AF37]/30">
            <CardHeader>
              <CardTitle className="text-white">Policy Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">
                Policy administration, renewals, and client communication tools.
              </p>
              <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
                Explore Tool
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black border border-[#D4AF37]/30">
            <CardHeader>
              <CardTitle className="text-white">Commission Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">
                Real-time commission tracking, reporting, and payment reconciliation.
              </p>
              <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
                Explore Tool
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black border border-[#D4AF37]/30">
            <CardHeader>
              <CardTitle className="text-white">Compliance Suite</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">
                License tracking, CE requirements, and regulatory compliance monitoring.
              </p>
              <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
                Explore Tool
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black border border-[#D4AF37]/30">
            <CardHeader>
              <CardTitle className="text-white">Agency Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">
                Business intelligence, performance metrics, and growth analytics.
              </p>
              <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
                Explore Tool
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}