// @ts-nocheck
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, QrCode, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ConsentIssuerModalProps {
  children: React.ReactNode;
}

export default function ConsentIssuerModal({ children }: ConsentIssuerModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [formData, setFormData] = useState({
    subject_email: '',
    jurisdiction: 'US',
    product: 'content',
    media: 'social',
    time: '1year',
    audience: 'public',
    exclusivity: false,
    training_data: false,
    valid_from: '',
    valid_to: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // Get subject user by email (simplified - in production would have proper user lookup)
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', formData.subject_email)
        .single();

      if (!profiles) {
        throw new Error('User not found with that email');
      }

      const scopes = {
        jurisdiction: formData.jurisdiction,
        product: formData.product,
        media: formData.media,
        time: formData.time,
        audience: formData.audience,
        exclusivity: formData.exclusivity,
        xr_events: ['presence', 'interaction', 'performance']
      };

      const conditions = {
        training_data: formData.training_data,
        disclosures: ['data_usage', 'third_party_sharing'],
        conflicts: []
      };

      const { data, error } = await supabase.functions.invoke('issue-consent', {
        body: {
          subject_user: profiles.id,
          scopes,
          conditions,
          valid_from: formData.valid_from || undefined,
          valid_to: formData.valid_to || undefined
        }
      });

      if (error) throw error;

      setResult(data);
      toast.success('Consent token issued successfully');

    } catch (error) {
      console.error('Error issuing consent:', error);
      toast.error(error.message || 'Failed to issue consent');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      subject_email: '',
      jurisdiction: 'US',
      product: 'content',
      media: 'social',
      time: '1year',
      audience: 'public',
      exclusivity: false,
      training_data: false,
      valid_from: '',
      valid_to: ''
    });
    setResult(null);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) {
        setTimeout(resetForm, 300);
      }
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Issue Consent Token
          </DialogTitle>
        </DialogHeader>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subject_email">Subject Email</Label>
                <Input
                  id="subject_email"
                  type="email"
                  value={formData.subject_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject_email: e.target.value }))}
                  placeholder="user@example.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="jurisdiction">Jurisdiction</Label>
                <Select value={formData.jurisdiction} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, jurisdiction: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="EU">European Union</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="product">Product Type</Label>
                <Select value={formData.product} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, product: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="content">Content/Media</SelectItem>
                    <SelectItem value="financial">Financial Services</SelectItem>
                    <SelectItem value="personal_data">Personal Data</SelectItem>
                    <SelectItem value="likeness">Likeness/Image</SelectItem>
                    <SelectItem value="legal">Legal Documents</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="media">Media Type</Label>
                <Select value={formData.media} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, media: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="broadcast">Broadcast</SelectItem>
                    <SelectItem value="print">Print</SelectItem>
                    <SelectItem value="digital">Digital</SelectItem>
                    <SelectItem value="live">Live Events</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="time">Duration</Label>
                <Select value={formData.time} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, time: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30days">30 Days</SelectItem>
                    <SelectItem value="6months">6 Months</SelectItem>
                    <SelectItem value="1year">1 Year</SelectItem>
                    <SelectItem value="perpetual">Perpetual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="audience">Audience</Label>
                <Select value={formData.audience} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, audience: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="partners">Partners Only</SelectItem>
                    <SelectItem value="internal">Internal Only</SelectItem>
                    <SelectItem value="restricted">Restricted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="valid_from">Valid From (Optional)</Label>
                <Input
                  id="valid_from"
                  type="datetime-local"
                  value={formData.valid_from}
                  onChange={(e) => setFormData(prev => ({ ...prev, valid_from: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="valid_to">Valid To (Optional)</Label>
                <Input
                  id="valid_to"
                  type="datetime-local"
                  value={formData.valid_to}
                  onChange={(e) => setFormData(prev => ({ ...prev, valid_to: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="exclusivity"
                  checked={formData.exclusivity}
                  onChange={(e) => setFormData(prev => ({ ...prev, exclusivity: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="exclusivity">Exclusive Rights</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="training_data"
                  checked={formData.training_data}
                  onChange={(e) => setFormData(prev => ({ ...prev, training_data: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="training_data">Allow AI Training Data Use</Label>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Issuing...' : 'Issue Consent Token'}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  Consent Token Issued Successfully
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Consent ID</Label>
                  <div className="p-2 bg-muted rounded font-mono text-sm">
                    {result.consent_id}
                  </div>
                </div>

                <div>
                  <Label>QR Code Data</Label>
                  <div className="p-4 bg-muted rounded text-center">
                    <QrCode className="w-16 h-16 mx-auto mb-2 text-muted-foreground" />
                    <div className="text-xs font-mono break-all">
                      {result.qr_data}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Badge variant="outline">
                    {result.token?.scopes?.jurisdiction} Jurisdiction
                  </Badge>
                  <Badge variant="outline">
                    {result.token?.scopes?.product} Product
                  </Badge>
                  <Badge variant="outline">
                    {result.token?.scopes?.time} Duration
                  </Badge>
                  <Badge variant={result.token?.scopes?.exclusivity ? "destructive" : "secondary"}>
                    {result.token?.scopes?.exclusivity ? "Exclusive" : "Non-exclusive"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Button onClick={resetForm} variant="outline" className="w-full">
              Issue Another Token
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}