import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload } from 'lucide-react';
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CEProvider {
  id: string;
  provider_name: string;
  provider_code: string;
}

interface AddCERecordModalProps {
  trigger: React.ReactNode;
  onSuccess?: () => void;
}

export default function AddCERecordModal({ trigger, onSuccess }: AddCERecordModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState<CEProvider[]>([]);
  const [formData, setFormData] = useState({
    course_name: '',
    provider: '',
    provider_id: '',
    credential_type: '',
    state: '',
    ce_hours: '',
    ethics_hours: '0',
    date_completed: undefined as Date | undefined,
    certificate_number: '',
    renewal_period: '',
    notes: ''
  });

  useEffect(() => {
    if (open) {
      fetchProviders();
    }
  }, [open]);

  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('accountant_ce_providers')
        .select('id, provider_name, provider_code')
        .eq('is_active', true)
        .order('provider_name');

      if (error) throw error;
      setProviders(data || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast.error('Failed to load CE providers');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.course_name || !formData.provider || !formData.credential_type || 
        !formData.state || !formData.ce_hours || !formData.date_completed) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const ceRecord = {
        user_id: user.id,
        course_name: formData.course_name,
        provider: formData.provider,
        provider_id: formData.provider_id || null,
        credential_type: formData.credential_type,
        state: formData.state,
        ce_hours: parseFloat(formData.ce_hours),
        ethics_hours: parseFloat(formData.ethics_hours) || 0,
        date_completed: format(formData.date_completed, 'yyyy-MM-dd'),
        certificate_number: formData.certificate_number,
        renewal_period: formData.renewal_period,
        notes: formData.notes,
        status: 'completed'
      };

      const { error } = await supabase
        .from('accountant_ce_records')
        .insert([ceRecord]);

      if (error) throw error;

      toast.success('CE record added successfully');
      setOpen(false);
      onSuccess?.();
      
      // Reset form
      setFormData({
        course_name: '',
        provider: '',
        provider_id: '',
        credential_type: '',
        state: '',
        ce_hours: '',
        ethics_hours: '0',
        date_completed: undefined,
        certificate_number: '',
        renewal_period: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error adding CE record:', error);
      toast.error('Failed to add CE record');
    } finally {
      setLoading(false);
    }
  };

  const handleProviderSelect = (providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    if (provider) {
      setFormData({
        ...formData,
        provider_id: providerId,
        provider: provider.provider_name
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add CE Record</DialogTitle>
          <DialogDescription>
            Record a completed continuing education course
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="course_name">Course Name *</Label>
              <Input
                id="course_name"
                value={formData.course_name}
                onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                placeholder="Enter course name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider">Provider *</Label>
              <Select onValueChange={handleProviderSelect} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.provider_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="credential_type">Credential Type *</Label>
              <Select 
                value={formData.credential_type} 
                onValueChange={(value) => setFormData({ ...formData, credential_type: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select credential" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CPA">CPA</SelectItem>
                  <SelectItem value="EA">Enrolled Agent</SelectItem>
                  <SelectItem value="CFE">Certified Fraud Examiner</SelectItem>
                  <SelectItem value="CMA">Certified Management Accountant</SelectItem>
                  <SelectItem value="CIA">Certified Internal Auditor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Select 
                value={formData.state} 
                onValueChange={(value) => setFormData({ ...formData, state: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TX">Texas</SelectItem>
                  <SelectItem value="CA">California</SelectItem>
                  <SelectItem value="FL">Florida</SelectItem>
                  <SelectItem value="NY">New York</SelectItem>
                  <SelectItem value="IL">Illinois</SelectItem>
                  <SelectItem value="ALL">All States (EA)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ce_hours">CE Hours *</Label>
              <Input
                id="ce_hours"
                type="number"
                step="0.25"
                min="0"
                value={formData.ce_hours}
                onChange={(e) => setFormData({ ...formData, ce_hours: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ethics_hours">Ethics Hours</Label>
              <Input
                id="ethics_hours"
                type="number"
                step="0.25"
                min="0"
                value={formData.ethics_hours}
                onChange={(e) => setFormData({ ...formData, ethics_hours: e.target.value })}
                placeholder="0.00"
              />
            </div>

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
                    {formData.date_completed ? (
                      format(formData.date_completed, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date_completed}
                    onSelect={(date) => setFormData({ ...formData, date_completed: date })}
                    disabled={(date) => date > new Date() || date < new Date("1990-01-01")}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="certificate_number">Certificate Number</Label>
              <Input
                id="certificate_number"
                value={formData.certificate_number}
                onChange={(e) => setFormData({ ...formData, certificate_number: e.target.value })}
                placeholder="Certificate or confirmation number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="renewal_period">Renewal Period</Label>
            <Input
              id="renewal_period"
              value={formData.renewal_period}
              onChange={(e) => setFormData({ ...formData, renewal_period: e.target.value })}
              placeholder="e.g., 2024, 2023-2024"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes about this course"
              rows={3}
            />
          </div>

          <div className="border-2 border-dashed border-muted-foreground rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-2">Upload Certificate (Optional)</p>
            <Button type="button" variant="outline" size="sm">
              Choose File
            </Button>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add CE Record'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}