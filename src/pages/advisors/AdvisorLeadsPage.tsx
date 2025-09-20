import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Search, 
  Filter, 
  Download,
  Phone,
  Mail,
  MapPin,
  Tag
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { emitReceipt } from '@/lib/analytics';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  tags: string[];
  consentGiven: boolean;
  createdAt: string;
}

export function AdvisorLeadsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    source: '',
    tags: '',
    consentGiven: false
  });

  const [leads] = useState<Lead[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '(555) 123-4567',
      source: 'Website Form',
      status: 'new',
      tags: ['Retirement', 'High Net Worth'],
      consentGiven: true,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael@example.com', 
      phone: '(555) 234-5678',
      source: 'Referral',
      status: 'contacted',
      tags: ['Tax Planning', 'Estate'],
      consentGiven: true,
      createdAt: '2024-01-14'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily@example.com',
      phone: '(555) 345-6789',
      source: 'LinkedIn',
      status: 'qualified',
      tags: ['401k Rollover'],
      consentGiven: true,
      createdAt: '2024-01-13'
    }
  ]);

  const handleAddLead = async () => {
    if (!newLead.name || !newLead.email || !newLead.consentGiven) {
      toast({
        title: "Validation Error",
        description: "Name, email, and consent are required",
        variant: "destructive"
      });
      return;
    }

    try {
      // Emit Consent-RDS receipt for PTC consent
      await emitReceipt({
        type: 'Consent-RDS',
        action: 'lead.consent.captured',
        leadName: newLead.name,
        leadEmail: newLead.email,
        consentType: 'PTC',
        purpose: 'outreach',
        scope: { contact: true },
        ttlDays: 90
      });

      toast({
        title: "Lead Added",
        description: `${newLead.name} has been added with PTC consent recorded`,
      });

      setIsAddLeadOpen(false);
      setNewLead({
        name: '',
        email: '',
        phone: '',
        source: '',
        tags: '',
        consentGiven: false
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add lead",
        variant: "destructive"
      });
    }
  };

  const handleExportCSV = () => {
    const csvData = leads.map(lead => ({
      Name: lead.name,
      Email: lead.email,
      Phone: lead.phone,
      Source: lead.source,
      Status: lead.status,
      Tags: lead.tags.join(', '),
      'Consent Given': lead.consentGiven ? 'Yes' : 'No',
      'Created Date': lead.createdAt
    }));

    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map(row => Object.values(row).join(','));
    const csv = [headers, ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'advisor-leads.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Leads exported to CSV successfully"
    });
  };

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'default';
      case 'contacted': return 'secondary';
      case 'qualified': return 'outline';
      case 'converted': return 'default';
      default: return 'default';
    }
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Lead Management</h1>
          <p className="text-muted-foreground">Capture and manage prospects with PTC consent</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Lead</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    placeholder="Enter prospect name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="source">Source</Label>
                  <Input
                    id="source"
                    value={newLead.source}
                    onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                    placeholder="e.g. Website, Referral, LinkedIn"
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={newLead.tags}
                    onChange={(e) => setNewLead({ ...newLead, tags: e.target.value })}
                    placeholder="Retirement, Tax Planning (comma separated)"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="consent"
                    checked={newLead.consentGiven}
                    onCheckedChange={(checked) => setNewLead({ ...newLead, consentGiven: checked as boolean })}
                  />
                  <Label htmlFor="consent" className="text-sm">
                    PTC Consent: I consent to being contacted for outreach purposes *
                  </Label>
                </div>
                <Button onClick={handleAddLead} className="w-full">
                  Add Lead
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="rounded-2xl shadow-sm border p-6 md:p-8">
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card className="rounded-2xl shadow-sm border p-6 md:p-8">
        <CardHeader>
          <CardTitle className="text-xl">Leads ({filteredLeads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-1">
                    <h3 className="font-medium">{lead.name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {lead.email}
                      </span>
                      {lead.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {lead.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {lead.source}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {lead.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Badge variant={getStatusColor(lead.status)}>
                    {lead.status}
                  </Badge>
                  {lead.consentGiven && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      PTC ✓
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Contact
                  </Button>
                  <Button variant="outline" size="sm">
                    Schedule
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}