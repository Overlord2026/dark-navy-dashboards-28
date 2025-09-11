import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { recordReceipt } from '@/features/receipts/record';
import { anchorBatch } from '@/features/anchor/providers';
import * as Canonical from '@/lib/canonical';
import { toast } from 'sonner';
import type { DecisionRDS } from '@/features/receipts/types';

interface GuardianCosignModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: 'offer' | 'education';
  contextData?: any;
  onSuccess?: () => void;
}

export function GuardianCosignModal({ 
  isOpen, 
  onClose, 
  context, 
  contextData = {},
  onSuccess 
}: GuardianCosignModalProps) {
  const [formData, setFormData] = useState({
    guardianName: '',
    guardianEmail: '',
    relation: '',
    consentAcknowledged: false,
    additionalNotes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const createCosignReceipt = async (action: 'request' | 'approve'): Promise<DecisionRDS> => {
    const baseData = {
      context,
      guardian: formData.guardianName,
      relation: formData.relation,
      ...contextData
    };

    const inputs_hash = await Canonical.hash(baseData);
    const shouldAnchor = Math.random() > 0.5; // Demo: randomly anchor some receipts

    const receipt: DecisionRDS = {
      id: `rds_cosign_${action}_${Date.now()}`,
      type: 'Decision-RDS',
      action: `cosign.${action}`,
      policy_version: 'NIL-2025.01',
      inputs_hash,
      reasons: action === 'request' ? ['MINOR_COSIGN_REQUIRED'] : ['GUARDIAN_APPROVAL_GRANTED'],
      result: 'approve',
      anchor_ref: shouldAnchor ? await anchorBatch(inputs_hash).catch(() => null) : null,
      ts: new Date().toISOString()
    };

    recordReceipt(receipt);
    return receipt;
  };

  const handleRequestCosign = async () => {
    if (!formData.guardianName || !formData.guardianEmail || !formData.relation) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Create request receipt
      await createCosignReceipt('request');
      
      toast.success('Co-sign request sent', {
        description: `Request sent to ${formData.guardianName} (${formData.guardianEmail})`
      });

      // Demo: Auto-approve after short delay to show the flow
      setTimeout(async () => {
        try {
          await createCosignReceipt('approve');
          toast.success('Guardian approval received', {
            description: 'Co-sign completed successfully'
          });
          onSuccess?.();
        } catch (error) {
          console.error('Failed to create approval receipt:', error);
        }
      }, 2000);

      onClose();
    } catch (error) {
      console.error('Failed to request co-sign:', error);
      toast.error('Failed to send co-sign request');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.guardianName && 
                     formData.guardianEmail && 
                     formData.relation && 
                     formData.consentAcknowledged;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Guardian Co-Sign Required"
      size="md"
    >
      <div className="space-y-6">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h4 className="text-blue-400 font-medium mb-2">Minor Protection Notice</h4>
          <p className="text-sm text-white/70">
            As a minor athlete, guardian approval is required for {context === 'offer' ? 'NIL offers' : 'compliance training completion'}.
            This ensures proper oversight and protection.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="guardianName" className="text-white">Guardian Full Name *</Label>
            <Input
              id="guardianName"
              value={formData.guardianName}
              onChange={(e) => handleInputChange('guardianName', e.target.value)}
              placeholder="Enter guardian's full name"
              className="bg-[#24313d] border-bfo-gold/40 text-white"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="guardianEmail" className="text-white">Guardian Email *</Label>
            <Input
              id="guardianEmail"
              type="email"
              value={formData.guardianEmail}
              onChange={(e) => handleInputChange('guardianEmail', e.target.value)}
              placeholder="guardian@example.com"
              className="bg-[#24313d] border-bfo-gold/40 text-white"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="relation" className="text-white">Relationship *</Label>
            <Select value={formData.relation} onValueChange={(value) => handleInputChange('relation', value)}>
              <SelectTrigger className="bg-[#24313d] border-bfo-gold/40 text-white">
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="legal_guardian">Legal Guardian</SelectItem>
                <SelectItem value="coach">Coach/Athletic Director</SelectItem>
                <SelectItem value="agent">Authorized Agent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="additionalNotes" className="text-white">Additional Notes (Optional)</Label>
            <Textarea
              id="additionalNotes"
              value={formData.additionalNotes}
              onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
              placeholder="Any additional context or notes..."
              className="bg-[#24313d] border-bfo-gold/40 text-white resize-none"
              rows={3}
            />
          </div>

          <div className="flex items-start space-x-3 p-4 bg-[#24313d]/50 rounded-lg border border-bfo-gold/20">
            <Checkbox
              id="consent"
              checked={formData.consentAcknowledged}
              onCheckedChange={(checked) => handleInputChange('consentAcknowledged', checked)}
              className="border-bfo-gold/40 data-[state=checked]:bg-bfo-gold data-[state=checked]:border-bfo-gold"
            />
            <div className="flex-1">
              <Label 
                htmlFor="consent" 
                className="text-sm text-white cursor-pointer leading-relaxed"
              >
                I acknowledge that this co-sign request will be sent to the specified guardian for approval. 
                The guardian will receive notification and must approve before proceeding with this {context} action.
              </Label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-bfo-gold/20">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleRequestCosign}
            disabled={!isFormValid || loading}
            className="bg-bfo-gold hover:bg-bfo-gold/80 text-bfo-black font-medium"
          >
            {loading ? 'Sending...' : 'Send for Co-Sign'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}