import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, Send, Users, BarChart3, Download, Eye, Mail, Phone, Linkedin } from 'lucide-react';
import { toast } from 'sonner';

interface Contact {
  id: string;
  name: string;
  email: string;
  publication: string;
  region: string;
  persona: string;
  status: 'pending' | 'invited' | 'opened' | 'clicked' | 'activated';
  invitedAt?: Date;
  lastActivity?: Date;
}

const OutreachManager: React.FC = () => {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<string>('');
  const [customMessage, setCustomMessage] = useState('');

  const personas = [
    { value: 'editor', label: 'Financial Editor' },
    { value: 'journalist', label: 'Journalist' },
    { value: 'influencer', label: 'Influencer' },
    { value: 'advisor', label: 'Financial Advisor' },
    { value: 'family_office', label: 'Family Office' }
  ];

  const regions = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'eu', label: 'European Union' },
    { value: 'asia', label: 'Asia Pacific' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Parse CSV and populate contacts
      toast.success(`Uploaded ${file.name} - Processing contacts...`);
      // Mock data for demonstration
      const mockContacts: Contact[] = [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@wsj.com',
          publication: 'Wall Street Journal',
          region: 'US',
          persona: 'editor',
          status: 'pending'
        },
        {
          id: '2',
          name: 'Michael Chen',
          email: 'mchen@bloomberg.com',
          publication: 'Bloomberg',
          region: 'US',
          persona: 'journalist',
          status: 'invited',
          invitedAt: new Date()
        }
      ];
      setContacts(mockContacts);
    }
  };

  const handleSendInvites = () => {
    const pendingContacts = contacts.filter(c => c.status === 'pending');
    if (pendingContacts.length === 0) {
      toast.error('No pending contacts to invite');
      return;
    }

    // Simulate sending invites
    toast.success(`Sending ${pendingContacts.length} personalized invites...`);
    
    // Update contact statuses
    setContacts(prev => prev.map(contact => 
      contact.status === 'pending' 
        ? { ...contact, status: 'invited', invitedAt: new Date() }
        : contact
    ));
  };

  const getStatusBadge = (status: Contact['status']) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: 'Pending' },
      invited: { variant: 'default' as const, label: 'Invited' },
      opened: { variant: 'outline' as const, label: 'Opened' },
      clicked: { variant: 'secondary' as const, label: 'Clicked' },
      activated: { variant: 'default' as const, label: 'Activated' }
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const stats = {
    totalContacts: contacts.length,
    invited: contacts.filter(c => c.status !== 'pending').length,
    activated: contacts.filter(c => c.status === 'activated').length,
    pending: contacts.filter(c => c.status === 'pending').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Global Outreach Manager</h1>
          <p className="text-muted-foreground">Manage editorial and VIP outreach campaigns</p>
        </div>
        <Button onClick={() => window.open('/campaign/vip-editorial', '_blank')}>
          <Eye className="h-4 w-4 mr-2" />
          Preview Landing Page
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Contacts</p>
                <p className="text-2xl font-bold">{stats.totalContacts}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Invited</p>
                <p className="text-2xl font-bold">{stats.invited}</p>
              </div>
              <Send className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Activated</p>
                <p className="text-2xl font-bold">{stats.activated}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <Upload className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="setup" className="space-y-4">
        <TabsList>
          <TabsTrigger value="setup">Campaign Setup</TabsTrigger>
          <TabsTrigger value="contacts">Contact Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="setup">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Contact List</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contact-upload">CSV File Upload</Label>
                  <Input
                    id="contact-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    CSV should include: name, email, publication, region, persona
                  </p>
                </div>

                <div>
                  <Label>Target Persona</Label>
                  <Select value={selectedPersona} onValueChange={setSelectedPersona}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select persona" />
                    </SelectTrigger>
                    <SelectContent>
                      {personas.map(persona => (
                        <SelectItem key={persona.value} value={persona.value}>
                          {persona.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Customization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="custom-message">Custom Message</Label>
                  <Textarea
                    id="custom-message"
                    placeholder="Add personalized message for this campaign..."
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSendInvites} disabled={stats.pending === 0}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Invites ({stats.pending})
                  </Button>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>Contact List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Publication</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Persona</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-muted-foreground">{contact.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{contact.publication}</TableCell>
                      <TableCell>{contact.region}</TableCell>
                      <TableCell>{contact.persona}</TableCell>
                      <TableCell>{getStatusBadge(contact.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost">
                            <Mail className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Linkedin className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Invite Open Rate</span>
                    <span className="font-bold">68%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Link Click Rate</span>
                    <span className="font-bold">24%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Profile Activation Rate</span>
                    <span className="font-bold">12%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Interview Bookings</span>
                    <span className="font-bold">8</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regions.map((region) => (
                    <div key={region.value} className="flex justify-between items-center">
                      <span>{region.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${Math.random() * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {Math.floor(Math.random() * 50)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OutreachManager;