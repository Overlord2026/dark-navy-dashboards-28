import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Upload, 
  Send, 
  Download,
  RefreshCw, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Filter,
  Search,
  Mail,
  MessageSquare,
  Linkedin,
  BarChart3,
  Activity,
  Users,
  Crown,
  Star,
  Zap,
  TrendingUp,
  Trophy,
  Sparkles,
  Target,
  Share2,
  Bell,
  UserPlus,
  FileDown,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface VipInvite {
  id: string;
  slug: string;
  name: string;
  firm?: string;
  persona_type: string;
  email: string;
  phone?: string;
  linkedin_url?: string;
  invite_status: 'not_sent' | 'sent' | 'opened' | 'joined' | 'referred';
  activation_link: string;
  wave: string;
  batch_name: string;
  custom_message?: string;
  a_b_variant?: 'A' | 'B';
  created_at: string;
  sent_at?: string;
  opened_at?: string;
  joined_at?: string;
  referred_count?: number;
  priority: 'high' | 'medium' | 'low';
  notes?: string;
}

interface Wave {
  id: string;
  name: string;
  persona_limits: Record<string, number>;
  status: 'planned' | 'active' | 'completed';
  auto_trigger_threshold: number;
  started_at?: string;
  completed_at?: string;
}

interface Analytics {
  totalInvites: number;
  sentInvites: number;
  openedInvites: number;
  joinedInvites: number;
  referralCount: number;
  openRate: number;
  joinRate: number;
  referralRate: number;
  topReferrers: { name: string; count: number }[];
  personaBreakdown: Record<string, { invited: number; joined: number; pending: number }>;
  waveProgress: Record<string, { total: number; joined: number; percentage: number }>;
  abTestResults: { variantA: number; variantB: number; winner?: string };
}

const PERSONA_TYPES = {
  advisor: 'Financial Advisor',
  attorney: 'Legal Counsel',
  accountant: 'CPA',
  property_manager: 'Property Manager',
  healthcare_influencer: 'Health Influencer',
  family_office: 'Family Office',
  insurance_agent: 'Insurance Expert',
  coach: 'Family Coach',
  consultant: 'Consultant'
};

const EMAIL_TEMPLATES = {
  advisor: {
    subjectA: "Founding Financial Advisor Invitation - Family Office Marketplace™",
    subjectB: "Join the Elite: Founding Advisor Spot Reserved for You",
    bodyA: `Hi {{name}},

As a trusted financial advisor, you understand the unique needs of high-net-worth families. We're launching the Family Office Marketplace™ and have reserved a Founding Advisor spot for you.

Your Founding Benefits:
• Direct access to qualified family office prospects
• Collaboration with elite attorneys, CPAs, and consultants
• Featured placement in our premium directory
• Exclusive "Founding 100" recognition and badge

Claim your VIP profile: {{activation_link}}

We're limiting Founding status to just 100 advisors nationwide.

Best,
Tony Gomes
Boutique Family Office™`,
    bodyB: `Hi {{name}},

The family office industry is evolving, and we want you at the forefront. You've been selected as one of only 100 Founding Financial Advisors for our exclusive Family Office Marketplace™.

Why this matters:
🏆 Elite recognition in a curated network
🎯 Direct pipeline to qualified HNW families  
🤝 Collaboration with top-tier professionals
⚡ First-mover advantage in the digital family office space

Secure your spot now: {{activation_link}}

Time-sensitive: Only {{spots_remaining}} founding spots left.

Warm regards,
Tony Gomes`
  },
  // Add templates for other personas...
};

export function VipInviteEngine() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [invites, setInvites] = useState<VipInvite[]>([]);
  const [waves, setWaves] = useState<Wave[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedInvites, setSelectedInvites] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    persona: 'all',
    wave: 'all',
    priority: 'all'
  });
  const [sendingInvites, setSendingInvites] = useState(false);
  const [csvData, setCsvData] = useState<string>('');
  const [templatePersona, setTemplatePersona] = useState('advisor');
  const [customTemplate, setCustomTemplate] = useState('');
  const [abTestEnabled, setAbTestEnabled] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadInvites(),
        loadWaves(),
        loadAnalytics()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load VIP data');
    } finally {
      setLoading(false);
    }
  };

  const loadInvites = async () => {
    try {
      // TODO: Replace with actual Supabase call after migration
      const mockInvites: VipInvite[] = [
        {
          id: '1',
          slug: 'john-smith-advisor',
          name: 'John Smith',
          firm: 'Smith Wealth Management',
          persona_type: 'advisor',
          email: 'john@smithwealth.com',
          phone: '+1-555-0123',
          linkedin_url: 'https://linkedin.com/in/johnsmith',
          invite_status: 'joined',
          activation_link: 'https://bfo.co/invite/john-smith-advisor',
          wave: 'Wave 1',
          batch_name: 'Elite Advisors Q1',
          a_b_variant: 'A',
          created_at: '2024-01-15T10:30:00Z',
          sent_at: '2024-01-15T10:30:00Z',
          opened_at: '2024-01-15T11:45:00Z',
          joined_at: '2024-01-15T14:20:00Z',
          referred_count: 3,
          priority: 'high',
          notes: 'Top performer in region'
        },
        {
          id: '2',
          slug: 'sarah-johnson-attorney',
          name: 'Sarah Johnson',
          firm: 'Johnson Legal Group',
          persona_type: 'attorney',
          email: 'sarah@johnsonlegal.com',
          invite_status: 'opened',
          activation_link: 'https://bfo.co/invite/sarah-johnson-attorney',
          wave: 'Wave 1',
          batch_name: 'Estate Planning Experts',
          a_b_variant: 'B',
          created_at: '2024-01-16T09:15:00Z',
          sent_at: '2024-01-16T09:15:00Z',
          opened_at: '2024-01-16T15:30:00Z',
          priority: 'high'
        }
      ];
      setInvites(mockInvites);
    } catch (error) {
      console.error('Error loading invites:', error);
    }
  };

  const loadWaves = async () => {
    try {
      const mockWaves: Wave[] = [
        {
          id: '1',
          name: 'Wave 1 - Founding 100',
          persona_limits: {
            advisor: 25,
            attorney: 20,
            accountant: 15,
            property_manager: 10,
            healthcare_influencer: 10,
            family_office: 20
          },
          status: 'active',
          auto_trigger_threshold: 70,
          started_at: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          name: 'Wave 2 - Next 500',
          persona_limits: {
            advisor: 100,
            attorney: 75,
            accountant: 50,
            property_manager: 75,
            healthcare_influencer: 25,
            family_office: 175
          },
          status: 'planned',
          auto_trigger_threshold: 70
        }
      ];
      setWaves(mockWaves);
    } catch (error) {
      console.error('Error loading waves:', error);
    }
  };

  const loadAnalytics = async () => {
    try {
      const mockAnalytics: Analytics = {
        totalInvites: 156,
        sentInvites: 142,
        openedInvites: 89,
        joinedInvites: 34,
        referralCount: 12,
        openRate: 62.7,
        joinRate: 38.2,
        referralRate: 35.3,
        topReferrers: [
          { name: 'John Smith', count: 3 },
          { name: 'Michael Brown', count: 2 },
          { name: 'Lisa Davis', count: 2 }
        ],
        personaBreakdown: {
          advisor: { invited: 45, joined: 12, pending: 33 },
          attorney: { invited: 32, joined: 8, pending: 24 },
          accountant: { invited: 28, joined: 6, pending: 22 },
          property_manager: { invited: 25, joined: 4, pending: 21 },
          healthcare_influencer: { invited: 15, joined: 2, pending: 13 },
          family_office: { invited: 11, joined: 2, pending: 9 }
        },
        waveProgress: {
          'Wave 1': { total: 100, joined: 34, percentage: 34 }
        },
        abTestResults: { variantA: 18, variantB: 16, winner: 'A' }
      };
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const processCsvUpload = async () => {
    if (!csvData.trim()) {
      toast.error('Please paste CSV data');
      return;
    }

    try {
      const lines = csvData.trim().split('\n');
      const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
      
      const requiredFields = ['persona', 'first_name', 'last_name', 'email'];
      const missingFields = requiredFields.filter(field => !headers.includes(field));
      
      if (missingFields.length > 0) {
        toast.error(`Missing required fields: ${missingFields.join(', ')}`);
        return;
      }

      const newInvites = lines.slice(1).map((line, index) => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const invite: any = {};
        
        headers.forEach((header, i) => {
          invite[header] = values[i] || '';
        });

        return {
          id: `temp-${index}`,
          slug: `${invite.first_name}-${invite.last_name}-${invite.persona}`.toLowerCase().replace(/\s+/g, '-'),
          name: `${invite.first_name} ${invite.last_name}`,
          firm: invite.organization || '',
          persona_type: invite.persona,
          email: invite.email,
          phone: invite.phone || '',
          linkedin_url: invite.linkedin_url || '',
          invite_status: 'not_sent' as const,
          activation_link: `https://bfo.co/invite/${invite.first_name}-${invite.last_name}-${invite.persona}`.toLowerCase().replace(/\s+/g, '-'),
          wave: 'Wave 1',
          batch_name: `Bulk Upload ${new Date().toLocaleDateString()}`,
          created_at: new Date().toISOString(),
          priority: 'medium' as const,
          notes: invite.notes || ''
        };
      });

      // TODO: Save to Supabase
      setInvites(prev => [...prev, ...newInvites]);
      setCsvData('');
      toast.success(`Successfully uploaded ${newInvites.length} VIP invites`);
      
    } catch (error) {
      console.error('Error processing CSV:', error);
      toast.error('Failed to process CSV data');
    }
  };

  const sendBulkInvites = async (inviteIds: string[]) => {
    setSendingInvites(true);
    
    try {
      // TODO: Replace with actual edge function call
      const selectedInvitesList = invites.filter(inv => inviteIds.includes(inv.id));
      
      for (const invite of selectedInvitesList) {
        const template = EMAIL_TEMPLATES[invite.persona_type as keyof typeof EMAIL_TEMPLATES] || EMAIL_TEMPLATES.advisor;
        const variant = abTestEnabled ? (Math.random() > 0.5 ? 'A' : 'B') : 'A';
        
        // Simulate sending
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Update invite status
        setInvites(prev => prev.map(inv => 
          inv.id === invite.id 
            ? { ...inv, invite_status: 'sent' as const, sent_at: new Date().toISOString(), a_b_variant: variant }
            : inv
        ));
      }

      toast.success(`Successfully sent ${inviteIds.length} VIP invitations`);
      setSelectedInvites([]);
      
    } catch (error) {
      console.error('Error sending invites:', error);
      toast.error('Failed to send invitations');
    } finally {
      setSendingInvites(false);
    }
  };

  const exportData = () => {
    const csvContent = [
      'Name,Firm,Persona,Email,Status,Wave,Sent At,Joined At,Referrals',
      ...invites.map(inv => [
        inv.name,
        inv.firm || '',
        inv.persona_type,
        inv.email,
        inv.invite_status,
        inv.wave,
        inv.sent_at || '',
        inv.joined_at || '',
        inv.referred_count || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vip-invites-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredInvites = invites.filter(invite => {
    const matchesSearch = !searchTerm || 
      invite.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invite.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invite.firm && invite.firm.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filters.status === 'all' || invite.invite_status === filters.status;
    const matchesPersona = filters.persona === 'all' || invite.persona_type === filters.persona;
    const matchesWave = filters.wave === 'all' || invite.wave === filters.wave;
    const matchesPriority = filters.priority === 'all' || invite.priority === filters.priority;
    
    return matchesSearch && matchesStatus && matchesPersona && matchesWave && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_sent': return 'bg-slate-100 text-slate-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'opened': return 'bg-yellow-100 text-yellow-800';
      case 'joined': return 'bg-emerald-100 text-emerald-800';
      case 'referred': return 'bg-purple-100 text-purple-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'not_sent': return <Clock className="h-4 w-4" />;
      case 'sent': return <Send className="h-4 w-4" />;
      case 'opened': return <Eye className="h-4 w-4" />;
      case 'joined': return <CheckCircle className="h-4 w-4" />;
      case 'referred': return <Share2 className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Crown className="h-8 w-8 text-amber-500" />
            VIP Invite Engine
          </h1>
          <p className="text-muted-foreground">
            Launch your Founding 100 campaign with wave-based automation and viral growth
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportData} variant="outline">
            <FileDown className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={loadData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">Total VIPs</span>
            </div>
            <div className="text-2xl font-bold mt-1">{analytics?.totalInvites || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Send className="h-5 w-5 text-emerald-500" />
              <span className="text-sm font-medium">Sent</span>
            </div>
            <div className="text-2xl font-bold mt-1">{analytics?.sentInvites || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium">Open Rate</span>
            </div>
            <div className="text-2xl font-bold mt-1">{analytics?.openRate || 0}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium">Joined</span>
            </div>
            <div className="text-2xl font-bold mt-1">{analytics?.joinedInvites || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-500" />
              <span className="text-sm font-medium">Join Rate</span>
            </div>
            <div className="text-2xl font-bold mt-1">{analytics?.joinRate || 0}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-pink-500" />
              <span className="text-sm font-medium">Referrals</span>
            </div>
            <div className="text-2xl font-bold mt-1">{analytics?.referralCount || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="upload">Bulk Upload</TabsTrigger>
          <TabsTrigger value="invites">Manage Invites</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="waves">Wave Manager</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Wave Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Wave Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(analytics?.waveProgress || {}).map(([wave, progress]) => (
                  <div key={wave} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{wave}</span>
                      <span className="text-sm text-muted-foreground">
                        {progress.joined}/{progress.total} joined
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full transition-all"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* A/B Test Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  A/B Test Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Variant A</span>
                    <Badge variant={analytics?.abTestResults.winner === 'A' ? 'default' : 'outline'}>
                      {analytics?.abTestResults.variantA} joins
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Variant B</span>
                    <Badge variant={analytics?.abTestResults.winner === 'B' ? 'default' : 'outline'}>
                      {analytics?.abTestResults.variantB} joins
                    </Badge>
                  </div>
                  {analytics?.abTestResults.winner && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-center">
                        🏆 <strong>Variant {analytics.abTestResults.winner}</strong> is winning
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Referrers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Top Referrers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.topReferrers.map((referrer, index) => (
                    <div key={referrer.name} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center text-xs font-bold text-white">
                        {index + 1}
                      </div>
                      <span className="flex-1">{referrer.name}</span>
                      <Badge variant="outline">{referrer.count} referrals</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upload">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Bulk CSV Upload
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="csv-data">CSV Data</Label>
                  <Textarea
                    id="csv-data"
                    placeholder="Paste CSV data here..."
                    value={csvData}
                    onChange={(e) => setCsvData(e.target.value)}
                    rows={10}
                    className="mt-1"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Required columns: persona, first_name, last_name, email
                  </p>
                </div>
                <Button onClick={processCsvUpload} className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Process Upload
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CSV Format Example</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
{`persona,first_name,last_name,email,organization,linkedin_url,phone,notes
advisor,John,Smith,john@example.com,Smith Wealth,linkedin.com/in/johnsmith,555-0123,Top performer
attorney,Sarah,Johnson,sarah@lawfirm.com,Johnson Legal,,555-0124,Estate planning expert
accountant,Mike,Brown,mike@cpa.com,Brown CPA Group,,,Tax specialist`}
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="invites">
          <div className="space-y-6">
            {/* Filters and Actions */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, firm, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="not_sent">Not Sent</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="opened">Opened</SelectItem>
                      <SelectItem value="joined">Joined</SelectItem>
                      <SelectItem value="referred">Referred</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filters.persona} onValueChange={(value) => setFilters(prev => ({ ...prev, persona: value }))}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="All Personas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Personas</SelectItem>
                      {Object.entries(PERSONA_TYPES).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Bulk Actions */}
                {selectedInvites.length > 0 && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                    <span className="text-sm font-medium">{selectedInvites.length} selected</span>
                    <Button 
                      size="sm" 
                      onClick={() => sendBulkInvites(selectedInvites)}
                      disabled={sendingInvites}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {sendingInvites ? 'Sending...' : 'Send Invites'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setSelectedInvites([])}>
                      Clear Selection
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setSelectedInvites(filteredInvites.map(inv => inv.id))}>
                      Select All Filtered
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Invites List */}
            <Card>
              <CardHeader>
                <CardTitle>VIP Invitations ({filteredInvites.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredInvites.map((invite) => (
                    <motion.div
                      key={invite.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedInvites.includes(invite.id)}
                        onChange={() => {
                          setSelectedInvites(prev => 
                            prev.includes(invite.id) 
                              ? prev.filter(id => id !== invite.id)
                              : [...prev, invite.id]
                          );
                        }}
                        className="h-4 w-4"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{invite.name}</span>
                          {invite.priority === 'high' && (
                            <Star className="h-4 w-4 text-amber-500" />
                          )}
                          {invite.referred_count && invite.referred_count > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {invite.referred_count} referrals
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{invite.firm}</span>
                          <span>•</span>
                          <span>{PERSONA_TYPES[invite.persona_type as keyof typeof PERSONA_TYPES]}</span>
                          <span>•</span>
                          <span>{invite.wave}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(invite.invite_status)} variant="outline">
                          {getStatusIcon(invite.invite_status)}
                          <span className="ml-1 capitalize">{invite.invite_status.replace('_', ' ')}</span>
                        </Badge>
                        {invite.a_b_variant && (
                          <Badge variant="outline" className="text-xs">
                            {invite.a_b_variant}
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Template Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="template-persona">Persona Type</Label>
                  <Select value={templatePersona} onValueChange={setTemplatePersona}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PERSONA_TYPES).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="ab-test" 
                    checked={abTestEnabled}
                    onCheckedChange={setAbTestEnabled}
                  />
                  <Label htmlFor="ab-test">Enable A/B Testing</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Template Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <strong>Subject:</strong> {EMAIL_TEMPLATES[templatePersona as keyof typeof EMAIL_TEMPLATES]?.subjectA || 'Template not found'}
                  </div>
                  <div>
                    <strong>Body Preview:</strong>
                    <div className="bg-muted p-3 rounded mt-1 max-h-48 overflow-y-auto">
                      {EMAIL_TEMPLATES[templatePersona as keyof typeof EMAIL_TEMPLATES]?.bodyA?.substring(0, 300) || 'Template not found'}...
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="waves">
          <div className="space-y-6">
            {waves.map((wave) => (
              <Card key={wave.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      {wave.name}
                    </CardTitle>
                    <Badge 
                      variant={wave.status === 'active' ? 'default' : wave.status === 'completed' ? 'outline' : 'secondary'}
                    >
                      {wave.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {Object.entries(wave.persona_limits).map(([persona, limit]) => {
                      const invited = invites.filter(inv => inv.persona_type === persona && inv.wave === wave.name).length;
                      const joined = invites.filter(inv => inv.persona_type === persona && inv.wave === wave.name && inv.invite_status === 'joined').length;
                      const percentage = limit > 0 ? (joined / limit) * 100 : 0;
                      
                      return (
                        <div key={persona} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{PERSONA_TYPES[persona as keyof typeof PERSONA_TYPES]}</span>
                            <span className="text-sm text-muted-foreground">
                              {joined}/{limit}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-emerald-500 h-2 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {wave.status === 'active' && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        Auto-trigger next wave at {wave.auto_trigger_threshold}% completion
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Persona Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Persona Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics?.personaBreakdown || {}).map(([persona, data]) => {
                    const joinRate = data.invited > 0 ? (data.joined / data.invited) * 100 : 0;
                    
                    return (
                      <div key={persona} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">
                            {PERSONA_TYPES[persona as keyof typeof PERSONA_TYPES]}
                          </span>
                          <div className="text-right text-sm">
                            <div>{data.joined}/{data.invited} joined</div>
                            <div className="text-muted-foreground">{joinRate.toFixed(1)}%</div>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-emerald-500 h-2 rounded-full transition-all"
                            style={{ width: `${joinRate}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Conversion Funnel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Conversion Funnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                    <span>Invites Sent</span>
                    <span className="font-bold">{analytics?.sentInvites}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                    <span>Opened ({analytics?.openRate}%)</span>
                    <span className="font-bold">{analytics?.openedInvites}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded">
                    <span>Joined ({analytics?.joinRate}%)</span>
                    <span className="font-bold">{analytics?.joinedInvites}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded">
                    <span>Referred Others ({analytics?.referralRate}%)</span>
                    <span className="font-bold">{analytics?.referralCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* VIP Wall Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  VIP Wall Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {invites
                    .filter(inv => inv.invite_status === 'joined')
                    .slice(0, 10)
                    .map((invite, index) => (
                      <motion.div
                        key={invite.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{invite.name}</div>
                          <div className="text-sm text-muted-foreground">{invite.firm}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Crown className="h-4 w-4 text-amber-500" />
                          <span className="text-xs font-medium">Founding Member</span>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* FOMO Ticker */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  <AnimatePresence>
                    {invites
                      .filter(inv => inv.joined_at)
                      .sort((a, b) => new Date(b.joined_at!).getTime() - new Date(a.joined_at!).getTime())
                      .slice(0, 15)
                      .map((invite) => (
                        <motion.div
                          key={invite.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Sparkles className="h-4 w-4 text-emerald-500" />
                          <span>
                            <strong>{invite.name}</strong> just joined as a Founding {PERSONA_TYPES[invite.persona_type as keyof typeof PERSONA_TYPES]}
                          </span>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}