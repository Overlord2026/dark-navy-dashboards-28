import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Provider {
  id: string;
  provider_name: string;
  approved_states: string[];
}

interface BarStatus {
  id: string;
  state: string;
  bar_number: string;
}

interface AddCLERecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordAdded: () => void;
  providers: Provider[];
  barStatuses: BarStatus[];
}

export function AddCLERecordModal({ 
  isOpen, 
  onClose, 
  onRecordAdded, 
  providers, 
  barStatuses 
}: AddCLERecordModalProps) {
  const [formData, setFormData] = useState({
    state: '',
    bar_number: '',
    course_name: '',
    provider: '',
    provider_id: '',
    cle_hours: '',
    ethics_hours: '',
    tech_hours: '',
    date_completed: null as Date | null,
    certificate_url: '',
    certificate_number: '',
    notes: ''
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleStateChange = (state: string) => {
    const barStatus = barStatuses.find(b => b.state === state);
    setFormData(prev => ({
      ...prev,
      state,
      bar_number: barStatus?.bar_number || ''
    }));
  };

  const handleProviderChange = (providerName: string) => {
    const provider = providers.find(p => p.provider_name === providerName);
    setFormData(prev => ({
      ...prev,
      provider: providerName,
      provider_id: provider?.id || ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.course_name || !formData.provider || !formData.state || !formData.cle_hours || !formData.date_completed) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('attorney_cle_records')
        .insert({
          user_id: user.id,
          state: formData.state,
          bar_number: formData.bar_number,
          course_name: formData.course_name,
          provider: formData.provider,
          provider_id: formData.provider_id || null,
          cle_hours: parseFloat(formData.cle_hours),
          ethics_hours: parseFloat(formData.ethics_hours) || 0,
          tech_hours: parseFloat(formData.tech_hours) || 0,
          date_completed: format(formData.date_completed, 'yyyy-MM-dd'),
          certificate_url: formData.certificate_url || null,
          certificate_number: formData.certificate_number || null,
          notes: formData.notes || null,
          status: 'completed'
        });

      if (error) throw error;

      // Update bar status with new hours
      const barStatus = barStatuses.find(b => b.state === formData.state);
      if (barStatus) {
        const { error: updateError } = await supabase
          .from('attorney_bar_status')
          .update({
            cle_hours_completed: parseFloat(formData.cle_hours),
            ethics_hours_completed: parseFloat(formData.ethics_hours) || 0,
            tech_hours_completed: parseFloat(formData.tech_hours) || 0
          })
          .eq('id', barStatus.id);

        if (updateError) console.error('Error updating bar status:', updateError);
      }

      toast({
        title: "Success",
        description: "CLE record added successfully",
      });

      // Reset form
      setFormData({
        state: '',
        bar_number: '',
        course_name: '',
        provider: '',
        provider_id: '',
        cle_hours: '',
        ethics_hours: '',
        tech_hours: '',
        date_completed: null,
        certificate_url: '',
        certificate_number: '',
        notes: ''
      });

      onRecordAdded();
    } catch (error) {
      console.error('Error adding CLE record:', error);
      toast({
        title: "Error",
        description: "Failed to add CLE record",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const availableProviders = formData.state
    ? providers.filter(p => p.approved_states.includes(formData.state))
    : providers;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add CLE Record</DialogTitle>
          <DialogDescription>
            Record a completed CLE course and update your compliance status.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* State and Bar Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Select value={formData.state} onValueChange={handleStateChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {barStatuses.map((status) => (
                    <SelectItem key={status.state} value={status.state}>
                      {status.state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bar_number">Bar Number</Label>
              <Input
                id="bar_number"
                value={formData.bar_number}
                onChange={(e) => setFormData(prev => ({ ...prev, bar_number: e.target.value }))}
                placeholder="Auto-filled based on state"
                disabled
              />
            </div>
          </div>

          {/* Course Information */}
          <div className="space-y-2">
            <Label htmlFor="course_name">Course Name *</Label>
            <Input
              id="course_name"
              value={formData.course_name}
              onChange={(e) => setFormData(prev => ({ ...prev, course_name: e.target.value }))}
              placeholder="Enter course name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="provider">Provider *</Label>
            <Select value={formData.provider} onValueChange={handleProviderChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {availableProviders.map((provider) => (
                  <SelectItem key={provider.id} value={provider.provider_name}>
                    {provider.provider_name}
                  </SelectItem>
                ))}
                <SelectItem value="other">Other Provider</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.provider === 'other' && (
            <div className="space-y-2">
              <Label htmlFor="custom_provider">Custom Provider Name</Label>
              <Input
                id="custom_provider"
                value={formData.provider}
                onChange={(e) => setFormData(prev => ({ ...prev, provider: e.target.value, provider_id: '' }))}
                placeholder="Enter provider name"
              />
            </div>
          )}

          {/* Hours */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cle_hours">General CLE Hours *</Label>
              <Input
                id="cle_hours"
                type="number"
                step="0.5"
                min="0"
                value={formData.cle_hours}
                onChange={(e) => setFormData(prev => ({ ...prev, cle_hours: e.target.value }))}
                placeholder="0.0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ethics_hours">Ethics Hours</Label>
              <Input
                id="ethics_hours"
                type="number"
                step="0.5"
                min="0"
                value={formData.ethics_hours}
                onChange={(e) => setFormData(prev => ({ ...prev, ethics_hours: e.target.value }))}
                placeholder="0.0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tech_hours">Technology Hours</Label>
              <Input
                id="tech_hours"
                type="number"
                step="0.5"
                min="0"
                value={formData.tech_hours}
                onChange={(e) => setFormData(prev => ({ ...prev, tech_hours: e.target.value }))}
                placeholder="0.0"
              />
            </div>
          </div>

          {/* Date Completed */}
          <div className="space-y-2">
            <Label>Date Completed *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date_completed && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date_completed ? format(formData.date_completed, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date_completed}
                  onSelect={(date) => setFormData(prev => ({ ...prev, date_completed: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Certificate Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="certificate_number">Certificate Number</Label>
              <Input
                id="certificate_number"
                value={formData.certificate_number}
                onChange={(e) => setFormData(prev => ({ ...prev, certificate_number: e.target.value }))}
                placeholder="Certificate number (if any)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="certificate_url">Certificate URL</Label>
              <div className="flex">
                <Input
                  id="certificate_url"
                  type="url"
                  value={formData.certificate_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, certificate_url: e.target.value }))}
                  placeholder="https://..."
                  className="rounded-r-none"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-l-none border-l-0"
                  onClick={() => {
                    // Future: Implement file upload functionality
                    toast({
                      title: "Coming Soon",
                      description: "Certificate upload will be available soon",
                    });
                  }}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about this course..."
              rows={3}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Add CLE Record"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}