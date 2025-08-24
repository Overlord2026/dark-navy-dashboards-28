import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Eye, Send, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { getSupervisorPrefs, saveSupervisorPrefs, type SupervisorPrefs } from '@/features/compliance/supervisor/prefs';
import { makeSupervisorDigest, renderDigestTemplate } from '@/features/compliance/supervisor/digest';
import { sendEmail } from '@/features/comms/send';
import { recordReceipt } from '@/features/receipts/record';

const PERSONAS = ['advisor', 'cpa', 'attorney', 'insurance', 'medicare', 'healthcare', 'realtor'] as const;

export default function SupervisorSettings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [prefs, setPrefs] = useState<SupervisorPrefs>({
    userId: 'current-supervisor-id',
    firmId: 'current-firm-id',
    enabled: false,
    hourUtc: 13, // 8am ET
    personas: ['advisor'],
    sendEmpty: false
  });
  const [previewContent, setPreviewContent] = useState<string>('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    loadPrefs();
  }, []);

  const loadPrefs = async () => {
    const supervisorPrefs = await getSupervisorPrefs(prefs.firmId);
    const userPrefs = supervisorPrefs.find(p => p.userId === prefs.userId);
    if (userPrefs) {
      setPrefs(userPrefs);
    }
  };

  const handleSave = async () => {
    try {
      await saveSupervisorPrefs(prefs);
      
      // Record Decision-RDS receipt
      await recordReceipt({
        type: 'Decision-RDS',
        action: 'compliance.settings.update',
        created_at: new Date().toISOString()
      } as any);
      
      toast({
        title: "Settings Saved",
        description: "Supervisor digest preferences have been updated."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePreview = async () => {
    try {
      const counts = await makeSupervisorDigest(prefs.firmId, prefs.personas);
      const date = new Date().toLocaleDateString();
      const content = renderDigestTemplate(counts, date);
      setPreviewContent(content);
      setIsPreviewOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate preview.",
        variant: "destructive"
      });
    }
  };

  const handleSendTest = async () => {
    setIsSending(true);
    try {
      const counts = await makeSupervisorDigest(prefs.firmId, prefs.personas);
      const date = new Date().toLocaleDateString();
      const subject = `[TEST] Supervisor Daily Digest — ${date}`;
      const markdown = renderDigestTemplate(counts, date);
      
      const result = await sendEmail({
        to: `supervisor-${prefs.userId}@example.com`,
        subject,
        markdown
      });
      
      if (result.ok) {
        // Record Comms-RDS receipt
        await recordReceipt({
          type: 'Comms-RDS',
          channel: 'email',
          template_id: 'supervisor.digest.daily',
          result: 'sent',
          policy_ok: true,
          created_at: new Date().toISOString()
        } as any);
        
        toast({
          title: "Test Email Sent",
          description: "Check your email for the test digest."
        });
      } else {
        throw new Error('Failed to send test email');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send test email.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const handlePersonaToggle = (persona: string, checked: boolean) => {
    if (checked) {
      setPrefs(prev => ({
        ...prev,
        personas: [...prev.personas, persona as any]
      }));
    } else {
      setPrefs(prev => ({
        ...prev,
        personas: prev.personas.filter(p => p !== persona)
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/supervisor')}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Supervisor Console
            </Button>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Supervisor Settings</h1>
            <p className="text-muted-foreground">
              Configure daily digest preferences and compliance notifications
            </p>
          </div>

          {/* Main Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Daily Digest Configuration
              </CardTitle>
              <CardDescription>
                Receive daily summaries of compliance exceptions and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Enable Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enabled">Enable Daily Digest</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive automated daily digest emails
                  </p>
                </div>
                <Switch
                  id="enabled"
                  checked={prefs.enabled}
                  onCheckedChange={(checked) => setPrefs(prev => ({ ...prev, enabled: checked }))}
                />
              </div>

              {/* Delivery Time */}
              <div className="space-y-2">
                <Label htmlFor="hour">Delivery Time (UTC)</Label>
                <Select
                  value={prefs.hourUtc.toString()}
                  onValueChange={(value) => setPrefs(prev => ({ ...prev, hourUtc: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i.toString().padStart(2, '0')}:00 UTC
                        {i === 13 && ' (8am ET)'}
                        {i === 17 && ' (12pm ET)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Persona Selection */}
              <div className="space-y-3">
                <Label>Personas to Monitor</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {PERSONAS.map((persona) => (
                    <div key={persona} className="flex items-center space-x-2">
                      <Checkbox
                        id={persona}
                        checked={prefs.personas.includes(persona)}
                        onCheckedChange={(checked) => handlePersonaToggle(persona, checked as boolean)}
                      />
                      <Label htmlFor={persona} className="capitalize text-sm">
                        {persona}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Send Empty */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="send-empty">Send When Empty</Label>
                  <p className="text-sm text-muted-foreground">
                    Send "All clear" emails when no exceptions are found
                  </p>
                </div>
                <Switch
                  id="send-empty"
                  checked={prefs.sendEmpty}
                  onCheckedChange={(checked) => setPrefs(prev => ({ ...prev, sendEmpty: checked }))}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button onClick={handleSave}>
                  Save Settings
                </Button>
                <Button variant="outline" onClick={handlePreview}>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleSendTest}
                  disabled={isSending}
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isSending ? 'Sending...' : 'Send Test'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Current Status */}
          <Card>
            <CardHeader>
              <CardTitle>Current Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant={prefs.enabled ? "default" : "secondary"}>
                  {prefs.enabled ? "Enabled" : "Disabled"}
                </Badge>
                {prefs.enabled && (
                  <span className="text-sm text-muted-foreground">
                    Delivers at {prefs.hourUtc.toString().padStart(2, '0')}:00 UTC
                  </span>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                Monitoring {prefs.personas.length} persona{prefs.personas.length !== 1 ? 's' : ''}: {prefs.personas.join(', ')}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Digest Preview</DialogTitle>
            <DialogDescription>
              Preview of the daily supervisor digest email content
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div className="bg-muted rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">
              {previewContent}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}