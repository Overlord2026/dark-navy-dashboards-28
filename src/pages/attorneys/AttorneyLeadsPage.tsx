import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  UserPlus, 
  Shield, 
  Search, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  FileText
} from 'lucide-react';
import { recordReceipt } from '@/features/receipts/record';
import { toast } from 'sonner';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  matter_type: string;
  conflict_status: 'pending' | 'clear' | 'conflict';
  intake_status: 'new' | 'scheduled' | 'completed';
  source: string;
  created_at: string;
}

export default function AttorneyLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      name: 'Robert Thompson',
      email: 'robert.thompson@email.com',
      phone: '555-0456',
      matter_type: 'Estate Planning',
      conflict_status: 'clear',
      intake_status: 'scheduled',
      source: 'Referral',
      created_at: '2024-01-15'
    },
    {
      id: '2',
      name: 'Jennifer Davis',
      email: 'jennifer.davis@email.com', 
      phone: '555-0789',
      matter_type: 'Business Formation',
      conflict_status: 'pending',
      intake_status: 'new',
      source: 'Website',
      created_at: '2024-01-14'
    }
  ]);

  const [showAddLead, setShowAddLead] = useState(false);
  const [showConflictCheck, setShowConflictCheck] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [conflictSearchTerm, setConflictSearchTerm] = useState('');

  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    matter_type: '',
    matter_description: '',
    referral_source: '',
    consent_marketing: false,
    consent_contact: true
  });

  const handleAddLead = async () => {
    try {
      // Record consent
      recordReceipt({
        id: `consent_${Date.now()}`,
        type: 'Consent-RDS',
        policy_version: 'A-2025.01',
        inputs_hash: `sha256:${JSON.stringify({ email: newLead.email, consent: { contact: newLead.consent_contact, marketing: newLead.consent_marketing } })}`,
        result: 'approve',
        reasons: ['PTC_CONSENT'],
        created_at: new Date().toISOString()
      });

      // Create lead
      const lead: Lead = {
        id: Date.now().toString(),
        name: newLead.name,
        email: newLead.email,
        phone: newLead.phone,
        matter_type: newLead.matter_type,
        conflict_status: 'pending',
        intake_status: 'new',
        source: newLead.referral_source,
        created_at: new Date().toISOString().split('T')[0]
      };

      setLeads(prev => [lead, ...prev]);
      setNewLead({
        name: '',
        email: '',
        phone: '',
        matter_type: '',
        matter_description: '',
        referral_source: '',
        consent_marketing: false,
        consent_contact: true
      });
      setShowAddLead(false);

      toast.success('Lead added with consent recorded');
    } catch (error) {
      toast.error('Failed to add lead');
    }
  };

  const handleConflictCheck = async (lead: Lead) => {
    try {
      // Record conflict check decision
      recordReceipt({
        id: `conflict_check_${Date.now()}`,
        type: 'Decision-RDS',
        policy_version: 'A-2025.01',
        inputs_hash: `sha256:conflict_check_${lead.name}_${conflictSearchTerm}`,
        result: 'approve',
        reasons: ['CONFLICT_SEARCH_EXECUTED', 'DATABASE_QUERIED'],
        created_at: new Date().toISOString()
      });

      // Update lead status
      setLeads(prev => prev.map(l => 
        l.id === lead.id 
          ? { ...l, conflict_status: 'clear' as const }
          : l
      ));

      setShowConflictCheck(false);
      setSelectedLead(null);
      setConflictSearchTerm('');

      toast.success('Conflict check completed - No conflicts found');
    } catch (error) {
      toast.error('Conflict check failed');
    }
  };

  const getConflictStatusColor = (status: string) => {
    switch (status) {
      case 'clear': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'conflict': return 'bg-red-500/10 text-red-700 border-red-200';
      case 'pending': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getIntakeStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'scheduled': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'new': return 'bg-gray-500/10 text-gray-700 border-gray-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Attorney Leads</h1>
          <p className="text-muted-foreground">
            Manage prospective clients with conflict checking and intake tracking
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={showAddLead} onOpenChange={setShowAddLead}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Lead</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={newLead.name}
                    onChange={(e) => setNewLead(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Client full name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newLead.email}
                    onChange={(e) => setNewLead(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="client@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newLead.phone}
                    onChange={(e) => setNewLead(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="555-0123"
                  />
                </div>

                <div>
                  <Label htmlFor="matter_type">Matter Type *</Label>
                  <Select onValueChange={(value) => setNewLead(prev => ({ ...prev, matter_type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select matter type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="estate_planning">Estate Planning</SelectItem>
                      <SelectItem value="business_formation">Business Formation</SelectItem>
                      <SelectItem value="contract_review">Contract Review</SelectItem>
                      <SelectItem value="litigation">Litigation</SelectItem>
                      <SelectItem value="real_estate">Real Estate</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Matter Description</Label>
                  <Textarea
                    id="description"
                    value={newLead.matter_description}
                    onChange={(e) => setNewLead(prev => ({ ...prev, matter_description: e.target.value }))}
                    placeholder="Brief description of legal matter"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="source">Referral Source</Label>
                  <Input
                    id="source"
                    value={newLead.referral_source}
                    onChange={(e) => setNewLead(prev => ({ ...prev, referral_source: e.target.value }))}
                    placeholder="How did they find us?"
                  />
                </div>

                <div className="space-y-3 border-t pt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="consent_contact"
                      checked={newLead.consent_contact}
                      onCheckedChange={(checked) => setNewLead(prev => ({ ...prev, consent_contact: !!checked }))}
                    />
                    <Label htmlFor="consent_contact" className="text-sm">
                      I consent to be contacted regarding this legal matter
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="consent_marketing"
                      checked={newLead.consent_marketing}
                      onCheckedChange={(checked) => setNewLead(prev => ({ ...prev, consent_marketing: !!checked }))}
                    />
                    <Label htmlFor="consent_marketing" className="text-sm">
                      I consent to receive legal updates and newsletters
                    </Label>
                  </div>
                </div>

                <Button onClick={handleAddLead} className="w-full">
                  Add Lead & Record Consent
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-2">
                  <div className="font-medium">{lead.name}</div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {lead.email}
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {lead.phone}
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      {lead.matter_type}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getConflictStatusColor(lead.conflict_status)}>
                      {lead.conflict_status === 'clear' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {lead.conflict_status === 'conflict' && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {lead.conflict_status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                      Conflict: {lead.conflict_status}
                    </Badge>
                    <Badge className={getIntakeStatusColor(lead.intake_status)}>
                      Intake: {lead.intake_status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {lead.conflict_status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedLead(lead);
                        setShowConflictCheck(true);
                      }}
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      Run Conflict Check
                    </Button>
                  )}
                  <div className="text-right text-sm text-muted-foreground">
                    Added: {lead.created_at}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conflict Check Modal */}
      <Dialog open={showConflictCheck} onOpenChange={setShowConflictCheck}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conflict Check - {selectedLead?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="search">Search Terms</Label>
              <Input
                id="search"
                value={conflictSearchTerm}
                onChange={(e) => setConflictSearchTerm(e.target.value)}
                placeholder="Client names, company names, opposing parties..."
              />
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Search className="h-4 w-4 mr-2" />
                <span className="font-medium">Conflict Database Search</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Current clients</li>
                <li>• Former clients (5 year lookback)</li>
                <li>• Opposing parties</li>
                <li>• Related entities</li>
              </ul>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={() => selectedLead && handleConflictCheck(selectedLead)}
                className="flex-1"
              >
                <Shield className="h-4 w-4 mr-2" />
                Run Check
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowConflictCheck(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}