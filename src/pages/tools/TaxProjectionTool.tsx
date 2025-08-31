// TODO: flesh out per /out/CPA_UX_Wireframes.md
import React from 'react';
import { BrandHeader } from '@/components/site/BrandHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calculator } from 'lucide-react';

export default function TaxProjectionTool() {
  return (
    <div className="min-h-screen bg-background">
      <BrandHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Tools
            </Button>
          </div>
          
          <section className="bfo-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calculator className="h-8 w-8 text-gold" />
              <h1 className="text-3xl font-bold">Multi-Year Tax Projector</h1>
            </div>
            <p className="text-muted-foreground mb-6">
              Project tax liabilities across multiple years with scenario modeling and optimization recommendations.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Features</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 5-year tax projection modeling</li>
                  <li>• Roth conversion optimization</li>
                  <li>• Tax-loss harvesting scenarios</li>
                  <li>• Estate tax projections</li>
                  <li>• Business entity comparisons</li>
                  <li>• Charitable giving strategies</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Quick Actions</h2>
                <div className="space-y-3">
                  <Button className="w-full gold-button">
                    Start New Projection
                  </Button>
                  <Button className="w-full gold-outline-button">
                    Load Client Template
                  </Button>
                  <Button className="w-full gold-outline-button">
                    View Sample Reports
                  </Button>
                </div>
              </div>
            </div>
          </section>
          
          <section className="bfo-card p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Projections</h2>
            <div className="text-center py-8 text-muted-foreground">
              <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No projections yet. Create your first projection to get started.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}