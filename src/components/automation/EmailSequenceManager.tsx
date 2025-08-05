import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Clock, Users, TrendingUp, Edit, Save, X } from 'lucide-react';

interface EmailSequence {
  id: string;
  persona: string;
  sequence_type: string;
  subject_template: string;
  content_template: string;
  is_active: boolean;
  created_at: string;
}

interface EmailLog {
  id: string;
  user_id: string;
  persona: string;
  sequence_type: string;
  email_sent_at: string;
  status: string;
  user_email?: string;
}

export const EmailSequenceManager = () => {
  const [sequences, setSequences] = useState<EmailSequence[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [editingSequence, setEditingSequence] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    persona: '',
    sequence_type: '',
    subject_template: '',
    content_template: ''
  });
  const { toast } = useToast();

  const personas = ['advisor', 'cpa', 'attorney', 'coach', 'insurance', 'industry_org', 'compliance', 'vip_partner'];
  const sequenceTypes = ['welcome', 'day2', 'day3', 'day7'];

  useEffect(() => {
    fetchSequences();
    fetchEmailLogs();
  }, []);

  const fetchSequences = async () => {
    try {
      const { data, error } = await supabase
        .from('email_sequences')
        .select('*')
        .order('persona', { ascending: true });

      if (error) throw error;
      setSequences(data || []);
    } catch (error) {
      console.error('Error fetching sequences:', error);
      toast({
        title: "Error",
        description: "Failed to load email sequences",
        variant: "destructive",
      });
    }
  };

  const fetchEmailLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('onboarding_email_log')
        .select(`
          *,
          profiles!user_id(email)
        `)
        .order('email_sent_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setEmailLogs(data || []);
    } catch (error) {
      console.error('Error fetching email logs:', error);
    }
  };

  const handleSaveSequence = async () => {
    try {
      const { error } = await supabase
        .from('email_sequences')
        .upsert({
          id: editingSequence || undefined,
          ...formData,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Email sequence saved successfully",
      });

      setEditingSequence(null);
      setFormData({ persona: '', sequence_type: '', subject_template: '', content_template: '' });
      fetchSequences();
    } catch (error) {
      console.error('Error saving sequence:', error);
      toast({
        title: "Error",
        description: "Failed to save email sequence",
        variant: "destructive",
      });
    }
  };

  const startEditing = (sequence: EmailSequence) => {
    setEditingSequence(sequence.id);
    setFormData({
      persona: sequence.persona,
      sequence_type: sequence.sequence_type,
      subject_template: sequence.subject_template,
      content_template: sequence.content_template
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Sequence Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Sequence Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* New/Edit Sequence Form */}
          <div className="bg-muted/50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-4">
              {editingSequence ? 'Edit Sequence' : 'Create New Sequence'}
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Select
                value={formData.persona}
                onValueChange={(value) => setFormData({ ...formData, persona: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Persona" />
                </SelectTrigger>
                <SelectContent>
                  {personas.map(persona => (
                    <SelectItem key={persona} value={persona}>
                      {persona.charAt(0).toUpperCase() + persona.slice(1).replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={formData.sequence_type}
                onValueChange={(value) => setFormData({ ...formData, sequence_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Sequence Type" />
                </SelectTrigger>
                <SelectContent>
                  {sequenceTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Input
                placeholder="Email Subject Template"
                value={formData.subject_template}
                onChange={(e) => setFormData({ ...formData, subject_template: e.target.value })}
              />
              <Textarea
                placeholder="Email Content Template (HTML supported)"
                rows={8}
                value={formData.content_template}
                onChange={(e) => setFormData({ ...formData, content_template: e.target.value })}
              />
            </div>

            <div className="flex gap-2 mt-4">
              <Button onClick={handleSaveSequence}>
                <Save className="h-4 w-4 mr-2" />
                {editingSequence ? 'Update' : 'Create'} Sequence
              </Button>
              {editingSequence && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingSequence(null);
                    setFormData({ persona: '', sequence_type: '', subject_template: '', content_template: '' });
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )}
            </div>
          </div>

          {/* Existing Sequences */}
          <div className="space-y-4">
            {sequences.map((sequence) => (
              <div key={sequence.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">
                      {sequence.persona.charAt(0).toUpperCase() + sequence.persona.slice(1)} - {sequence.sequence_type}
                    </h4>
                    <p className="text-sm text-muted-foreground">{sequence.subject_template}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={sequence.is_active ? "default" : "secondary"}>
                      {sequence.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEditing(sequence)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Email Logs & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Email Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Sent</p>
                <p className="text-2xl font-bold">{emailLogs.filter(log => log.status === 'sent').length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">
                  {emailLogs.length > 0
                    ? Math.round((emailLogs.filter(log => log.status === 'sent').length / emailLogs.length) * 100)
                    : 0
                  }%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Email Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {emailLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">{log.persona} - {log.sequence_type}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(log.email_sent_at).toLocaleString()}
                    </p>
                  </div>
                  <Badge className={getStatusColor(log.status)}>
                    {log.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
