/**
 * Admin Invites Management Page
 * CSV import, invite generation, sending, and analytics
 */

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Send, 
  Eye, 
  MousePointer, 
  UserX, 
  CheckCircle, 
  Users, 
  FileText,
  Download,
  Anchor
} from 'lucide-react';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';
import { parseProfileCSV, normalizeProfileRows, type ProfileRow } from '@/services/profileNormalizer';
import { createInvites, sendInvites, getInviteAnalytics, type CampaignContext } from '@/services/inviter';
import { anchorBatch } from '@/services/receipts';

export function InvitesPage() {
  const [csvContent, setCsvContent] = useState('');
  const [parsedRows, setParsedRows] = useState<ProfileRow[]>([]);
  const [normalizedProfiles, setNormalizedProfiles] = useState([]);
  const [campaignCtx, setCampaignCtx] = useState<Partial<CampaignContext>>({
    channel: 'email'
  });
  const [invites, setInvites] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  // File drop handler
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCsvContent(content);
      try {
        const rows = parseProfileCSV(content);
        setParsedRows(rows);
        toast.success(`Parsed ${rows.length} profiles from CSV`);
      } catch (error) {
        toast.error('Failed to parse CSV: ' + error.message);
      }
    };
    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false
  });

  // Normalize profiles preview
  const handleNormalize = async () => {
    if (!parsedRows.length) {
      toast.error('No profiles to normalize');
      return;
    }

    setLoading(true);
    try {
      const normalized = await normalizeProfileRows(parsedRows);
      setNormalizedProfiles(normalized);
      toast.success(`Normalized ${normalized.length} profiles (no PII stored)`);
    } catch (error) {
      toast.error('Failed to normalize profiles');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Generate invites
  const handleGenerateInvites = async () => {
    if (!normalizedProfiles.length || !campaignCtx.campaign_id) {
      toast.error('Missing normalized profiles or campaign ID');
      return;
    }

    setLoading(true);
    try {
      const createdInvites = await createInvites(
        normalizedProfiles,
        campaignCtx as CampaignContext
      );
      setInvites(createdInvites);
      toast.success(`Generated ${createdInvites.length} invites with Invite-RDS receipts`);
      
      // Refresh analytics
      await loadAnalytics();
    } catch (error) {
      toast.error('Failed to generate invites');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Send invites
  const handleSendInvites = async () => {
    if (!invites.length) {
      toast.error('No invites to send');
      return;
    }

    setLoading(true);
    try {
      const inviteIds = invites.map(inv => inv.id);
      const result = await sendInvites(inviteIds, campaignCtx.channel as "email" | "sms");
      
      toast.success(`Sent ${result.sent} invites, ${result.failed} failed`);
      
      // Refresh analytics
      await loadAnalytics();
    } catch (error) {
      toast.error('Failed to send invites');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Load analytics
  const loadAnalytics = async () => {
    try {
      const data = await getInviteAnalytics(campaignCtx.campaign_id);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  // Anchor receipts
  const handleAnchorReceipts = async () => {
    setLoading(true);
    try {
      await anchorBatch({ sinceIso: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() });
      toast.success('Receipts anchored successfully');
    } catch (error) {
      toast.error('Failed to anchor receipts');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadAnalytics();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Social Graph Invites</h1>
          <p className="text-muted-foreground">
            Content-free invite generation for agents and families
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAnchorReceipts} variant="outline" disabled={loading}>
            <Anchor className="h-4 w-4 mr-2" />
            Anchor Now
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="import" className="space-y-6">
        <TabsList>
          <TabsTrigger value="import">Import & Generate</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-6">
          {/* CSV Import */}
          <Card>
            <CardHeader>
              <CardTitle>1. Import Profile CSV</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {isDragActive ? 'Drop CSV here...' : 'Drag & drop CSV or click to browse'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Required columns: persona, full_name, email/phone or profile_url
                </p>
              </div>

              {csvContent && (
                <div>
                  <Label>Raw CSV Preview</Label>
                  <Textarea 
                    value={csvContent.slice(0, 500)} 
                    readOnly 
                    className="h-20 font-mono text-xs"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Parsed {parsedRows.length} rows
                  </p>
                </div>
              )}

              {parsedRows.length > 0 && (
                <Button onClick={handleNormalize} disabled={loading}>
                  <FileText className="h-4 w-4 mr-2" />
                  {loading ? 'Normalizing...' : 'Normalize Profiles (Remove PII)'}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Campaign Context */}
          <Card>
            <CardHeader>
              <CardTitle>2. Campaign Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="campaign_id">Campaign ID *</Label>
                  <Input
                    id="campaign_id"
                    value={campaignCtx.campaign_id || ''}
                    onChange={(e) => setCampaignCtx(prev => ({ ...prev, campaign_id: e.target.value }))}
                    placeholder="metro-miami-marine-2024"
                  />
                </div>
                <div>
                  <Label htmlFor="channel">Channel *</Label>
                   <Select value={campaignCtx.channel} onValueChange={(value: "email" | "sms") => 
                    setCampaignCtx(prev => ({ ...prev, channel: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="metro">Metro</Label>
                  <Input
                    id="metro"
                    value={campaignCtx.metro || ''}
                    onChange={(e) => setCampaignCtx(prev => ({ ...prev, metro: e.target.value }))}
                    placeholder="Miami, FL"
                  />
                </div>
                <div>
                  <Label htmlFor="specialty">Specialty</Label>
                  <Select value={campaignCtx.specialty} onValueChange={(value) => 
                    setCampaignCtx(prev => ({ ...prev, specialty: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marine">Marine</SelectItem>
                      <SelectItem value="fine_art">Fine Art</SelectItem>
                      <SelectItem value="coastal_home">Coastal Home</SelectItem>
                      <SelectItem value="exotics">Exotics</SelectItem>
                      <SelectItem value="umbrella">Umbrella</SelectItem>
                      <SelectItem value="flood_eq">Flood/EQ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {normalizedProfiles.length > 0 && (
                <div className="mt-4">
                  <Button onClick={handleGenerateInvites} disabled={loading || !campaignCtx.campaign_id}>
                    <Users className="h-4 w-4 mr-2" />
                    {loading ? 'Generating...' : `Generate ${normalizedProfiles.length} Invites`}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Send Invites */}
          {invites.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>3. Send Invites</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {invites.length} invites ready to send via {campaignCtx.channel}
                    </p>
                  </div>
                  <Button onClick={handleSendInvites} disabled={loading}>
                    <Send className="h-4 w-4 mr-2" />
                    {loading ? 'Sending...' : 'Send Batch'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Sent</p>
                      <p className="text-2xl font-bold">{analytics.metrics.sent}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Viewed</p>
                      <p className="text-2xl font-bold">{analytics.metrics.viewed}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <MousePointer className="h-4 w-4 text-purple-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Clicked</p>
                      <p className="text-2xl font-bold">{analytics.metrics.clicked}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Converted</p>
                      <p className="text-2xl font-bold">{analytics.metrics.converted}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {analytics && analytics.metrics.sent > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Funnel Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sent → Viewed</span>
                    <span className="text-sm font-medium">
                      {((analytics.metrics.viewed / analytics.metrics.sent) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={(analytics.metrics.viewed / analytics.metrics.sent) * 100} 
                    className="h-2"
                  />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Viewed → Clicked</span>
                    <span className="text-sm font-medium">
                      {analytics.metrics.viewed > 0 
                        ? ((analytics.metrics.clicked / analytics.metrics.viewed) * 100).toFixed(1)
                        : '0.0'
                      }%
                    </span>
                  </div>
                  <Progress 
                    value={analytics.metrics.viewed > 0 
                      ? (analytics.metrics.clicked / analytics.metrics.viewed) * 100 
                      : 0
                    } 
                    className="h-2"
                  />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Clicked → Converted</span>
                    <span className="text-sm font-medium">
                      {analytics.metrics.clicked > 0 
                        ? ((analytics.metrics.converted / analytics.metrics.clicked) * 100).toFixed(1)
                        : '0.0'
                      }%
                    </span>
                  </div>
                  <Progress 
                    value={analytics.metrics.clicked > 0 
                      ? (analytics.metrics.converted / analytics.metrics.clicked) * 100 
                      : 0
                    } 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-xs text-muted-foreground text-center">
            All tracking via content-free receipts • Raw PII only at send-time • Audit-RDS available
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default InvitesPage;