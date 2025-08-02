import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CampaignBookingModalProps {
  agencyId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const CampaignBookingModal: React.FC<CampaignBookingModalProps> = ({
  agencyId,
  onClose,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [agencyName, setAgencyName] = useState('');
  const [formData, setFormData] = useState({
    campaign_name: '',
    campaign_type: '',
    start_date: new Date(),
    end_date: undefined as Date | undefined,
    budget: '',
    goals: '',
    target_leads: '',
    target_cpl: '',
    additional_notes: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAgencyName();
  }, [agencyId]);

  const fetchAgencyName = async () => {
    try {
      const { data, error } = await supabase
        .from('marketing_agencies')
        .select('name')
        .eq('id', agencyId)
        .single();

      if (error) throw error;
      setAgencyName(data.name);
    } catch (error) {
      console.error('Error fetching agency name:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.campaign_name || !formData.campaign_type || !formData.budget) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields."
      });
      return;
    }

    try {
      setLoading(true);

      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('You must be logged in to book a campaign');
      }

      // Create campaign record
      const { error: campaignError } = await supabase
        .from('agency_campaigns')
        .insert({
          agency_id: agencyId,
          advisor_id: user.id,
          campaign_name: formData.campaign_name,
          campaign_type: formData.campaign_type,
          start_date: formData.start_date.toISOString().split('T')[0],
          end_date: formData.end_date?.toISOString().split('T')[0],
          budget: parseFloat(formData.budget),
          goals: {
            target_leads: formData.target_leads ? parseInt(formData.target_leads) : null,
            target_cpl: formData.target_cpl ? parseFloat(formData.target_cpl) : null,
            description: formData.goals,
            additional_notes: formData.additional_notes
          }
        });

      if (campaignError) throw campaignError;

      onSuccess();
    } catch (error) {
      console.error('Error booking campaign:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to book campaign."
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Book Campaign with {agencyName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campaign Name */}
          <div className="space-y-2">
            <Label htmlFor="campaign_name">Campaign Name *</Label>
            <Input
              id="campaign_name"
              value={formData.campaign_name}
              onChange={(e) => updateFormData('campaign_name', e.target.value)}
              placeholder="Q1 2024 Lead Generation Campaign"
              required
            />
          </div>

          {/* Campaign Type */}
          <div className="space-y-2">
            <Label htmlFor="campaign_type">Campaign Type *</Label>
            <Select onValueChange={(value) => updateFormData('campaign_type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select campaign type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seminar">Educational Seminars</SelectItem>
                <SelectItem value="digital">Digital Marketing</SelectItem>
                <SelectItem value="dinner_events">Dinner Events</SelectItem>
                <SelectItem value="webinar">Webinars</SelectItem>
                <SelectItem value="direct_mail">Direct Mail</SelectItem>
                <SelectItem value="social_media">Social Media</SelectItem>
                <SelectItem value="referral">Referral Program</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.start_date, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.start_date}
                    onSelect={(date) => date && updateFormData('start_date', date)}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.end_date ? format(formData.end_date, "PPP") : "Select end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.end_date}
                    onSelect={(date) => updateFormData('end_date', date)}
                    disabled={(date) => date < formData.start_date}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <Label htmlFor="budget">Campaign Budget *</Label>
            <Input
              id="budget"
              type="number"
              value={formData.budget}
              onChange={(e) => updateFormData('budget', e.target.value)}
              placeholder="10000"
              min="0"
              step="100"
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter your total campaign budget in USD
            </p>
          </div>

          {/* Goals */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target_leads">Target Leads</Label>
              <Input
                id="target_leads"
                type="number"
                value={formData.target_leads}
                onChange={(e) => updateFormData('target_leads', e.target.value)}
                placeholder="100"
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target_cpl">Target Cost Per Lead</Label>
              <Input
                id="target_cpl"
                type="number"
                value={formData.target_cpl}
                onChange={(e) => updateFormData('target_cpl', e.target.value)}
                placeholder="100"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Goals Description */}
          <div className="space-y-2">
            <Label htmlFor="goals">Campaign Goals & Objectives</Label>
            <Textarea
              id="goals"
              value={formData.goals}
              onChange={(e) => updateFormData('goals', e.target.value)}
              placeholder="Describe your campaign goals, target audience, and success metrics..."
              rows={3}
            />
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="additional_notes">Additional Notes</Label>
            <Textarea
              id="additional_notes"
              value={formData.additional_notes}
              onChange={(e) => updateFormData('additional_notes', e.target.value)}
              placeholder="Any specific requirements, preferences, or questions for the agency..."
              rows={3}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="marketplace" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Book Campaign
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};