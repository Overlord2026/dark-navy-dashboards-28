import React from 'react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, FileText, Receipt, Users, TrendingUp, Clock } from 'lucide-react';

export default function TaxHubPro() {
  return (
    <div className="min-h-screen bg-background">
      
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <section className="bfo-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calculator className="h-8 w-8 text-bfo-gold" />
              <h1 className="text-3xl font-bold">TaxHub Pro - CPA Console</h1>
            </div>
            <p className="text-muted-foreground mb-6">
              Professional tax planning and client management platform for CPAs
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="gold-button flex items-center gap-2 h-20 flex-col">
                <Users className="h-6 w-6" />
                <span>Client Intake</span>
              </Button>
              
              <Button className="gold-outline-button flex items-center gap-2 h-20 flex-col">
                <TrendingUp className="h-6 w-6" />
                <span>Tax Projections</span>
              </Button>
              
              <Button className="gold-outline-button flex items-center gap-2 h-20 flex-col">
                <Receipt className="h-6 w-6" />
                <span>Receipt Manager</span>
              </Button>
            </div>
          </section>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bfo-card p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-bfo-gold" />
                Recent Projects
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <span className="font-medium">Smith Family 2024</span>
                    <Badge variant="outline" className="ml-2">Review</Badge>
                  </div>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <span className="font-medium">Jones LLC Filing</span>
                    <Badge variant="secondary" className="ml-2">Draft</Badge>
                  </div>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <span className="font-medium">Estate Planning - Wilson</span>
                    <Badge variant="default" className="ml-2">Complete</Badge>
                  </div>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <Button className="w-full mt-4 gold-outline-button">
                View All Projects
              </Button>
            </section>
            
            <section className="bfo-card p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button className="w-full gold-button">
                  Start New Client Intake
                </Button>
                <Button className="w-full gold-outline-button">
                  Upload Tax Documents
                </Button>
                <Button className="w-full gold-outline-button">
                  Generate Projection Report
                </Button>
                <Button className="w-full gold-outline-button">
                  Export Client Data
                </Button>
              </div>
            </section>
          </div>
          
          <section className="bfo-card p-6">
            <h2 className="text-xl font-semibold mb-4">Professional Tools</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="bg-muted rounded-lg p-4 mb-2">
                  <Calculator className="h-8 w-8 mx-auto text-bfo-gold" />
                </div>
                <p className="text-sm">Tax Calculator</p>
              </div>
              <div className="text-center">
                <div className="bg-muted rounded-lg p-4 mb-2">
                  <FileText className="h-8 w-8 mx-auto text-bfo-gold" />
                </div>
                <p className="text-sm">Form Builder</p>
              </div>
              <div className="text-center">
                <div className="bg-muted rounded-lg p-4 mb-2">
                  <TrendingUp className="h-8 w-8 mx-auto text-bfo-gold" />
                </div>
                <p className="text-sm">Analytics</p>
              </div>
              <div className="text-center">
                <div className="bg-muted rounded-lg p-4 mb-2">
                  <Receipt className="h-8 w-8 mx-auto text-bfo-gold" />
                </div>
                <p className="text-sm">Receipts</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}