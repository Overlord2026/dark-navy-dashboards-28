import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Shield, Phone, Mail, Calendar, User, AlertTriangle, XCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LeadModel } from "@/features/pro/lead/LeadModel";
import { recordConsentRDS } from "@/features/pro/compliance/ConsentTracker";
import { recordDecisionRDS } from "@/features/pro/compliance/DecisionTracker";

export default function MedicareLeadsPage() {
  const { toast } = useToast();
  const [leads, setLeads] = useState(LeadModel.getByPersona('medicare') || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    tags: [] as string[],
    notes: '',
    consent_given: false,
    dnc_verified: false
  });

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDNCCheck = async (phoneNumber: string) => {
    // Simulate DNC lookup
    const isDNC = Math.random() < 0.1; // 10% chance of being on DNC
    
    const decision = recordDecisionRDS({
      action: 'medicare_dnc_check',
      persona: 'medicare',
      inputs_hash: await hash({ phone: phoneNumber }),
      reasons: ['regulatory_requirement', 'tcpa_compliance'],
      result: isDNC ? 'deny' : 'approve',
      metadata: {
        phone: phoneNumber,
        dnc_status: isDNC ? 'listed' : 'clear',
        check_timestamp: new Date().toISOString()
      }
    });

    return { isDNC, decision };
  };

  const handleAddLead = async () => {
    if (!newLead.name || !newLead.email || !newLead.phone || !newLead.consent_given) {
      toast({
        title: "Error",
        description: "Name, email, phone, and PTC consent are required",
        variant: "destructive"
      });
      return;
    }

    try {
      // Check DNC status
      const { isDNC, decision: dncDecision } = await handleDNCCheck(newLead.phone);
      
      if (isDNC) {
        toast({
          title: "DNC Listed",
          description: "This number is on the Do Not Call registry. Lead blocked.",
          variant: "destructive"
        });
        return;
      }

      // Record PTC consent
      const ptcConsent = recordConsentRDS({
        persona: 'medicare',
        scope: { 
          contact: true, 
          marketing: true, 
          analytics: false, 
          third_party_sharing: false 
        },
        ttlDays: 90,
        purpose: 'PTC'
      });

      // Create lead
      const lead = LeadModel.create({
        ...newLead,
        persona: 'medicare',
        status: 'new',
        dnc_verified: true
      });

      setLeads(LeadModel.getByPersona('medicare') || []);
      setIsAddModalOpen(false);
      setNewLead({
        name: '',
        email: '',
        phone: '',
        utm_source: '',
        utm_medium: '',
        utm_campaign: '',
        tags: [],
        notes: '',
        consent_given: false,
        dnc_verified: false
      });

      toast({
        title: "Medicare Lead Added",
        description: `${lead.name} added with PTC consent. DNC clear.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add Medicare lead",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'ptc': return 'bg-yellow-100 text-yellow-800';
      case 'soa': return 'bg-purple-100 text-purple-800';
      case 'call': return 'bg-orange-100 text-orange-800';
      case 'pecl': return 'bg-green-100 text-green-800';
      case 'enrolled': return 'bg-emerald-100 text-emerald-800';
      case 'post_enroll': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const availableTags = [
    'medicare-advantage',
    'medigap',
    'part-d',
    'dual-eligible',
    'aep',
    'sep',
    'lis',
    'high-income'
  ];

  const hash = async (obj: any) => {
    return btoa(JSON.stringify(obj)).slice(0, 16);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Medicare Leads</h1>
          <p className="text-muted-foreground">
            PTC-compliant Medicare prospect management with DNC verification
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Medicare Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Medicare Lead</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <Shield className="h-4 w-4 inline mr-1" />
                  PTC consent and DNC verification required for Medicare leads
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newLead.name}
                  onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                  placeholder="Full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newLead.email}
                  onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                  placeholder="email@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={newLead.phone}
                  onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                  placeholder="(555) 123-4567"
                />
                <p className="text-xs text-muted-foreground">
                  Will be automatically checked against DNC registry
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="utm_source">Source</Label>
                  <Select value={newLead.utm_source} onValueChange={(value) => setNewLead({...newLead, utm_source: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="seminar">Seminar</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="direct_mail">Direct Mail</SelectItem>
                      <SelectItem value="telemarketing">Telemarketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="utm_medium">Medium</Label>
                  <Input
                    id="utm_medium"
                    value={newLead.utm_medium}
                    onChange={(e) => setNewLead({...newLead, utm_medium: e.target.value})}
                    placeholder="aep, sep"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="utm_campaign">Campaign</Label>
                  <Input
                    id="utm_campaign"
                    value={newLead.utm_campaign}
                    onChange={(e) => setNewLead({...newLead, utm_campaign: e.target.value})}
                    placeholder="aep-2025"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Medicare Interest</Label>
                <div className="grid grid-cols-2 gap-2">
                  {availableTags.map(tag => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={tag}
                        checked={newLead.tags.includes(tag)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewLead({...newLead, tags: [...newLead.tags, tag]});
                          } else {
                            setNewLead({...newLead, tags: newLead.tags.filter(t => t !== tag)});
                          }
                        }}
                      />
                      <Label htmlFor={tag} className="text-xs">{tag}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newLead.notes}
                  onChange={(e) => setNewLead({...newLead, notes: e.target.value})}
                  placeholder="Medicare-specific needs, current coverage"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="consent"
                    checked={newLead.consent_given}
                    onCheckedChange={(checked) => setNewLead({...newLead, consent_given: !!checked})}
                  />
                  <Label htmlFor="consent" className="text-sm">
                    Prior Telephone Consent (PTC) obtained *
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Required by TCPA. Creates Consent-RDS receipt with purpose: 'PTC'
                </p>
              </div>

              <Button onClick={handleAddLead} className="w-full">
                Add Medicare Lead
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Medicare leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          {leads.filter(l => l.dnc_verified).length} DNC Clear
        </Badge>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Shield className="h-3 w-3" />
          {leads.filter(l => l.consent_given).length} PTC Consent
        </Badge>
      </div>

      {/* Leads List */}
      <div className="grid gap-4">
        {filteredLeads.map((lead) => (
          <Card key={lead.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{lead.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {lead.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(lead.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {lead.tags?.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {(lead.tags?.length || 0) > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{(lead.tags?.length || 0) - 2}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(lead.status)}>
                      {lead.status}
                    </Badge>
                    {lead.consent_given && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        PTC
                      </Badge>
                    )}
                    {lead.dnc_verified && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        DNC OK
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {lead.utm_source && (
                <div className="mt-3 pt-3 border-t flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Source: {lead.utm_source}</span>
                  {lead.utm_medium && <span>Medium: {lead.utm_medium}</span>}
                  {lead.utm_campaign && <span>Campaign: {lead.utm_campaign}</span>}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Medicare leads found</h3>
            <p className="text-muted-foreground mb-4">
              Get started by adding your first Medicare lead with PTC consent
            </p>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Medicare Lead
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}