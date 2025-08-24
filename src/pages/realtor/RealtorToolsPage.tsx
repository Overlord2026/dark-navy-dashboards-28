import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Download, 
  Upload, 
  FileText, 
  Package, 
  Home,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Users
} from 'lucide-react';
import { toast } from 'sonner';
import { recordDecisionRDS } from '@/features/pro/compliance/DecisionTracker';

const RealtorToolsPage: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const properties = [
    { id: 'prop_001', address: '123 Oak Street', price: 450000, status: 'under_contract' },
    { id: 'prop_002', address: '456 Pine Avenue', price: 525000, status: 'pending' },
    { id: 'prop_003', address: '789 Maple Drive', price: 380000, status: 'active' }
  ];

  const clients = [
    { id: 'client_001', name: 'Johnson Family', type: 'buyer' },
    { id: 'client_002', name: 'Smith Estate', type: 'seller' },
    { id: 'client_003', name: 'Davis Trust', type: 'investor' }
  ];

  const disclosureChecklist = [
    { 
      id: 'lead_paint', 
      name: 'Lead-Based Paint Disclosure', 
      required: true, 
      description: 'Federal requirement for properties built before 1978',
      completed: true
    },
    { 
      id: 'natural_hazards', 
      name: 'Natural Hazards Disclosure', 
      required: true, 
      description: 'State-required geological and environmental hazards',
      completed: false
    },
    { 
      id: 'property_condition', 
      name: 'Property Condition Statement', 
      required: true, 
      description: 'Seller disclosure of known defects and improvements',
      completed: false
    },
    { 
      id: 'hoa_docs', 
      name: 'HOA Documents', 
      required: false, 
      description: 'Homeowners association bylaws and financial statements',
      completed: true
    },
    { 
      id: 'title_report', 
      name: 'Preliminary Title Report', 
      required: true, 
      description: 'Title company preliminary ownership and encumbrance report',
      completed: true
    }
  ];

  const handleCompleteDisclosure = (disclosureId: string) => {
    const decision = recordDecisionRDS({
      action: 'disclosure_complete',
      persona: 'realtor',
      inputs_hash: `${selectedProperty}_${disclosureId}`,
      reasons: ['disclosure_mandatory', 'legal_compliance', 'buyer_protection'],
      result: 'approve',
      metadata: {
        property_id: selectedProperty,
        disclosure_type: disclosureId,
        client_id: selectedClient
      }
    });

    toast.success('Disclosure completed with compliance tracking');
    console.log('Disclosure Decision-RDS:', decision);
  };

  const handleExportOfferPack = async () => {
    if (!selectedProperty || !selectedClient) {
      toast.error('Please select property and client');
      return;
    }

    setIsExporting(true);
    try {
      const property = properties.find(p => p.id === selectedProperty);
      const client = clients.find(c => c.id === selectedClient);
      
      // Record offer pack generation decision
      const decision = recordDecisionRDS({
        action: 'offer_pack_generate',
        persona: 'realtor',
        inputs_hash: `${selectedProperty}_${selectedClient}`,
        reasons: ['client_request', 'disclosures_complete', 'offer_preparation'],
        result: 'approve',
        metadata: {
          property_id: selectedProperty,
          client_id: selectedClient,
          pack_type: 'offer_package'
        }
      });

      // Create offer pack manifest
      const manifest = {
        pack_type: "offer_package",
        property: {
          id: property?.id,
          address: property?.address,
          price: property?.price
        },
        client: {
          id: client?.id,
          name: client?.name,
          type: client?.type
        },
        documents: [
          { name: "Purchase Agreement", type: "contract", required: true, included: true },
          { name: "Property Disclosure", type: "disclosure", required: true, included: true },
          { name: "Financing Contingency", type: "addendum", required: false, included: true },
          { name: "Inspection Contingency", type: "addendum", required: false, included: true },
          { name: "Lead Paint Disclosure", type: "disclosure", required: true, included: true }
        ],
        compliance_checks: {
          disclosures_complete: true,
          required_docs_included: true,
          client_signatures_ready: true
        },
        decision_receipt: decision.inputs_hash,
        generated_at: new Date().toISOString()
      };

      // Simulate zip creation and download
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const blob = new Blob([JSON.stringify(manifest, null, 2)], 
        { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `offer_pack_${property?.address.replace(/\s+/g, '_')}_manifest.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('Offer pack exported with compliance manifest');
      console.log('Offer Pack Decision-RDS:', decision);
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportClosePack = async () => {
    if (!selectedProperty || !selectedClient) {
      toast.error('Please select property and client');
      return;
    }

    setIsExporting(true);
    try {
      const property = properties.find(p => p.id === selectedProperty);
      const client = clients.find(c => c.id === selectedClient);

      // Record close pack generation decision
      const decision = recordDecisionRDS({
        action: 'close_pack_generate',
        persona: 'realtor',
        inputs_hash: `${selectedProperty}_${selectedClient}_close`,
        reasons: ['closing_preparation', 'compliance_complete', 'title_clear'],
        result: 'approve',
        metadata: {
          property_id: selectedProperty,
          client_id: selectedClient,
          pack_type: 'closing_package'
        }
      });

      // Create comprehensive close pack manifest
      const manifest = {
        pack_type: "closing_package",
        property: {
          id: property?.id,
          address: property?.address,
          price: property?.price,
          closing_date: "2024-01-30"
        },
        client: {
          id: client?.id,
          name: client?.name,
          type: client?.type
        },
        documents: [
          { name: "Final Purchase Agreement", type: "contract", required: true, included: true },
          { name: "Property Deed", type: "title", required: true, included: true },
          { name: "Title Insurance Policy", type: "insurance", required: true, included: true },
          { name: "Final Walk-Through Report", type: "inspection", required: true, included: true },
          { name: "Closing Disclosure", type: "financial", required: true, included: true },
          { name: "Property Disclosures", type: "disclosure", required: true, included: true },
          { name: "HOA Documents", type: "community", required: false, included: true },
          { name: "Warranty Information", type: "warranty", required: false, included: true }
        ],
        compliance_verification: {
          all_disclosures_complete: true,
          title_search_clear: true,
          liens_resolved: true,
          inspections_complete: true,
          financing_approved: true,
          insurance_bound: true
        },
        proof_of_compliance: {
          decision_receipt: decision.inputs_hash,
          disclosure_receipts: [
            "lead_paint_20240115",
            "natural_hazards_20240118", 
            "property_condition_20240120"
          ],
          regulatory_compliance: "NAR_standards_2024"
        },
        generated_at: new Date().toISOString(),
        retention_period: "7_years"
      };

      // Simulate comprehensive zip creation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const blob = new Blob([JSON.stringify(manifest, null, 2)], 
        { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `close_pack_${property?.address.replace(/\s+/g, '_')}_manifest.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('Close pack exported with proof manifest');
      console.log('Close Pack Decision-RDS:', decision);
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Realtor Tools</h1>
          <p className="text-muted-foreground">
            Manage offers, disclosures, and closing packages with compliance proofs
          </p>
        </div>
      </div>

      <Tabs defaultValue="disclosures" className="space-y-6">
        <TabsList>
          <TabsTrigger value="disclosures">Disclosure Checklists</TabsTrigger>
          <TabsTrigger value="offers">Offer Packages</TabsTrigger>
          <TabsTrigger value="closing">Closing Packages</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Tools</TabsTrigger>
        </TabsList>

        {/* Disclosure Checklists */}
        <TabsContent value="disclosures">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Property Disclosure Checklists
              </CardTitle>
              <CardDescription>
                Track and complete required property disclosures with Decision-RDS receipts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((prop) => (
                      <SelectItem key={prop.id} value={prop.id}>
                        {prop.address} - ${prop.price.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} ({client.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {disclosureChecklist.map((disclosure) => (
                  <div key={disclosure.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <Checkbox 
                      checked={disclosure.completed}
                      disabled={disclosure.completed}
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{disclosure.name}</h4>
                        {disclosure.required && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                        {disclosure.completed && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {disclosure.description}
                      </p>
                    </div>
                    {!disclosure.completed && (
                      <Button 
                        size="sm"
                        onClick={() => handleCompleteDisclosure(disclosure.id)}
                        disabled={!selectedProperty || !selectedClient}
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Offer Packages */}
        <TabsContent value="offers">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Offer Package Generator
              </CardTitle>
              <CardDescription>
                Create comprehensive offer packages with addenda and disclosures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((prop) => (
                      <SelectItem key={prop.id} value={prop.id}>
                        {prop.address} - ${prop.price.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} ({client.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Offer Amount" />
                <Input placeholder="Earnest Money" />
                <Input placeholder="Closing Date" type="date" />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Financing Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conventional">Conventional</SelectItem>
                    <SelectItem value="fha">FHA</SelectItem>
                    <SelectItem value="va">VA</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Include Addenda:</h4>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center space-x-2">
                    <Checkbox defaultChecked />
                    <span className="text-sm">Financing Contingency</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <Checkbox defaultChecked />
                    <span className="text-sm">Inspection Contingency</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <Checkbox />
                    <span className="text-sm">Appraisal Contingency</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <Checkbox />
                    <span className="text-sm">Title Contingency</span>
                  </label>
                </div>
              </div>

              <Button 
                onClick={handleExportOfferPack}
                disabled={isExporting || !selectedProperty || !selectedClient}
                className="w-full gap-2"
              >
                <Download className="h-4 w-4" />
                {isExporting ? 'Generating...' : 'Generate Offer Package'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Closing Packages */}
        <TabsContent value="closing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Closing Package Generator
              </CardTitle>
              <CardDescription>
                Create complete closing packages with proof manifests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.filter(p => p.status === 'under_contract').map((prop) => (
                      <SelectItem key={prop.id} value={prop.id}>
                        {prop.address} - ${prop.price.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} ({client.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 border rounded-lg space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Closing Package Includes:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Final Purchase Agreement
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Property Deed
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Title Insurance Policy
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Closing Disclosure
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    All Property Disclosures
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Compliance Manifest
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleExportClosePack}
                disabled={isExporting || !selectedProperty || !selectedClient}
                className="w-full gap-2"
              >
                <Download className="h-4 w-4" />
                {isExporting ? 'Generating...' : 'Generate Closing Package'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Campaign Tools */}
        <TabsContent value="campaigns">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Neighborhood Report Campaign
                </CardTitle>
                <CardDescription>
                  Send market analysis to prospects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Neighborhood/ZIP Code" />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Report Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly Market Update</SelectItem>
                    <SelectItem value="quarterly">Quarterly Analysis</SelectItem>
                    <SelectItem value="custom">Custom Report</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea placeholder="Additional market insights..." />
                <Button className="w-full gap-2">
                  <Users className="h-4 w-4" />
                  Send to Prospects
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Open House Follow-up
                </CardTitle>
                <CardDescription>
                  Automated follow-up campaigns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Property Address" />
                <Input placeholder="Open House Date" type="date" />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Follow-up Sequence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate Thank You</SelectItem>
                    <SelectItem value="weekly">Weekly Check-in</SelectItem>
                    <SelectItem value="monthly">Monthly Updates</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea placeholder="Personal message..." />
                <Button className="w-full gap-2">
                  <Mail className="h-4 w-4" />
                  Setup Campaign
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealtorToolsPage;