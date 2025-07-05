import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, PiggyBank } from 'lucide-react';
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
      <DialogContent className={cn("sm:max-w-[550px] p-0 overflow-hidden bg-card border border-border/50 shadow-2xl", isMobile && "mx-4")}>
        <div className="relative">
          {/* Header with gradient background */}
          <div className="relative px-8 py-5 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent border-b border-border/30">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-50" />
            <DialogHeader className="relative">
              <div className="flex items-center gap-4">
                {onBack && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="p-2 rounded-full hover:bg-primary/10 transition-all duration-300"
                  >
                    <ArrowLeft className="h-4 w-4 text-foreground" />
                  </Button>
                )}
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <PiggyBank className="h-6 w-6" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-semibold text-foreground tracking-tight">
                      Add Retirement Plan
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Set up your retirement savings account
                    </p>
                  </div>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Form content */}
          <div className="p-7">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="plan_type" className="text-base font-medium text-foreground">Plan Type</Label>
                <Select
                  value={formData.plan_type}
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, plan_type: value }))}
                >
                  <SelectTrigger className="h-12 border-border/50 bg-background hover:border-primary/30 transition-colors duration-200">
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

              <div className="space-y-3">
                <Label htmlFor="provider" className="text-base font-medium text-foreground">Provider</Label>
                <Input
                  id="provider"
                  placeholder="e.g., Fidelity, Vanguard, Charles Schwab"
                  value={formData.provider}
                  onChange={(e) => setFormData(prev => ({ ...prev, provider: e.target.value }))}
                  className="h-12 border-border/50 bg-background hover:border-primary/30 focus:border-primary/50 transition-colors duration-200"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="balance" className="text-base font-medium text-foreground">Current Balance</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="balance"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.balance}
                    onChange={(e) => setFormData(prev => ({ ...prev, balance: parseFloat(e.target.value) || 0 }))}
                    className="h-12 pl-8 border-border/50 bg-background hover:border-primary/30 focus:border-primary/50 transition-colors duration-200"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="source" className="text-base font-medium text-foreground">Contribution Source</Label>
                <Select
                  value={formData.source}
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, source: value }))}
                >
                  <SelectTrigger className="h-12 border-border/50 bg-background hover:border-primary/30 transition-colors duration-200">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="contribution_amount" className="text-base font-medium text-foreground">
                    Monthly Contribution <span className="text-muted-foreground text-sm font-normal">(Optional)</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
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
                      className="h-12 pl-8 border-border/50 bg-background hover:border-primary/30 focus:border-primary/50 transition-colors duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="vesting_schedule" className="text-base font-medium text-foreground">
                    Vesting Schedule <span className="text-muted-foreground text-sm font-normal">(Optional)</span>
                  </Label>
                  <Input
                    id="vesting_schedule"
                    placeholder="e.g., 20% per year over 5 years"
                    value={formData.vesting_schedule || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, vesting_schedule: e.target.value }))}
                    className="h-12 border-border/50 bg-background hover:border-primary/30 focus:border-primary/50 transition-colors duration-200"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-5 border-t border-border/30">
                <div className={cn("flex gap-3", isMobile ? "flex-col" : "flex-row justify-end")}>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleBack}
                    className={cn(
                      "h-12 px-6 border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200",
                      isMobile && "w-full"
                    )}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={saving || !formData.provider.trim()}
                    className={cn(
                      "h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200",
                      "shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30",
                      isMobile && "w-full"
                    )}
                  >
                    {saving ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Adding Plan...
                      </div>
                    ) : (
                      'Add Retirement Plan'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};