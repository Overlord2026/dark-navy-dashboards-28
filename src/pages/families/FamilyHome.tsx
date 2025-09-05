import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, TrendingUp, Users, Clock } from 'lucide-react';
import { DashboardWidgets } from './DashboardWidgets';
import { ProgressBar } from '@/components/progress/ProgressBar';

export default function FamilyHome() {
  const [selectedPath, setSelectedPath] = useState<'aspiring' | 'retirees' | null>(null);

  const pathConfig = {
    aspiring: {
      title: 'Aspiring Families',
      subtitle: 'Building wealth for tomorrow',
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-teal-600',
      tools: ['retirement', 'tax', 'goals', 'vault']
    },
    retirees: {
      title: 'Retirees',
      subtitle: 'Preserving and enjoying wealth',
      icon: Clock,
      gradient: 'from-amber-500 to-orange-600',
      tools: ['retirement', 'tax', 'vault', 'health']
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--bfo-black))] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Choose Your Path Section */}
        {!selectedPath && (
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4 text-white">
              Choose Your Path
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
              Tell us about your family's stage to personalize your experience
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
              {Object.entries(pathConfig).map(([key, config]) => {
                const IconComponent = config.icon;
                return (
                  <div
                    key={key}
                    className="bfo-card-luxury cursor-pointer"
                    onClick={() => setSelectedPath(key as 'aspiring' | 'retirees')}
                  >
                    <div className="text-center p-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-bfo-gold/10 flex items-center justify-center">
                        <IconComponent className="w-8 h-8 text-bfo-gold" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{config.title}</h3>
                      <p className="text-white/80">{config.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Hero Section */}
        {selectedPath && (
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4 text-white">
              {pathConfig[selectedPath].title} Hub
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Everything you need to secure your family's financial future, organized and simplified.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setSelectedPath(null)}
              className="mt-4 border-bfo-gold text-bfo-gold hover:bg-bfo-gold hover:text-black"
            >
              Change Path
            </Button>
          </div>
        )}

        {/* Dashboard Widgets - Enhanced with FAM_V1 */}
        {selectedPath && <DashboardWidgets />}


        {/* Main Action Cards with Progress */}
        {selectedPath && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Retirement Roadmap Card */}
            <div className="bfo-card bfo-no-blur">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-bfo-gold/20 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-bfo-gold" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Retirement Roadmap</h3>
                  <p className="text-white/70">Plan your retirement journey</p>
                </div>
              </div>
              <p className="text-white/60 mb-6">
                Calculate retirement needs, optimize savings strategies, and track progress toward your goals.
              </p>
              <ProgressBar value={67} label="Retirement Planning" className="mb-6" />
              <Button 
                className="btn-gold w-full"
                onClick={() => window.location.href = '/tools/retirement'}
              >
                Continue Planning
              </Button>
            </div>

            {/* Tax Planning Card */}
            <div className="bfo-card bfo-no-blur">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-bfo-gold/20 rounded-lg">
                  <Shield className="h-8 w-8 text-bfo-gold" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Tax Planning</h3>
                  <p className="text-white/70">Optimize your tax strategy</p>
                </div>
              </div>
              <p className="text-white/60 mb-6">
                Analyze tax-saving opportunities, plan for deductions, and prepare for tax season.
              </p>
              <ProgressBar value={43} label="Tax Strategy" className="mb-6" />
              <Button 
                className="btn-gold w-full"
                onClick={() => window.location.href = '/tools/tax'}
              >
                Review Strategy
              </Button>
            </div>
          </div>
        )}

        {/* Trust Explainer Footer */}
        {selectedPath && (
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
        )}
      </div>
    </div>
  );
}