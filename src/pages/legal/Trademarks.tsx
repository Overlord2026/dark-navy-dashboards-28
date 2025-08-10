import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copyright, Shield, Globe, AlertTriangle } from 'lucide-react';
import { TRADEMARK_MODULES, CN_TRANSLITERATIONS, OWNER_INFO } from '@/config/patent-modules';

export default function Trademarks() {
  const trademarkClasses = {
    'IC 36': 'Financial services; investment management; wealth management',
    'IC 41': 'Educational services; training; continuing education',
    'IC 42': 'Software as a service; technology consulting; data analytics',
    'IC 45': 'Legal services; compliance consulting; regulatory advisory'
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-black text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <Copyright className="h-12 w-12 text-[#C7A449]" />
            <div>
              <h1 className="text-4xl font-bold">BFO™ Trademark Portfolio</h1>
              <p className="text-xl text-gray-300">Registered and Pending Trademarks</p>
            </div>
          </div>
          <p className="text-lg text-gray-200 max-w-4xl">
            The following trademarks are owned by {OWNER_INFO.inventor} and are registered, pending registration, 
            or used in commerce in the United States and internationally.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Usage Notice */}
        <Card className="mb-8 border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
              Trademark Usage Notice
            </CardTitle>
          </CardHeader>
          <CardContent className="text-amber-700">
            <p className="mb-2">
              <strong>Proper Usage:</strong> All BFO trademarks must be used with the appropriate trademark symbol (™ or ®) 
              and should be used as adjectives, not nouns or verbs.
            </p>
            <p>
              <strong>Unauthorized Use:</strong> Use of these trademarks without permission is prohibited and may constitute trademark infringement.
            </p>
          </CardContent>
        </Card>

        {/* US Trademarks */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">United States Trademarks</h2>
          
          <div className="grid gap-6">
            {Object.entries(TRADEMARK_MODULES).map(([id, name]) => (
              <Card key={id} className="border-l-4 border-l-[#C7A449]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-[#C7A449] text-black font-bold">
                        {id}
                      </Badge>
                      {name}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-black text-[#C7A449]">
                      Intent to Use
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">International Classes:</h4>
                      <div className="space-y-2">
                        {Object.entries(trademarkClasses).map(([classCode, description]) => (
                          <div key={classCode} className="text-sm">
                            <Badge variant="outline" className="mr-2">{classCode}</Badge>
                            <span className="text-muted-foreground">{description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Filing Details:</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p><strong>Filing Method:</strong> TEAS Plus</p>
                        <p><strong>Basis:</strong> Intent to Use (1(b))</p>
                        <p><strong>Owner:</strong> {OWNER_INFO.inventor}</p>
                        <p><strong>Status:</strong> Application Pending</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* International Trademarks */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">International Trademark Protection</h2>
          
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Madrid Protocol Filings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                International trademark protection is sought or obtained through the Madrid Protocol for the following jurisdictions:
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {['China (CN)', 'European Union (EU)', 'United Kingdom (UK)', 'Canada (CA)', 'Australia (AU)', 'Japan (JP)', 'South Korea (KR)', 'Singapore (SG)'].map((country) => (
                  <Badge key={country} variant="outline" className="justify-center p-2">
                    {country}
                  </Badge>
                ))}
              </div>

              <div>
                <h4 className="font-semibold mb-3">Chinese Transliterations:</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {Object.entries(CN_TRANSLITERATIONS).map(([english, chinese]) => (
                    <div key={english} className="bg-muted p-3 rounded-lg">
                      <div className="font-semibold">{english}</div>
                      <div className="text-2xl text-[#C7A449] font-bold">{chinese}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Proper Usage Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#C7A449]" />
              Trademark Usage Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-700 mb-2">✓ Correct Usage</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Use BFO Compliance IQ™ software</li>
                  <li>• The EpochVault™ platform provides...</li>
                  <li>• Powered by Liquidity IQ™ technology</li>
                  <li>• BFO™ branded solutions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-700 mb-2">✗ Incorrect Usage</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• We will BFO your portfolio</li>
                  <li>• EpochVault without ™ symbol</li>
                  <li>• Use as a generic term</li>
                  <li>• Modify or alter the marks</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Contact for Licensing:</strong> For authorized use of BFO trademarks, 
                contact {OWNER_INFO.email}. Commercial use without permission is prohibited.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}