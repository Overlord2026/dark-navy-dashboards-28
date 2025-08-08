import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { PhoneCall, Shield, CheckCircle2, FileText, AlertTriangle } from 'lucide-react';

export const MedicareComplianceSetupStep = () => {
  const [twilioConnected, setTwilioConnected] = useState(false);
  const [recordingEnabled, setRecordingEnabled] = useState(false);
  const [complianceChecked, setComplianceChecked] = useState(false);

  const complianceItems = [
    "CMS call recording requirements enabled",
    "Secure vault with Medicare compliance folders created",
    "SOA form templates uploaded and configured",
    "Disclosure scripts available for reference",
    "Compliance monitoring dashboard activated"
  ];

  const handleTwilioSetup = () => {
    // Simulate Twilio connection
    setTwilioConnected(true);
    setRecordingEnabled(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-100 to-emerald-100 p-3 rounded-full">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4">Compliance Setup</h2>
        <p className="text-lg text-muted-foreground">
          Let's configure your CMS-compliant recording and storage system
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {/* Twilio Integration */}
        <Card className={`${twilioConnected ? 'border-green-300 bg-green-50' : 'border-blue-300'}`}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PhoneCall className="h-5 w-5" />
              <span>Twilio Integration</span>
              {twilioConnected && <Badge className="bg-green-100 text-green-800">Connected</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Connect your Twilio account for SMS and voice recording capabilities
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className={`h-4 w-4 ${twilioConnected ? 'text-green-600' : 'text-gray-400'}`} />
                <span className="text-sm">Inbound call recording</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className={`h-4 w-4 ${twilioConnected ? 'text-green-600' : 'text-gray-400'}`} />
                <span className="text-sm">Outbound call recording</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className={`h-4 w-4 ${twilioConnected ? 'text-green-600' : 'text-gray-400'}`} />
                <span className="text-sm">SMS messaging</span>
              </div>
            </div>
            <Button 
              onClick={handleTwilioSetup}
              disabled={twilioConnected}
              className="w-full mt-4"
            >
              {twilioConnected ? 'Connected' : 'Connect Twilio Account'}
            </Button>
          </CardContent>
        </Card>

        {/* Call Recording Setup */}
        <Card className={`${recordingEnabled ? 'border-green-300 bg-green-50' : 'border-amber-300'}`}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Call Recording</span>
              {recordingEnabled && <Badge className="bg-green-100 text-green-800">Enabled</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Automatic recording with CMS-compliant metadata and storage
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className={`h-4 w-4 ${recordingEnabled ? 'text-green-600' : 'text-gray-400'}`} />
                <span className="text-sm">Date/time stamping</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className={`h-4 w-4 ${recordingEnabled ? 'text-green-600' : 'text-gray-400'}`} />
                <span className="text-sm">Secure vault storage</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className={`h-4 w-4 ${recordingEnabled ? 'text-green-600' : 'text-gray-400'}`} />
                <span className="text-sm">Client categorization</span>
              </div>
            </div>
            {!recordingEnabled && (
              <div className="flex items-center space-x-2 mt-4 p-3 bg-amber-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-amber-700">Connect Twilio first to enable recording</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* CMS Compliance Checklist */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5" />
            <span>CMS Compliance Checklist</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            Your compliance requirements will be automatically configured:
          </p>
          <div className="space-y-4">
            {complianceItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-800 mb-2">Compliance PDF Generated</p>
            <p className="text-sm text-blue-700">
              A comprehensive compliance guide will be automatically created in your secure vault, 
              including all CMS requirements and best practices for Medicare sales.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Final Confirmation */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
              <Checkbox 
                id="compliance-agreement"
                checked={complianceChecked}
                onCheckedChange={(checked) => setComplianceChecked(checked === true)}
            />
            <div className="space-y-1">
              <label htmlFor="compliance-agreement" className="text-sm font-medium cursor-pointer">
                I understand the CMS compliance requirements for Medicare sales
              </label>
              <p className="text-xs text-muted-foreground">
                I acknowledge that all Medicare-related calls will be recorded and stored according 
                to CMS guidelines, and I will follow all required disclosure procedures.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};