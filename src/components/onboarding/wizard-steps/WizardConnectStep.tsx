import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Link, Upload, Building2, Landmark, Shield, Lock, CheckCircle } from 'lucide-react';

interface WizardConnectStepProps {
  onComplete: (connectionData: any) => void;
  hasFeature: boolean;
}

export function WizardConnectStep({ onComplete, hasFeature }: WizardConnectStepProps) {
  const [activeTab, setActiveTab] = useState<string>('link');
  const [connecting, setConnecting] = useState<boolean>(false);

  const institutions = [
    { id: 'chase', name: 'Chase', icon: Building2 },
    { id: 'bofa', name: 'Bank of America', icon: Landmark },
    { id: 'wells', name: 'Wells Fargo', icon: Building2 },
    { id: 'citi', name: 'Citibank', icon: Building2 }
  ];

  const handleLinkAccount = async (institutionId?: string) => {
    if (!hasFeature) {
      onComplete({ 
        type: 'gated', 
        feature_required: 'account_linking',
        connected: false 
      });
      return;
    }

    setConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      onComplete({
        type: 'plaid',
        connected: true,
        source: institutionId || 'other',
        success_message: 'Great! We can personalize more now.'
      });
      setConnecting(false);
    }, 2000);
  };

  const handleFileUpload = () => {
    // Simulate file upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.csv,.xlsx';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onComplete({
          type: 'upload',
          connected: true,
          source: 'document_upload',
          filename: file.name,
          success_message: 'Great! We can personalize more now.'
        });
      }
    };
    input.click();
  };

  const handleSkip = () => {
    onComplete({
      type: 'skipped',
      connected: false,
      message: 'You can connect accounts later from your dashboard'
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Connect one data point</h2>
        <p className="text-muted-foreground">
          Link an account or upload a document to unlock personalized insights
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="link" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            Link Account
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Document
          </TabsTrigger>
        </TabsList>

        <TabsContent value="link" className="space-y-4">
          {/* Security Badge */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-green-600" />
                <div className="text-sm">
                  <p className="font-medium text-green-800">Bank-level security</p>
                  <p className="text-green-700">Read-only access • 256-bit encryption • SOC 2 compliant</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Institution Grid */}
          <div className="grid grid-cols-2 gap-3">
            {institutions.map((institution) => {
              const Icon = institution.icon;
              
              return (
                <Card 
                  key={institution.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-sm relative ${
                    !hasFeature ? 'opacity-75' : ''
                  }`}
                  onClick={() => !connecting && handleLinkAccount(institution.id)}
                >
                  {!hasFeature && (
                    <Badge className="absolute -top-2 -right-2 text-xs bg-orange-500">
                      <Lock className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                  
                  <CardContent className="p-4 text-center">
                    <Icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <h3 className="font-medium text-sm">{institution.name}</h3>
                    {connecting && (
                      <p className="text-xs text-muted-foreground mt-1">Connecting...</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleLinkAccount()}
            disabled={connecting}
          >
            {!hasFeature && <Lock className="h-4 w-4 mr-2" />}
            {connecting ? 'Connecting...' : 'Search 2,000+ other banks'}
          </Button>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload a Financial Document</CardTitle>
              <p className="text-sm text-muted-foreground">
                Bank statement, investment account, or budget spreadsheet
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm font-medium mb-2">Drop your file here or click to browse</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Supports PDF, CSV, XLSX files up to 10MB
                </p>
                <Button onClick={handleFileUpload} variant="outline">
                  Choose File
                </Button>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  Files are encrypted and processed securely
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  We'll extract key financial data points
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  You can delete files anytime
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Skip Option */}
      <div className="text-center pt-4 border-t">
        <p className="text-sm text-muted-foreground mb-3">
          Not ready to connect? You can always add accounts later.
        </p>
        <Button variant="ghost" onClick={handleSkip} size="sm">
          Skip for now
        </Button>
      </div>
    </div>
  );
}