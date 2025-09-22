import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/lib/analytics';

export interface EmailSequence {
  id: string;
  persona: string;
  sequence_type: string;
  subject_template: string;
  content_template: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  created_by?: string;
}

export interface EmailLog {
  id: string;
  user_id: string;
  sequence_id: string;
  status: 'pending' | 'sent' | 'failed' | 'bounced';
  sent_at?: string;
  recipient_email: string;
  error_message?: string;
}

export const useEmailSequences = () => {
  const [sequences, setSequences] = useState<EmailSequence[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchSequences = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('email_sequences')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSequences(data || []);
    } catch (error) {
      console.error('Error fetching sequences:', error);
      toast({
        title: "Error",
        description: "Failed to load email sequences",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchEmailLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('email_automation_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setEmailLogs(data || []);
    } catch (error) {
      console.error('Error fetching email logs:', error);
    }
  };

  const createSequence = async (sequenceData: Omit<EmailSequence, 'id' | 'created_at'>) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('email_sequences')
        .insert({
          ...sequenceData,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setSequences(prev => [data, ...prev]);
      
      analytics.track('email_sequence_created', {
        persona: sequenceData.persona,
        sequence_type: sequenceData.sequence_type
      });

      toast({
        title: "Success",
        description: "Email sequence created successfully",
      });

      return data;
    } catch (error) {
      console.error('Error creating sequence:', error);
      toast({
        title: "Error",
        description: "Failed to create email sequence",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSequence = async (id: string, updates: Partial<EmailSequence>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('email_sequences')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSequences(prev => prev.map(seq => seq.id === id ? data : seq));

      toast({
        title: "Success",
        description: "Email sequence updated successfully",
      });

      return data;
    } catch (error) {
      console.error('Error updating sequence:', error);
      toast({
        title: "Error",
        description: "Failed to update email sequence",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const triggerSequence = async (recipientEmail: string, persona: string, sequenceType: string) => {
    try {
      // Find matching sequence
      const sequence = sequences.find(s => 
        s.persona === persona && 
        s.sequence_type === sequenceType && 
        s.is_active
      );

      if (!sequence) {
        throw new Error(`No active sequence found for ${persona} - ${sequenceType}`);
      }

      // Call edge function to send email
      const { data, error } = await supabase.functions.invoke('email-automation', {
        body: {
          recipient_email: recipientEmail,
          sequence_id: sequence.id,
          persona,
          sequence_type: sequenceType
        }
      });

      if (error) throw error;

      analytics.track('email_sequence_triggered', {
        persona,
        sequence_type: sequenceType,
        recipient_email: recipientEmail
      });

      toast({
        title: "Email Sent",
        description: `${sequenceType} email sent to ${recipientEmail}`,
      });

      // Refresh logs
      await fetchEmailLogs();

      return data;
    } catch (error) {
      console.error('Error triggering sequence:', error);
      toast({
        title: "Error",
        description: "Failed to send email sequence",
        variant: "destructive",
      });
      return null;
    }
  };

  const enrollUserInSequence = async (userEmail: string, persona: string) => {
    try {
      // Trigger welcome sequence
      await triggerSequence(userEmail, persona, 'welcome');
      
      // Schedule follow-up sequences (this would be handled by the edge function)
      const followUpSequences = ['day2', 'day3', 'day7'];
      
      for (const seqType of followUpSequences) {
        await supabase.functions.invoke('email-automation', {
          body: {
            recipient_email: userEmail,
            persona,
            sequence_type: seqType,
            schedule_for: new Date(Date.now() + (
              seqType === 'day2' ? 2 * 24 * 60 * 60 * 1000 :
              seqType === 'day3' ? 3 * 24 * 60 * 60 * 1000 :
              7 * 24 * 60 * 60 * 1000
            )).toISOString()
          }
        });
      }

      analytics.track('user_enrolled_in_sequence', {
        persona,
        user_email: userEmail
      });

    } catch (error) {
      console.error('Error enrolling user in sequence:', error);
    }
  };

  useEffect(() => {
    fetchSequences();
    fetchEmailLogs();
  }, []);

  return {
    sequences,
    emailLogs,
    loading,
    createSequence,
    updateSequence,
    triggerSequence,
    enrollUserInSequence,
    fetchSequences,
    fetchEmailLogs
  };
};