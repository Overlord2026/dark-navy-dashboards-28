import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  DollarSign,
  Calendar,
  FileText,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { recordDecisionRDS } from '@/features/pro/compliance/DecisionTracker';

const RealtorLeadsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const leads = [
    {
      id: 'lead_001',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '555-0123',
      type: 'buyer',
      budget: '$400,000 - $500,000',
      location: 'Downtown',
      status: 'qualified',
      source: 'website',
      lastContact: '2024-01-14',
      disclosuresRequired: ['lead_paint', 'natural_hazards'],
      disclosuresCompleted: ['lead_paint']
    },
    {
      id: 'lead_002', 
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      phone: '555-0456',
      type: 'seller',
      budget: '$650,000',
      location: 'Suburbs',
      status: 'contacted',
      source: 'referral',
      lastContact: '2024-01-13',
      disclosuresRequired: ['property_condition', 'natural_hazards', 'lead_paint'],
      disclosuresCompleted: []
    },
    {
      id: 'lead_003',
      name: 'Emily Davis', 
      email: 'emily.d@email.com',
      phone: '555-0789',
      type: 'buyer',
      budget: '$300,000 - $400,000',
      location: 'Westside',
      status: 'new',
      source: 'zillow',
      lastContact: '2024-01-15',
      disclosuresRequired: ['lead_paint'],
      disclosuresCompleted: []
    }
  ];

  const handleCompleteDisclosure = (leadId: string, disclosureType: string) => {
    // Record disclosure completion decision
    const decision = recordDecisionRDS({
      action: 'disclosure_complete',
      persona: 'realtor',
      inputs_hash: `${leadId}_${disclosureType}`,
      reasons: ['disclosure_mandatory', 'property_compliance', 'buyer_protection'],
      result: 'approve',
      metadata: {
        lead_id: leadId,
        disclosure_type: disclosureType,
        compliance_requirement: 'real_estate_law'
      }
    });

    toast.success(`${disclosureType.replace('_', ' ')} disclosure completed for lead`);
    console.log('Disclosure Decision-RDS:', decision);
  };

  const handleScheduleShowing = (leadId: string) => {
    const decision = recordDecisionRDS({
      action: 'showing_schedule',
      persona: 'realtor', 
      inputs_hash: leadId,
      reasons: ['client_request', 'property_available', 'disclosures_complete'],
      result: 'approve',
      metadata: {
        lead_id: leadId,
        showing_type: 'private',
        requires_disclosures: true
      }
    });

    toast.success('Showing scheduled with compliance tracking');
    console.log('Showing Decision-RDS:', decision);
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDisclosureStatus = (lead: any) => {
    const completed = lead.disclosuresCompleted.length;
    const required = lead.disclosuresRequired.length;
    
    if (completed === required) return { status: 'complete', color: 'bg-green-500' };
    if (completed > 0) return { status: 'partial', color: 'bg-yellow-500' };
    return { status: 'pending', color: 'bg-red-500' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Realtor Leads</h1>
          <p className="text-muted-foreground">
            Manage buyer and seller leads with disclosure compliance
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Lead</DialogTitle>
              <DialogDescription>
                Create a new buyer or seller lead with compliance tracking
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="First Name" />
                <Input placeholder="Last Name" />
              </div>
              <Input placeholder="Email" type="email" />
              <Input placeholder="Phone" type="tel" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Lead Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">Buyer</SelectItem>
                  <SelectItem value="seller">Seller</SelectItem>
                  <SelectItem value="investor">Investor</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Budget Range" />
              <Input placeholder="Preferred Location" />
              <Textarea placeholder="Additional Notes" />
              <div className="flex gap-2">
                <Button className="flex-1">Create Lead</Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Management</CardTitle>
          <CardDescription>Search and manage leads with disclosure tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads by name, email, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="buyer">Buyers</SelectItem>
                <SelectItem value="seller">Sellers</SelectItem>
                <SelectItem value="investor">Investors</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Leads Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Budget/Value</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Disclosures</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => {
                const disclosureStatus = getDisclosureStatus(lead);
                return (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {lead.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {lead.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {lead.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {lead.budget}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {lead.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          lead.status === 'qualified' ? 'default' :
                          lead.status === 'contacted' ? 'secondary' : 'outline'
                        }
                        className="capitalize"
                      >
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${disclosureStatus.color}`} />
                        <span className="text-sm">
                          {lead.disclosuresCompleted.length}/{lead.disclosuresRequired.length}
                        </span>
                        {disclosureStatus.status !== 'complete' && (
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedLead(lead)}
                            >
                              <FileText className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Disclosure Management - {lead.name}</DialogTitle>
                              <DialogDescription>
                                Complete required property disclosures
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              {lead.disclosuresRequired.map((disclosure) => (
                                <div key={disclosure} className="flex items-center justify-between p-3 border rounded">
                                  <div>
                                    <p className="font-medium capitalize">
                                      {disclosure.replace('_', ' ')} Disclosure
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {disclosure === 'lead_paint' && 'Lead-based paint disclosure (pre-1978 properties)'}
                                      {disclosure === 'natural_hazards' && 'Natural hazards and geological disclosures'}
                                      {disclosure === 'property_condition' && 'Property condition and defects disclosure'}
                                    </p>
                                  </div>
                                  {lead.disclosuresCompleted.includes(disclosure) ? (
                                    <Badge variant="default">Completed</Badge>
                                  ) : (
                                    <Button 
                                      size="sm"
                                      onClick={() => handleCompleteDisclosure(lead.id, disclosure)}
                                    >
                                      Complete
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleScheduleShowing(lead.id)}
                          disabled={disclosureStatus.status !== 'complete'}
                        >
                          <Calendar className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealtorLeadsPage;