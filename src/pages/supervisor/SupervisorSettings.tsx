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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronLeft, Eye, Send, Clock, FileText, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { getSupervisorPrefs, saveSupervisorPrefs, type SupervisorPrefs } from '@/features/compliance/supervisor/prefs';
import { makeSupervisorDigest, renderDigestTemplate } from '@/features/compliance/supervisor/digest';
import { makeMonthlyMetrics } from '@/features/compliance/supervisor/monthly';
import { buildAndSendMonthlyReport } from '@/features/compliance/supervisor/monthlySend';
import { sendEmail } from '@/features/comms/send';
import { recordReceipt } from '@/features/receipts/record';

// Extended supervisor preferences type for monthly settings
interface ExtendedSupervisorPrefs extends SupervisorPrefs {
  monthlyEnabled?: boolean;
  monthlyDayUtc?: number;
  monthlyHourUtc?: number;
  attachEvidence?: boolean;
  anchorReports?: boolean;
}

export default function SupervisorSettings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [prefs, setPrefs] = useState<ExtendedSupervisorPrefs>({
    userId: 'current-supervisor-id',
    firmId: 'current-firm-id',
    enabled: false,
    hourUtc: 13, // 8am ET
    personas: ['advisor'],
    sendEmpty: false,
    monthlyEnabled: false,
    monthlyDayUtc: 1,
    monthlyHourUtc: 13,
    attachEvidence: false,
    anchorReports: false
  });
  const [previewContent, setPreviewContent] = useState<string>('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMonthlyPreviewOpen, setIsMonthlyPreviewOpen] = useState(false);
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

  const handleSendTestMonthly = async () => {
    setIsSending(true);
    try {
      const result = await buildAndSendMonthlyReport({
        firmId: prefs.firmId,
        personas: prefs.personas,
        attachEvidence: prefs.attachEvidence || false,
        anchor: prefs.anchorReports || false,
        to: [`supervisor-${prefs.userId}@example.com`]
      });
      
      if (result.ok) {
        toast({
          title: "Test Monthly Report Sent",
          description: `Monthly report for ${result.month} has been sent. Check your email and Vault.`
        });
      } else {
        throw new Error('Failed to send monthly report');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send test monthly report.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const handlePreviewMonthly = async () => {
    try {
      const metrics = await makeMonthlyMetrics(prefs.firmId, prefs.personas, new Date());
      const byPersonaMd = Object.entries(metrics.byPersona)
        .map(([persona, count]) => `- ${persona.charAt(0).toUpperCase() + persona.slice(1)}: **${count}**`)
        .join('\n');
      
      const content = `# Supervisor Monthly Report — ${metrics.month_label}

**Firm overview (last month):**  
- Exceptions (open at month end): **${metrics.exceptions_open}** (Δ ${metrics.exceptions_delta} vs prior month)  
- Guardrails alerts (count in month): **${metrics.guardrails_count}**  
- Beneficiary mismatches (open at month end): **${metrics.beneficiary_open}** (Δ ${metrics.beneficiary_delta})  
- Evidence packs built: **${metrics.evidence_count}**  
- Anchor coverage (info): **${metrics.anchor_coverage}%**

**By Persona (open exceptions @ month end):**  
${byPersonaMd}

**Trends (monthly)**  
Exceptions: \`${metrics.spark_exceptions}\`  
Evidence: \`${metrics.spark_evidence}\`

**Links**  
- Exceptions: ${metrics.links.exceptions_link}  
- Evidence Builder: ${metrics.links.evidence_link}  
- Anchors Verify: ${metrics.links.anchors_link}  
- Audits: ${metrics.links.audits_link}  

> No client data included. For details, open the console to view exceptions and export an Evidence Pack.`;
      
      setPreviewContent(content);
      setIsMonthlyPreviewOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate monthly preview.",
        variant: "destructive"
      });
    }
  };

  const PERSONAS = ['advisor', 'cpa', 'attorney', 'insurance', 'medicare', 'healthcare', 'realtor'] as const;

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

          {/* Monthly Report Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Monthly Report Configuration
              </CardTitle>
              <CardDescription>
                Generate and email comprehensive monthly compliance reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Enable Monthly Reports */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="monthly-enabled">Enable Monthly Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Generate monthly compliance reports with trends and analytics
                  </p>
                </div>
                <Switch
                  id="monthly-enabled"
                  checked={prefs.monthlyEnabled || false}
                  onCheckedChange={(checked) => setPrefs(prev => ({ ...prev, monthlyEnabled: checked }))}
                />
              </div>

              {/* Monthly Delivery Day */}
              <div className="space-y-2">
                <Label htmlFor="monthly-day">Delivery Day (UTC)</Label>
                <Select
                  value={(prefs.monthlyDayUtc || 1).toString()}
                  onValueChange={(value) => setPrefs(prev => ({ ...prev, monthlyDayUtc: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                      <SelectItem key={day} value={day.toString()}>
                        {day === 1 && '1st (recommended)'}
                        {day !== 1 && `${day}${day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Monthly Delivery Hour */}
              <div className="space-y-2">
                <Label htmlFor="monthly-hour">Delivery Time (UTC)</Label>
                <Select
                  value={(prefs.monthlyHourUtc || 13).toString()}
                  onValueChange={(value) => setPrefs(prev => ({ ...prev, monthlyHourUtc: parseInt(value) }))}
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

              {/* Attach Evidence ZIP */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="attach-evidence">Attach Evidence ZIP</Label>
                  <p className="text-sm text-muted-foreground">
                    Include evidence pack with receipts (large file)
                  </p>
                </div>
                <Switch
                  id="attach-evidence"
                  checked={prefs.attachEvidence || false}
                  onCheckedChange={(checked) => setPrefs(prev => ({ ...prev, attachEvidence: checked }))}
                />
              </div>

              {prefs.attachEvidence && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Evidence ZIP files can be large and may affect email delivery. Consider using Vault links instead.
                  </AlertDescription>
                </Alert>
              )}

              {/* Anchor Reports */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="anchor-reports">Anchor Report Manifest</Label>
                  <p className="text-sm text-muted-foreground">
                    Create tamper-evident anchors for report integrity
                  </p>
                </div>
                <Switch
                  id="anchor-reports"
                  checked={prefs.anchorReports || false}
                  onCheckedChange={(checked) => setPrefs(prev => ({ ...prev, anchorReports: checked }))}
                />
              </div>

              {/* Monthly Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" onClick={handlePreviewMonthly}>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Monthly
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleSendTestMonthly}
                  disabled={isSending}
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isSending ? 'Sending...' : 'Send Test Monthly'}
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
                  Daily: {prefs.enabled ? "Enabled" : "Disabled"}
                </Badge>
                <Badge variant={prefs.monthlyEnabled ? "default" : "secondary"}>
                  Monthly: {prefs.monthlyEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              {prefs.enabled && (
                <div className="text-sm text-muted-foreground">
                  Daily digest at {prefs.hourUtc.toString().padStart(2, '0')}:00 UTC
                </div>
              )}
              {prefs.monthlyEnabled && (
                <div className="text-sm text-muted-foreground">
                  Monthly report on day {prefs.monthlyDayUtc || 1} at {(prefs.monthlyHourUtc || 13).toString().padStart(2, '0')}:00 UTC
                </div>
              )}
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

      {/* Monthly Preview Dialog */}
      <Dialog open={isMonthlyPreviewOpen} onOpenChange={setIsMonthlyPreviewOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Monthly Report Preview</DialogTitle>
            <DialogDescription>
              Preview of the monthly supervisor report content
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