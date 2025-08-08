import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Upload, User, Building, Shield, FileText } from 'lucide-react';

export const InsuranceProfileSetupStep = () => {
  const [formData, setFormData] = useState({
    agentName: '',
    agencyName: '',
    licenseNumber: '',
    email: '',
    phone: ''
  });

  const [selectedLines, setSelectedLines] = useState<string[]>([]);
  const [logoUploaded, setLogoUploaded] = useState(false);
  const [complianceUploaded, setComplianceUploaded] = useState(false);

  const insuranceLines = [
    { id: 'life', name: 'Life Insurance', description: 'Term, Whole, Universal Life policies' },
    { id: 'health', name: 'Health Insurance', description: 'Individual and Group Health plans' },
    { id: 'medicare_advantage', name: 'Medicare Advantage', description: 'Medicare Part C plans' },
    { id: 'medicare_supplement', name: 'Medicare Supplement', description: 'Medigap policies' },
    { id: 'ltc', name: 'Long-Term Care', description: 'LTC insurance and hybrid products' },
    { id: 'disability', name: 'Disability Insurance', description: 'Short and Long-term disability' },
    { id: 'annuities', name: 'Annuities', description: 'Fixed and Variable annuity products' },
    { id: 'property', name: 'Property & Casualty', description: 'Auto, Home, Umbrella policies' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleInsuranceLine = (lineId: string) => {
    setSelectedLines(prev => 
      prev.includes(lineId) 
        ? prev.filter(id => id !== lineId)
        : [...prev, lineId]
    );
  };

  const handleFileUpload = (type: 'logo' | 'compliance') => {
    // Simulate file upload
    if (type === 'logo') {
      setLogoUploaded(true);
    } else {
      setComplianceUploaded(true);
    }
  };

  const isFormValid = formData.agentName && formData.email && formData.phone && selectedLines.length > 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-100 to-emerald-100 p-3 rounded-full">
            <User className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4">Profile Setup</h2>
        <p className="text-lg text-muted-foreground">
          Let's set up your insurance professional profile and compliance documentation
        </p>
      </div>

      <div className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Agent Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="agent-name">Agent Name *</Label>
                <Input
                  id="agent-name"
                  placeholder="Enter your full name"
                  value={formData.agentName}
                  onChange={(e) => handleInputChange('agentName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agency-name">Agency Name</Label>
                <Input
                  id="agency-name"
                  placeholder="Your agency or firm name"
                  value={formData.agencyName}
                  onChange={(e) => handleInputChange('agencyName', e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="license">License Number</Label>
                <Input
                  id="license"
                  placeholder="Insurance license #"
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lines of Insurance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Lines of Insurance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">
              Select the types of insurance products you sell (select all that apply):
            </p>
            
            <div className="grid gap-4 md:grid-cols-2">
              {insuranceLines.map((line) => (
                <Card 
                  key={line.id}
                  className={`cursor-pointer transition-all ${
                    selectedLines.includes(line.id) 
                      ? 'border-primary bg-primary/5' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => toggleInsuranceLine(line.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={selectedLines.includes(line.id)}
                        onChange={() => {}} // Handled by card click
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{line.name}</h3>
                        <p className="text-sm text-muted-foreground">{line.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedLines.length > 0 && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">
                  Selected Lines ({selectedLines.length}):
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedLines.map(lineId => {
                    const line = insuranceLines.find(l => l.id === lineId);
                    return (
                      <Badge key={lineId} className="bg-green-100 text-green-800">
                        {line?.name}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* File Uploads */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Agency Branding & Compliance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Agency Logo */}
              <div className="space-y-4">
                <Label>Agency Logo (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {logoUploaded ? (
                    <div className="text-green-600">
                      <FileText className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm font-medium">Logo uploaded successfully</p>
                    </div>
                  ) : (
                    <div>
                      <Building className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">Upload your agency logo</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleFileUpload('logo')}
                      >
                        Choose File
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Compliance Documentation */}
              <div className="space-y-4">
                <Label>Compliance Documentation</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {complianceUploaded ? (
                    <div className="text-green-600">
                      <Shield className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm font-medium">Compliance docs uploaded</p>
                    </div>
                  ) : (
                    <div>
                      <Shield className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">License, E&O, State registrations</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleFileUpload('compliance')}
                      >
                        Upload Files
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Setup Summary */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Profile Setup Summary</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-800">Agent Info</div>
                  <div className="text-blue-600">
                    {isFormValid ? 'Complete' : 'Incomplete'}
                  </div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-800">Insurance Lines</div>
                  <div className="text-green-600">
                    {selectedLines.length} Selected
                  </div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="font-medium text-purple-800">Files</div>
                  <div className="text-purple-600">
                    {logoUploaded && complianceUploaded ? 'All Uploaded' : 'Optional'}
                  </div>
                </div>
              </div>
              
              {!isFormValid && (
                <p className="text-sm text-muted-foreground mt-4">
                  Please complete required fields to continue
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};