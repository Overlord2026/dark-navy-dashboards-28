import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Download, 
  Users, 
  Shield, 
  MessageCircle,
  CheckCircle,
  AlertTriangle,
  FileText,
  Phone,
  Sparkles
} from 'lucide-react';

export const AdvisorTrainingManual = () => {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Advisor Training Manual</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Complete guide to helping your clients navigate the Family Office Platform
        </p>
        
        {/* Download Options */}
        <div className="flex gap-2 justify-center">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Training Slides
          </Button>
        </div>
      </div>

      <Tabs value={activeSection} onValueChange={setActiveSection}>
        <TabsList className="grid grid-cols-7 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="premium">Premium</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="linda">Linda AI</TabsTrigger>
          <TabsTrigger value="scripts">Scripts</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                New Client Onboarding Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">What's Changed:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Simplified account creation (name, email, mobile only)</li>
                    <li>• Optional account linking via Plaid or manual entry</li>
                    <li>• Optional family & goals setup</li>
                    <li>• Immediate dashboard access</li>
                    <li>• Optional welcome call booking</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Key Benefits:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• No upfront sensitive data required</li>
                    <li>• Faster time to value</li>
                    <li>• Privacy-first approach</li>
                    <li>• Explore before committing</li>
                    <li>• Advisor guidance when ready</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Magic Link Invitations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  When you send a magic link invitation, clients who join through that link are automatically 
                  linked to your household and practice.
                </p>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">How It Works:</h4>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Send invitation from your advisor dashboard</li>
                    <li>2. Client receives email with secure magic link</li>
                    <li>3. Client clicks link and completes onboarding</li>
                    <li>4. Client is automatically linked to your practice</li>
                    <li>5. You receive notification when they join</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onboarding Guide */}
        <TabsContent value="onboarding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Step-by-Step Client Guidance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                {[
                  {
                    step: 1,
                    title: "Create Secure Account",
                    description: "Name, email, and mobile number only",
                    time: "2 minutes"
                  },
                  {
                    step: 2,
                    title: "Add Account (Optional)",
                    description: "Connect via Plaid, add manually, or skip",
                    time: "3-5 minutes"
                  },
                  {
                    step: 3,
                    title: "Family & Goals (Optional)",
                    description: "Invite family, set financial objectives",
                    time: "5-10 minutes"
                  },
                  {
                    step: 4,
                    title: "Welcome Call (Optional)",
                    description: "Book consultation or explore independently",
                    time: "15 minutes"
                  }
                ].map((step) => (
                  <div key={step.step} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                      <Badge variant="secondary" className="mt-1 text-xs">{step.time}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy & Data */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy Protection & Data Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Basic Onboarding</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Name and contact info only</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>No SSN or sensitive data</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Optional account linking</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Advisor-Triggered Data Collection</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Account opening requires SSN, DOB</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Formal advice needs financial profile</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>ID verification for compliance</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Premium Features */}
        <TabsContent value="premium" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic vs Premium Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left">Feature</th>
                      <th className="border border-border p-3 text-center">Basic</th>
                      <th className="border border-border p-3 text-center">Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">Dashboard Access</td>
                      <td className="border border-border p-3 text-center">✓</td>
                      <td className="border border-border p-3 text-center">✓</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">Expert Marketplace Browsing</td>
                      <td className="border border-border p-3 text-center">✓</td>
                      <td className="border border-border p-3 text-center">✓</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">Educational Resources</td>
                      <td className="border border-border p-3 text-center">✓</td>
                      <td className="border border-border p-3 text-center">✓</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">Private Market Access</td>
                      <td className="border border-border p-3 text-center">Request</td>
                      <td className="border border-border p-3 text-center">✓</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">Dedicated Advisor Support</td>
                      <td className="border border-border p-3 text-center">-</td>
                      <td className="border border-border p-3 text-center">✓</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">Advanced Analytics</td>
                      <td className="border border-border p-3 text-center">-</td>
                      <td className="border border-border p-3 text-center">✓</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance */}
        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                <h4 className="font-semibold text-amber-900 mb-2">When Full KYC is Required:</h4>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Client requests to open investment accounts</li>
                  <li>• Formal financial advice is requested</li>
                  <li>• Private market investments are considered</li>
                  <li>• Advisor determines compliance is necessary</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Required Documents:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Government-issued photo ID</li>
                  <li>• Social Security Number</li>
                  <li>• Address verification</li>
                  <li>• Financial profile questionnaire</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Linda AI */}
        <TabsContent value="linda" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Linda AI Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">What Linda Can Help With:</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Platform navigation and tutorials</li>
                  <li>• General how-to questions</li>
                  <li>• Feature explanations</li>
                  <li>• Account setup assistance</li>
                </ul>
              </div>
              
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <h4 className="font-semibold text-red-900 mb-2">⚠️ Important Disclaimer:</h4>
                <p className="text-sm text-red-800">
                  Linda AI is prohibited from providing financial, legal, tax, or accounting advice. 
                  All such questions should be directed to qualified professionals.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Client Scripts */}
        <TabsContent value="scripts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Sample Client Call Script
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Welcome Call Opening:</h4>
                <div className="text-sm space-y-2">
                  <p><strong>"Thanks for joining the Family Office Platform!"</strong></p>
                  <p>
                    "I'm here to help you get the most out of your dashboard and explore the platform 
                    at your own pace. There's no pressure to make any decisions today - this is all 
                    about helping you navigate and understand what's available."
                  </p>
                  <p><strong>Key talking points:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Dashboard walkthrough and key features</li>
                    <li>How to browse the expert marketplace</li>
                    <li>Available educational resources</li>
                    <li>Privacy protection measures</li>
                    <li>How to upgrade when ready</li>
                    <li>Q&A based on their goals</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};