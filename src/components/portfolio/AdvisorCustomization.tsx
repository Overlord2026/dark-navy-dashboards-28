import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Settings, FileText, Shield, Building } from 'lucide-react';

interface AdvisorBranding {
  firmName: string;
  advisorName: string;
  title: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  logoUrl?: string;
  licenseNumber?: string;
  complianceDisclaimer: string;
  customFooter: string;
}

interface AdvisorCustomizationProps {
  branding: AdvisorBranding;
  onBrandingChange: (branding: AdvisorBranding) => void;
  className?: string;
}

export function AdvisorCustomization({ 
  branding, 
  onBrandingChange, 
  className = "" 
}: AdvisorCustomizationProps) {
  
  const handleFieldChange = (field: keyof AdvisorBranding, value: string) => {
    onBrandingChange({
      ...branding,
      [field]: value
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Advisor Branding & Customization
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Customize the cover page, branding, and compliance disclosures for your reports
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Firm Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-primary" />
              <h3 className="text-lg font-semibold">Firm Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firmName">Firm Name *</Label>
                <Input
                  id="firmName"
                  value={branding.firmName}
                  onChange={(e) => handleFieldChange('firmName', e.target.value)}
                  placeholder="Boutique Family Office"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="advisorName">Advisor Name *</Label>
                <Input
                  id="advisorName"
                  value={branding.advisorName}
                  onChange={(e) => handleFieldChange('advisorName', e.target.value)}
                  placeholder="John Smith, CFP"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Title/Designation</Label>
                <Input
                  id="title"
                  value={branding.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="Senior Wealth Manager"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                  id="licenseNumber"
                  value={branding.licenseNumber || ''}
                  onChange={(e) => handleFieldChange('licenseNumber', e.target.value)}
                  placeholder="RIA-12345678"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={branding.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={branding.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  placeholder="advisor@boutiquefamilyoffice.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={branding.website}
                  onChange={(e) => handleFieldChange('website', e.target.value)}
                  placeholder="www.boutiquefamilyoffice.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo URL (Optional)</Label>
                <Input
                  id="logoUrl"
                  value={branding.logoUrl || ''}
                  onChange={(e) => handleFieldChange('logoUrl', e.target.value)}
                  placeholder="https://yourfirm.com/logo.png"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Business Address</Label>
              <Textarea
                id="address"
                value={branding.address}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                placeholder="123 Financial District&#10;Suite 456&#10;New York, NY 10001"
                rows={3}
              />
            </div>
          </div>

          <Separator />

          {/* Compliance & Legal */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <h3 className="text-lg font-semibold">Compliance & Legal Disclosures</h3>
              <Badge variant="outline" className="text-xs">Required</Badge>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="complianceDisclaimer">Compliance Disclaimer *</Label>
                <Textarea
                  id="complianceDisclaimer"
                  value={branding.complianceDisclaimer}
                  onChange={(e) => handleFieldChange('complianceDisclaimer', e.target.value)}
                  placeholder="This report is for informational purposes only and does not constitute investment advice. Past performance is not indicative of future results. Securities offered through [Broker-Dealer Name], Member FINRA/SIPC."
                  rows={4}
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Include required regulatory disclosures, FINRA/SIPC membership, and investment advisory disclaimers
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customFooter">Custom Footer Text</Label>
                <Textarea
                  id="customFooter"
                  value={branding.customFooter}
                  onChange={(e) => handleFieldChange('customFooter', e.target.value)}
                  placeholder="Additional disclosures, ADV Part 2 notice, or custom messaging for your clients"
                  rows={3}
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Preview Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <h3 className="text-lg font-semibold">Cover Page Preview</h3>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
              <div className="text-center space-y-3">
                {branding.logoUrl && (
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Building className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                )}
                
                <h1 className="text-2xl font-bold text-gray-900">
                  {branding.firmName || 'Your Firm Name'}
                </h1>
                
                <div className="space-y-1 text-gray-700">
                  <p className="font-medium">{branding.advisorName || 'Advisor Name'}</p>
                  {branding.title && <p className="text-sm">{branding.title}</p>}
                  {branding.licenseNumber && (
                    <p className="text-xs text-gray-600">License: {branding.licenseNumber}</p>
                  )}
                </div>
                
                <div className="pt-4 border-t border-blue-200 space-y-1 text-sm text-gray-600">
                  {branding.phone && <p>{branding.phone}</p>}
                  {branding.email && <p>{branding.email}</p>}
                  {branding.website && <p>{branding.website}</p>}
                </div>
                
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Portfolio Review & Analysis
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Prepared for [Client Name]
                  </p>
                </div>
              </div>
            </div>
            
            {/* Compliance Preview */}
            {branding.complianceDisclaimer && (
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Compliance Footer Preview:</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {branding.complianceDisclaimer}
                </p>
                {branding.customFooter && (
                  <p className="text-xs text-gray-600 leading-relaxed mt-2 pt-2 border-t border-gray-200">
                    {branding.customFooter}
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}