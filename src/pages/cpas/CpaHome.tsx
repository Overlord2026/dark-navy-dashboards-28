// TODO: flesh out per /out/CPA_UX_Wireframes.md
import React from 'react';

import { PersonaSubHeader } from '@/components/layout/PersonaSubHeader';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calculator, Users, BookOpen } from 'lucide-react';
import { FLAGS } from '@/config/flags';
import AssistedBadge from '@/components/badges/AssistedBadge';

export default function CpaHome() {
  return (
    <div className="min-h-screen bg-background">
      
      <PersonaSubHeader>
        <span className="text-bfo-gold">CPA Dashboard</span>
      </PersonaSubHeader>
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <section className="bfo-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold">CPA Command Center</h1>
              {FLAGS.__ENABLE_AGENT_AUTOMATIONS__ && <AssistedBadge />}
            </div>
            <p className="text-muted-foreground mb-6">
              Welcome to your comprehensive tax professional workspace
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="gold-button flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Tax Projections
                <ArrowRight className="h-4 w-4" />
              </Button>
              
              <Button className="gold-outline-button flex items-center gap-2">
                <Users className="h-4 w-4" />
                Client Portal
                <ArrowRight className="h-4 w-4" />
              </Button>
              
              <Button className="gold-outline-button flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                CE Center
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </section>
          
          <section className="bfo-card p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="bg-muted rounded-lg p-4 mb-2">📊</div>
                <p className="text-sm">Start Tax Projection</p>
              </div>
              <div className="text-center">
                <div className="bg-muted rounded-lg p-4 mb-2">📁</div>
                <p className="text-sm">Client Documents</p>
              </div>
              <div className="text-center">
                <div className="bg-muted rounded-lg p-4 mb-2">🎓</div>
                <p className="text-sm">CE Requirements</p>
              </div>
              <div className="text-center">
                <div className="bg-muted rounded-lg p-4 mb-2">📋</div>
                <p className="text-sm">Compliance Tools</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}