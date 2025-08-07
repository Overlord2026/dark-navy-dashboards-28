import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Globe, Send, Users, Mail, Upload, Eye, Download, Languages, MapPin, Calendar, Star } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface VipInvitation {
  id: string;
  email: string;
  name: string;
  country: string;
  language: string;
  persona: string;
  status: 'pending' | 'sent' | 'opened' | 'signed_up';
  sentAt?: Date;
  openedAt?: Date;
}

const VipInviteManager: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('create');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [csvData, setCsvData] = useState('');
  const [invitations, setInvitations] = useState<VipInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸', countries: ['US', 'CA', 'AU', 'GB'] },
    { code: 'es', name: 'Español', flag: '🇪🇸', countries: ['ES', 'MX', 'AR', 'CL', 'CO'] },
    { code: 'fr', name: 'Français', flag: '🇫🇷', countries: ['FR', 'CA', 'BE', 'CH'] },
    { code: 'zh', name: '中文', flag: '🇨🇳', countries: ['CN', 'TW', 'HK', 'SG'] },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳', countries: ['IN'] },
    { code: 'ar', name: 'العربية', flag: '🇸🇦', countries: ['SA', 'AE', 'QA', 'KW'] },
  ];

  const personas = [
    { value: 'family_office', label: 'Family Office Principal', description: 'High net worth families managing $10M+ assets' },
    { value: 'wealth_advisor', label: 'Wealth Advisor/RIA', description: 'Financial advisors managing client portfolios' },
    { value: 'private_banker', label: 'Private Banker', description: 'Bank representatives serving HNW clients' },
    { value: 'attorney', label: 'Estate Attorney', description: 'Legal professionals specializing in estate planning' },
    { value: 'cpa', label: 'CPA/Tax Professional', description: 'Accountants serving high net worth clients' },
    { value: 'insurance_specialist', label: 'Life Insurance Specialist', description: 'Insurance agents focusing on estate planning' },
  ];

  const handleCsvUpload = () => {
    try {
      const lines = csvData.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      const newInvitations: VipInvitation[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const invitation: VipInvitation = {
          id: `invite_${Date.now()}_${i}`,
          email: values[headers.indexOf('email')] || '',
          name: values[headers.indexOf('name')] || '',
          country: values[headers.indexOf('country')] || '',
          language: values[headers.indexOf('language')] || 'en',
          persona: values[headers.indexOf('persona')] || 'family_office',
          status: 'pending'
        };
        newInvitations.push(invitation);
      }

      setInvitations(prev => [...prev, ...newInvitations]);
      setCsvData('');
      toast.success(`Imported ${newInvitations.length} VIP invitations`);
    } catch (error) {
      toast.error('Error parsing CSV data');
    }
  };

  const sendVipInvitations = async (inviteIds: string[]) => {
    setIsLoading(true);
    try {
      for (const inviteId of inviteIds) {
        const invitation = invitations.find(inv => inv.id === inviteId);
        if (!invitation) continue;

        // Call edge function to send VIP invitation
        const { error } = await supabase.functions.invoke('send-vip-invitation', {
          body: {
            email: invitation.email,
            name: invitation.name,
            language: invitation.language,
            persona: invitation.persona,
            country: invitation.country
          }
        });

        if (!error) {
          setInvitations(prev => prev.map(inv => 
            inv.id === inviteId 
              ? { ...inv, status: 'sent', sentAt: new Date() }
              : inv
          ));
        }
      }
      toast.success(`Sent ${inviteIds.length} VIP invitations`);
    } catch (error) {
      toast.error('Error sending invitations');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Calendar className="h-4 w-4 text-yellow-500" />;
      case 'sent': return <Send className="h-4 w-4 text-blue-500" />;
      case 'opened': return <Eye className="h-4 w-4 text-green-500" />;
      case 'signed_up': return <Star className="h-4 w-4 text-gold-500" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getRegionStats = () => {
    const stats = invitations.reduce((acc, inv) => {
      const lang = inv.language;
      if (!acc[lang]) {
        acc[lang] = { total: 0, sent: 0, signups: 0 };
      }
      acc[lang].total++;
      if (inv.status === 'sent' || inv.status === 'opened' || inv.status === 'signed_up') {
        acc[lang].sent++;
      }
      if (inv.status === 'signed_up') {
        acc[lang].signups++;
      }
      return acc;
    }, {} as Record<string, { total: number; sent: number; signups: number }>);

    return stats;
  };

  const regionStats = getRegionStats();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Globe className="h-8 w-8 text-primary" />
            {t('admin.vipInvites.title', 'VIP Global Invitation Manager')}
          </h1>
          <p className="text-muted-foreground">{t('admin.vipInvites.description', 'Manage international VIP invitations and track regional performance')}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {invitations.length} Total Invites
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            {Object.keys(regionStats).length} Languages
          </Badge>
        </div>
      </div>

      {/* Global Stats Dashboard */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Invitations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invitations.length}</div>
            <p className="text-xs text-muted-foreground">Across all regions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sent Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {invitations.length > 0 ? Math.round((invitations.filter(i => i.status !== 'pending').length / invitations.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Invitations sent</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Signup Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {invitations.length > 0 ? Math.round((invitations.filter(i => i.status === 'signed_up').length / invitations.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Converted to signup</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Region</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(regionStats).length > 0 ? languages.find(l => l.code === Object.keys(regionStats).sort((a, b) => regionStats[b].total - regionStats[a].total)[0])?.flag : '🌍'}
            </div>
            <p className="text-xs text-muted-foreground">Most invitations</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="create">Create Invites</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
          <TabsTrigger value="manage">Manage & Send</TabsTrigger>
          <TabsTrigger value="analytics">Regional Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Individual VIP Invitation</CardTitle>
              <CardDescription>Create personalized invitations for high-value prospects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Smith" />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">🇺🇸 United States</SelectItem>
                      <SelectItem value="ES">🇪🇸 Spain</SelectItem>
                      <SelectItem value="FR">🇫🇷 France</SelectItem>
                      <SelectItem value="CN">🇨🇳 China</SelectItem>
                      <SelectItem value="IN">🇮🇳 India</SelectItem>
                      <SelectItem value="SA">🇸🇦 Saudi Arabia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Preferred Language</Label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="persona">Target Persona</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select persona" />
                    </SelectTrigger>
                    <SelectContent>
                      {personas.map((persona) => (
                        <SelectItem key={persona.value} value={persona.value}>
                          <div>
                            <div className="font-medium">{persona.label}</div>
                            <div className="text-sm text-muted-foreground">{persona.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Create VIP Invitation
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bulk CSV Import</CardTitle>
              <CardDescription>Import multiple VIP invitations from CSV format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="csv-format">Expected CSV Format:</Label>
                <div className="bg-muted p-3 rounded text-sm font-mono">
                  name,email,country,language,persona<br/>
                  John Smith,john@example.com,US,en,family_office<br/>
                  María García,maria@ejemplo.es,ES,es,wealth_advisor
                </div>
              </div>
              
              <div>
                <Label htmlFor="csv-data">CSV Data</Label>
                <Textarea 
                  id="csv-data"
                  value={csvData}
                  onChange={(e) => setCsvData(e.target.value)}
                  placeholder="Paste your CSV data here..."
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleCsvUpload} disabled={!csvData.trim()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import CSV Data
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                VIP Invitation Queue
                <Button 
                  onClick={() => sendVipInvitations(invitations.filter(i => i.status === 'pending').map(i => i.id))}
                  disabled={isLoading || !invitations.some(i => i.status === 'pending')}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send All Pending
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Persona</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map((invitation) => (
                    <TableRow key={invitation.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(invitation.status)}
                          <Badge variant={invitation.status === 'signed_up' ? 'default' : 'secondary'}>
                            {invitation.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{invitation.name}</TableCell>
                      <TableCell>{invitation.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {invitation.country}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {languages.find(l => l.code === invitation.language)?.flag}
                          {languages.find(l => l.code === invitation.language)?.name}
                        </div>
                      </TableCell>
                      <TableCell>{personas.find(p => p.value === invitation.persona)?.label}</TableCell>
                      <TableCell>
                        {invitation.status === 'pending' && (
                          <Button 
                            size="sm" 
                            onClick={() => sendVipInvitations([invitation.id])}
                            disabled={isLoading}
                          >
                            Send
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(regionStats).map(([langCode, stats]) => {
              const language = languages.find(l => l.code === langCode);
              const conversionRate = stats.sent > 0 ? (stats.signups / stats.sent) * 100 : 0;
              
              return (
                <Card key={langCode}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{language?.flag}</span>
                      {language?.name} Region
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <div className="text-xs text-muted-foreground">Total</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{stats.sent}</div>
                        <div className="text-xs text-muted-foreground">Sent</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{stats.signups}</div>
                        <div className="text-xs text-muted-foreground">Signups</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Conversion Rate</span>
                        <span>{conversionRate.toFixed(1)}%</span>
                      </div>
                      <Progress value={conversionRate} className="h-2" />
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Countries: {language?.countries.join(', ')}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VipInviteManager;