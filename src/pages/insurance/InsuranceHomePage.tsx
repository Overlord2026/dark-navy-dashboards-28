import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Phone, FileText, CheckCircle, AlertTriangle, Users, FileCheck } from 'lucide-react';
import { toast } from 'sonner';

interface InsuranceHomePageProps {
  segment?: 'life-annuity' | 'medicare-ltc';
}

export const InsuranceHomePage: React.FC<InsuranceHomePageProps> = ({ segment = 'life-annuity' }) => {
  const [activeTab, setActiveTab] = useState(segment);

  const handleQuickAction = (action: string) => {
    // Track analytics
    const event = `insurance.${action}`;
    console.log(`[Analytics] ${event}`, { segment: activeTab });
    
    toast.success(`${action.replace('_', ' ')} initiated`, {
      description: "Action logged with compliance tracking"
    });
  };

  const MedicareComplianceChips = () => (
    <div className="grid grid-cols-4 md:grid-cols-7 gap-2 mb-6">
      <Badge variant="outline" className="text-xs flex items-center gap-1">
        <CheckCircle className="h-3 w-3 text-green-500" />
        PTC ✓
      </Badge>
      <Badge variant="outline" className="text-xs flex items-center gap-1">
        <CheckCircle className="h-3 w-3 text-green-500" />
        DNC ✓
      </Badge>
      <Badge variant="outline" className="text-xs flex items-center gap-1">
        <AlertTriangle className="h-3 w-3 text-yellow-500" />
        SOA
      </Badge>
      <Badge variant="outline" className="text-xs flex items-center gap-1">
        <CheckCircle className="h-3 w-3 text-green-500" />
        Disclaimer ✓
      </Badge>
      <Badge variant="outline" className="text-xs flex items-center gap-1">
        <AlertTriangle className="h-3 w-3 text-yellow-500" />
        PECL
      </Badge>
      <Badge variant="outline" className="text-xs flex items-center gap-1">
        <AlertTriangle className="h-3 w-3 text-yellow-500" />
        Enrollment
      </Badge>
      <Badge variant="outline" className="text-xs flex items-center gap-1">
        <CheckCircle className="h-3 w-3 text-green-500" />
        Retention 10y ✓
      </Badge>
    </div>
  );

  const MedicareDisclaimerBanner = () => (
    <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 p-4 mb-6">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">Required Medicare Disclaimers</p>
          <p className="text-blue-700 dark:text-blue-300 mb-2">
            "We do not offer every plan available in your area. Any information we provide is limited to the plans we do offer in your area."
          </p>
          <p className="text-blue-700 dark:text-blue-300">
            "Please contact Medicare.gov or 1-800-MEDICARE to get information on all of your options."
          </p>
          <div className="mt-3">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm font-medium">Read aloud to beneficiary before recorded call</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Insurance Home</h1>
        <Badge variant="secondary">Professional Tools</Badge>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="life-annuity">Life & Annuity</TabsTrigger>
          <TabsTrigger value="medicare-ltc">Medicare & LTC</TabsTrigger>
        </TabsList>

        <TabsContent value="life-annuity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Life & Annuity Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button 
                  onClick={() => handleQuickAction('new_lead')}
                  className="flex items-center gap-2 h-11"
                >
                  <Users className="h-4 w-4" />
                  New Lead
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleQuickAction('needs_analysis')}
                  className="flex items-center gap-2 h-11"
                >
                  <FileText className="h-4 w-4" />
                  Needs Analysis
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleQuickAction('illustration')}
                  className="flex items-center gap-2 h-11"
                >
                  <FileCheck className="h-4 w-4" />
                  Illustration
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleQuickAction('suitability')}
                  className="flex items-center gap-2 h-11"
                >
                  <CheckCircle className="h-4 w-4" />
                  Suitability
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medicare-ltc" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Medicare & Supplements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MedicareComplianceChips />
              <MedicareDisclaimerBanner />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Button 
                  onClick={() => handleQuickAction('new_lead')}
                  className="flex items-center gap-2 h-11"
                >
                  <Users className="h-4 w-4" />
                  New Lead
                </Button>
                <Button 
                  onClick={() => handleQuickAction('start_recorded_call')}
                  className="flex items-center gap-2 h-11"
                >
                  <Phone className="h-4 w-4" />
                  Start Recorded Call
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleQuickAction('soa')}
                  className="flex items-center gap-2 h-11"
                >
                  <FileText className="h-4 w-4" />
                  SOA
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline"
                  onClick={() => handleQuickAction('pecl')}
                  className="flex items-center gap-2 h-11"
                >
                  <FileCheck className="h-4 w-4" />
                  PECL
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleQuickAction('enroll')}
                  className="flex items-center gap-2 h-11"
                >
                  <CheckCircle className="h-4 w-4" />
                  Enroll
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleQuickAction('export_pack')}
                  className="flex items-center gap-2 h-11"
                >
                  <FileText className="h-4 w-4" />
                  Export Pack
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};