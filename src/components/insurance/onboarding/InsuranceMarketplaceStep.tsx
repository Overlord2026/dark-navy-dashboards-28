import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Network, 
  Users, 
  TrendingUp, 
  FileText, 
  DollarSign, 
  CheckCircle2,
  ArrowRight,
  Crown
} from 'lucide-react';

export const InsuranceMarketplaceStep = () => {
  const [selectedConnections, setSelectedConnections] = useState<string[]>([]);
  const [marketplaceEnabled, setMarketplaceEnabled] = useState(true);
  const [referralPreferences, setReferralPreferences] = useState<string[]>([]);

  const professionalTypes = [
    {
      id: 'financial_advisors',
      title: 'Financial Advisors',
      description: 'Investment planning and wealth management',
      icon: <TrendingUp className="h-6 w-6 text-emerald-600" />,
      benefits: ['Retirement planning referrals', 'Investment-linked insurance', 'Estate planning coordination']
    },
    {
      id: 'cpas',
      title: 'CPAs & Tax Professionals',
      description: 'Tax planning and accounting services',
      icon: <FileText className="h-6 w-6 text-blue-600" />,
      benefits: ['Tax-efficient insurance strategies', 'Business insurance planning', 'Estate tax coordination']
    },
    {
      id: 'attorneys',
      title: 'Estate Planning Attorneys',
      description: 'Legal planning and estate services',
      icon: <Users className="h-6 w-6 text-purple-600" />,
      benefits: ['Trust-owned life insurance', 'Estate planning integration', 'Legal structure guidance']
    },
    {
      id: 'healthcare',
      title: 'Healthcare Professionals',
      description: 'Medical and wellness providers',
      icon: <CheckCircle2 className="h-6 w-6 text-red-600" />,
      benefits: ['Health insurance coordination', 'Medicare supplement planning', 'Wellness program integration']
    }
  ];

  const referralServices = [
    { id: 'receive_referrals', label: 'Receive referrals from other professionals' },
    { id: 'send_referrals', label: 'Send referrals to trusted partners' },
    { id: 'joint_planning', label: 'Participate in joint planning sessions' },
    { id: 'shared_clients', label: 'Collaborate on shared client cases' }
  ];

  const toggleConnection = (connectionId: string) => {
    setSelectedConnections(prev => 
      prev.includes(connectionId)
        ? prev.filter(id => id !== connectionId)
        : [...prev, connectionId]
    );
  };

  const toggleReferralPreference = (preferenceId: string) => {
    setReferralPreferences(prev => 
      prev.includes(preferenceId)
        ? prev.filter(id => id !== preferenceId)
        : [...prev, preferenceId]
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-100 to-emerald-100 p-3 rounded-full">
            <Network className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4">Marketplace Integration</h2>
        <p className="text-lg text-muted-foreground">
          Connect to advisors, CPAs, attorneys for cross-referrals and comprehensive client service
        </p>
      </div>

      <div className="space-y-8">
        {/* Marketplace Overview */}
        <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-emerald-800 mb-4">
                Welcome to the BFO Professional Network
              </h3>
              <p className="text-emerald-700 max-w-2xl mx-auto">
                Join a curated network of vetted financial professionals dedicated to providing 
                comprehensive wealth and protection planning for high-net-worth families.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3 text-center">
              <div>
                <div className="text-2xl font-bold text-emerald-600">500+</div>
                <div className="text-sm text-emerald-700">Verified Professionals</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">$2.5B+</div>
                <div className="text-sm text-blue-700">Assets Under Management</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">95%</div>
                <div className="text-sm text-purple-700">Client Satisfaction</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Connections */}
        <Card>
          <CardHeader>
            <CardTitle>Connect with Professional Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">
              Select the types of professionals you'd like to connect with for client referrals and collaboration:
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              {professionalTypes.map((type) => (
                <Card 
                  key={type.id}
                  className={`cursor-pointer transition-all ${
                    selectedConnections.includes(type.id) 
                      ? 'border-primary bg-primary/5' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => toggleConnection(type.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={selectedConnections.includes(type.id)}
                        onChange={() => {}} // Handled by card click
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {type.icon}
                          <h3 className="font-semibold">{type.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {type.description}
                        </p>
                        <div className="space-y-1">
                          {type.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center space-x-1 text-xs">
                              <CheckCircle2 className="h-3 w-3 text-green-600" />
                              <span className="text-muted-foreground">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedConnections.length > 0 && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">
                  Selected Connections ({selectedConnections.length}):
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedConnections.map(connectionId => {
                    const connection = professionalTypes.find(t => t.id === connectionId);
                    return (
                      <Badge key={connectionId} className="bg-green-100 text-green-800">
                        {connection?.title}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Referral Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Referral Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">
              How would you like to participate in the referral network?
            </p>

            <div className="space-y-4">
              {referralServices.map((service) => (
                <div key={service.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={service.id}
                    checked={referralPreferences.includes(service.id)}
                    onCheckedChange={() => toggleReferralPreference(service.id)}
                  />
                  <label htmlFor={service.id} className="font-medium cursor-pointer">
                    {service.label}
                  </label>
                </div>
              ))}
            </div>

            {referralPreferences.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Referral Benefits:</h4>
                <div className="grid gap-2 md:grid-cols-2 text-sm text-blue-700">
                  <div>• Expand your client base</div>
                  <div>• Increase revenue per client</div>
                  <div>• Build professional relationships</div>
                  <div>• Provide comprehensive solutions</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Premium Marketplace Features */}
        <Card className="border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              <span>Premium Marketplace Placement</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Upgrade to Premium for enhanced visibility and priority placement in professional searches.
            </p>

            <div className="grid gap-4 md:grid-cols-2 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium text-yellow-800">Premium Benefits:</h4>
                <div className="space-y-1 text-yellow-700">
                  <div>• Featured profile placement</div>
                  <div>• Priority in search results</div>
                  <div>• Advanced analytics dashboard</div>
                  <div>• Direct messaging capabilities</div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-yellow-800">Additional Features:</h4>
                <div className="space-y-1 text-yellow-700">
                  <div>• Referral tracking and commissions</div>
                  <div>• Joint proposal collaboration</div>
                  <div>• Client introduction automation</div>
                  <div>• Performance reporting</div>
                </div>
              </div>
            </div>

            <Button className="w-full mt-4 bg-yellow-600 hover:bg-yellow-700">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium Placement
            </Button>
          </CardContent>
        </Card>

        {/* Integration Summary */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-6">Marketplace Integration Summary</h3>
              
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600">
                    {selectedConnections.length}
                  </div>
                  <div className="font-medium text-emerald-800">Professional Types</div>
                  <div className="text-sm text-emerald-600">Selected</div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {referralPreferences.length}
                  </div>
                  <div className="font-medium text-blue-800">Referral Services</div>
                  <div className="text-sm text-blue-600">Enabled</div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">✓</div>
                  <div className="font-medium text-purple-800">Ready</div>
                  <div className="text-sm text-purple-600">Dashboard Tour</div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Your marketplace profile will be created and you'll have access to the professional network 
                immediately after completing the onboarding process.
              </p>

              <Button variant="outline" className="w-full">
                <ArrowRight className="h-4 w-4 mr-2" />
                Continue to Dashboard Tour
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};