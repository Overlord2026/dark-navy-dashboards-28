import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Shield, PhoneCall, CheckCircle2, AlertTriangle, Settings } from 'lucide-react';

export const InsuranceComplianceStep = () => {
  const [callRecordingEnabled, setCallRecordingEnabled] = useState(false);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [complianceRulesSet, setComplianceRulesSet] = useState(false);
  const [medicareCompliance, setMedicareCompliance] = useState(false);

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const complianceFeatures = [
    "Automatic call recording with CMS-compliant timestamps",
    "Secure vault storage with encryption and access controls", 
    "State-specific disclosure requirement tracking",
    "Medicare SOA form integration and e-signature",
    "Call quality monitoring and compliance scoring",
    "Automated compliance reporting and audit trails"
  ];

  const handleStateSelection = (state: string) => {
    setSelectedStates(prev => 
      prev.includes(state) 
        ? prev.filter(s => s !== state)
        : [...prev, state]
    );
  };

  const enableCallRecording = () => {
    setCallRecordingEnabled(true);
    setComplianceRulesSet(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-100 to-emerald-100 p-3 rounded-full">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4">Compliance Tool Activation</h2>
        <p className="text-lg text-muted-foreground">
          Enable call recording for Medicare sales calls and set state-specific compliance rules
        </p>
      </div>

      <div className="space-y-8">
        {/* Call Recording Setup */}
        <Card className={`${callRecordingEnabled ? 'border-green-300 bg-green-50' : 'border-blue-300'}`}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <PhoneCall className="h-5 w-5" />
                <span>Medicare Call Recording</span>
              </div>
              {callRecordingEnabled && (
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">
              Enable automatic call recording for Medicare sales calls with CMS-compliant archiving and timestamps.
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="enable-recording"
                  checked={callRecordingEnabled}
                  onCheckedChange={(checked) => setCallRecordingEnabled(checked === true)}
                />
                <div>
                  <label htmlFor="enable-recording" className="font-medium cursor-pointer">
                    Enable Medicare call recording
                  </label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Automatically record and archive all Medicare-related sales calls with proper disclosures
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="medicare-compliance"
                  checked={medicareCompliance}
                  onCheckedChange={(checked) => setMedicareCompliance(checked === true)}
                />
                <div>
                  <label htmlFor="medicare-compliance" className="font-medium cursor-pointer">
                    Enable Medicare-specific compliance features
                  </label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Includes SOA forms, disclosure tracking, and CMS requirement monitoring
                  </p>
                </div>
              </div>
            </div>

            {callRecordingEnabled && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 mb-3">Compliance Features Enabled:</h4>
                <div className="grid gap-2 md:grid-cols-2">
                  {complianceFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-green-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!callRecordingEnabled && (
              <Button onClick={enableCallRecording} className="w-full mt-4">
                <Shield className="h-4 w-4 mr-2" />
                Enable Call Recording & Compliance
              </Button>
            )}
          </CardContent>
        </Card>

        {/* State-Specific Compliance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>State-Specific Compliance Rules</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">
              Select the states where you are licensed to ensure compliance with local regulations.
            </p>

            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Licensed States</Label>
                <div className="grid grid-cols-5 gap-2 mt-2 max-h-40 overflow-y-auto p-2 border rounded-lg">
                  {states.map((state) => (
                    <div key={state} className="flex items-center space-x-2">
                      <Checkbox
                        id={`state-${state}`}
                        checked={selectedStates.includes(state)}
                        onCheckedChange={() => handleStateSelection(state)}
                      />
                      <Label 
                        htmlFor={`state-${state}`} 
                        className="text-sm cursor-pointer"
                      >
                        {state}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {selectedStates.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">
                    Selected States ({selectedStates.length}):
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedStates.map(state => (
                      <Badge key={state} variant="outline" className="bg-blue-100 text-blue-800">
                        {state}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-blue-700 mt-2">
                    State-specific compliance rules and disclosure requirements will be automatically applied.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Compliance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance Setup Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center p-4 border rounded-lg">
                <div className={`text-2xl font-bold ${callRecordingEnabled ? 'text-green-600' : 'text-gray-400'}`}>
                  {callRecordingEnabled ? '✓' : '○'}
                </div>
                <div className="font-medium">Call Recording</div>
                <div className="text-sm text-muted-foreground">
                  {callRecordingEnabled ? 'Enabled' : 'Not configured'}
                </div>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className={`text-2xl font-bold ${selectedStates.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                  {selectedStates.length}
                </div>
                <div className="font-medium">Licensed States</div>
                <div className="text-sm text-muted-foreground">
                  {selectedStates.length > 0 ? 'Rules configured' : 'No states selected'}
                </div>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className={`text-2xl font-bold ${medicareCompliance ? 'text-green-600' : 'text-gray-400'}`}>
                  {medicareCompliance ? '✓' : '○'}
                </div>
                <div className="font-medium">Medicare Features</div>
                <div className="text-sm text-muted-foreground">
                  {medicareCompliance ? 'Enabled' : 'Not enabled'}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">Important Compliance Notice</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    By enabling call recording, you agree to comply with all applicable federal and state laws 
                    regarding call recording and consent. This includes providing proper disclosures to clients 
                    before recording begins.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};