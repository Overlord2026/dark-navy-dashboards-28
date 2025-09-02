import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, TrendingUp } from 'lucide-react';
import { DashboardWidgets } from './DashboardWidgets';

export default function FamilyHome() {
  return (
    <div className="min-h-screen bg-[hsl(var(--bfo-black))] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-white">
            Your Family Financial Hub
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Everything you need to secure your family's financial future, organized and simplified.
          </p>
        </div>

        {/* Dashboard Widgets - Enhanced with FAM_V1 */}
        <DashboardWidgets />

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Goals Card */}
          <div className="bfo-card bfo-no-blur">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-bfo-gold/20 rounded-lg">
                <TrendingUp className="h-8 w-8 text-bfo-gold" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Goals</h3>
                <p className="text-white/70">Plan your financial roadmap</p>
              </div>
            </div>
            <p className="text-white/60 mb-6">
              Set financial milestones, track progress, and get personalized guidance for retirement, 
              education, and major life goals.
            </p>
            <Button 
              className="btn-gold w-full"
              onClick={() => window.location.href = '/goals'}
            >
              Start Roadmap
            </Button>
          </div>

          {/* Vault Card */}
          <div className="bfo-card bfo-no-blur">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-bfo-gold/20 rounded-lg">
                <Shield className="h-8 w-8 text-bfo-gold" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Vault</h3>
                <p className="text-white/70">Secure document storage</p>
              </div>
            </div>
            <p className="text-white/60 mb-6">
              Store and organize your important financial documents, wills, insurance policies, 
              and family records in one secure location.
            </p>
            <Button 
              className="btn-gold w-full"
              onClick={() => window.location.href = '/vault'}
            >
              Open Vault
            </Button>
          </div>
        </div>

        {/* Trust Explainer Footer */}
        <div className="bfo-card bfo-no-blur">
          <div className="text-center">
            <Shield className="h-8 w-8 text-bfo-gold mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-white">
              Bank-Level Security & Trust
            </h3>
            <p className="text-sm text-white/60 max-w-3xl mx-auto">
              Your financial data is protected with enterprise-grade encryption, smart checks for accuracy, 
              and proof slips for every important decision. We never see your account passwords or have 
              access to move your money.
            </p>
            <div className="flex justify-center items-center gap-4 mt-4 text-xs text-white/50">
              <span>🔒 256-bit Encryption</span>
              <span>✓ Smart Checks</span>
              <span>📄 Proof Slips</span>
              <span>🕐 Time-Stamped</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}