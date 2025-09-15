import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Edit, Copy, Settings, Eye, Users, TrendingUp } from 'lucide-react';

// TODO: Import existing questionnaire component if available
// import { AdvisorQuestionnaire } from '@/components/advisor/AdvisorQuestionnaire';

export default function QuestionnairesPage() {
  return (
    <>
      <Helmet>
        <title>Questionnaire Management | Advisor Platform</title>
        <meta name="description" content="Create, manage, and analyze client questionnaires for risk assessment and advisory services" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Questionnaire Management
            </h1>
            <p className="text-muted-foreground">
              Create and manage client questionnaires for risk assessment and onboarding
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Templates
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Questionnaire
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Questionnaires</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Responses</p>
                  <p className="text-2xl font-bold">247</p>
                </div>
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold">89.5%</p>
                </div>
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Time</p>
                  <p className="text-2xl font-bold">12m</p>
                </div>
                <Eye className="w-6 h-6 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Questionnaire Library */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Questionnaires */}
          <Card>
            <CardHeader>
              <CardTitle>Active Questionnaires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* TODO: Replace with actual questionnaire management component */}
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Risk Assessment Questionnaire</h3>
                      <p className="text-sm text-muted-foreground">25 questions • Investment risk profiling</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">67 responses</Badge>
                        <Badge variant="outline">Active</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileText className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Estate Planning Intake</h3>
                      <p className="text-sm text-muted-foreground">18 questions • Estate planning assessment</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">42 responses</Badge>
                        <Badge variant="outline">Active</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FileText className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Retirement Planning Survey</h3>
                      <p className="text-sm text-muted-foreground">32 questions • Retirement readiness assessment</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">89 responses</Badge>
                        <Badge variant="outline">Active</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full">
                  View All Questionnaires
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Templates & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Templates */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Risk Assessment Template
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Client Onboarding Template
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Investment Preference Template
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Financial Goals Template
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>New response: Risk Assessment from Johnson Family</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Updated: Estate Planning Intake questionnaire</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Created: Custom Investment Questionnaire</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feature Notice */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Settings className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-medium text-yellow-900">Enhanced Questionnaire Builder</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  The comprehensive questionnaire builder with advanced logic, conditional questions, and automated scoring 
                  is currently being developed. For now, you can use the basic questionnaire functionality and templates.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}