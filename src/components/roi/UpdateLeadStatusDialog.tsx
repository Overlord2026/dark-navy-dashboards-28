import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useROIData } from '@/hooks/useROIData';

interface Lead {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  stage: string;
  source?: string;
  revenue?: number;
  ltv?: number;
  days_to_close?: number;
  notes?: string;
}

interface UpdateLeadStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  onLeadUpdated?: () => void;
}

const LEAD_STAGES = [
  { value: 'lead', label: 'New Lead' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'appt1', label: 'First Appointment Set' },
  { value: 'appt2', label: 'Second Appointment' },
  { value: 'appt3', label: 'Third Appointment' },
  { value: 'proposal', label: 'Proposal Sent' },
  { value: 'closed', label: 'Closed Won' },
  { value: 'lost', label: 'Closed Lost' },
];

export function UpdateLeadStatusDialog({ 
  open, 
  onOpenChange, 
  lead, 
  onLeadUpdated 
}: UpdateLeadStatusDialogProps) {
  const { toast } = useToast();
  const { updateLeadStatus, loading } = useROIData();
  const [formData, setFormData] = useState({
    stage: '',
    revenue: '',
    ltv: '',
    days_to_close: '',
    notes: '',
  });

  // Update form when lead changes
  useEffect(() => {
    if (lead) {
      setFormData({
        stage: lead.stage || '',
        revenue: lead.revenue?.toString() || '',
        ltv: lead.ltv?.toString() || '',
        days_to_close: lead.days_to_close?.toString() || '',
        notes: lead.notes || '',
      });
    }
  }, [lead]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lead || !formData.stage) {
      toast({
        title: "Missing Information",
        description: "Please select a lead stage.",
        variant: "destructive",
      });
      return;
    }

    try {
      const updates: Partial<Lead> = {
        stage: formData.stage,
        notes: formData.notes,
      };

      // Add financial data if provided
      if (formData.revenue) {
        updates.revenue = parseFloat(formData.revenue);
      }
      if (formData.ltv) {
        updates.ltv = parseFloat(formData.ltv);
      }
      if (formData.days_to_close) {
        updates.days_to_close = parseInt(formData.days_to_close);
      }

      await updateLeadStatus(lead.id, updates);
      
      onLeadUpdated?.();
      onOpenChange(false);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const isClosedStage = formData.stage === 'closed' || formData.stage === 'lost';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Lead Status</DialogTitle>
          <DialogDescription>
            {lead && `Update the status and details for ${lead.first_name} ${lead.last_name}`}
          </DialogDescription>
        </DialogHeader>
        
        {lead && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Lead Info Summary */}
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{lead.first_name} {lead.last_name}</h4>
                  <p className="text-sm text-muted-foreground">{lead.email}</p>
                  {lead.phone && (
                    <p className="text-sm text-muted-foreground">{lead.phone}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Source</p>
                  <p className="text-sm font-medium capitalize">{lead.source || 'Unknown'}</p>
                </div>
              </div>
            </div>

            {/* Stage Selection */}
            <div className="space-y-2">
              <Label htmlFor="stage">Lead Stage *</Label>
              <Select 
                value={formData.stage} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, stage: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select new stage" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  {LEAD_STAGES.map((stage) => (
                    <SelectItem key={stage.value} value={stage.value}>
                      {stage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Financial Fields - Show when closing deals */}
            {isClosedStage && formData.stage === 'closed' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="revenue">Initial Revenue ($)</Label>
                    <Input 
                      id="revenue" 
                      type="number" 
                      placeholder="8000" 
                      step="0.01"
                      value={formData.revenue}
                      onChange={(e) => setFormData(prev => ({ ...prev, revenue: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ltv">Lifetime Value ($)</Label>
                    <Input 
                      id="ltv" 
                      type="number" 
                      placeholder="25000" 
                      step="0.01"
                      value={formData.ltv}
                      onChange={(e) => setFormData(prev => ({ ...prev, ltv: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="days_to_close">Days to Close</Label>
                  <Input 
                    id="days_to_close" 
                    type="number" 
                    placeholder="45"
                    value={formData.days_to_close}
                    onChange={(e) => setFormData(prev => ({ ...prev, days_to_close: e.target.value }))}
                  />
                </div>
              </>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea 
                id="notes" 
                placeholder="Add notes about this status update..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Status'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}