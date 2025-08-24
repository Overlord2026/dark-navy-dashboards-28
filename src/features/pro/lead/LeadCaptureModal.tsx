import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { LeadModel } from './LeadModel';
import { ProPersona, ConsentScope } from '../types';
import { recordConsentRDS } from '../compliance/ConsentTracker';
import { toast } from 'sonner';

interface LeadCaptureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  persona: ProPersona;
  onLeadCreated?: (leadId: string) => void;
}

const PERSONA_LABELS = {
  advisor: 'Financial Advisory',
  cpa: 'Tax & Accounting',
  attorney: 'Legal Services',
  insurance: 'Insurance Services',
  healthcare: 'Healthcare Services',
  realtor: 'Real Estate Services'
};

const CONSENT_LABELS = {
  advisor: 'I consent to being contacted about financial advisory services and related communications',
  cpa: 'I agree to be contacted regarding tax services.',
  attorney: 'I agree to be contacted regarding legal services; no attorney-client relationship is created by this communication.',
  insurance: 'I agree to be contacted regarding insurance products; I understand state licensing applies.',
  healthcare: 'I consent to be contacted about wellness/health services; HIPAA authorization may be required for records.',
  realtor: 'I agree to be contacted regarding real estate services.'
};

export function LeadCaptureModal({ open, onOpenChange, persona, onLeadCreated }: LeadCaptureModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tagInput: '',
    consentGiven: false
  });
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTag = () => {
    const tag = formData.tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setFormData(prev => ({ ...prev, tagInput: '' }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error('Name and email are required');
      return;
    }

    if (!formData.consentGiven) {
      toast.error('Consent is required to capture lead');
      return;
    }

    setIsSubmitting(true);

    try {
      // Record consent receipt
      const consentScope: ConsentScope = {
        contact: true,
        marketing: true,
        analytics: false,
        third_party_sharing: false
      };

      const consentReceipt = recordConsentRDS({
        persona,
        scope: consentScope,
        ttlDays: 90,
        purpose: 'lead_outreach',
        result: 'approve'
      });

      // Create lead
      const lead = LeadModel.create({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        tags,
        persona,
        status: 'new',
        consent_given: true,
        consent_receipt_id: consentReceipt.inputs_hash,
        // UTM tracking from URL params
        utm_source: new URLSearchParams(window.location.search).get('utm_source') || undefined,
        utm_medium: new URLSearchParams(window.location.search).get('utm_medium') || undefined,
        utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign') || undefined,
      });

      toast.success('Lead captured successfully!');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        tagInput: '',
        consentGiven: false
      });
      setTags([]);
      
      onLeadCreated?.(lead.id);
      onOpenChange(false);

    } catch (error) {
      console.error('Error capturing lead:', error);
      toast.error('Failed to capture lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Capture New Lead - {PERSONA_LABELS[persona]}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Enter phone number"
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={formData.tagInput}
                onChange={(e) => setFormData(prev => ({ ...prev, tagInput: e.target.value }))}
                placeholder="Add tag..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" onClick={handleAddTag} size="icon" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="consent"
                checked={formData.consentGiven}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, consentGiven: !!checked }))
                }
              />
              <Label htmlFor="consent" className="text-sm leading-relaxed">
                {CONSENT_LABELS[persona]}
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              This consent is valid for 90 days and creates a compliance receipt for audit purposes.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Capturing...' : 'Capture Lead'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}