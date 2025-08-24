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
import { Plus, Search, Shield, Phone, Mail, Calendar, User, Heart, Activity, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LeadModel } from "@/features/pro/lead/LeadModel";
import { recordConsentRDS } from "@/features/pro/compliance/ConsentTracker";

export default function HealthcareLeadsPage() {
  const { toast } = useToast();
  const [leads, setLeads] = useState(LeadModel.getByPersona('healthcare') || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    medicalRecordNumber: '',
    insuranceProvider: '',
    primaryConcern: '',
    referralSource: '',
    tags: [] as string[],
    notes: '',
    hipaa_consent: false,
    treatment_consent: false,
    sharing_consent: false
  });

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.phone && lead.phone.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddLead = async () => {
    if (!newLead.name || !newLead.email || !newLead.hipaa_consent) {
      toast({
        title: "Error",
        description: "Name, email, and HIPAA consent are required",
        variant: "destructive"
      });
      return;
    }

    try {
      // Record HIPAA consent with minimum necessary principle
      const hipaaConsent = recordConsentRDS({
        persona: 'healthcare',
        scope: { 
          contact: newLead.treatment_consent, 
          marketing: false, // Healthcare marketing requires special handling
          analytics: false, 
          third_party_sharing: newLead.sharing_consent 
        },
        ttlDays: 365, // HIPAA consent typically lasts longer
        purpose: 'healthcare_treatment_coordination'
      });

      // Create patient lead
      const lead = LeadModel.create({
        ...newLead,
        persona: 'healthcare',
        status: 'new',
        consent_given: true
      });

      setLeads(LeadModel.getByPersona('healthcare') || []);
      setIsAddModalOpen(false);
      setNewLead({
        name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        medicalRecordNumber: '',
        insuranceProvider: '',
        primaryConcern: '',
        referralSource: '',
        tags: [],
        notes: '',
        hipaa_consent: false,
        treatment_consent: false,
        sharing_consent: false
      });

      toast({
        title: "Patient Lead Added",
        description: `${lead.name} added with HIPAA consent. Receipt: ${hipaaConsent.inputs_hash}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add patient lead",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'screening': return 'bg-yellow-100 text-yellow-800';
      case 'consultation': return 'bg-purple-100 text-purple-800';
      case 'treatment': return 'bg-green-100 text-green-800';
      case 'monitoring': return 'bg-orange-100 text-orange-800';
      case 'discharged': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const availableTags = [
    'diabetes',
    'hypertension',
    'cardiovascular',
    'preventive-care',
    'mental-health',
    'chronic-disease',
    'wellness-coaching',
    'nutrition',
    'exercise-therapy',
    'medication-management'
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Healthcare Patient Leads</h1>
          <p className="text-muted-foreground">
            HIPAA-compliant patient management with consent-driven collaboration
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Patient Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Patient Lead</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <Shield className="h-4 w-4 inline mr-1" />
                  HIPAA consent required. Minimum necessary principle applied to all sharing.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Patient Name *</Label>
                <Input
                  id="name"
                  value={newLead.name}
                  onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                  placeholder="Full legal name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newLead.email}
                  onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                  placeholder="patient@example.com"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={newLead.dateOfBirth}
                    onChange={(e) => setNewLead({...newLead, dateOfBirth: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalRecordNumber">Medical Record Number</Label>
                <Input
                  id="medicalRecordNumber"
                  value={newLead.medicalRecordNumber}
                  onChange={(e) => setNewLead({...newLead, medicalRecordNumber: e.target.value})}
                  placeholder="MRN-123456"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                <Input
                  id="insuranceProvider"
                  value={newLead.insuranceProvider}
                  onChange={(e) => setNewLead({...newLead, insuranceProvider: e.target.value})}
                  placeholder="Blue Cross Blue Shield"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryConcern">Primary Health Concern</Label>
                <Select value={newLead.primaryConcern} onValueChange={(value) => setNewLead({...newLead, primaryConcern: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select concern" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preventive_care">Preventive Care</SelectItem>
                    <SelectItem value="chronic_disease">Chronic Disease Management</SelectItem>
                    <SelectItem value="wellness_coaching">Wellness Coaching</SelectItem>
                    <SelectItem value="nutrition_counseling">Nutrition Counseling</SelectItem>
                    <SelectItem value="mental_health">Mental Health Support</SelectItem>
                    <SelectItem value="medication_management">Medication Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referralSource">Referral Source</Label>
                <Select value={newLead.referralSource} onValueChange={(value) => setNewLead({...newLead, referralSource: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physician_referral">Physician Referral</SelectItem>
                    <SelectItem value="self_referral">Self Referral</SelectItem>
                    <SelectItem value="insurance_referral">Insurance Referral</SelectItem>
                    <SelectItem value="online_search">Online Search</SelectItem>
                    <SelectItem value="word_of_mouth">Word of Mouth</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Health Focus Areas</Label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
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
                <Label htmlFor="notes">Clinical Notes</Label>
                <Textarea
                  id="notes"
                  value={newLead.notes}
                  onChange={(e) => setNewLead({...newLead, notes: e.target.value})}
                  placeholder="Initial assessment, health history notes"
                  rows={2}
                />
              </div>

              <div className="space-y-3 border-t pt-3">
                <Label className="text-sm font-semibold">HIPAA Consent *</Label>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hipaa_consent"
                      checked={newLead.hipaa_consent}
                      onCheckedChange={(checked) => setNewLead({...newLead, hipaa_consent: !!checked})}
                    />
                    <Label htmlFor="hipaa_consent" className="text-sm">
                      HIPAA authorization for treatment coordination *
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="treatment_consent"
                      checked={newLead.treatment_consent}
                      onCheckedChange={(checked) => setNewLead({...newLead, treatment_consent: !!checked})}
                    />
                    <Label htmlFor="treatment_consent" className="text-sm">
                      Consent for treatment communications
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sharing_consent"
                      checked={newLead.sharing_consent}
                      onCheckedChange={(checked) => setNewLead({...newLead, sharing_consent: !!checked})}
                    />
                    <Label htmlFor="sharing_consent" className="text-sm">
                      Consent for minimum-necessary information sharing with care team
                    </Label>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Creates Consent-RDS receipt with healthcare-specific scope and 365-day TTL
                </p>
              </div>

              <Button onClick={handleAddLead} className="w-full">
                Add Patient Lead
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
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Shield className="h-3 w-3" />
          {leads.filter(l => l.consent_given).length} HIPAA Consented
        </Badge>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Heart className="h-3 w-3" />
          {leads.length} Total Patients
        </Badge>
      </div>

      {/* Patients List */}
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
                      {lead.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {lead.phone}
                        </div>
                      )}
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
                        HIPAA
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {lead.primaryConcern && (
                <div className="mt-3 pt-3 border-t flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Primary Concern: {lead.primaryConcern}</span>
                  {lead.referralSource && <span>Referral: {lead.referralSource}</span>}
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
            <h3 className="text-lg font-semibold mb-2">No patients found</h3>
            <p className="text-muted-foreground mb-4">
              Get started by adding your first patient with HIPAA consent
            </p>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Patient Lead
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}