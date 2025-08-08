import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, MessageSquare, Calendar, TrendingUp, Crown, Target } from 'lucide-react';

export const MedicareMarketingStep = () => {
  const [leadEngineEnabled, setLeadEngineEnabled] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);

  const campaignTemplates = [
    {
      id: 'annual-enrollment',
      title: 'Medicare Annual Enrollment',
      description: 'Automated sequence for OEP period',
      icon: <Calendar className="h-5 w-5 text-blue-600" />,
      type: 'Seasonal Campaign'
    },
    {
      id: 'supplements-education',
      title: 'Medicare Supplements Education',
      description: 'Educational content series about Medigap',
      icon: <Mail className="h-5 w-5 text-green-600" />,
      type: 'Educational Series'
    },
    {
      id: 'webinar-series',
      title: 'Medicare Planning Webinars',
      description: 'Monthly webinar invitations and follow-ups',
      icon: <MessageSquare className="h-5 w-5 text-purple-600" />,
      type: 'Webinar Campaign'
    },
    {
      id: 'referral-program',
      title: 'Client Referral Program',
      description: 'Encourage satisfied clients to refer friends',
      icon: <Target className="h-5 w-5 text-amber-600" />,
      type: 'Referral Campaign'
    }
  ];

  const toggleTemplate = (templateId: string) => {
    setSelectedTemplates(prev => 
      prev.includes(templateId)
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-100 to-emerald-100 p-3 rounded-full">
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4">Marketing Preferences</h2>
        <p className="text-lg text-muted-foreground">
          Set up your Lead-to-Sales Engine and choose campaign templates
        </p>
      </div>

      {/* Lead-to-Sales Engine Toggle */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Lead-to-Sales Engine</span>
            </div>
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
              <Crown className="h-3 w-3 mr-1" />
              Premium Feature
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="enable-lead-engine"
                checked={leadEngineEnabled}
                onCheckedChange={(checked) => setLeadEngineEnabled(checked === true)}
              />
              <div>
                <label htmlFor="enable-lead-engine" className="font-medium cursor-pointer">
                  Enable automated marketing campaigns
                </label>
                <p className="text-sm text-muted-foreground mt-1">
                  Activate multi-channel marketing automation with email, SMS, and LinkedIn campaigns. 
                  Includes lead scoring, nurture sequences, and ROI tracking.
                </p>
              </div>
            </div>

            {leadEngineEnabled && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Lead-to-Sales Engine includes:</h4>
                <div className="grid md:grid-cols-2 gap-2 text-sm text-blue-700">
                  <div>• Email campaign automation</div>
                  <div>• SMS marketing sequences</div>
                  <div>• LinkedIn outreach templates</div>
                  <div>• Lead scoring and prioritization</div>
                  <div>• Drip campaign management</div>
                  <div>• ROI and conversion tracking</div>
                </div>
              </div>
            )}

            {!leadEngineEnabled && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> The Lead-to-Sales Engine is a Premium feature. 
                  You can enable it later when you upgrade your plan.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Templates */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Choose Campaign Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            Select pre-built campaign templates that match your marketing strategy:
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            {campaignTemplates.map((template) => (
              <Card 
                key={template.id}
                className={`cursor-pointer transition-all ${
                  selectedTemplates.includes(template.id) 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => toggleTemplate(template.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={selectedTemplates.includes(template.id)}
                      onChange={() => {}} // Handled by card click
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {template.icon}
                        <h3 className="font-semibold">{template.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {template.description}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {template.type}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedTemplates.length > 0 && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">
                Selected Templates ({selectedTemplates.length}):
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedTemplates.map(templateId => {
                  const template = campaignTemplates.find(t => t.id === templateId);
                  return (
                    <Badge key={templateId} className="bg-green-100 text-green-800">
                      {template?.title}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Marketing Setup Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Marketing Setup Complete</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-800">Lead Engine</div>
                <div className="text-blue-600">
                  {leadEngineEnabled ? 'Enabled' : 'Available on Premium'}
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="font-medium text-green-800">Templates</div>
                <div className="text-green-600">
                  {selectedTemplates.length} Selected
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="font-medium text-purple-800">Ready to</div>
                <div className="text-purple-600">View Dashboard</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};