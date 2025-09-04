import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Phone, 
  MessageSquare, 
  Settings, 
  Users, 
  Play, 
  Volume2,
  Activity,
  BarChart3,
  TestTube,
  Shield,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const LindaAdminControls = () => {
  const { toast } = useToast();
  const [isTestCallActive, setIsTestCallActive] = useState(false);
  const [globalSettings, setGlobalSettings] = useState({
    enabled: false, // Permanently disabled
    defaultVoice: 'professional-female',
    callRetryAttempts: 3,
    smsBackupEnabled: true,
    recordingEnabled: false,
    complianceMode: true
  });

  const [brandingSettings, setBrandingSettings] = useState({
    firmName: 'Boutique Family Office',
    callerIdNumber: '+1 (555) 123-4567',
    greeting: 'Hi, this is Linda calling from {{FIRM_NAME}}. I\'m calling to confirm your appointment with {{ADVISOR_NAME}} scheduled for {{APPOINTMENT_TIME}}.',
    holdMusic: 'classical',
    smsSignature: 'Sent by {{FIRM_NAME}} via Linda AI'
  });

  const personas = [
    { id: 'advisor', name: 'Financial Advisors', users: 24, enabled: true },
    { id: 'cpa', name: 'CPAs/Accountants', users: 12, enabled: true },
    { id: 'attorney', name: 'Attorneys', users: 8, enabled: true },
    { id: 'insurance', name: 'Insurance Agents', users: 15, enabled: false },
    { id: 'consultant', name: 'Consultants', users: 6, enabled: true },
    { id: 'coach', name: 'Coaches', users: 4, enabled: false }
  ];

  const callLogs = [
    { id: 1, clientName: 'John Smith', advisor: 'Sarah Johnson', type: 'confirmation', status: 'success', duration: '1m 23s', timestamp: '2024-01-15 10:30 AM' },
    { id: 2, clientName: 'Mary Wilson', advisor: 'Mike Chen', type: 'reminder', status: 'success', duration: '0m 45s', timestamp: '2024-01-15 10:15 AM' },
    { id: 3, clientName: 'Robert Brown', advisor: 'Lisa Park', type: 'reschedule', status: 'failed', duration: '0m 12s', timestamp: '2024-01-15 09:45 AM' },
    { id: 4, clientName: 'Jennifer Davis', advisor: 'Tom Wilson', type: 'follow-up', status: 'success', duration: '2m 10s', timestamp: '2024-01-15 09:30 AM' }
  ];

  const handleTestCall = () => {
    // Linda disabled - no test calls
    toast({
      title: "Linda Voice Disabled",
      description: "Voice functionality is permanently disabled in this environment."
    });
  };

  const togglePersonaEnabled = (personaId: string) => {
    // Update persona enabled status
    toast({
      title: "Settings Updated",
      description: `Linda AI ${personas.find(p => p.id === personaId)?.enabled ? 'disabled' : 'enabled'} for ${personas.find(p => p.id === personaId)?.name}`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Linda AI Assistant - Admin Controls</h2>
          <p className="text-muted-foreground">
            Configure voice AI settings, monitor call logs, and manage Linda across all personas
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleTestCall}
            disabled={isTestCallActive}
            className="gap-2"
          >
            {isTestCallActive ? (
              <>
                <Volume2 className="h-4 w-4 animate-pulse" />
                Testing...
              </>
            ) : (
              <>
                <TestTube className="h-4 w-4" />
                Test Linda Call
              </>
            )}
          </Button>
          <Badge variant="secondary" className="px-3 py-1">
            Linda Disabled (Dev Environment)
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="personas">Personas</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="logs">Call Logs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Global Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="linda-enabled">Enable Linda AI</Label>
                    <p className="text-sm text-muted-foreground">Master switch for all Linda functionality</p>
                  </div>
                  <Switch 
                    id="linda-enabled"
                    checked={globalSettings.enabled}
                    onCheckedChange={(checked) => setGlobalSettings(prev => ({ ...prev, enabled: checked }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default-voice">Default Voice</Label>
                  <Select 
                    value={globalSettings.defaultVoice}
                    onValueChange={(value) => setGlobalSettings(prev => ({ ...prev, defaultVoice: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional-female">Professional Female</SelectItem>
                      <SelectItem value="professional-male">Professional Male</SelectItem>
                      <SelectItem value="warm-female">Warm Female</SelectItem>
                      <SelectItem value="confident-male">Confident Male</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retry-attempts">Call Retry Attempts</Label>
                  <Select 
                    value={globalSettings.callRetryAttempts.toString()}
                    onValueChange={(value) => setGlobalSettings(prev => ({ ...prev, callRetryAttempts: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 attempt</SelectItem>
                      <SelectItem value="2">2 attempts</SelectItem>
                      <SelectItem value="3">3 attempts</SelectItem>
                      <SelectItem value="4">4 attempts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-backup">SMS Backup</Label>
                    <p className="text-sm text-muted-foreground">Send SMS if call fails</p>
                  </div>
                  <Switch 
                    id="sms-backup"
                    checked={globalSettings.smsBackupEnabled}
                    onCheckedChange={(checked) => setGlobalSettings(prev => ({ ...prev, smsBackupEnabled: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Compliance & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="recording-enabled">Call Recording</Label>
                    <p className="text-sm text-muted-foreground">Record calls for compliance</p>
                  </div>
                  <Switch 
                    id="recording-enabled"
                    checked={globalSettings.recordingEnabled}
                    onCheckedChange={(checked) => setGlobalSettings(prev => ({ ...prev, recordingEnabled: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compliance-mode">HIPAA Compliance Mode</Label>
                    <p className="text-sm text-muted-foreground">Enhanced security and data protection</p>
                  </div>
                  <Switch 
                    id="compliance-mode"
                    checked={globalSettings.complianceMode}
                    onCheckedChange={(checked) => setGlobalSettings(prev => ({ ...prev, complianceMode: checked }))}
                  />
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-800">
                    <Shield className="h-4 w-4 inline mr-1" />
                    All Linda communications are encrypted and SOC 2 compliant
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="personas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Persona Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {personas.map((persona) => (
                  <div key={persona.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Switch 
                        checked={persona.enabled}
                        onCheckedChange={() => togglePersonaEnabled(persona.id)}
                      />
                      <div>
                        <h3 className="font-medium">{persona.name}</h3>
                        <p className="text-sm text-muted-foreground">{persona.users} active users</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={persona.enabled ? "default" : "secondary"}>
                        {persona.enabled ? 'Active' : 'Disabled'}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Voice & Branding Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firm-name">Firm Name</Label>
                  <Input
                    id="firm-name"
                    value={brandingSettings.firmName}
                    onChange={(e) => setBrandingSettings(prev => ({ ...prev, firmName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="caller-id">Caller ID Number</Label>
                  <Input
                    id="caller-id"
                    value={brandingSettings.callerIdNumber}
                    onChange={(e) => setBrandingSettings(prev => ({ ...prev, callerIdNumber: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="greeting">Default Greeting Template</Label>
                <Textarea
                  id="greeting"
                  value={brandingSettings.greeting}
                  onChange={(e) => setBrandingSettings(prev => ({ ...prev, greeting: e.target.value }))}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Use {`{{FIRM_NAME}}, {{ADVISOR_NAME}}, {{CLIENT_NAME}}, {{APPOINTMENT_TIME}}`} as placeholders
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hold-music">Hold Music</Label>
                  <Select 
                    value={brandingSettings.holdMusic}
                    onValueChange={(value) => setBrandingSettings(prev => ({ ...prev, holdMusic: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classical">Classical</SelectItem>
                      <SelectItem value="jazz">Jazz</SelectItem>
                      <SelectItem value="ambient">Ambient</SelectItem>
                      <SelectItem value="none">None (Silence)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sms-signature">SMS Signature</Label>
                  <Input
                    id="sms-signature"
                    value={brandingSettings.smsSignature}
                    onChange={(e) => setBrandingSettings(prev => ({ ...prev, smsSignature: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="gap-2">
                  <Play className="h-4 w-4" />
                  Preview Voice
                </Button>
                <Button variant="outline">
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Call Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {callLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`h-2 w-2 rounded-full ${
                        log.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <p className="font-medium">{log.clientName}</p>
                        <p className="text-sm text-muted-foreground">
                          {log.advisor} • {log.type} • {log.duration}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                        {log.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{log.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Calls Today</span>
                </div>
                <p className="text-2xl font-bold mt-2">127</p>
                <p className="text-xs text-green-600">+12% from yesterday</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Success Rate</span>
                </div>
                <p className="text-2xl font-bold mt-2">94.2%</p>
                <p className="text-xs text-green-600">+2.1% this week</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Avg Duration</span>
                </div>
                <p className="text-2xl font-bold mt-2">1m 34s</p>
                <p className="text-xs text-muted-foreground">Within target</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">SMS Sent</span>
                </div>
                <p className="text-2xl font-bold mt-2">89</p>
                <p className="text-xs text-blue-600">Backup messages</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};