import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Rocket, Target, FileText, Mail, BarChart3, 
  Download, Settings, Play, Users 
} from 'lucide-react';
import SportsFounding20Landing from '@/components/founding20/SportsFounding20Landing';
import { LaunchChecklistInterface } from '@/components/founding20/LaunchChecklistInterface';
import { OnepageOverviewGenerator } from '@/components/founding20/OnepageOverviewGenerator';
import { LeadershipDeckGenerator } from '@/components/founding20/LeadershipDeckGenerator';
import { EmailCampaignManager } from '@/components/founding20/EmailCampaignManager';
import { QATestSuiteStandalone } from '@/components/founding20/QATestSuiteStandalone';
import { LaunchDayCommandCenter } from '@/components/founding20/LaunchDayCommandCenter';
import { track } from '@/lib/analytics/track';

export default function Founding20MasterDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    track('founding20_tab_changed', { tab: value });
  };

  const launchComponents = [
    {
      id: 'sports_landing',
      title: 'Sports Landing Page',
      description: 'Partnership-focused landing for sports leagues & associations',
      status: 'active',
      url: '/founding20/sports',
      icon: Target
    },
    {
      id: 'launch_checklist',
      title: 'Launch Sequencing Checklist',
      description: 'Interactive checklist for all segments and tiers',
      status: 'active',
      icon: FileText
    },
    {
      id: 'overview_generator',
      title: 'One-Page Overview',
      description: 'ROI-ranked targets with QR codes for each segment',
      status: 'active',
      icon: BarChart3
    },
    {
      id: 'leadership_deck',
      title: 'Leadership Briefing Deck',
      description: 'Executive presentation with brand guide and mockups',
      status: 'active',
      icon: Rocket
    },
    {
      id: 'email_campaigns',
      title: 'Email Campaign Manager',
      description: 'Template creation and outreach automation',
      status: 'active',
      icon: Mail
    },
    {
      id: 'qa_suite',
      title: 'QA Test Suite',
      description: 'Comprehensive pre-launch testing and optimization',
      status: 'ready',
      icon: Settings
    },
    {
      id: 'command_center',
      title: 'Launch Day Command Center',
      description: 'Real-time monitoring and live dashboard',
      status: 'ready',
      icon: Play
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'ready': return 'bg-yellow-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gold mb-4">
            Founding 20 Master Dashboard
          </h1>
          <p className="text-xl text-white/70 mb-6">
            Complete BFO launch system: assets, automations, analytics & command center
          </p>
          
          <div className="flex flex-wrap justify-center gap-2">
            <Badge className="bg-emerald-500/20 text-emerald-400">Sports</Badge>
            <Badge className="bg-blue-500/20 text-blue-400">Longevity</Badge>
            <Badge className="bg-red-500/20 text-red-400">RIA</Badge>
            <Badge className="bg-gold/20 text-gold">Multi-Segment</Badge>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-7 bg-black border border-gold/30 mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              Overview
            </TabsTrigger>
            <TabsTrigger value="checklist" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              Checklist
            </TabsTrigger>
            <TabsTrigger value="overview_gen" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              Overview
            </TabsTrigger>
            <TabsTrigger value="deck" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              Leadership
            </TabsTrigger>
            <TabsTrigger value="emails" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              Emails
            </TabsTrigger>
            <TabsTrigger value="qa" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              QA Suite
            </TabsTrigger>
            <TabsTrigger value="command" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              Command
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {launchComponents.map(component => {
                const IconComponent = component.icon;
                
                return (
                  <Card key={component.id} className="bg-black border-gold/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-5 w-5 text-gold" />
                          <CardTitle className="text-white text-lg">
                            {component.title}
                          </CardTitle>
                        </div>
                        <Badge className={getStatusColor(component.status)}>
                          {component.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/70 text-sm mb-4">
                        {component.description}
                      </p>
                      
                      <div className="flex gap-2">
                        {component.url && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gold text-gold hover:bg-gold/10"
                            onClick={() => window.open(component.url, '_blank')}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          className="bg-gold text-black hover:bg-gold/90"
                          onClick={() => setSelectedTab(
                            component.id === 'sports_landing' ? 'overview' :
                            component.id === 'launch_checklist' ? 'checklist' :
                            component.id === 'overview_generator' ? 'overview_gen' :
                            component.id === 'leadership_deck' ? 'deck' :
                            component.id === 'email_campaigns' ? 'emails' :
                            component.id === 'qa_suite' ? 'qa' :
                            component.id === 'command_center' ? 'command' : 'overview'
                          )}
                        >
                          Configure
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Launch Status Summary */}
            <Card className="bg-black border-gold/30">
              <CardHeader>
                <CardTitle className="text-gold">Launch Readiness Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">5/7</div>
                    <div className="text-white/70">Components Active</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">2/7</div>
                    <div className="text-white/70">Components Ready</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gold mb-2">85%</div>
                    <div className="text-white/70">Launch Ready</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Asset Generation Summary */}
            <Card className="bg-black border-gold/30">
              <CardHeader>
                <CardTitle className="text-gold">Asset Generation Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    'Sports Founding 20 PDFs (Print/Digital)',
                    'Launch Checklist PDFs (Print/Digital)', 
                    'One-Page Overview (PDF/PNG + QR Codes)',
                    'Leadership Briefing Deck (PDF/PPTX)',
                    'Email Headers (Light/Dark variants)',
                    'QR Code ZIP packages per segment'
                  ].map((asset, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-white/70">{asset}</span>
                      <Badge className="bg-green-500">Generated</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="checklist">
            <LaunchChecklistInterface />
          </TabsContent>

          <TabsContent value="overview_gen">
            <OnepageOverviewGenerator />
          </TabsContent>

          <TabsContent value="deck">
            <LeadershipDeckGenerator />
          </TabsContent>

          <TabsContent value="emails">
            <EmailCampaignManager />
          </TabsContent>

          <TabsContent value="qa">
            <QATestSuiteStandalone />
          </TabsContent>

          <TabsContent value="command">
            <LaunchDayCommandCenter />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}