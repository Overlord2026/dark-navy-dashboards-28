import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { VaultWatermark } from './VaultWatermark';
import { PatentPendingBadge } from './PatentPendingBadge';
import { 
  FileCheck, 
  Shield, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Send,
  Eye,
  Edit,
  Trash2,
  Plus,
  Mail,
  Calendar
} from 'lucide-react';

interface AgreementWorkflow {
  id: string;
  workflowType: 'privacy_consent' | 'access_agreement' | 'fiduciary_terms' | 'data_sharing';
  recipientEmail: string;
  recipientName: string;
  templateContent: string;
  signatureStatus: 'pending' | 'signed' | 'declined' | 'expired';
  sentAt?: string;
  signedAt?: string;
  expiresAt: string;
  remindersSent: number;
  lastReminderAt?: string;
}

interface AgreementWorkflowManagerProps {
  vaultId: string;
  onWorkflowChange?: (workflows: AgreementWorkflow[]) => void;
}

const workflowTypes = [
  {
    value: 'privacy_consent',
    label: 'Privacy & Data Consent',
    description: 'Consent for data collection, storage, and processing',
    icon: Shield,
    template: `I, [RECIPIENT_NAME], hereby consent to the collection, storage, and processing of my personal data within the Secure Legacy Vault™ system. I understand that:

1. My data will be encrypted and stored securely
2. Access is limited to authorized vault members only  
3. I can revoke this consent at any time
4. My data will be handled in accordance with applicable privacy laws

By signing below, I acknowledge that I have read and understood this consent agreement.`
  },
  {
    value: 'access_agreement',
    label: 'Vault Access Agreement',
    description: 'Terms and conditions for vault access and usage',
    icon: Users,
    template: `This Vault Access Agreement grants [RECIPIENT_NAME] access to the Secure Legacy Vault™ with the following terms:

1. Access Level: [ACCESS_LEVEL]
2. Permitted Actions: [PERMITTED_ACTIONS]
3. Confidentiality: All information accessed must remain confidential
4. Compliance: Must comply with all vault policies and procedures
5. Audit: All activities may be logged and audited

I agree to these terms and conditions for vault access.`
  },
  {
    value: 'fiduciary_terms',
    label: 'Fiduciary Terms & Conditions',
    description: 'Fiduciary responsibilities and obligations',
    icon: FileCheck,
    template: `As a fiduciary with access to the Secure Legacy Vault™, [RECIPIENT_NAME] acknowledges:

1. Fiduciary Duty: To act in the best interests of the beneficiaries
2. Confidentiality: To maintain strict confidentiality of all information
3. Record Keeping: To maintain accurate records of all activities
4. Compliance: To comply with all applicable laws and regulations
5. Reporting: To provide regular updates as required

I accept these fiduciary responsibilities.`
  },
  {
    value: 'data_sharing',
    label: 'Data Sharing Agreement',
    description: 'Terms for sharing vault data with third parties',
    icon: Users,
    template: `This Data Sharing Agreement authorizes the sharing of specific vault data with [RECIPIENT_NAME] for the following purposes:

1. Purpose: [DATA_SHARING_PURPOSE]
2. Data Types: [SPECIFIC_DATA_TYPES]
3. Duration: [SHARING_DURATION]
4. Security: Data must be protected with appropriate security measures
5. Limitations: Data may only be used for authorized purposes

I consent to this data sharing arrangement.`
  }
];

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  signed: 'bg-emerald-100 text-emerald-700',
  declined: 'bg-red-100 text-red-700',
  expired: 'bg-gray-100 text-gray-700'
};

const statusIcons = {
  pending: Clock,
  signed: CheckCircle,
  declined: XCircle,
  expired: AlertTriangle
};

export const AgreementWorkflowManager: React.FC<AgreementWorkflowManagerProps> = ({
  vaultId,
  onWorkflowChange
}) => {
  const { t } = useTranslation();
  const [workflows, setWorkflows] = useState<AgreementWorkflow[]>([]);
  const [editingWorkflow, setEditingWorkflow] = useState<AgreementWorkflow | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('privacy_consent');

  const defaultWorkflow: Omit<AgreementWorkflow, 'id'> = {
    workflowType: 'privacy_consent',
    recipientEmail: '',
    recipientName: '',
    templateContent: '',
    signatureStatus: 'pending',
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    remindersSent: 0
  };

  const createWorkflow = () => {
    const template = workflowTypes.find(t => t.value === selectedTemplate);
    const newWorkflow: AgreementWorkflow = {
      ...defaultWorkflow,
      id: Math.random().toString(36).substring(7),
      workflowType: selectedTemplate as any,
      templateContent: template?.template || ''
    };
    setEditingWorkflow(newWorkflow);
    setShowForm(true);
  };

  const editWorkflow = (workflow: AgreementWorkflow) => {
    setEditingWorkflow({ ...workflow });
    setShowForm(true);
  };

  const saveWorkflow = () => {
    if (!editingWorkflow) return;

    const isNew = !workflows.find(w => w.id === editingWorkflow.id);
    
    let updatedWorkflows;
    if (isNew) {
      updatedWorkflows = [...workflows, editingWorkflow];
    } else {
      updatedWorkflows = workflows.map(w => 
        w.id === editingWorkflow.id ? editingWorkflow : w
      );
    }
    
    setWorkflows(updatedWorkflows);
    onWorkflowChange?.(updatedWorkflows);
    setShowForm(false);
    setEditingWorkflow(null);
  };

  const deleteWorkflow = (id: string) => {
    const updatedWorkflows = workflows.filter(w => w.id !== id);
    setWorkflows(updatedWorkflows);
    onWorkflowChange?.(updatedWorkflows);
  };

  const sendWorkflow = (id: string) => {
    const updatedWorkflows = workflows.map(w => 
      w.id === id 
        ? { 
            ...w, 
            sentAt: new Date().toISOString(),
            signatureStatus: 'pending' as const
          }
        : w
    );
    setWorkflows(updatedWorkflows);
    onWorkflowChange?.(updatedWorkflows);
  };

  const sendReminder = (id: string) => {
    const updatedWorkflows = workflows.map(w => 
      w.id === id 
        ? { 
            ...w, 
            remindersSent: w.remindersSent + 1,
            lastReminderAt: new Date().toISOString()
          }
        : w
    );
    setWorkflows(updatedWorkflows);
    onWorkflowChange?.(updatedWorkflows);
  };

  const getCompletionRate = () => {
    if (workflows.length === 0) return 0;
    const signed = workflows.filter(w => w.signatureStatus === 'signed').length;
    return (signed / workflows.length) * 100;
  };

  return (
    <div className="space-y-6 relative">
      <VaultWatermark />
      <PatentPendingBadge />
      
      <Card className="premium-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-primary" />
                {t('vault.agreements.title', 'Digital Consent & Agreement Workflows')}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {t('vault.agreements.description', 'Manage digital agreements and consent workflows for vault access')}
              </p>
            </div>
            <Button onClick={createWorkflow} className="touch-target">
              <Plus className="h-4 w-4 mr-2" />
              {t('vault.agreements.create', 'Create Agreement')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Overview Stats */}
          {workflows.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Agreements</p>
                    <p className="text-2xl font-bold">{workflows.length}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Signed</p>
                    <p className="text-2xl font-bold">
                      {workflows.filter(w => w.signatureStatus === 'signed').length}
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold">
                      {workflows.filter(w => w.signatureStatus === 'pending').length}
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Completion Rate</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{Math.round(getCompletionRate())}%</span>
                    </div>
                    <Progress value={getCompletionRate()} className="h-2" />
                  </div>
                </div>
              </Card>
            </div>
          )}

          {workflows.length === 0 && !showForm ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">
                {t('vault.agreements.empty', 'No agreement workflows configured')}
              </p>
              <p className="text-sm">
                {t('vault.agreements.emptyDescription', 'Create digital agreements to manage consent and access permissions')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {workflows.map((workflow) => {
                const workflowType = workflowTypes.find(t => t.value === workflow.workflowType);
                const StatusIcon = statusIcons[workflow.signatureStatus];
                const TypeIcon = workflowType?.icon || FileCheck;
                
                return (
                  <Card key={workflow.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <TypeIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{workflowType?.label}</h3>
                            <Badge className={statusColors[workflow.signatureStatus]}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {workflow.signatureStatus}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>To: {workflow.recipientName} ({workflow.recipientEmail})</p>
                            <p>Expires: {new Date(workflow.expiresAt).toLocaleDateString()}</p>
                            {workflow.sentAt && (
                              <p>Sent: {new Date(workflow.sentAt).toLocaleDateString()}</p>
                            )}
                            {workflow.signedAt && (
                              <p>Signed: {new Date(workflow.signedAt).toLocaleDateString()}</p>
                            )}
                            {workflow.remindersSent > 0 && (
                              <p>Reminders sent: {workflow.remindersSent}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {workflow.signatureStatus === 'pending' && !workflow.sentAt && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => sendWorkflow(workflow.id)}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Send
                          </Button>
                        )}
                        
                        {workflow.signatureStatus === 'pending' && workflow.sentAt && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => sendReminder(workflow.id)}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Remind
                          </Button>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => editWorkflow(workflow)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteWorkflow(workflow.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Form */}
      {showForm && editingWorkflow && (
        <Card className="premium-card">
          <CardHeader>
            <CardTitle>
              {workflows.find(w => w.id === editingWorkflow.id) 
                ? t('vault.agreements.edit', 'Edit Agreement') 
                : t('vault.agreements.create', 'Create Agreement')
              }
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Agreement Type Selection */}
            <div>
              <Label>Agreement Type</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {workflowTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div
                      key={type.value}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        editingWorkflow.workflowType === type.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => {
                        setEditingWorkflow({
                          ...editingWorkflow,
                          workflowType: type.value as any,
                          templateContent: type.template
                        });
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <span className="font-medium">{type.label}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {type.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Recipient Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="recipientName">Recipient Name</Label>
                <Input
                  id="recipientName"
                  value={editingWorkflow.recipientName}
                  onChange={(e) => setEditingWorkflow({
                    ...editingWorkflow,
                    recipientName: e.target.value
                  })}
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <Label htmlFor="recipientEmail">Recipient Email</Label>
                <Input
                  id="recipientEmail"
                  type="email"
                  value={editingWorkflow.recipientEmail}
                  onChange={(e) => setEditingWorkflow({
                    ...editingWorkflow,
                    recipientEmail: e.target.value
                  })}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="expiresAt">Expiration Date</Label>
              <Input
                id="expiresAt"
                type="date"
                value={editingWorkflow.expiresAt.split('T')[0]}
                onChange={(e) => setEditingWorkflow({
                  ...editingWorkflow,
                  expiresAt: new Date(e.target.value).toISOString()
                })}
              />
            </div>

            <Separator />

            {/* Agreement Template */}
            <div>
              <Label htmlFor="templateContent">Agreement Template</Label>
              <Textarea
                id="templateContent"
                value={editingWorkflow.templateContent}
                onChange={(e) => setEditingWorkflow({
                  ...editingWorkflow,
                  templateContent: e.target.value
                })}
                rows={12}
                className="font-mono text-sm"
                placeholder="Enter the agreement template content..."
              />
              <p className="text-xs text-muted-foreground mt-2">
                Use placeholders like [RECIPIENT_NAME], [ACCESS_LEVEL], etc. which will be replaced when sent.
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditingWorkflow(null);
                }}
              >
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button onClick={saveWorkflow}>
                {t('common.save', 'Save Agreement')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};