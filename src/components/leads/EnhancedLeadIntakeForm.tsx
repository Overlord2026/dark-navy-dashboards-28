import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, Shield, TrendingUp, DollarSign, User, Mail, Phone, Building } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PlaidLink } from 'react-plaid-link';

interface LeadData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  lead_value?: number;
  notes?: string;
}

interface EnhancedLeadIntakeFormProps {
  onSubmit?: (leadData: LeadData) => void;
  className?: string;
}

export function EnhancedLeadIntakeForm({ onSubmit, className }: EnhancedLeadIntakeFormProps) {
  const [formData, setFormData] = useState<LeadData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    lead_value: 0,
    notes: ''
  });
  const [enrichmentConsent, setEnrichmentConsent] = useState(false);
  const [plaidConsent, setPlaidConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichmentData, setEnrichmentData] = useState<any>(null);
  const [plaidLinkToken, setPlaidLinkToken] = useState<string | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create the lead first
      const { data: lead, error: createError } = await supabase
        .from('leads')
        .insert({
          first_name: formData.name.split(' ')[0] || '',
          last_name: formData.name.split(' ').slice(1).join(' ') || '',
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          lead_value: formData.lead_value,
          notes: formData.notes,
          advisor_id: (await supabase.auth.getUser()).data.user?.id,
          lead_status: 'new',
          lead_source: 'manual_entry',
          enrichment_status: enrichmentConsent ? 'pending' : 'skipped',
          plaid_consent_given: plaidConsent
        })
        .select()
        .single();

      if (createError) throw createError;

      setLeadId(lead.id);

      // If enrichment consent given, trigger enrichment
      if (enrichmentConsent) {
        setIsEnriching(true);
        await triggerEnrichment(lead.id);
      }

      // If Plaid consent given, prepare Plaid Link
      if (plaidConsent) {
        await preparePlaidLink();
      }

      toast({
        title: "Lead Created Successfully",
        description: enrichmentConsent ? "Lead enrichment is in progress..." : "Lead has been added to your pipeline",
      });

      onSubmit?.(formData);
      
      if (!enrichmentConsent && !plaidConsent) {
        resetForm();
      }
    } catch (error: any) {
      console.error('Error creating lead:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create lead",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerEnrichment = async (leadId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('lead-enrichment', {
        body: {
          lead_id: leadId,
          email: formData.email,
          name: formData.name,
          company: formData.company
        }
      });

      if (error) throw error;

      setEnrichmentData(data);
      toast({
        title: "Lead Enriched",
        description: `Catchlight Score: ${data.catchlight_score}/100`,
      });
    } catch (error: any) {
      console.error('Error enriching lead:', error);
      toast({
        title: "Enrichment Error",
        description: "Lead enrichment failed, but lead was created successfully",
        variant: "destructive",
      });
    } finally {
      setIsEnriching(false);
    }
  };

  const preparePlaidLink = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('plaid-create-link-token');
      
      if (error) throw error;
      
      setPlaidLinkToken(data.link_token);
    } catch (error: any) {
      console.error('Error preparing Plaid link:', error);
      toast({
        title: "Plaid Setup Error",
        description: "Net worth verification setup failed",
        variant: "destructive",
      });
    }
  };

  const handlePlaidSuccess = async (public_token: string) => {
    if (!leadId) return;

    try {
      const { data, error } = await supabase.functions.invoke('plaid-net-worth-verification', {
        body: {
          lead_id: leadId,
          public_token: public_token
        }
      });

      if (error) throw error;

      toast({
        title: "Net Worth Verified",
        description: `Verified net worth: $${data.net_worth.toLocaleString()}`,
      });

      resetForm();
    } catch (error: any) {
      console.error('Error verifying net worth:', error);
      toast({
        title: "Verification Error",
        description: "Net worth verification failed",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      lead_value: 0,
      notes: ''
    });
    setEnrichmentConsent(false);
    setPlaidConsent(false);
    setEnrichmentData(null);
    setPlaidLinkToken(null);
    setLeadId(null);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Enhanced Lead Capture
        </CardTitle>
        <CardDescription>
          Capture leads with optional enrichment and instant net worth verification
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                disabled={isSubmitting || isEnriching}
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                disabled={isSubmitting || isEnriching}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                disabled={isSubmitting || isEnriching}
              />
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                disabled={isSubmitting || isEnriching}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="lead_value">Estimated Value ($)</Label>
            <Input
              id="lead_value"
              type="number"
              value={formData.lead_value}
              onChange={(e) => setFormData(prev => ({ ...prev, lead_value: Number(e.target.value) }))}
              disabled={isSubmitting || isEnriching}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              disabled={isSubmitting || isEnriching}
            />
          </div>

          {/* Consent Section */}
          <div className="border-t pt-4 space-y-3">
            <h4 className="font-medium">Optional Enhancements</h4>
            
            <div className="flex items-start space-x-2">
              <Checkbox
                id="enrichment-consent"
                checked={enrichmentConsent}
                onCheckedChange={(checked) => setEnrichmentConsent(checked === true)}
                disabled={isSubmitting || isEnriching}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="enrichment-consent" className="flex items-center gap-2 cursor-pointer">
                  <TrendingUp className="h-4 w-4" />
                  Enable Lead Enrichment
                </Label>
                <p className="text-xs text-muted-foreground">
                  Get instant prospect scoring and professional insights via Catchlight.ai
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="plaid-consent"
                checked={plaidConsent}
                onCheckedChange={(checked) => setPlaidConsent(checked === true)}
                disabled={isSubmitting || isEnriching}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="plaid-consent" className="flex items-center gap-2 cursor-pointer">
                  <Shield className="h-4 w-4" />
                  Enable Net Worth Verification
                </Label>
                <p className="text-xs text-muted-foreground">
                  Instant financial verification via secure Plaid connection
                </p>
              </div>
            </div>
          </div>

          {/* Enrichment Results */}
          {enrichmentData && (
            <div className="border rounded-lg p-4 bg-muted/20">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Enrichment Results
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Catchlight Score:</span>
                  <Badge variant={enrichmentData.catchlight_score > 80 ? "default" : "secondary"}>
                    {enrichmentData.catchlight_score}/100
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Confidence:</span>
                  <span className="ml-2">{Math.round(enrichmentData.confidence)}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Plaid Link */}
          {plaidLinkToken && leadId && (
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Net Worth Verification
              </h4>
              <PlaidLink
                token={plaidLinkToken}
                onSuccess={handlePlaidSuccess}
                onExit={() => {
                  toast({
                    title: "Verification Cancelled",
                    description: "Net worth verification was cancelled",
                  });
                  resetForm();
                }}
              >
                <Button variant="outline" className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Connect Financial Accounts
                </Button>
              </PlaidLink>
            </div>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || isEnriching}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating Lead...
              </>
            ) : isEnriching ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enriching Lead...
              </>
            ) : (
              'Create Enhanced Lead'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}