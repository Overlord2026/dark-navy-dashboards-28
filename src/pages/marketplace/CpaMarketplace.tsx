// TODO: flesh out per /out/CPA_UX_Wireframes.md
import React from 'react';
import { BrandHeader } from '@/components/layout/BrandHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function CpaMarketplace() {
  const cpas = [
    { id: 1, name: "Sarah Johnson, CPA", specialty: "Tax Planning", rating: 4.9, location: "New York, NY" },
    { id: 2, name: "Michael Chen, CPA", specialty: "Estate Tax", rating: 4.8, location: "San Francisco, CA" },
    { id: 3, name: "Lisa Rodriguez, CPA", specialty: "Small Business", rating: 4.7, location: "Austin, TX" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <BrandHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <section className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Find Expert CPAs</h1>
            <p className="text-xl text-muted-foreground">
              Connect with certified public accountants specializing in your needs
            </p>
          </section>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input placeholder="Search by specialty or location..." className="flex-1" />
            <Button className="gold-button">Search CPAs</Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="outline">All Specialties</Badge>
            <Badge variant="outline">Tax Planning</Badge>
            <Badge variant="outline">Estate Tax</Badge>
            <Badge variant="outline">Business Tax</Badge>
            <Badge variant="outline">Audit</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cpas.map((cpa) => (
              <div key={cpa.id} className="bfo-card p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    {cpa.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold">{cpa.name}</h3>
                    <p className="text-sm text-muted-foreground">{cpa.specialty}</p>
                    <p className="text-sm text-muted-foreground">{cpa.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge>★ {cpa.rating}</Badge>
                  <Button 
                    size="sm" 
                    className="gold-outline-button"
                    onClick={() => window.location.href = `/marketplace/cpas/${cpa.id}`}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}