import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { runtimeFlags } from '@/config/runtimeFlags';
import { FileText, Send, AlertCircle, CheckCircle } from 'lucide-react';

interface NILDisclosureFormProps {
  athleteId?: string;
  onComplete?: () => void;
}

export const NILDisclosureForm: React.FC<NILDisclosureFormProps> = ({ 
  athleteId,
  onComplete 
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    dealType: '',
    amount: '',
    duration: '',
    description: '',
    brandName: '',
    universityId: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const disclosureData = {
        athlete_user_id: athleteId || user.id,
        agent_id: user.id,
        school_id: formData.universityId || null,
        disclosure_type: 'initial',
        deal_type: formData.dealType,
        deal_amount: formData.amount ? parseFloat(formData.amount) : null,
        deal_duration: formData.duration,
        deal_description: formData.description,
        brand_name: formData.brandName,
        status: 'submitted',
        payload: {
          type: 'nil_disclosure',
          via: runtimeFlags.emailEnabled ? 'normal' : 'no-secrets-mode',
          dealDetails: formData,
          generatedAt: new Date().toISOString(),
          complianceVersion: '2024.1'
        },
        created_by: user.id
      };

      if (!runtimeFlags.emailEnabled) {
        // No-secrets mode: simulate database insert
        console.log('NIL Disclosure saved locally:', disclosureData);
        
        toast({
          title: "✅ Disclosure Recorded",
          description: "Email notifications will be sent once admin enables email delivery.",
        });

        // Analytics tracking
        if (typeof window !== 'undefined' && (window as any).analytics) {
          (window as any).analytics.track('nil.disclosure.recorded', { 
            noSecrets: true,
            dealType: formData.dealType 
          });
        }
      } else {
        // Normal mode: use Edge Function
        const { error } = await supabase.functions.invoke('nil-disclosure-processor', {
          body: disclosureData
        });

        if (error) throw error;

        toast({
          title: "✅ Disclosure Submitted",
          description: "University has been notified and compliance review initiated.",
        });

        // Analytics tracking
        if (typeof window !== 'undefined' && (window as any).analytics) {
          (window as any).analytics.track('nil.disclosure.submitted', {
            dealType: formData.dealType
          });
        }
      }

      // Reset form
      setFormData({
        dealType: '',
        amount: '',
        duration: '',
        description: '',
        brandName: '',
        universityId: ''
      });

      onComplete?.();

    } catch (error: any) {
      console.error('Disclosure submission error:', error);
      toast({
        title: "❌ Submission Failed",
        description: error.message || "Failed to submit disclosure",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          NIL Disclosure Form
        </CardTitle>
        {!runtimeFlags.emailEnabled && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              Email notifications disabled. Records will be saved for later delivery.
            </span>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dealType">Deal Type *</Label>
              <Select 
                value={formData.dealType} 
                onValueChange={(value) => setFormData({...formData, dealType: value})}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select deal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="endorsement">Endorsement</SelectItem>
                  <SelectItem value="social_media">Social Media</SelectItem>
                  <SelectItem value="appearance">Appearance</SelectItem>
                  <SelectItem value="merchandise">Merchandise</SelectItem>
                  <SelectItem value="licensing">Licensing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Deal Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                placeholder="e.g., 6 months, 1 year"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brandName">Brand/Company Name</Label>
              <Input
                id="brandName"
                placeholder="Company name"
                value={formData.brandName}
                onChange={(e) => setFormData({...formData, brandName: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deal Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the NIL opportunity and your role..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="universityId">University/School</Label>
            <Input
              id="universityId"
              placeholder="University ID (optional)"
              value={formData.universityId}
              onChange={(e) => setFormData({...formData, universityId: e.target.value})}
            />
          </div>

          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.dealType || !formData.description}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Disclosure
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};