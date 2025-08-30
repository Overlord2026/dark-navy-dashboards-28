import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Settings, 
  Mic, 
  BookOpen, 
  Receipt, 
  ShoppingCart,
  MessageSquare,
  Calendar,
  Star
} from 'lucide-react';
import { PersonaConfig, Tool, Receipt as ReceiptType } from '@/types/bfo-platform';
import { PERSONA_CONFIGS } from '@/config/personas';
import { useNavigate } from 'react-router-dom';
import VoiceAssistant from '@/components/bfo/VoiceAssistant';

interface PersonaDashboardProps {
  personaId: string;
  subPersonaId?: string;
}

export function PersonaDashboard({ personaId, subPersonaId }: PersonaDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [recentReceipts, setRecentReceipts] = useState<ReceiptType[]>([]);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const navigate = useNavigate();

  const persona = PERSONA_CONFIGS.find(p => p.id === personaId);
  const subPersona = persona?.subPersonas?.find(sp => sp.id === subPersonaId);
  
  const currentConfig = subPersona || persona;
  const tools = subPersona?.tools || persona?.tools || [];

  useEffect(() => {
    // Load recent receipts (mock data)
    setRecentReceipts([
      {
        id: '1',
        action: 'Tool Access',
        result: 'approved',
        timestamp: new Date().toISOString(),
        persona: personaId,
        tool: 'portfolio-analysis',
        compliance: true
      },
      {
        id: '2',
        action: 'Data Export',
        result: 'approved',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        persona: personaId,
        compliance: true
      }
    ]);
  }, [personaId]);

  const quickActions = [
    { label: 'Start Workspace', icon: Settings, action: () => navigate(`${currentConfig?.route}/workspace`) },
    { label: 'Book Demo', icon: Calendar, action: () => navigate('/book-demo') },
    { label: 'Explore Catalog', icon: ShoppingCart, action: () => navigate('/catalog') },
    { label: 'Voice Assistant', icon: Mic, action: () => setVoiceOpen(true) }
  ];

  const enabledTools = tools.filter(tool => tool.enabled);
  const premiumTools = tools.filter(tool => tool.premium);

  if (!persona) {
    return <div>Persona not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-black text-[#D4AF37] gold-border w-full">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Welcome back, {currentConfig?.name || persona.name}</h1>
              <p className="text-white/80 mt-2 opacity-90">
                {subPersona ? subPersona.description : `Your professional dashboard and automations live here.`}
              </p>
            </div>
            <div className="flex gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={action.action}
                  className="flex items-center gap-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors"
                >
                  <action.icon className="h-4 w-4" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sub-persona tabs */}
      {persona.subPersonas && !subPersonaId && (
        <div className="bg-black text-[#D4AF37] border-b border-[#D4AF37]">
          <div className="max-w-7xl mx-auto px-6">
            <Tabs value={subPersonaId || 'overview'} className="w-full">
              <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${persona.subPersonas.length + 1}, 1fr)` }}>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                {persona.subPersonas.map(sub => (
                  <TabsTrigger
                    key={sub.id}
                    value={sub.id}
                    onClick={() => navigate(sub.route)}
                  >
                    {sub.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Tools
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Learn & CE
            </TabsTrigger>
            <TabsTrigger value="receipts" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Receipts
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Automation
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Compliance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{enabledTools.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {premiumTools.length} premium
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Recent Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{recentReceipts.length}</div>
                  <p className="text-xs text-muted-foreground">
                    100% compliant
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Voice Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">
                    This week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Automation Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">95%</div>
                  <p className="text-xs text-muted-foreground">
                    Workflows active
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Receipts */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest compliance receipts and actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentReceipts.map(receipt => (
                    <div key={receipt.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{receipt.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(receipt.timestamp).toLocaleDateString()} at{' '}
                          {new Date(receipt.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge 
                        variant={receipt.result === 'approved' ? 'default' : receipt.result === 'denied' ? 'destructive' : 'secondary'}
                      >
                        {receipt.result}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map(tool => (
                <Card key={tool.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                      {tool.premium && <Badge variant="secondary">Premium</Badge>}
                    </div>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant={tool.enabled ? 'default' : 'secondary'}>
                        {tool.enabled ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button 
                        size="sm" 
                        onClick={() => navigate(tool.route)}
                        disabled={!tool.enabled}
                      >
                        Open Tool
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="education" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Continuing Education</CardTitle>
                  <CardDescription>Track your CE requirements and progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Annual CE Hours</span>
                      <Badge>24 / 40 hours</Badge>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <Button className="w-full">Browse CE Courses</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Learning Resources</CardTitle>
                  <CardDescription>Industry insights and best practices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded cursor-pointer hover:bg-accent">
                      <h4 className="font-medium">Tax Law Updates 2024</h4>
                      <p className="text-sm text-muted-foreground">Latest changes in tax regulations</p>
                    </div>
                    <div className="p-3 border rounded cursor-pointer hover:bg-accent">
                      <h4 className="font-medium">Estate Planning Strategies</h4>
                      <p className="text-sm text-muted-foreground">Advanced estate planning techniques</p>
                    </div>
                    <Button variant="outline" className="w-full">View All Resources</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="receipts" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Receipts</CardTitle>
                <CardDescription>Automated compliance tracking and receipts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReceipts.map(receipt => (
                    <div key={receipt.id} className="flex items-center justify-between p-4 border rounded">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <div>
                            <p className="font-medium">{receipt.action}</p>
                            <p className="text-sm text-muted-foreground">
                              Receipt ID: {receipt.id}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="default">{receipt.result}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(receipt.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Automations</CardTitle>
                  <CardDescription>Streamline your workflow with intelligent automation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">Client Follow-up Emails</p>
                        <p className="text-sm text-muted-foreground">Automatic after meetings</p>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">Compliance Reminders</p>
                        <p className="text-sm text-muted-foreground">Weekly compliance checks</p>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <Button className="w-full">Create New Automation</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Workflow Insights</CardTitle>
                  <CardDescription>Optimize your productivity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Time Saved This Month</span>
                      <span className="font-bold">32 hours</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tasks Automated</span>
                      <span className="font-bold">156</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Efficiency Score</span>
                      <Badge variant="default">95%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Status</CardTitle>
                  <CardDescription>Real-time compliance monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Overall Compliance Score</span>
                      <Badge variant="default" className="text-green-600">98%</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Data Security</span>
                        <span className="text-green-600">✓ Compliant</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Record Keeping</span>
                        <span className="text-green-600">✓ Compliant</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Client Communications</span>
                        <span className="text-green-600">✓ Compliant</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Alerts</CardTitle>
                  <CardDescription>Security monitoring and alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded bg-green-50 dark:bg-green-950">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm font-medium">All systems secure</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Last scan: {new Date().toLocaleString()}
                      </p>
                    </div>
                    <Button variant="outline" className="w-full">View Security Report</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Voice Assistant */}
      <VoiceAssistant 
        isOpen={voiceOpen} 
        onClose={() => setVoiceOpen(false)}
        persona={personaId}
      />
    </div>
  );
}