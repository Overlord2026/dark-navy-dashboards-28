import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FeeTier {
  breakpoint: number;
  advisory_bps: number;
  platform_bps: number;
  fund_bps: number;
  trading_flat: number;
}

interface FeeModel {
  id?: string;
  name: string;
  description: string;
  tiers: FeeTier[];
  default_model: boolean;
}

interface FeeModelEditorProps {
  model?: FeeModel;
  onSave: (model: FeeModel) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const FeeModelEditor: React.FC<FeeModelEditorProps> = ({
  model,
  onSave,
  onCancel,
  isLoading = false
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FeeModel>(
    model || {
      name: '',
      description: '',
      tiers: [{ breakpoint: 0, advisory_bps: 0, platform_bps: 0, fund_bps: 0, trading_flat: 0 }],
      default_model: false
    }
  );

  const addTier = () => {
    const lastTier = formData.tiers[formData.tiers.length - 1];
    const newBreakpoint = lastTier ? lastTier.breakpoint + 1000000 : 0;
    
    setFormData(prev => ({
      ...prev,
      tiers: [...prev.tiers, { 
        breakpoint: newBreakpoint, 
        advisory_bps: 0, 
        platform_bps: 0, 
        fund_bps: 0, 
        trading_flat: 0 
      }]
    }));
  };

  const removeTier = (index: number) => {
    if (formData.tiers.length === 1) {
      toast({
        title: "Cannot Remove",
        description: "At least one tier is required.",
        variant: "destructive"
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      tiers: prev.tiers.filter((_, i) => i !== index)
    }));
  };

  const updateTier = (index: number, field: keyof FeeTier, value: number) => {
    setFormData(prev => ({
      ...prev,
      tiers: prev.tiers.map((tier, i) => 
        i === index ? { ...tier, [field]: value } : tier
      )
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Model name is required.",
        variant: "destructive"
      });
      return false;
    }

    // Check for duplicate breakpoints
    const breakpoints = formData.tiers.map(t => t.breakpoint);
    const uniqueBreakpoints = [...new Set(breakpoints)];
    if (breakpoints.length !== uniqueBreakpoints.length) {
      toast({
        title: "Validation Error",
        description: "Breakpoints must be unique.",
        variant: "destructive"
      });
      return false;
    }

    // Check that breakpoints are in ascending order
    for (let i = 1; i < formData.tiers.length; i++) {
      if (formData.tiers[i].breakpoint <= formData.tiers[i - 1].breakpoint) {
        toast({
          title: "Validation Error",
          description: "Breakpoints must be in ascending order.",
          variant: "destructive"
        });
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    // Sort tiers by breakpoint before saving
    const sortedTiers = [...formData.tiers].sort((a, b) => a.breakpoint - b.breakpoint);
    
    try {
      await onSave({
        ...formData,
        tiers: sortedTiers
      });
      
      toast({
        title: "Success",
        description: "Fee model saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save fee model.",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>
          {model ? 'Edit Fee Model' : 'Create Fee Model'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Model Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., BFO Standard"
            />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="default_model"
              checked={formData.default_model}
              onChange={(e) => setFormData(prev => ({ ...prev, default_model: e.target.checked }))}
              className="h-4 w-4"
            />
            <Label htmlFor="default_model">Default Model</Label>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Brief description of this fee model..."
            rows={3}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Fee Tiers</h3>
            <Button type="button" onClick={addTier} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Tier
            </Button>
          </div>

          <div className="space-y-4">
            {formData.tiers.map((tier, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">
                    Tier {index + 1} {index === 0 ? '(Base)' : `(${formatCurrency(tier.breakpoint)}+)`}
                  </h4>
                  {formData.tiers.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeTier(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid md:grid-cols-5 gap-3">
                  <div>
                    <Label className="text-xs">Breakpoint ($)</Label>
                    <Input
                      type="number"
                      value={tier.breakpoint}
                      onChange={(e) => updateTier(index, 'breakpoint', parseInt(e.target.value) || 0)}
                      disabled={index === 0}
                      min="0"
                      step="1000"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Advisory (bps)</Label>
                    <Input
                      type="number"
                      value={tier.advisory_bps}
                      onChange={(e) => updateTier(index, 'advisory_bps', parseFloat(e.target.value) || 0)}
                      min="0"
                      max="1000"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Platform (bps)</Label>
                    <Input
                      type="number"
                      value={tier.platform_bps}
                      onChange={(e) => updateTier(index, 'platform_bps', parseFloat(e.target.value) || 0)}
                      min="0"
                      max="1000"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Fund (bps)</Label>
                    <Input
                      type="number"
                      value={tier.fund_bps}
                      onChange={(e) => updateTier(index, 'fund_bps', parseFloat(e.target.value) || 0)}
                      min="0"
                      max="1000"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Trading ($/mo)</Label>
                    <Input
                      type="number"
                      value={tier.trading_flat}
                      onChange={(e) => updateTier(index, 'trading_flat', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-6">
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Model'}
          </Button>
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};