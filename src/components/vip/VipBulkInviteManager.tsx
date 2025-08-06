import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Send, 
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
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { VipBulkInviteUpload } from './VipBulkInviteUpload';
import { VipDirectory } from './VipDirectory';

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

interface ActivityLogEntry {
  id: string;
  invite_id: string;
  action_type: string;
  details: any;
  performed_by?: string;
  created_at: string;
}

const PERSONA_DISPLAY_NAMES = {
  advisor: 'Financial Advisor',
  attorney: 'Legal Counsel',
  cpa: 'CPA', 
  accountant: 'Accountant',
  insurance_agent: 'Insurance Professional',
  consultant: 'Consultant',
  coach: 'Coach',
  healthcare_consultant: 'Healthcare Consultant'
};

export const VipBulkInviteManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [invites, setInvites] = useState<VipInvite[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvites, setSelectedInvites] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [personaFilter, setPersonaFilter] = useState('all');
  const [batchFilter, setBatchFilter] = useState('all');
  const [sendingInvites, setSendingInvites] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      loadInvites(),
      loadActivityLog()
    ]);
  };

  const loadInvites = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vip_invites')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setInvites(data || []);
      
    } catch (error) {
      console.error('Error loading invites:', error);
      toast.error('Failed to load VIP invites');
    } finally {
      setLoading(false);
    }
  };

  const loadActivityLog = async () => {
    try {
      const { data, error } = await supabase
        .from('vip_admin_activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      setActivityLog(data || []);
      
    } catch (error) {
      console.error('Error loading activity log:', error);
    }
  };

  const sendBulkInvites = async (inviteIds: string[]) => {
    setSendingInvites(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-vip-invites', {
        body: { inviteIds }
      });

      if (error) throw error;

      toast.success(`Successfully sent ${inviteIds.length} VIP invitations`);
      setSelectedInvites([]);
      loadData();

    } catch (error) {
      console.error('Error sending invites:', error);
      toast.error('Failed to send invitations');
    } finally {
      setSendingInvites(false);
    }
  };

  const resendInvite = async (inviteId: string) => {
    try {
      const { error } = await supabase.functions.invoke('resend-vip-invite', {
        body: { inviteId }
      });

      if (error) throw error;

      toast.success('Invitation resent successfully');
      loadData();

    } catch (error) {
      console.error('Error resending invite:', error);
      toast.error('Failed to resend invitation');
    }
  };

  const toggleSelectInvite = (inviteId: string) => {
    setSelectedInvites(prev => 
      prev.includes(inviteId) 
        ? prev.filter(id => id !== inviteId)
        : [...prev, inviteId]
    );
  };

  const selectAllFiltered = () => {
    const filteredIds = filteredInvites.map(invite => invite.id);
    setSelectedInvites(filteredIds);
  };

  const clearSelection = () => {
    setSelectedInvites([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reserved': return 'bg-slate-100 text-slate-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'viewed': return 'bg-yellow-100 text-yellow-800';
      case 'activated': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'reserved': return <Clock className="h-4 w-4" />;
      case 'sent': return <Send className="h-4 w-4" />;
      case 'viewed': return <Eye className="h-4 w-4" />;
      case 'activated': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredInvites = invites.filter(invite => {
    const matchesSearch = !searchTerm || 
      invite.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invite.firm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invite.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invite.invite_status === statusFilter;
    const matchesPersona = personaFilter === 'all' || invite.persona_type === personaFilter;
    const matchesBatch = batchFilter === 'all' || invite.batch_name === batchFilter;
    
    return matchesSearch && matchesStatus && matchesPersona && matchesBatch;
  });

  const stats = {
    total: invites.length,
    reserved: invites.filter(i => i.invite_status === 'reserved').length,
    sent: invites.filter(i => i.invite_status === 'sent').length,
    viewed: invites.filter(i => i.invite_status === 'viewed').length,
    activated: invites.filter(i => i.invite_status === 'activated').length,
  };

  const uniquePersonas = [...new Set(invites.map(i => i.persona_type))];
  const uniqueBatches = [...new Set(invites.map(i => i.batch_name))];
  const availablePersonas = Object.keys(PERSONA_DISPLAY_NAMES);

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
          <h1 className="text-3xl font-bold">VIP Bulk Invite Manager</h1>
          <p className="text-muted-foreground">
            Upload, manage, and track your VIP founding member invitations
          </p>
        </div>
        <Button onClick={loadData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">Total</span>
            </div>
            <div className="text-2xl font-bold mt-1">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-slate-500" />
              <span className="text-sm font-medium">Reserved</span>
            </div>
            <div className="text-2xl font-bold mt-1">{stats.reserved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Send className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">Sent</span>
            </div>
            <div className="text-2xl font-bold mt-1">{stats.sent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium">Viewed</span>
            </div>
            <div className="text-2xl font-bold mt-1">{stats.viewed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <span className="text-sm font-medium">Activated</span>
            </div>
            <div className="text-2xl font-bold mt-1">{stats.activated}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="upload">Bulk Upload</TabsTrigger>
          <TabsTrigger value="invites">Manage Invites</TabsTrigger>
          <TabsTrigger value="directory">VIP Directory</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Persona Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {uniquePersonas.map(persona => {
                  const personaInvites = invites.filter(i => i.persona_type === persona);
                  const activated = personaInvites.filter(i => i.invite_status === 'activated').length;
                  const percentage = personaInvites.length > 0 ? (activated / personaInvites.length) * 100 : 0;
                  
                  return (
                    <div key={persona} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          {PERSONA_DISPLAY_NAMES[persona as keyof typeof PERSONA_DISPLAY_NAMES] || persona}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {activated}/{personaInvites.length} activated
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
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {activityLog.slice(0, 10).map((entry) => (
                    <div key={entry.id} className="flex items-start gap-3 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p>{entry.action_type}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(entry.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upload">
          <VipBulkInviteUpload 
            onUploadComplete={loadData}
            availablePersonas={availablePersonas}
          />
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
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="viewed">Viewed</SelectItem>
                      <SelectItem value="activated">Activated</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={personaFilter} onValueChange={setPersonaFilter}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="All Personas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Personas</SelectItem>
                      {uniquePersonas.map(persona => (
                        <SelectItem key={persona} value={persona}>
                          {PERSONA_DISPLAY_NAMES[persona as keyof typeof PERSONA_DISPLAY_NAMES] || persona}
                        </SelectItem>
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
                    <Button variant="outline" size="sm" onClick={clearSelection}>
                      Clear Selection
                    </Button>
                    <Button variant="outline" size="sm" onClick={selectAllFiltered}>
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
                        onChange={() => toggleSelectInvite(invite.id)}
                        className="h-4 w-4"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{invite.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {PERSONA_DISPLAY_NAMES[invite.persona_type as keyof typeof PERSONA_DISPLAY_NAMES] || invite.persona_type}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(invite.invite_status)}`}>
                            {getStatusIcon(invite.invite_status)}
                            <span className="ml-1">{invite.invite_status}</span>
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {invite.firm} • {invite.email}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Batch: {invite.batch_name}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {invite.invite_status === 'reserved' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => sendBulkInvites([invite.id])}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                        {['sent', 'viewed'].includes(invite.invite_status) && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => resendInvite(invite.id)}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        )}
                        {invite.linkedin_url && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(invite.linkedin_url, '_blank')}
                          >
                            <Linkedin className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="directory">
          <VipDirectory />
        </TabsContent>

        <TabsContent value="analytics">
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
            <p className="text-muted-foreground">
              Detailed analytics and reporting coming soon
            </p>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Activity Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {activityLog.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{entry.action_type}</p>
                      {entry.details && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {JSON.stringify(entry.details)}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(entry.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};