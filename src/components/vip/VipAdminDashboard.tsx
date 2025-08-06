import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, 
  Users, 
  Send, 
  Eye, 
  Check, 
  Clock, 
  Filter,
  Download,
  Search,
  Plus,
  Mail,
  MessageSquare,
  Linkedin,
  BarChart3,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface VipInvite {
  id: string;
  slug: string;
  name: string;
  firm: string;
  persona_type: string;
  email: string;
  phone?: string;
  linkedin_url?: string;
  invite_status: 'reserved' | 'sent' | 'viewed' | 'activated';
  activation_link: string;
  persona_group: string;
  batch_name: string;
  custom_message?: string;
  created_at: string;
  sent_at?: string;
  viewed_at?: string;
  activated_at?: string;
}

interface AnalyticsSummary {
  totalInvites: number;
  totalSent: number;
  totalViewed: number;
  totalActivated: number;
  conversionRate: number;
  viewRate: number;
  activationRate: number;
  byPersona: Record<string, any>;
  byBatch: Record<string, any>;
}

export const VipAdminDashboard: React.FC = () => {
  const [invites, setInvites] = useState<VipInvite[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [selectedPersona, setSelectedPersona] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, [selectedBatch, selectedPersona]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // TODO: Enable after migration is run
      // let query = supabase.from('vip_invites').select('*');
      // const { data: invitesData, error } = await query.order('created_at', { ascending: false });
      // setInvites(invitesData || []);
      // calculateAnalytics(invitesData || []);
      
      // Mock data for now
      setInvites([]);
      calculateAnalytics([]);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (inviteData: VipInvite[]) => {
    const totalInvites = inviteData.length;
    const totalSent = inviteData.filter(i => ['sent', 'viewed', 'activated'].includes(i.invite_status)).length;
    const totalViewed = inviteData.filter(i => ['viewed', 'activated'].includes(i.invite_status)).length;
    const totalActivated = inviteData.filter(i => i.invite_status === 'activated').length;
    
    const conversionRate = totalSent > 0 ? (totalActivated / totalSent) * 100 : 0;
    const viewRate = totalSent > 0 ? (totalViewed / totalSent) * 100 : 0;
    const activationRate = totalViewed > 0 ? (totalActivated / totalViewed) * 100 : 0;
    
    // Analytics by persona
    const byPersona = inviteData.reduce((acc, invite) => {
      if (!acc[invite.persona_type]) {
        acc[invite.persona_type] = { total: 0, sent: 0, viewed: 0, activated: 0 };
      }
      acc[invite.persona_type].total++;
      if (['sent', 'viewed', 'activated'].includes(invite.invite_status)) {
        acc[invite.persona_type].sent++;
      }
      if (['viewed', 'activated'].includes(invite.invite_status)) {
        acc[invite.persona_type].viewed++;
      }
      if (invite.invite_status === 'activated') {
        acc[invite.persona_type].activated++;
      }
      return acc;
    }, {} as Record<string, any>);
    
    // Analytics by batch
    const byBatch = inviteData.reduce((acc, invite) => {
      if (!acc[invite.batch_name]) {
        acc[invite.batch_name] = { total: 0, sent: 0, viewed: 0, activated: 0 };
      }
      acc[invite.batch_name].total++;
      if (['sent', 'viewed', 'activated'].includes(invite.invite_status)) {
        acc[invite.batch_name].sent++;
      }
      if (['viewed', 'activated'].includes(invite.invite_status)) {
        acc[invite.batch_name].viewed++;
      }
      if (invite.invite_status === 'activated') {
        acc[invite.batch_name].activated++;
      }
      return acc;
    }, {} as Record<string, any>);
    
    setAnalytics({
      totalInvites,
      totalSent,
      totalViewed,
      totalActivated,
      conversionRate,
      viewRate,
      activationRate,
      byPersona,
      byBatch
    });
  };

  const sendBatchInvites = async (inviteIds: string[]) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-vip-invites', {
        body: { inviteIds }
      });
      
      if (error) throw error;
      
      toast.success(`Sent ${inviteIds.length} VIP invitations`);
      loadDashboardData();
      
    } catch (error) {
      console.error('Error sending invites:', error);
      toast.error('Failed to send invitations');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reserved': return 'bg-slate-500';
      case 'sent': return 'bg-blue-500';
      case 'viewed': return 'bg-yellow-500';
      case 'activated': return 'bg-emerald-500';
      default: return 'bg-slate-500';
    }
  };

  const getPersonaDisplayName = (personaType: string) => {
    switch (personaType) {
      case 'advisor': return 'Financial Advisor';
      case 'attorney': return 'Legal Counsel';
      case 'cpa': return 'CPA';
      case 'accountant': return 'Accountant';
      case 'insurance_agent': return 'Insurance Professional';
      case 'consultant': return 'Consultant';
      case 'coach': return 'Coach';
      case 'healthcare_consultant': return 'Healthcare Consultant';
      default: return 'Professional';
    }
  };

  const filteredInvites = invites.filter(invite => 
    searchTerm === '' || 
    invite.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invite.firm.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invite.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const uniqueBatches = [...new Set(invites.map(i => i.batch_name))];
  const uniquePersonas = [...new Set(invites.map(i => i.persona_type))];

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
        <div className="flex items-center gap-3">
          <Crown className="h-8 w-8 text-gold" />
          <div>
            <h1 className="text-3xl font-bold">VIP Campaign Dashboard</h1>
            <p className="text-muted-foreground">
              Manage and track your VIP founding member invitations
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button className="bg-gold hover:bg-gold/90 text-navy">
            <Plus className="h-4 w-4 mr-2" />
            Add VIP Invite
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">Total VIP Invites</span>
                </div>
                <div className="text-2xl font-bold mt-2">{analytics.totalInvites}</div>
                <div className="text-sm text-muted-foreground">
                  {analytics.totalSent} sent ({Math.round((analytics.totalSent / analytics.totalInvites) * 100)}%)
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium">Page Views</span>
                </div>
                <div className="text-2xl font-bold mt-2">{analytics.totalViewed}</div>
                <div className="text-sm text-muted-foreground">
                  {analytics.viewRate.toFixed(1)}% view rate
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm font-medium">Activations</span>
                </div>
                <div className="text-2xl font-bold mt-2">{analytics.totalActivated}</div>
                <div className="text-sm text-muted-foreground">
                  {analytics.activationRate.toFixed(1)}% activation rate
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium">Conversion Rate</span>
                </div>
                <div className="text-2xl font-bold mt-2">{analytics.conversionRate.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">
                  Overall campaign performance
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
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
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">All Batches</option>
              {uniqueBatches.map(batch => (
                <option key={batch} value={batch}>{batch}</option>
              ))}
            </select>
            <select
              value={selectedPersona}
              onChange={(e) => setSelectedPersona(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">All Personas</option>
              {uniquePersonas.map(persona => (
                <option key={persona} value={persona}>{getPersonaDisplayName(persona)}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="invites">VIP Invites</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Batch Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Progress by Batch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics && Object.entries(analytics.byBatch).map(([batch, stats]: [string, any]) => (
                  <div key={batch} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{batch}</span>
                      <span className="text-sm text-muted-foreground">
                        {stats.activated}/{stats.total} activated
                      </span>
                    </div>
                    <Progress value={(stats.activated / stats.total) * 100} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{stats.sent} sent</span>
                      <span>{stats.viewed} viewed</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Persona Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Performance by Persona</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics && Object.entries(analytics.byPersona).map(([persona, stats]: [string, any]) => (
                  <div key={persona} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium">{getPersonaDisplayName(persona)}</div>
                      <div className="text-sm text-muted-foreground">
                        {stats.activated}/{stats.total} activated
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {stats.total > 0 ? Math.round((stats.activated / stats.total) * 100) : 0}%
                      </div>
                      <div className="text-xs text-muted-foreground">conversion</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="invites">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>VIP Invitations ({filteredInvites.length})</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Send className="h-4 w-4 mr-2" />
                    Send Selected
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredInvites.map((invite) => (
                  <motion.div
                    key={invite.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-gold to-yellow-500 rounded-full flex items-center justify-center">
                        <Crown className="h-5 w-5 text-navy" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{invite.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {getPersonaDisplayName(invite.persona_type)}
                          </Badge>
                          <Badge className={`text-xs text-white ${getStatusColor(invite.invite_status)}`}>
                            {invite.invite_status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {invite.firm} • {invite.email}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {invite.batch_name} • Created {new Date(invite.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                {analytics && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Reserved</span>
                      <span className="font-bold">{analytics.totalInvites}</span>
                    </div>
                    <Progress value={100} className="h-3" />
                    
                    <div className="flex justify-between items-center">
                      <span>Sent</span>
                      <span className="font-bold">{analytics.totalSent}</span>
                    </div>
                    <Progress value={(analytics.totalSent / analytics.totalInvites) * 100} className="h-3" />
                    
                    <div className="flex justify-between items-center">
                      <span>Viewed</span>
                      <span className="font-bold">{analytics.totalViewed}</span>
                    </div>
                    <Progress value={(analytics.totalViewed / analytics.totalInvites) * 100} className="h-3" />
                    
                    <div className="flex justify-between items-center">
                      <span>Activated</span>
                      <span className="font-bold">{analytics.totalActivated}</span>
                    </div>
                    <Progress value={(analytics.totalActivated / analytics.totalInvites) * 100} className="h-3" />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Channel Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-blue-500" />
                      <span>Email Invites</span>
                    </div>
                    <span className="font-bold">85%</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Linkedin className="h-5 w-5 text-blue-600" />
                      <span>LinkedIn Outreach</span>
                    </div>
                    <span className="font-bold">12%</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-green-500" />
                      <span>SMS Follow-up</span>
                    </div>
                    <span className="font-bold">3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Invitation Templates</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage personalized invitation templates for each persona group
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Crown className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Template management coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};