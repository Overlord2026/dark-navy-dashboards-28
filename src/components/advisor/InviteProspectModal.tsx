import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { clientSegments } from "@/components/solutions/WhoWeServe";

interface InviteProspectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface InviteFormData {
  firstName: string;
  lastName: string;
  email: string;
  clientSegment: string;
  assignedAdvisorId: string;
  personalNote: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
}

export function InviteProspectModal({ open, onOpenChange }: InviteProspectModalProps) {
  const { userProfile } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableAdvisors, setAvailableAdvisors] = useState<Array<{id: string, name: string}>>([]);
  
  const [formData, setFormData] = useState<InviteFormData>({
    firstName: "",
    lastName: "",
    email: "",
    clientSegment: "general",
    assignedAdvisorId: userProfile?.id || "",
    personalNote: "",
    utmSource: "",
    utmMedium: "advisor_invite",
    utmCampaign: "",
  });

  React.useEffect(() => {
    if (open && userProfile?.role === 'admin') {
      loadAvailableAdvisors();
    }
  }, [open, userProfile?.role]);

  const loadAvailableAdvisors = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('role', ['advisor', 'admin']);

      if (error) throw error;

      const advisors = data?.map(advisor => ({
        id: advisor.id,
        name: `${advisor.first_name || ''} ${advisor.last_name || ''}`.trim() || advisor.id
      })) || [];

      setAvailableAdvisors(advisors);
    } catch (error) {
      console.error('Error loading advisors:', error);
    }
  };

  const handleInputChange = (field: keyof InviteFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('leads-invite', {
        body: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: "",
          segment: formData.clientSegment,
          utm_source: formData.utmSource || "advisor_invite",
          utm_medium: formData.utmMedium,
          utm_campaign: formData.utmCampaign || `advisor_${userProfile?.id}`,
          lead_stage: "invited",
          advisor_id: formData.assignedAdvisorId || userProfile?.id,
          email_opt_in: true,
          sms_opt_in: false,
          send_invite: true,
          redirect_url: `${window.location.origin}/auth`,
          personal_note: formData.personalNote
        }
      });

      if (error) throw error;

      toast.success("Invitation sent successfully!");
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        clientSegment: "general",
        assignedAdvisorId: userProfile?.id || "",
        personalNote: "",
        utmSource: "",
        utmMedium: "advisor_invite",
        utmCampaign: "",
      });
      
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      toast.error(error.message || "Failed to send invitation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const segmentOptions = [
    { value: "general", label: "General" },
    ...clientSegments.map(segment => ({
      value: segment.id,
      label: segment.title
    }))
  ];

  const isAdmin = userProfile?.role === 'admin';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invite New Prospect</DialogTitle>
          <DialogDescription>
            Send a personalized invitation to a potential client with segmented onboarding.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Enter first name"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email address"
              required
            />
          </div>

          <div>
            <Label htmlFor="clientSegment">Client Segment</Label>
            <Select value={formData.clientSegment} onValueChange={(value) => handleInputChange('clientSegment', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select client segment" />
              </SelectTrigger>
              <SelectContent>
                {segmentOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isAdmin && availableAdvisors.length > 0 && (
            <div>
              <Label htmlFor="assignedAdvisor">Assign to Advisor</Label>
              <Select value={formData.assignedAdvisorId} onValueChange={(value) => handleInputChange('assignedAdvisorId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select advisor" />
                </SelectTrigger>
                <SelectContent>
                  {availableAdvisors.map((advisor) => (
                    <SelectItem key={advisor.id} value={advisor.id}>
                      {advisor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="personalNote">Personal Note (Optional)</Label>
            <Textarea
              id="personalNote"
              value={formData.personalNote}
              onChange={(e) => handleInputChange('personalNote', e.target.value)}
              placeholder="Add a personal message to include in the invitation email"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="utmSource">UTM Source (Optional)</Label>
              <Input
                id="utmSource"
                value={formData.utmSource}
                onChange={(e) => handleInputChange('utmSource', e.target.value)}
                placeholder="e.g., linkedin, referral"
              />
            </div>
            <div>
              <Label htmlFor="utmCampaign">UTM Campaign (Optional)</Label>
              <Input
                id="utmCampaign"
                value={formData.utmCampaign}
                onChange={(e) => handleInputChange('utmCampaign', e.target.value)}
                placeholder="e.g., q1_outreach"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending Invitation..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}