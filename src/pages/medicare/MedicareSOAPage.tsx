import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Shield, 
  Users, 
  Signature, 
  Download,
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye,
  Archive
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { recordDecisionRDS } from "@/features/pro/compliance/DecisionTracker";
import * as Canonical from "@/lib/canonical";

export default function MedicareSOAPage() {
  const { toast } = useToast();
  const [soaData, setSOAData] = useState({
    clientName: '',
    clientAge: '',
    planTypes: [] as string[],
    appointmentDate: '',
    appointmentTime: '',
    meetingLocation: '',
    agentName: '',
    agentLicense: '',
    discussionTopics: [] as string[],
    clientSignature: '',
    agentSignature: '',
    witnessSignature: ''
  });

  const [isSOAModalOpen, setIsSOAModalOpen] = useState(false);
  const [completedSOAs, setCompletedSOAs] = useState([
    {
      id: 'soa_001',
      clientName: 'Robert Johnson',
      appointmentDate: '2024-01-15',
      status: 'completed',
      signedAt: '2024-01-15T10:30:00Z',
      planTypes: ['Medicare Advantage'],
      receiptHash: 'soa_abc123'
    },
    {
      id: 'soa_002', 
      clientName: 'Maria Garcia',
      appointmentDate: '2024-01-14',
      status: 'pending',
      planTypes: ['Medigap Plan F'],
      receiptHash: null
    }
  ]);

  const planTypeOptions = [
    'Medicare Advantage',
    'Medigap Plan A',
    'Medigap Plan B', 
    'Medigap Plan C',
    'Medigap Plan F',
    'Medigap Plan G',
    'Medigap Plan K',
    'Medigap Plan L',
    'Medigap Plan M',
    'Medigap Plan N',
    'Medicare Part D',
    'Medicare Supplement'
  ];

  const discussionTopicOptions = [
    'Medicare eligibility and enrollment periods',
    'Medicare Part A (hospital insurance)',
    'Medicare Part B (medical insurance)', 
    'Medicare Part C (Medicare Advantage)',
    'Medicare Part D (prescription drug coverage)',
    'Medigap supplemental insurance',
    'Premium and cost-sharing information',
    'Provider networks and coverage areas',
    'Prescription drug formularies',
    'Special needs plans (SNPs)',
    'Low Income Subsidy (LIS) programs',
    'Medicare Savings Programs'
  ];

  const handleSOASubmit = async () => {
    if (!soaData.clientName || !soaData.appointmentDate || soaData.planTypes.length === 0) {
      toast({
        title: "Error",
        description: "Client name, appointment date, and plan types are required",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create SOA receipt
      const decision = await recordDecisionRDS({
        action: 'medicare.soa.signed',
        persona: 'medicare',
        inputs_hash: await Canonical.hash({
          clientName: soaData.clientName,
          planTypes: soaData.planTypes,
          discussionTopics: soaData.discussionTopics,
          appointmentDate: soaData.appointmentDate
        }),
        reasons: ['regulatory_requirement', 'cms_compliance', 'documented_consent'],
        result: 'approve',
        metadata: {
          soa_type: 'medicare',
          plan_types: soaData.planTypes,
          appointment_scheduled: true,
          signature_method: 'electronic',
          retention_period: '10_years'
        }
      });

      // Add to completed SOAs
      const newSOA = {
        id: `soa_${Date.now()}`,
        clientName: soaData.clientName,
        appointmentDate: soaData.appointmentDate,
        status: 'completed',
        signedAt: new Date().toISOString(),
        planTypes: soaData.planTypes,
        receiptHash: decision.inputs_hash
      };

      setCompletedSOAs([newSOA, ...completedSOAs]);
      setIsSOAModalOpen(false);
      
      // Reset form
      setSOAData({
        clientName: '',
        clientAge: '',
        planTypes: [],
        appointmentDate: '',
        appointmentTime: '',
        meetingLocation: '',
        agentName: '',
        agentLicense: '',
        discussionTopics: [],
        clientSignature: '',
        agentSignature: '',
        witnessSignature: ''
      });

      toast({
        title: "SOA Completed",
        description: `Scope of Appointment signed for ${newSOA.clientName}. Receipt: ${decision.inputs_hash}`,
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process SOA",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Scope of Appointment (SOA)</h1>
          <p className="text-muted-foreground">
            CMS-compliant SOA management with e-signature and 10-year retention
          </p>
        </div>
        <Dialog open={isSOAModalOpen} onOpenChange={setIsSOAModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Create New SOA
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Scope of Appointment</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="client-info" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="client-info">Client Info</TabsTrigger>
                <TabsTrigger value="appointment">Appointment</TabsTrigger>
                <TabsTrigger value="signatures">Signatures</TabsTrigger>
              </TabsList>

              <TabsContent value="client-info" className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <Shield className="h-4 w-4 inline mr-1" />
                    SOA required before any Medicare plan discussion per CMS regulations
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name *</Label>
                    <Input
                      id="clientName"
                      value={soaData.clientName}
                      onChange={(e) => setSOAData({...soaData, clientName: e.target.value})}
                      placeholder="Full legal name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="clientAge">Client Age</Label>
                    <Input
                      id="clientAge"
                      type="number"
                      value={soaData.clientAge}
                      onChange={(e) => setSOAData({...soaData, clientAge: e.target.value})}
                      placeholder="65"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Plan Types to Discuss *</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {planTypeOptions.map(plan => (
                      <div key={plan} className="flex items-center space-x-2">
                        <Checkbox
                          id={plan}
                          checked={soaData.planTypes.includes(plan)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSOAData({...soaData, planTypes: [...soaData.planTypes, plan]});
                            } else {
                              setSOAData({...soaData, planTypes: soaData.planTypes.filter(p => p !== plan)});
                            }
                          }}
                        />
                        <Label htmlFor={plan} className="text-sm">{plan}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Discussion Topics</Label>
                  <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                    {discussionTopicOptions.map(topic => (
                      <div key={topic} className="flex items-center space-x-2">
                        <Checkbox
                          id={topic}
                          checked={soaData.discussionTopics.includes(topic)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSOAData({...soaData, discussionTopics: [...soaData.discussionTopics, topic]});
                            } else {
                              setSOAData({...soaData, discussionTopics: soaData.discussionTopics.filter(t => t !== topic)});
                            }
                          }}
                        />
                        <Label htmlFor={topic} className="text-xs">{topic}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="appointment" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="appointmentDate">Appointment Date *</Label>
                    <Input
                      id="appointmentDate"
                      type="date"
                      value={soaData.appointmentDate}
                      onChange={(e) => setSOAData({...soaData, appointmentDate: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="appointmentTime">Appointment Time</Label>
                    <Input
                      id="appointmentTime"
                      type="time"
                      value={soaData.appointmentTime}
                      onChange={(e) => setSOAData({...soaData, appointmentTime: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meetingLocation">Meeting Location</Label>
                  <Select value={soaData.meetingLocation} onValueChange={(value) => setSOAData({...soaData, meetingLocation: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client_home">Client's Home</SelectItem>
                      <SelectItem value="office">Agent's Office</SelectItem>
                      <SelectItem value="phone">Phone Appointment</SelectItem>
                      <SelectItem value="video">Video Conference</SelectItem>
                      <SelectItem value="public_location">Public Location</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="agentName">Agent Name</Label>
                    <Input
                      id="agentName"
                      value={soaData.agentName}
                      onChange={(e) => setSOAData({...soaData, agentName: e.target.value})}
                      placeholder="Licensed agent name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="agentLicense">Agent License #</Label>
                    <Input
                      id="agentLicense"
                      value={soaData.agentLicense}
                      onChange={(e) => setSOAData({...soaData, agentLicense: e.target.value})}
                      placeholder="State license number"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="signatures" className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-800">
                    <Signature className="h-4 w-4 inline mr-1" />
                    Electronic signatures create binding SOA with 10-year retention
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientSignature">Client Electronic Signature</Label>
                    <Input
                      id="clientSignature"
                      value={soaData.clientSignature}
                      onChange={(e) => setSOAData({...soaData, clientSignature: e.target.value})}
                      placeholder="Type full name to sign electronically"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="agentSignature">Agent Electronic Signature</Label>
                    <Input
                      id="agentSignature"
                      value={soaData.agentSignature}
                      onChange={(e) => setSOAData({...soaData, agentSignature: e.target.value})}
                      placeholder="Type full name to sign electronically"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="witnessSignature">Witness Signature (Optional)</Label>
                    <Input
                      id="witnessSignature"
                      value={soaData.witnessSignature}
                      onChange={(e) => setSOAData({...soaData, witnessSignature: e.target.value})}
                      placeholder="Witness name if applicable"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleSOASubmit} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Complete & Sign SOA
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Preview PDF
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* SOA Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{completedSOAs.length}</div>
            <div className="text-sm text-muted-foreground">Total SOAs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {completedSOAs.filter(s => s.status === 'completed').length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-amber-600">
              {completedSOAs.filter(s => s.status === 'pending').length}
            </div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">100%</div>
            <div className="text-sm text-muted-foreground">Compliance Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* SOAs List */}
      <Card>
        <CardHeader>
          <CardTitle>Scope of Appointment Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {completedSOAs.map((soa) => (
              <div key={soa.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{soa.clientName}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>Appointment: {new Date(soa.appointmentDate).toLocaleDateString()}</span>
                      <span>Plans: {soa.planTypes.join(', ')}</span>
                      {soa.signedAt && (
                        <span>Signed: {new Date(soa.signedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(soa.status)}>
                    {soa.status}
                  </Badge>
                  {soa.receiptHash && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Receipt: {soa.receiptHash.slice(0, 8)}
                    </Badge>
                  )}
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Archive className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}