import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Crown, Upload, Send, Eye, Trophy, Gift, Users, CheckCircle, Clock, AlertCircle, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VIPRecord {
  id?: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  persona: string;
  vipTier: string;
  specialty?: string;
  region?: string;
  source?: string;
  status: 'pending' | 'sent' | 'activated' | 'expired';
  credits: number;
  lastActivity?: string;
  referralCode?: string;
}

interface BulkUploadStats {
  total: number;
  processed: number;
  succeeded: number;
  failed: number;
  errors: string[];
}

export const VIPBulkManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [vipRecords, setVipRecords] = useState<VIPRecord[]>([]);
  const [uploadStats, setUploadStats] = useState<BulkUploadStats>({ total: 0, processed: 0, succeeded: 0, failed: 0, errors: [] });
  const [isProcessing, setIsProcessing] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Sample data for testing
  const sampleVIPs: VIPRecord[] = [
    {
      id: '1',
      name: 'Greg Hammer',
      company: 'Zoom Coaching Contact',
      email: 'greg@example.com',
      phone: '(219) 864-8266',
      persona: 'coach',
      vipTier: 'platinum',
      specialty: 'Executive Leadership',
      region: 'Midwest',
      source: 'Kim Referral',
      status: 'activated',
      credits: 150,
      lastActivity: '2024-01-15',
      referralCode: 'COACH-HAMMER24'
    },
    {
      id: '2',
      name: 'Dr. Gary Kampothekras',
      company: '1-800-ASK-GARY',
      email: 'gary@askgary.com',
      phone: '(941) 321-2828',
      persona: 'attorney',
      vipTier: 'platinum',
      specialty: 'Attorney Referral Network',
      region: 'Florida',
      source: 'Strategic Partner',
      status: 'sent',
      credits: 200,
      lastActivity: '2024-01-10',
      referralCode: 'ATT-ASKGARY24'
    },
    {
      id: '3',
      name: 'Stephanie Bogan',
      company: 'LimitlessFA',
      email: 'coaching@limitlessfa.life',
      persona: 'advisor',
      vipTier: 'gold',
      specialty: 'Advisor Growth',
      region: 'National',
      source: 'Industry Influencer',
      status: 'pending',
      credits: 75,
      referralCode: 'ADV-LIMITLESS24'
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvData = e.target?.result as string;
        const lines = csvData.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        const parsedRecords: VIPRecord[] = lines.slice(1).map((line, index) => {
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
          const record: any = {};
          
          headers.forEach((header, i) => {
            record[header] = values[i] || '';
          });

          return {
            name: record.name || record['full name'] || `Contact ${index + 1}`,
            company: record.company || record.firm || record.organization || '',
            email: record.email || record['email address'] || '',
            phone: record.phone || record.mobile || record.telephone || '',
            persona: record.persona || record.type || record.role || 'other',
            vipTier: record['vip tier'] || record.tier || 'gold',
            specialty: record.specialty || record.focus || '',
            region: record.region || record.location || '',
            source: record.source || record.referral || 'Bulk Import',
            status: 'pending' as const,
            credits: parseInt(record.credits || '50') || 50
          };
        });

        setVipRecords(parsedRecords);
        setUploadStats({ total: parsedRecords.length, processed: 0, succeeded: 0, failed: 0, errors: [] });
        
        toast({
          title: 'File Uploaded',
          description: `Successfully parsed ${parsedRecords.length} VIP records`,
        });
      } catch (error) {
        toast({
          title: 'Upload Error',
          description: 'Failed to parse CSV file. Please check the format.',
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
  };

  const loadSampleData = () => {
    setVipRecords(sampleVIPs);
    setUploadStats({ total: sampleVIPs.length, processed: 0, succeeded: 0, failed: 0, errors: [] });
    toast({
      title: 'Sample Data Loaded',
      description: `Loaded ${sampleVIPs.length} sample VIP records`,
    });
  };

  const processBulkInvites = async () => {
    if (vipRecords.length === 0) {
      toast({
        title: 'No Records',
        description: 'Please upload VIP records before sending invites',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    const stats = { ...uploadStats, processed: 0, succeeded: 0, failed: 0, errors: [] };

    for (let i = 0; i < vipRecords.length; i++) {
      const record = vipRecords[i];
      try {
        // Create VIP organization record
        const { data: orgData, error: orgError } = await supabase
          .from('vip_organizations')
          .insert({
            organization_name: record.company,
            organization_type: record.persona,
            contact_name: record.name,
            contact_email: record.email,
            contact_phone: record.phone,
            vip_tier: record.vipTier,
            specialty: record.specialty,
            region: record.region,
            source: record.source,
            status: 'pending'
          })
          .select()
          .single();

        if (orgError) throw orgError;

        // Send invitation via edge function
        const { error: inviteError } = await supabase.functions.invoke('send-vip-invitations', {
          body: {
            single_organization_id: orgData.id,
            custom_message: customMessage,
            send_method: 'email'
          }
        });

        if (inviteError) throw inviteError;

        stats.succeeded++;
        
        // Update local record status
        setVipRecords(prev => prev.map((r, idx) => 
          idx === i ? { ...r, status: 'sent' as const, id: orgData.id } : r
        ));

      } catch (error: any) {
        stats.failed++;
        stats.errors.push(`${record.name}: ${error.message}`);
      }
      
      stats.processed++;
      setUploadStats({ ...stats });
    }

    setIsProcessing(false);
    toast({
      title: 'Bulk Invites Complete',
      description: `Sent ${stats.succeeded} invites, ${stats.failed} failed`,
      variant: stats.failed > 0 ? 'destructive' : 'default',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'activated': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'sent': return <Send className="h-3 w-3" />;
      case 'activated': return <CheckCircle className="h-3 w-3" />;
      case 'expired': return <AlertCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Crown className="h-8 w-8 text-gold" />
        <div>
          <h1 className="text-3xl font-bold">VIP Bulk Management</h1>
          <p className="text-muted-foreground">
            Upload, invite, and manage VIP founders and early adopters
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload & Import
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Manage VIPs
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="credits" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Credits & Rewards
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>CSV Upload</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="csvFile">Upload VIP List (CSV)</Label>
                  <Input
                    id="csvFile"
                    type="file"
                    accept=".csv"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Expected columns: name, company, email, phone, persona, vip_tier, specialty, region, source
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Choose File
                  </Button>
                  <Button 
                    onClick={loadSampleData}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Load Sample Data
                  </Button>
                </div>

                {uploadStats.total > 0 && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Processing Progress</span>
                      <span>{uploadStats.processed}/{uploadStats.total}</span>
                    </div>
                    <Progress value={(uploadStats.processed / uploadStats.total) * 100} className="mb-2" />
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-green-600">✓ {uploadStats.succeeded} sent</div>
                      <div className="text-red-600">✗ {uploadStats.failed} failed</div>
                      <div className="text-blue-600">⏳ {uploadStats.total - uploadStats.processed} pending</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Invitation Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="persona">Filter by Persona (Optional)</Label>
                  <Select value={selectedPersona} onValueChange={setSelectedPersona}>
                    <SelectTrigger>
                      <SelectValue placeholder="All personas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Personas</SelectItem>
                      <SelectItem value="advisor">Advisor</SelectItem>
                      <SelectItem value="attorney">Attorney</SelectItem>
                      <SelectItem value="cpa">CPA</SelectItem>
                      <SelectItem value="coach">Coach</SelectItem>
                      <SelectItem value="consultant">Consultant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="customMessage">Custom Message (Optional)</Label>
                  <Textarea
                    id="customMessage"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Add a personal touch to the invitation emails..."
                    rows={4}
                  />
                </div>

                <Button 
                  onClick={processBulkInvites}
                  disabled={isProcessing || vipRecords.length === 0}
                  className="w-full flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sending Invites...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Magic Link Invites ({vipRecords.filter(r => !selectedPersona || r.persona === selectedPersona).length})
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>VIP Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vipRecords.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <h4 className="font-semibold">{record.name}</h4>
                        <p className="text-sm text-muted-foreground">{record.company}</p>
                        <p className="text-xs text-muted-foreground">{record.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="capitalize">
                          {record.persona}
                        </Badge>
                        <Badge variant="secondary" className="capitalize">
                          {record.vipTier}
                        </Badge>
                        <Badge className={getStatusColor(record.status)}>
                          {getStatusIcon(record.status)}
                          {record.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right text-sm">
                        <div className="font-medium">{record.credits} credits</div>
                        {record.lastActivity && (
                          <div className="text-muted-foreground">Last: {record.lastActivity}</div>
                        )}
                      </div>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-gold" />
                VIP Referral Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vipRecords
                  .filter(r => r.status === 'activated')
                  .sort((a, b) => b.credits - a.credits)
                  .slice(0, 10)
                  .map((record, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gold/10 text-gold font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{record.name}</h4>
                        <p className="text-sm text-muted-foreground">{record.company}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{record.credits}</div>
                        <div className="text-xs text-muted-foreground">credits earned</div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credits">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Credit Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">
                      {vipRecords.reduce((sum, r) => sum + r.credits, 0)}
                    </div>
                    <div className="text-sm text-green-600">Total Credits Distributed</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-lg font-bold text-blue-700">
                        {vipRecords.filter(r => r.status === 'activated').length}
                      </div>
                      <div className="text-xs text-blue-600">Active VIPs</div>
                    </div>
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="text-lg font-bold text-purple-700">
                        {vipRecords.filter(r => r.vipTier === 'platinum').length}
                      </div>
                      <div className="text-xs text-purple-600">Platinum Members</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reward Thresholds</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gold/10 border border-gold/20 rounded-lg">
                    <span className="font-medium">100 Credits</span>
                    <Badge variant="outline" className="text-gold border-gold">3 Month Free Service</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <span className="font-medium">250 Credits</span>
                    <Badge variant="outline" className="text-blue-600 border-blue-600">6 Month Free Service</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <span className="font-medium">500 Credits</span>
                    <Badge variant="outline" className="text-purple-600 border-purple-600">1 Year Free Service</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};