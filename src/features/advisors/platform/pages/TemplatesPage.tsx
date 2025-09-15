import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layout, Plus, Edit, Copy, Search, Filter, Mail, FileText, Calendar } from 'lucide-react';

// TODO: Import existing template components if available
// import { EmailTemplates } from '@/components/advisor/EmailTemplates';
// import { CampaignTemplates } from '@/components/advisor/CampaignTemplates';

export default function TemplatesPage() {
  return (
    <>
      <Helmet>
        <title>Template Library | Advisor Platform</title>
        <meta name="description" content="Manage email templates, document templates, and campaign sequences for advisor communications" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Layout className="w-6 h-6" />
              Template Library
            </h1>
            <p className="text-muted-foreground">
              Manage email templates, documents, and campaign sequences
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Email Templates</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Document Templates</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Campaign Sequences</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Most Used</p>
                  <p className="text-2xl font-bold">147</p>
                </div>
                <Layout className="w-6 h-6 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Template Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Email Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* TODO: Replace with actual email template management */}
                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <h3 className="font-medium text-sm">Welcome Email</h3>
                    <p className="text-xs text-muted-foreground">Client onboarding series #1</p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">Onboarding</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <h3 className="font-medium text-sm">Market Update</h3>
                    <p className="text-xs text-muted-foreground">Monthly market commentary</p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">Newsletter</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <h3 className="font-medium text-sm">Meeting Reminder</h3>
                    <p className="text-xs text-muted-foreground">Appointment confirmation</p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">Automated</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t">
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="w-3 h-3 mr-2" />
                  New Email Template
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Document Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Document Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <h3 className="font-medium text-sm">Investment Proposal</h3>
                    <p className="text-xs text-muted-foreground">Client proposal template</p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">Proposal</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <h3 className="font-medium text-sm">Risk Assessment</h3>
                    <p className="text-xs text-muted-foreground">Client risk profile form</p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">Assessment</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <h3 className="font-medium text-sm">Portfolio Review</h3>
                    <p className="text-xs text-muted-foreground">Quarterly review template</p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">Review</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t">
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="w-3 h-3 mr-2" />
                  New Document Template
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Sequences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Campaign Sequences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <h3 className="font-medium text-sm">Prospect Nurture</h3>
                    <p className="text-xs text-muted-foreground">5-email sequence</p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">5 emails</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <h3 className="font-medium text-sm">Client Onboarding</h3>
                    <p className="text-xs text-muted-foreground">3-email welcome series</p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">3 emails</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <h3 className="font-medium text-sm">Retirement Planning</h3>
                    <p className="text-xs text-muted-foreground">7-email education series</p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">7 emails</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t">
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="w-3 h-3 mr-2" />
                  New Campaign Sequence
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integration Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Layout className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-900">Template Integration</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Templates can be used across the platform in campaigns, prospect management, and client communications. 
                  Existing email templates from various components are being consolidated into this unified library.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}