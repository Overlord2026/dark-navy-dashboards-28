import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  User,
  FileText,
  Download,
  Users,
  Clock,
  DollarSign
} from 'lucide-react';

interface EstatePlanningModalProps {
  open: boolean;
  onClose: () => void;
}

interface DocumentStatus {
  id: string;
  name: string;
  completed: boolean;
  required: boolean;
  description: string;
}

interface Beneficiary {
  id: string;
  name: string;
  relationship: string;
  percentage: number;
  contingent: boolean;
}

interface Executor {
  id: string;
  name: string;
  role: 'primary' | 'successor';
  relationship: string;
  contact: string;
}

export const EstatePlanningModal: React.FC<EstatePlanningModalProps> = ({
  open,
  onClose
}) => {
  const [documents, setDocuments] = useState<DocumentStatus[]>([
    { id: 'will', name: 'Last Will and Testament', completed: false, required: true, description: 'Legal document outlining distribution of assets after death' },
    { id: 'trust', name: 'Revocable Living Trust', completed: false, required: false, description: 'Trust document to avoid probate and provide flexibility' },
    { id: 'power-attorney', name: 'Financial Power of Attorney', completed: false, required: true, description: 'Authorizes someone to handle financial matters if incapacitated' },
    { id: 'healthcare-proxy', name: 'Healthcare Power of Attorney', completed: false, required: true, description: 'Designates healthcare decision-maker if unable to make decisions' },
    { id: 'advance-directive', name: 'Advance Healthcare Directive', completed: false, required: true, description: 'Outlines wishes for medical care and end-of-life decisions' },
    { id: 'beneficiary-designations', name: 'Beneficiary Designations', completed: false, required: true, description: 'Updated beneficiaries on retirement accounts and insurance' },
    { id: 'guardian-designation', name: 'Guardian Designation for Minors', completed: false, required: false, description: 'Names guardians for minor children' },
    { id: 'asset-inventory', name: 'Asset Inventory', completed: false, required: true, description: 'Comprehensive list of all assets and liabilities' }
  ]);

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
    { id: '1', name: '', relationship: '', percentage: 0, contingent: false }
  ]);

  const [executors, setExecutors] = useState<Executor[]>([
    { id: '1', name: '', role: 'primary', relationship: '', contact: '' }
  ]);

  const [notes, setNotes] = useState('');

  const toggleDocument = (id: string) => {
    setDocuments(docs => 
      docs.map(doc => 
        doc.id === id ? { ...doc, completed: !doc.completed } : doc
      )
    );
  };

  const addBeneficiary = () => {
    const newId = (beneficiaries.length + 1).toString();
    setBeneficiaries([...beneficiaries, { 
      id: newId, 
      name: '', 
      relationship: '', 
      percentage: 0, 
      contingent: false 
    }]);
  };

  const updateBeneficiary = (id: string, field: keyof Beneficiary, value: any) => {
    setBeneficiaries(beneficiaries.map(ben => 
      ben.id === id ? { ...ben, [field]: value } : ben
    ));
  };

  const removeBeneficiary = (id: string) => {
    setBeneficiaries(beneficiaries.filter(ben => ben.id !== id));
  };

  const addExecutor = () => {
    const newId = (executors.length + 1).toString();
    setExecutors([...executors, { 
      id: newId, 
      name: '', 
      role: 'successor', 
      relationship: '', 
      contact: '' 
    }]);
  };

  const updateExecutor = (id: string, field: keyof Executor, value: any) => {
    setExecutors(executors.map(exec => 
      exec.id === id ? { ...exec, [field]: value } : exec
    ));
  };

  const removeExecutor = (id: string) => {
    setExecutors(executors.filter(exec => exec.id !== id));
  };

  const calculateCompletionPercentage = () => {
    const requiredDocs = documents.filter(doc => doc.required);
    const completedRequired = requiredDocs.filter(doc => doc.completed);
    return Math.round((completedRequired.length / requiredDocs.length) * 100);
  };

  const getCompletionStatus = () => {
    const percentage = calculateCompletionPercentage();
    if (percentage >= 100) return { status: 'complete', color: 'text-green-600', message: 'Estate plan is complete!' };
    if (percentage >= 75) return { status: 'good', color: 'text-blue-600', message: 'Almost complete' };
    if (percentage >= 50) return { status: 'fair', color: 'text-yellow-600', message: 'Good progress' };
    return { status: 'needs-work', color: 'text-red-600', message: 'Needs attention' };
  };

  const generateSummaryReport = () => {
    const completionData = {
      documents,
      beneficiaries: beneficiaries.filter(b => b.name),
      executors: executors.filter(e => e.name),
      notes,
      completionPercentage: calculateCompletionPercentage(),
      generatedDate: new Date().toISOString()
    };

    // Save to localStorage
    localStorage.setItem('estate-planning-summary', JSON.stringify(completionData));

    // Generate downloadable report
    const reportContent = `
ESTATE PLANNING SUMMARY REPORT
Generated: ${new Date().toLocaleDateString()}

COMPLETION STATUS: ${calculateCompletionPercentage()}%

REQUIRED DOCUMENTS:
${documents.filter(d => d.required).map(doc => 
  `${doc.completed ? '✓' : '✗'} ${doc.name}`
).join('\n')}

OPTIONAL DOCUMENTS:
${documents.filter(d => !d.required).map(doc => 
  `${doc.completed ? '✓' : '✗'} ${doc.name}`
).join('\n')}

BENEFICIARIES:
${beneficiaries.filter(b => b.name).map(ben => 
  `• ${ben.name} (${ben.relationship}) - ${ben.percentage}%${ben.contingent ? ' [Contingent]' : ''}`
).join('\n')}

EXECUTORS:
${executors.filter(e => e.name).map(exec => 
  `• ${exec.name} (${exec.role}) - ${exec.relationship} - ${exec.contact}`
).join('\n')}

NOTES:
${notes}

RECOMMENDATIONS:
${calculateCompletionPercentage() < 100 ? '• Complete remaining required documents' : '• Review and update annually'}
• Consult with estate planning attorney
• Update beneficiary designations
• Review asset titling and ownership

This summary is for planning purposes only. Please consult with qualified legal professionals.
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'estate-planning-summary.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const completionStatus = getCompletionStatus();
  const totalPercentage = beneficiaries.reduce((sum, ben) => sum + ben.percentage, 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Shield className="h-6 w-6 text-primary" />
            Estate Planning Summary
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="checklist" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="checklist">Document Checklist</TabsTrigger>
            <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
            <TabsTrigger value="executors">Executors</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="checklist" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Document Readiness Checklist
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={completionStatus.color}>
                      {calculateCompletionPercentage()}% Complete
                    </Badge>
                    <span className={`text-sm ${completionStatus.color}`}>
                      {completionStatus.message}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                        <Checkbox 
                          checked={doc.completed}
                          onCheckedChange={() => toggleDocument(doc.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${doc.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {doc.name}
                            </span>
                            {doc.required && (
                              <Badge variant="destructive" className="text-xs">Required</Badge>
                            )}
                            {doc.completed ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : doc.required ? (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {doc.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="beneficiaries" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Beneficiary Overview
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Total: {totalPercentage}%
                    </span>
                    {totalPercentage !== 100 && (
                      <Badge variant="destructive">Incomplete</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {beneficiaries.map((beneficiary, index) => (
                    <div key={beneficiary.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={beneficiary.name}
                          onChange={(e) => updateBeneficiary(beneficiary.id, 'name', e.target.value)}
                          placeholder="Full name"
                        />
                      </div>
                      <div>
                        <Label>Relationship</Label>
                        <Input
                          value={beneficiary.relationship}
                          onChange={(e) => updateBeneficiary(beneficiary.id, 'relationship', e.target.value)}
                          placeholder="e.g., Spouse, Child"
                        />
                      </div>
                      <div>
                        <Label>Percentage</Label>
                        <Input
                          type="number"
                          value={beneficiary.percentage}
                          onChange={(e) => updateBeneficiary(beneficiary.id, 'percentage', Number(e.target.value))}
                          placeholder="0"
                          max="100"
                          min="0"
                        />
                      </div>
                      <div className="flex items-center space-x-2 mt-6">
                        <Checkbox
                          checked={beneficiary.contingent}
                          onCheckedChange={(checked) => updateBeneficiary(beneficiary.id, 'contingent', checked)}
                        />
                        <Label className="text-sm">Contingent</Label>
                      </div>
                      <div className="flex items-center mt-6">
                        {beneficiaries.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeBeneficiary(beneficiary.id)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button onClick={addBeneficiary} variant="outline">
                    Add Beneficiary
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="executors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Executor & Trustee Roles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {executors.map((executor) => (
                    <div key={executor.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={executor.name}
                          onChange={(e) => updateExecutor(executor.id, 'name', e.target.value)}
                          placeholder="Full name"
                        />
                      </div>
                      <div>
                        <Label>Role</Label>
                        <select
                          value={executor.role}
                          onChange={(e) => updateExecutor(executor.id, 'role', e.target.value as 'primary' | 'successor')}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        >
                          <option value="primary">Primary</option>
                          <option value="successor">Successor</option>
                        </select>
                      </div>
                      <div>
                        <Label>Relationship</Label>
                        <Input
                          value={executor.relationship}
                          onChange={(e) => updateExecutor(executor.id, 'relationship', e.target.value)}
                          placeholder="e.g., Spouse, Child"
                        />
                      </div>
                      <div>
                        <Label>Contact</Label>
                        <Input
                          value={executor.contact}
                          onChange={(e) => updateExecutor(executor.id, 'contact', e.target.value)}
                          placeholder="Phone or email"
                        />
                      </div>
                      <div className="flex items-center mt-6">
                        {executors.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeExecutor(executor.id)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button onClick={addExecutor} variant="outline">
                    Add Executor
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Document Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {calculateCompletionPercentage()}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {documents.filter(d => d.required && d.completed).length} of {documents.filter(d => d.required).length} required documents
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Beneficiaries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald">
                    {beneficiaries.filter(b => b.name).length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {totalPercentage}% allocated
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Executors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {executors.filter(e => e.name).length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Named executors
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Notes & Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes, special instructions, or reminders..."
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {calculateCompletionPercentage() < 100 && (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Complete remaining required documents</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-blue-600">
                    <User className="h-4 w-4" />
                    <span>Schedule consultation with estate planning attorney</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Review and update beneficiary designations annually</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-600">
                    <DollarSign className="h-4 w-4" />
                    <span>Consider tax implications and strategies</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={generateSummaryReport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Summary
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};