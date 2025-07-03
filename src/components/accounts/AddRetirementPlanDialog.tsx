import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { useRetirementPlans, RetirementPlanData } from '@/hooks/useRetirementPlans';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface AddRetirementPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack?: () => void;
}

export const AddRetirementPlanDialog = ({ 
  open, 
  onOpenChange, 
  onBack 
}: AddRetirementPlanDialogProps) => {
  const { addPlan, saving } = useRetirementPlans();
  const isMobile = useIsMobile();
  
  const [formData, setFormData] = useState<RetirementPlanData>({
    plan_type: '401k',
    provider: '',
    balance: 0,
    source: 'pre_tax',
    contribution_amount: undefined,
    vesting_schedule: '',
  });

  const planTypeOptions = [
    { value: '401k', label: '401(k)' },
    { value: '403b', label: '403(b)' },
    { value: '457b', label: '457(b)' },
  ];

  const sourceOptions = [
    { value: 'pre_tax', label: 'Pre-tax' },
    { value: 'roth', label: 'Roth' },
    { value: 'match', label: 'Match' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.provider.trim()) {
      return;
    }

    const submitData: RetirementPlanData = {
      ...formData,
      vesting_schedule: formData.vesting_schedule?.trim() || undefined,
    };

    const success = await addPlan(submitData);
    if (success) {
      setFormData({
        plan_type: '401k',
        provider: '',
        balance: 0,
        source: 'pre_tax',
        contribution_amount: undefined,
        vesting_schedule: '',
      });
      onOpenChange(false);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-[425px]", isMobile && "mx-4")}>
        <DialogHeader>
          <div className="flex items-center gap-2">
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="p-1"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle>Add Retirement Plan</DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plan_type">Type</Label>
            <Select
              value={formData.plan_type}
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, plan_type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {planTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="provider">Provider</Label>
            <Input
              id="provider"
              placeholder="e.g., Fidelity, Vanguard"
              value={formData.provider}
              onChange={(e) => setFormData(prev => ({ ...prev, provider: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance">Balance</Label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.balance}
              onChange={(e) => setFormData(prev => ({ ...prev, balance: parseFloat(e.target.value) || 0 }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Select
              value={formData.source}
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, source: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sourceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contribution_amount">Contribution Amount (Optional)</Label>
            <Input
              id="contribution_amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.contribution_amount || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                contribution_amount: e.target.value ? parseFloat(e.target.value) : undefined 
              }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vesting_schedule">Vesting Schedule (Optional)</Label>
            <Input
              id="vesting_schedule"
              placeholder="e.g., 20% per year over 5 years"
              value={formData.vesting_schedule || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, vesting_schedule: e.target.value }))}
            />
          </div>

          <div className={cn("flex gap-2", isMobile ? "flex-col" : "flex-row justify-end")}>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleBack}
              className={cn(isMobile && "w-full")}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={saving || !formData.provider.trim()}
              className={cn(isMobile && "w-full")}
            >
              {saving ? 'Adding...' : 'Add Plan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};