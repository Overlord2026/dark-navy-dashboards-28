import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  CheckCircle, 
  Download, 
  Play, 
  FileText, 
  Users, 
  Mail, 
  Upload,
  Search,
  Filter,
  Calendar,
  AlertCircle
} from 'lucide-react';

export function StaffSOPGuide() {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const toggleStepCompletion = (stepId: string) => {
    setCompletedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const csvSteps = [
    {
      id: 'export',
      title: 'Export CSV from LinkedIn',
      description: 'Go to LinkedIn > My Network > Connections > Export Contacts',
      details: 'Choose "Export as CSV" and download to your computer. Save in designated folder.'
    },
    {
      id: 'clean',
      title: 'Clean and Deduplicate',
      description: 'Open CSV in Excel/Google Sheets and remove duplicates',
      details: 'Use built-in "Remove Duplicates" function. Standardize column headers.'
    },
    {
      id: 'enrich',
      title: 'Enrich Missing Data',
      description: 'Use Hunter.io for missing emails, Google for LinkedIn profiles',
      details: 'Verify all VIP contacts for accuracy. Double-check titles and organizations.'
    },
    {
      id: 'format',
      title: 'Format for Upload',
      description: 'Save as UTF-8 CSV with proper column headers',
      details: 'Required columns: First Name, Last Name, Email, Organization, Persona'
    },
    {
      id: 'upload',
      title: 'Upload to Dashboard',
      description: 'Drag and drop CSV to Marketing Admin section',
      details: 'Review deduplication results and resolve any conflicts.'
    },
    {
      id: 'assign',
      title: 'Assign to Campaign',
      description: 'Select appropriate campaign and persona for contacts',
      details: 'Choose from VIP Early Access, Beta Invite, or general drip campaigns.'
    },
    {
      id: 'monitor',
      title: 'Monitor and Resolve',
      description: 'Check for bounced emails and flagged contacts',
      details: 'Review error log weekly and escalate issues as needed.'
    }
  ];

  const dailyTasks = [
    'Check pending review queue for bounced emails',
    'Update VIP contact information as needed',
    'Review campaign performance metrics',
    'Respond to email delivery issues',
    'Update contact tags and segments'
  ];

  const weeklyTasks = [
    'Export and clean new LinkedIn connections',
    'Download analytics report for team meeting',
    'Update contact database with new information',
    'Review and optimize email templates',
    'Prepare next batch upload list'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Staff Training & SOPs</h2>
          <p className="text-muted-foreground">Step-by-step guides for marketing automation</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download PDF Guide
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="csv-process">CSV Process</TabsTrigger>
          <TabsTrigger value="daily-tasks">Daily Tasks</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="troubleshooting">Help</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Start */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Play className="h-5 w-5 mr-2" />
                  Quick Start Guide
                </CardTitle>
                <CardDescription>
                  New to the marketing automation system? Start here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                    <span>Login to Marketing Dashboard</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                    <span>Upload CSV contact list</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                    <span>Review and assign to campaigns</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                    <span>Monitor and resolve issues</span>
                  </div>
                </div>
                <Button className="w-full mt-4">Watch Tutorial Video</Button>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Key Performance Metrics
                </CardTitle>
                <CardDescription>
                  Important numbers to track and report weekly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Contacts uploaded</span>
                    <Badge variant="outline">Weekly goal: 500+</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Duplicate rate</span>
                    <Badge variant="outline">Target: &lt;5%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Bounce rate</span>
                    <Badge variant="outline">Target: &lt;2%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Data enrichment</span>
                    <Badge variant="outline">Target: 95%+</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="csv-process">
          <Card>
            <CardHeader>
              <CardTitle>CSV Contact Upload Process</CardTitle>
              <CardDescription>
                Step-by-step guide for updating and managing contact lists
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {csvSteps.map((step, index) => (
                  <div key={step.id} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <button
                        onClick={() => toggleStepCompletion(step.id)}
                        className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          completedSteps.includes(step.id)
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300'
                        }`}
                      >
                        {completedSteps.includes(step.id) && <CheckCircle className="h-3 w-3" />}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Step {index + 1}: {step.title}</span>
                          {completedSteps.includes(step.id) && (
                            <Badge variant="outline" className="text-green-600">
                              Complete
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                        <details className="mt-2">
                          <summary className="text-sm text-primary cursor-pointer">Show details</summary>
                          <p className="text-sm text-muted-foreground mt-1 ml-4">{step.details}</p>
                        </details>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Pro Tips:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Always backup original CSV before making changes</li>
                  <li>• Use consistent naming conventions for organizations</li>
                  <li>• Flag VIP contacts for supervisor review</li>
                  <li>• Check for typos in email addresses before upload</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daily-tasks">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Daily Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Daily Checklist
                </CardTitle>
                <CardDescription>
                  Tasks to complete each day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dailyTasks.map((task, index) => (
                    <label key={index} className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{task}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Weekly Checklist
                </CardTitle>
                <CardDescription>
                  Tasks to complete each week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weeklyTasks.map((task, index) => (
                    <label key={index} className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{task}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="space-y-6">
            {/* Email Templates */}
            <Card>
              <CardHeader>
                <CardTitle>Email Scripts & Templates</CardTitle>
                <CardDescription>
                  Ready-to-use email templates for different scenarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Bounce Follow-up</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      When email bounces, use this template to find alternative contact method
                    </p>
                    <Button size="sm" variant="outline">
                      <FileText className="h-3 w-3 mr-1" />
                      View Template
                    </Button>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">VIP Manual Outreach</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Personal message template for high-value contacts
                    </p>
                    <Button size="sm" variant="outline">
                      <FileText className="h-3 w-3 mr-1" />
                      View Template
                    </Button>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">LinkedIn Connection</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Message template for LinkedIn connection requests
                    </p>
                    <Button size="sm" variant="outline">
                      <FileText className="h-3 w-3 mr-1" />
                      View Template
                    </Button>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Data Update Request</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Ask contacts to update their information
                    </p>
                    <Button size="sm" variant="outline">
                      <FileText className="h-3 w-3 mr-1" />
                      View Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="troubleshooting">
          <div className="space-y-6">
            {/* Common Issues */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Common Issues & Solutions
                </CardTitle>
                <CardDescription>
                  Quick fixes for frequent problems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
                    <h4 className="font-medium text-yellow-800">High Bounce Rate</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Check email format, verify domains, use email validation tools
                    </p>
                  </div>
                  <div className="border-l-4 border-blue-400 bg-blue-50 p-4">
                    <h4 className="font-medium text-blue-800">CSV Upload Errors</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Ensure UTF-8 encoding, check column headers, remove special characters
                    </p>
                  </div>
                  <div className="border-l-4 border-red-400 bg-red-50 p-4">
                    <h4 className="font-medium text-red-800">Missing LinkedIn Profiles</h4>
                    <p className="text-sm text-red-700 mt-1">
                      Search "Name + Company" on Google, check company websites, use LinkedIn Sales Navigator
                    </p>
                  </div>
                  <div className="border-l-4 border-green-400 bg-green-50 p-4">
                    <h4 className="font-medium text-green-800">VIP Contact Questions</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Flag for supervisor review, double-check organization details, verify title accuracy
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>
                  Contact information for support and escalation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>Email: support@marketingteam.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Slack: #marketing-automation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>Knowledge Base: Available in dashboard</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}