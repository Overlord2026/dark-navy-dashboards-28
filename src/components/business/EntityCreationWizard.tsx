import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, FileText, Calendar } from 'lucide-react';
import { useEntityManagement, BusinessEntity } from '@/hooks/useEntityManagement';

interface EntityCreationWizardProps {
  open: boolean;
  onClose: () => void;
}

const ENTITY_TYPES = [
  {
    type: 'LLC' as const,
    name: 'Limited Liability Company',
    description: 'Flexible business structure with pass-through taxation',
    icon: Building2,
    benefits: ['Personal asset protection', 'Tax flexibility', 'Simple management structure']
  },
  {
    type: 'Corporation' as const,
    name: 'C-Corporation',
    description: 'Traditional corporate structure with double taxation',
    icon: Building2,
    benefits: ['Strong liability protection', 'Easier to raise capital', 'Perpetual existence']
  },
  {
    type: 'S-Corporation' as const,
    name: 'S-Corporation',
    description: 'Corporation with pass-through taxation',
    icon: Building2,
    benefits: ['No double taxation', 'Self-employment tax savings', 'Investment opportunities']
  },
  {
    type: 'Trust' as const,
    name: 'Trust',
    description: 'Fiduciary arrangement for asset management',
    icon: Users,
    benefits: ['Estate planning benefits', 'Tax advantages', 'Asset protection']
  },
  {
    type: 'Nonprofit' as const,
    name: 'Nonprofit Organization',
    description: 'Tax-exempt organization for charitable purposes',
    icon: FileText,
    benefits: ['Tax exemption', 'Grant eligibility', 'Public trust']
  },
  {
    type: 'Partnership' as const,
    name: 'Partnership',
    description: 'Business owned by two or more partners',
    icon: Users,
    benefits: ['Pass-through taxation', 'Shared responsibilities', 'Flexible profit sharing']
  }
];

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
];

export const EntityCreationWizard = ({ open, onClose }: EntityCreationWizardProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<BusinessEntity>>({
    entity_type: 'LLC',
    status: 'active'
  });
  const { createEntity } = useEntityManagement();

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    if (!formData.entity_name || !formData.entity_type || !formData.jurisdiction) {
      return;
    }

    const result = await createEntity(formData as Omit<BusinessEntity, 'id' | 'user_id' | 'created_at' | 'updated_at'>);
    if (result) {
      onClose();
      setStep(1);
      setFormData({ entity_type: 'LLC', status: 'active' });
    }
  };

  const selectedEntityType = ENTITY_TYPES.find(et => et.type === formData.entity_type);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Business Entity</DialogTitle>
          <DialogDescription>
            Step {step} of 3: Let's set up your new business entity with all the required information.
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Choose Entity Type</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {ENTITY_TYPES.map((entityType) => {
                  const Icon = entityType.icon;
                  return (
                    <Card
                      key={entityType.type}
                      className={`cursor-pointer transition-colors ${
                        formData.entity_type === entityType.type
                          ? 'border-primary bg-primary/5'
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, entity_type: entityType.type }))}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Icon className="h-5 w-5" />
                          {entityType.name}
                        </CardTitle>
                        <CardDescription>{entityType.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {entityType.benefits.map((benefit, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleNext} disabled={!formData.entity_type}>
                Next: Basic Information
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="entity_name">Entity Name *</Label>
                  <Input
                    id="entity_name"
                    value={formData.entity_name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, entity_name: e.target.value }))}
                    placeholder={`Enter ${selectedEntityType?.name} name`}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="jurisdiction">Jurisdiction *</Label>
                    <Select
                      value={formData.jurisdiction || ''}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, jurisdiction: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="formation_date">Formation Date</Label>
                    <Input
                      id="formation_date"
                      type="date"
                      value={formData.formation_date || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, formation_date: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="ein">EIN (Tax ID)</Label>
                  <Input
                    id="ein"
                    value={formData.ein || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, ein: e.target.value }))}
                    placeholder="XX-XXXXXXX"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the entity's purpose and activities"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext} disabled={!formData.entity_name || !formData.jurisdiction}>
                Next: Address Information
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Address Information</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Registered Address</h4>
                  <div className="grid gap-2">
                    <Input
                      placeholder="Street Address"
                      value={formData.registered_address?.street || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        registered_address: { ...prev.registered_address, street: e.target.value }
                      }))}
                    />
                    <div className="grid gap-2 md:grid-cols-3">
                      <Input
                        placeholder="City"
                        value={formData.registered_address?.city || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          registered_address: { ...prev.registered_address, city: e.target.value }
                        }))}
                      />
                      <Input
                        placeholder="State"
                        value={formData.registered_address?.state || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          registered_address: { ...prev.registered_address, state: e.target.value }
                        }))}
                      />
                      <Input
                        placeholder="ZIP Code"
                        value={formData.registered_address?.zip || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          registered_address: { ...prev.registered_address, zip: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Mailing Address</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      id="same_address"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            mailing_address: prev.registered_address
                          }));
                        }
                      }}
                    />
                    <Label htmlFor="same_address" className="text-sm">
                      Same as registered address
                    </Label>
                  </div>
                  <div className="grid gap-2">
                    <Input
                      placeholder="Street Address"
                      value={formData.mailing_address?.street || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        mailing_address: { ...prev.mailing_address, street: e.target.value }
                      }))}
                    />
                    <div className="grid gap-2 md:grid-cols-3">
                      <Input
                        placeholder="City"
                        value={formData.mailing_address?.city || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          mailing_address: { ...prev.mailing_address, city: e.target.value }
                        }))}
                      />
                      <Input
                        placeholder="State"
                        value={formData.mailing_address?.state || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          mailing_address: { ...prev.mailing_address, state: e.target.value }
                        }))}
                      />
                      <Input
                        placeholder="ZIP Code"
                        value={formData.mailing_address?.zip || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          mailing_address: { ...prev.mailing_address, zip: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleSubmit}>
                Create Entity
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};