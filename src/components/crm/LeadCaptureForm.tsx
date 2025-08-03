import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Upload, FileText, Users, Phone, Mail, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  leadSource: string;
  leadValue: number;
  timeline: string;
  notes?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

interface LeadCaptureFormProps {
  onLeadCreated?: (lead: any) => void;
}

export function LeadCaptureForm({ onLeadCreated }: LeadCaptureFormProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isCSVImportOpen, setIsCSVImportOpen] = useState(false);
  const [formData, setFormData] = useState<LeadFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    leadSource: 'website',
    leadValue: 0,
    timeline: '1-3_months',
    notes: ''
  });
  
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);

  const leadSources = [
    { value: 'website', label: 'Website' },
    { value: 'referral', label: 'Referral' },
    { value: 'social_media', label: 'Social Media' },
    { value: 'google_ads', label: 'Google Ads' },
    { value: 'facebook_ads', label: 'Facebook Ads' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'cold_call', label: 'Cold Call' },
    { value: 'networking', label: 'Networking Event' },
    { value: 'other', label: 'Other' }
  ];

  const timelines = [
    { value: 'immediate', label: 'Immediate' },
    { value: '1-3_months', label: '1-3 Months' },
    { value: '3-6_months', label: '3-6 Months' },
    { value: '6-12_months', label: '6-12 Months' },
    { value: '12+_months', label: '12+ Months' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create lead in database
      const { data, error } = await supabase
        .from('leads')
        .insert([{
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          lead_source: formData.leadSource,
          lead_value: formData.leadValue,
          timeline_to_purchase: formData.timeline,
          notes: formData.notes,
          lead_status: 'new',
          advisor_id: (await supabase.auth.getUser()).data.user?.id,
          utm_source: formData.utm_source,
          utm_medium: formData.utm_medium,
          utm_campaign: formData.utm_campaign
        }])
        .select()
        .single();

      if (error) throw error;

      // Auto-score the lead
      await supabase.rpc('calculate_lead_score', { p_lead_id: data.id });

      // Schedule automated follow-up
      await supabase.rpc('schedule_follow_up', { 
        p_lead_id: data.id, 
        p_stage: 'new' 
      });

      toast({
        title: "Lead Created",
        description: "New lead has been added to your pipeline",
      });

      setIsOpen(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        leadSource: 'website',
        leadValue: 0,
        timeline: '1-3_months',
        notes: ''
      });

      onLeadCreated?.(data);
    } catch (error) {
      console.error('Error creating lead:', error);
      toast({
        title: "Error",
        description: "Failed to create lead",
        variant: "destructive",
      });
    }
  };

  const handleCSVImport = async () => {
    if (!csvFile) {
      toast({
        title: "No File Selected",
        description: "Please select a CSV file to import",
        variant: "destructive",
      });
      return;
    }

    try {
      const text = await csvFile.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const leads = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',').map(v => v.trim());
          const lead: any = {
            advisor_id: (await supabase.auth.getUser()).data.user?.id,
            lead_status: 'new'
          };
          
          headers.forEach((header, index) => {
            const value = values[index]?.replace(/"/g, '');
            switch (header.toLowerCase()) {
              case 'first_name':
              case 'firstname':
                lead.first_name = value;
                break;
              case 'last_name':
              case 'lastname':
                lead.last_name = value;
                break;
              case 'email':
                lead.email = value;
                break;
              case 'phone':
                lead.phone = value;
                break;
              case 'company':
                lead.company = value;
                break;
              case 'lead_source':
              case 'source':
                lead.lead_source = value;
                break;
              case 'lead_value':
              case 'value':
                lead.lead_value = parseFloat(value) || 0;
                break;
              case 'timeline':
                lead.timeline_to_purchase = value;
                break;
              case 'notes':
                lead.notes = value;
                break;
            }
          });
          
          if (lead.first_name && lead.last_name && lead.email) {
            leads.push(lead);
          }
        }
      }

      // Import leads in batches
      const batchSize = 50;
      let imported = 0;
      
      for (let i = 0; i < leads.length; i += batchSize) {
        const batch = leads.slice(i, i + batchSize);
        const { error } = await supabase
          .from('leads')
          .insert(batch);
          
        if (error) throw error;
        
        imported += batch.length;
        setImportProgress((imported / leads.length) * 100);
      }

      toast({
        title: "Import Successful",
        description: `Successfully imported ${leads.length} leads`,
      });

      setIsCSVImportOpen(false);
      setCsvFile(null);
      setImportProgress(0);
      
    } catch (error) {
      console.error('Error importing CSV:', error);
      toast({
        title: "Import Failed",
        description: "Failed to import CSV file",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-2">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Capture New Lead</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="leadSource">Lead Source</Label>
                <Select 
                  value={formData.leadSource} 
                  onValueChange={(value) => setFormData({...formData, leadSource: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {leadSources.map((source) => (
                      <SelectItem key={source.value} value={source.value}>
                        {source.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="leadValue">Est. Lead Value ($)</Label>
                <Input
                  id="leadValue"
                  type="number"
                  value={formData.leadValue}
                  onChange={(e) => setFormData({...formData, leadValue: Number(e.target.value)})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeline">Timeline to Purchase</Label>
              <Select 
                value={formData.timeline} 
                onValueChange={(value) => setFormData({...formData, timeline: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timelines.map((timeline) => (
                    <SelectItem key={timeline.value} value={timeline.value}>
                      {timeline.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Additional notes about this lead..."
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Create Lead
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isCSVImportOpen} onOpenChange={setIsCSVImportOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Leads from CSV</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>CSV File</Label>
              <Input
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
              />
              <p className="text-sm text-muted-foreground">
                Expected columns: first_name, last_name, email, phone, company, lead_source, lead_value, timeline, notes
              </p>
            </div>
            
            {importProgress > 0 && (
              <div className="space-y-2">
                <Label>Import Progress</Label>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${importProgress}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">{Math.round(importProgress)}% complete</p>
              </div>
            )}
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsCSVImportOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCSVImport} disabled={!csvFile || importProgress > 0}>
                Import Leads
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}