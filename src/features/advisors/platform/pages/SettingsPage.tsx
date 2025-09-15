import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, User, Bell, Shield, Palette, Calendar, Mail, Database } from 'lucide-react';

export default function SettingsPage() {
  return (
    <>
      <Helmet>
        <title>Platform Settings | Advisor Platform</title>
        <meta name="description" content="Configure advisor platform settings, preferences, and integrations" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="w-6 h-6" />
              Platform Settings
            </h1>
            <p className="text-muted-foreground">
              Configure your advisor platform preferences and integrations
            </p>
          </div>
          <Button>
            Save Changes
          </Button>
        </div>

        {/* Settings Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Display Name</label>
                <input 
                  type="text" 
                  defaultValue="Alex Thompson, CFP®"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Professional Title</label>
                <input 
                  type="text" 
                  defaultValue="Senior Financial Advisor"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Firm Name</label>
                <input 
                  type="text" 
                  defaultValue="Thompson Wealth Management"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">License Numbers</label>
                <input 
                  type="text" 
                  defaultValue="Series 7, Series 66, CFP® #12345"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">New Prospect Alerts</h3>
                  <p className="text-sm text-muted-foreground">Get notified of new leads</p>
                </div>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Meeting Reminders</h3>
                  <p className="text-sm text-muted-foreground">15 minutes before meetings</p>
                </div>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Recording Processing</h3>
                  <p className="text-sm text-muted-foreground">When transcriptions complete</p>
                </div>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Campaign Performance</h3>
                  <p className="text-sm text-muted-foreground">Weekly ROI reports</p>
                </div>
                <input type="checkbox" />
              </div>
            </CardContent>
          </Card>

          {/* Security & Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">Enhanced security</p>
                </div>
                <Badge variant="secondary">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Session Timeout</h3>
                  <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
                </div>
                <select className="px-3 py-1 border rounded">
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>2 hours</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Data Retention</h3>
                  <p className="text-sm text-muted-foreground">Recording storage period</p>
                </div>
                <select className="px-3 py-1 border rounded">
                  <option>7 years</option>
                  <option>5 years</option>
                  <option>3 years</option>
                </select>
              </div>
              <Button variant="outline" className="w-full">
                Download My Data
              </Button>
            </CardContent>
          </Card>

          {/* Platform Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Platform Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Theme</label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option>Light</option>
                  <option>Dark</option>
                  <option>Auto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Dashboard Layout</label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option>Compact</option>
                  <option>Standard</option>
                  <option>Expanded</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Default Calendar View</label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option>Week</option>
                  <option>Month</option>
                  <option>Day</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Sidebar Collapsed</h3>
                  <p className="text-sm text-muted-foreground">Start with sidebar minimized</p>
                </div>
                <input type="checkbox" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integrations */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Integrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-medium">Calendar Sync</h3>
                    <p className="text-sm text-muted-foreground">Google Calendar</p>
                  </div>
                </div>
                <Badge variant="secondary">Connected</Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-medium">Email Marketing</h3>
                    <p className="text-sm text-muted-foreground">Mailchimp</p>
                  </div>
                </div>
                <Badge variant="outline">Connect</Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Database className="w-6 h-6 text-purple-600" />
                  <div>
                    <h3 className="font-medium">CRM System</h3>
                    <p className="text-sm text-muted-foreground">Salesforce</p>
                  </div>
                </div>
                <Badge variant="outline">Connect</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-2">Need Help with Settings?</h3>
                <p className="text-blue-700 mb-4">
                  Our support team can help you configure your platform settings and integrations.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Contact Support
                  </Button>
                  <Button variant="outline" size="sm">
                    View Documentation
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}