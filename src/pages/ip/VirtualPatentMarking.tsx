import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, FileText, Globe, Calendar } from 'lucide-react';
import { PATENT_MODULES, OWNER_INFO } from '@/config/patent-modules';

export default function VirtualPatentMarking() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-black text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <Shield className="h-12 w-12 text-[#C7A449]" />
            <div>
              <h1 className="text-4xl font-bold">BFO™ Patent Portfolio</h1>
              <p className="text-xl text-gray-300">Virtual Patent Marking Page</p>
            </div>
          </div>
          <p className="text-lg text-gray-200 max-w-4xl">
            The following products and services are protected by one or more patents pending in the United States and internationally. 
            This page constitutes virtual patent marking under 35 U.S.C. § 287(a).
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Owner Information */}
        <Card className="mb-8 border-[#C7A449]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#C7A449]" />
              Patent Owner Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p><strong>Inventor/Owner:</strong> {OWNER_INFO.inventor}</p>
                <p><strong>Address:</strong> {OWNER_INFO.address}</p>
              </div>
              <div>
                <p><strong>Email:</strong> {OWNER_INFO.email}</p>
                <p><strong>Phone:</strong> {OWNER_INFO.phone}</p>
                <p><strong>Entity Type:</strong> {OWNER_INFO.entity_type}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patent Applications */}
        <div className="grid gap-6">
          <h2 className="text-3xl font-bold mb-6">Patent Applications Pending</h2>
          
          {Object.values(PATENT_MODULES).map((module) => (
            <Card key={module.id} className="border-l-4 border-l-[#C7A449]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-[#C7A449] text-black font-bold">
                      {module.id}
                    </Badge>
                    {module.name}
                  </CardTitle>
                  <Badge variant="secondary" className="bg-black text-[#C7A449]">
                    Patent Pending
                  </Badge>
                </div>
                <p className="text-xl text-muted-foreground">{module.title}</p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{module.description}</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Protected Routes:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {module.routes.map((route, idx) => (
                        <li key={idx} className="font-mono bg-muted px-2 py-1 rounded">
                          {route}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Analytics Events:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {module.events.map((event, idx) => (
                        <li key={idx} className="font-mono bg-muted px-2 py-1 rounded">
                          {event}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Notice */}
        <Card className="mt-12 bg-gray-50 border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Globe className="h-6 w-6 text-[#C7A449] mt-1" />
              <div>
                <h3 className="font-semibold mb-2">International Protection</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  International patent applications have been filed or are planned under the PCT (Patent Cooperation Treaty) 
                  for the following jurisdictions: United States, European Union, United Kingdom, Canada, Australia, 
                  Japan, South Korea, Singapore, and China.
                </p>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Last Updated: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}