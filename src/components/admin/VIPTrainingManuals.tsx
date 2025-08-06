import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, FileText, Video, Users, BookOpen, Download, Play, CheckCircle } from 'lucide-react';

const trainingModules = [
  {
    id: 'staff-onboarding',
    title: 'Staff Onboarding Manual',
    description: 'Complete guide for team members managing VIP operations',
    duration: '45 min',
    type: 'pdf',
    sections: [
      'VIP Platform Overview',
      'Bulk Upload Process',
      'Magic Link Management',
      'Credits & Reward System',
      'Customer Support Scripts',
      'Troubleshooting Guide'
    ]
  },
  {
    id: 'vip-advisor-guide',
    title: 'VIP Advisor Welcome Manual',
    description: 'High-gloss guide for advisor VIPs on platform features',
    duration: '30 min',
    type: 'pdf',
    sections: [
      'Your VIP Dashboard',
      'Client Invitation System',
      'Referral Credit Program',
      'Compliance Guidelines',
      'Advanced Features',
      'Success Stories'
    ]
  },
  {
    id: 'vip-attorney-guide',
    title: 'VIP Attorney Resource Guide',
    description: 'Specialized manual for legal professionals',
    duration: '35 min',
    type: 'pdf',
    sections: [
      'Legal Partner Portal',
      'Client Case Management',
      'Document Automation',
      'Attorney Network Access',
      'Referral Best Practices',
      'Compliance Standards'
    ]
  },
  {
    id: 'vip-cpa-guide',
    title: 'VIP CPA Practice Manual',
    description: 'Comprehensive guide for CPA VIP members',
    duration: '40 min',
    type: 'pdf',
    sections: [
      'CPA Dashboard Features',
      'Tax Planning Tools',
      'Client Collaboration',
      'Document Management',
      'Professional Network',
      'Practice Growth Tips'
    ]
  }
];

const videoTutorials = [
  {
    id: 'platform-overview',
    title: 'Platform Overview for VIPs',
    description: 'Complete walkthrough of VIP features and benefits',
    duration: '12 min',
    persona: 'all',
    thumbnail: '/api/placeholder/320/180'
  },
  {
    id: 'advisor-dashboard',
    title: 'Advisor Dashboard Deep Dive',
    description: 'Detailed tour of advisor-specific features',
    duration: '15 min',
    persona: 'advisor',
    thumbnail: '/api/placeholder/320/180'
  },
  {
    id: 'referral-system',
    title: 'Maximizing Referral Credits',
    description: 'How to earn and redeem referral rewards',
    duration: '8 min',
    persona: 'all',
    thumbnail: '/api/placeholder/320/180'
  },
  {
    id: 'client-onboarding',
    title: 'VIP Client Onboarding Flow',
    description: 'Best practices for inviting and onboarding clients',
    duration: '10 min',
    persona: 'all',
    thumbnail: '/api/placeholder/320/180'
  }
];

const complianceGuidelines = [
  {
    title: 'Linda AI Boundaries',
    content: 'Linda AI is designed to assist with platform navigation and general information only. She does not provide legal, accounting, investment, or financial advice.',
    level: 'critical'
  },
  {
    title: 'Referral Disclosure',
    content: 'All VIP members must disclose their referral relationship when inviting clients to maintain transparency and compliance.',
    level: 'important'
  },
  {
    title: 'Data Privacy',
    content: 'VIP members have access to enhanced features but must follow all data privacy guidelines when handling client information.',
    level: 'important'
  },
  {
    title: 'Marketing Guidelines',
    content: 'VIP status and founding member badges may be used in marketing materials with proper attribution to the platform.',
    level: 'moderate'
  }
];

const sopChecklist = [
  {
    category: 'VIP Onboarding',
    items: [
      'Verify contact information accuracy',
      'Assign appropriate VIP tier and persona',
      'Generate magic link invitation',
      'Send personalized welcome message',
      'Follow up within 48 hours if unopened',
      'Schedule welcome call for Platinum VIPs'
    ]
  },
  {
    category: 'Credit Management',
    items: [
      'Track referral completions daily',
      'Validate credit eligibility',
      'Process reward redemptions weekly',
      'Send credit balance notifications',
      'Handle dispute resolution',
      'Update leaderboard rankings'
    ]
  },
  {
    category: 'Support Response',
    items: [
      'Respond to VIP inquiries within 2 hours',
      'Escalate technical issues immediately',
      'Provide personalized solutions',
      'Document all interactions',
      'Follow up post-resolution',
      'Collect feedback for improvements'
    ]
  }
];

export const VIPTrainingManuals: React.FC = () => {
  const [activeTab, setActiveTab] = useState('manuals');

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'important': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'moderate': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Crown className="h-8 w-8 text-gold" />
        <div>
          <h1 className="text-3xl font-bold">VIP Training Center</h1>
          <p className="text-muted-foreground">
            Training materials, SOPs, and compliance guidelines for VIP management
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="manuals" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Training Manuals
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Video Tutorials
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="sops" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            SOPs & Checklists
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manuals">
          <div className="grid md:grid-cols-2 gap-6">
            {trainingModules.map((module) => (
              <Card key={module.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {module.description}
                      </p>
                    </div>
                    <Badge variant="outline">{module.duration}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Sections Covered:</h4>
                    <ul className="space-y-1">
                      {module.sections.map((section, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          {section}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex items-center gap-2">
                      <Download className="h-3 w-3" />
                      Download PDF
                    </Button>
                    <Button size="sm" variant="outline">
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoTutorials.map((video) => (
              <Card key={video.id} className="hover:shadow-md transition-shadow">
                <div className="relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-t-lg">
                    <Button size="lg" className="rounded-full h-16 w-16">
                      <Play className="h-6 w-6" />
                    </Button>
                  </div>
                  <Badge 
                    className="absolute top-2 right-2 bg-black/70 text-white"
                  >
                    {video.duration}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{video.title}</h3>
                      <Badge variant="outline" className="capitalize">
                        {video.persona}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {video.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Compliance Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceGuidelines.map((guideline, index) => (
                    <div 
                      key={index}
                      className={`p-4 border rounded-lg ${getLevelColor(guideline.level)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold mb-2">{guideline.title}</h4>
                          <p className="text-sm">{guideline.content}</p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`capitalize ${getLevelColor(guideline.level)}`}
                        >
                          {guideline.level}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Linda AI Usage Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">CRITICAL: What Linda CANNOT Do</h4>
                  <ul className="space-y-1 text-sm text-red-700">
                    <li>• Provide legal advice or interpretations</li>
                    <li>• Offer investment or financial recommendations</li>
                    <li>• Give accounting or tax advice</li>
                    <li>• Make regulatory compliance decisions</li>
                    <li>• Access or modify client financial data</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">What Linda CAN Help With</h4>
                  <ul className="space-y-1 text-sm text-green-700">
                    <li>• Platform navigation and feature explanations</li>
                    <li>• Process workflows and step-by-step guides</li>
                    <li>• General information about services</li>
                    <li>• Technical support and troubleshooting</li>
                    <li>• Scheduling and administrative tasks</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sops">
          <div className="space-y-6">
            {sopChecklist.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    {category.category} SOP
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                          {itemIndex + 1}
                        </div>
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};